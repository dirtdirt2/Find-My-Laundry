
import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { pool } from '../db/pool.js';
import { hashPassword } from '../utils/password.js';
import {
  createOtpCode,
  getOtpExpiryDate,
  hashOtp,
  isOtpHashMatch,
} from '../utils/otp.js';
import { sendVerificationEmail } from '../utils/email.js';

const router = Router();
const OTP_RESEND_WAIT_SECONDS = 60;
const MAX_OTP_ATTEMPTS = 5;

function normalizeEmail(value) {
  return String(value ?? '').trim().toLowerCase();
}

function validEmail(email) {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function issueOtp(connection, userId) {
  const code = createOtpCode();
  const expiresAt = getOtpExpiryDate();

  await connection.execute(`
    UPDATE email_otps
    SET consumed_at = UTC_TIMESTAMP(3)
    WHERE user_id = ? AND consumed_at IS NULL
  `, [userId]);

  await connection.execute(`
    INSERT INTO email_otps (id, user_id, otp_hash, expires_at, attempts, created_at)
    VALUES (?, ?, ?, ?, 0, UTC_TIMESTAMP(3))
  `, [randomUUID(), userId, hashOtp(code), expiresAt]);

  return { code, expiresAt };
}

router.post('/register', async (req, res, next) => {
  const fullName = String(req.body?.fullName ?? '').trim();
  const email = normalizeEmail(req.body?.email);
  const password = String(req.body?.password ?? '');
  const acceptedTerms = req.body?.acceptedTerms === true;

  if (fullName.length < 2 || fullName.length > 100) {
    return res.status(400).json({
      error: 'Full name must be between 2 and 100 characters.',
    });
  }

  if (!validEmail(email)) {
    return res.status(400).json({
      error: 'Please provide a valid email address.',
    });
  }

  if (password.length < 8 || password.length > 128) {
    return res.status(400).json({
      error: 'Password must be between 8 and 128 characters.',
    });
  }

  if (!acceptedTerms) {
    return res.status(400).json({
      error: 'You must accept the Terms of Service and Privacy Policy.',
    });
  }

  let connection;

  try {
    const passwordHash = await hashPassword(password);

    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [existingRows] = await connection.execute(
      'SELECT id, email_verified FROM users WHERE email = ? FOR UPDATE',
      [email],
    );

    const existingUser = existingRows[0];

    if (existingUser?.email_verified) {
      await connection.rollback();

      return res.status(409).json({
        error: 'An account with this email already exists.',
      });
    }

    const userId = existingUser?.id || randomUUID();
    const acceptedAt = new Date();

    if (existingUser) {
      await connection.execute(`
        UPDATE users
        SET full_name = ?, password_hash = ?, terms_accepted_at = ?,
            updated_at = UTC_TIMESTAMP(3)
        WHERE id = ?
      `, [fullName, passwordHash, acceptedAt, userId]);
    } else {
      await connection.execute(`
        INSERT INTO users (
          id, full_name, email, password_hash,
          terms_accepted_at, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, UTC_TIMESTAMP(3), UTC_TIMESTAMP(3))
      `, [userId, fullName, email, passwordHash, acceptedAt]);
    }

    const otp = await issueOtp(connection, userId);

    await connection.commit();

    await sendVerificationEmail(email, otp.code);

    return res.status(201).json({
      message: 'Registration details saved. A verification code has been sent to your email.',
      email,
      expiresAt: otp.expiresAt.toISOString(),
    });
  } catch (error) {
    if (connection) {
      await connection.rollback().catch(() => {});
    }

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        error: 'An account with this email already exists.',
      });
    }

    console.error('[Registration Error]', error.message);

    return res.status(502).json({
      error: 'Registration could not send your verification email. Please try again later.',
    });
  } finally {
    connection?.release();
  }
});

router.post('/resend-otp', async (req, res, next) => {
  const email = normalizeEmail(req.body?.email);

  if (!validEmail(email)) {
    return res.status(400).json({
      error: 'A valid email address is required.',
    });
  }

  let connection;

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [users] = await connection.execute(
      'SELECT id, email_verified FROM users WHERE email = ? FOR UPDATE',
      [email],
    );

    const user = users[0];

    if (!user || user.email_verified) {
      await connection.rollback();

      return res.status(404).json({
        error: 'No pending email verification was found for this address.',
      });
    }

    const [previousRows] = await connection.execute(`
      SELECT TIMESTAMPDIFF(SECOND, created_at, UTC_TIMESTAMP(3)) AS elapsed_seconds
      FROM email_otps
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 1
    `, [user.id]);

    const elapsedSeconds = Number(
      previousRows[0]?.elapsed_seconds ?? OTP_RESEND_WAIT_SECONDS,
    );

    if (elapsedSeconds < OTP_RESEND_WAIT_SECONDS) {
      await connection.rollback();

      return res.status(429).json({
        error: `Please wait ${OTP_RESEND_WAIT_SECONDS - elapsedSeconds} seconds before requesting another code.`,
      });
    }

    const otp = await issueOtp(connection, user.id);

    await connection.commit();

    await sendVerificationEmail(email, otp.code);

    return res.json({
      message: 'A new verification code has been sent to your email.',
      expiresAt: otp.expiresAt.toISOString(),
    });
  } catch (error) {
    if (connection) {
      await connection.rollback().catch(() => {});
    }

    console.error('[OTP Resend Error]', error.message);

    return res.status(502).json({
      error: 'We could not send your verification email. Please try again later.',
    });
  } finally {
    connection?.release();
  }
});

router.post('/verify-email', async (req, res, next) => {
  const email = normalizeEmail(req.body?.email);
  const code = String(req.body?.code ?? '').replace(/\D/g, '');

  if (!validEmail(email) || !/^\d{6}$/.test(code)) {
    return res.status(400).json({
      error: 'Enter a valid email address and 6-digit verification code.',
    });
  }

  let connection;

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [rows] = await connection.execute(`
      SELECT
        o.id AS otp_id,
        o.otp_hash,
        o.attempts,
        (o.expires_at <= UTC_TIMESTAMP(3)) AS is_expired,
        u.id AS user_id,
        u.full_name,
        u.email,
        u.phone_number,
        u.location,
        u.email_verified
      FROM email_otps o
      INNER JOIN users u ON u.id = o.user_id
      WHERE u.email = ? AND o.consumed_at IS NULL
      ORDER BY o.created_at DESC
      LIMIT 1
      FOR UPDATE
    `, [email]);

    const otpRow = rows[0];

    if (!otpRow || otpRow.email_verified) {
      await connection.rollback();

      return res.status(400).json({
        error: 'No active verification code was found. Request a new code.',
      });
    }

    if (Number(otpRow.is_expired) === 1) {
      await connection.execute(
        'UPDATE email_otps SET consumed_at = UTC_TIMESTAMP(3) WHERE id = ?',
        [otpRow.otp_id],
      );

      await connection.commit();

      return res.status(400).json({
        error: 'Your verification code has expired. Request a new one.',
      });
    }

    if (Number(otpRow.attempts) >= MAX_OTP_ATTEMPTS) {
      await connection.rollback();

      return res.status(429).json({
        error: 'Too many incorrect attempts. Request a new verification code.',
      });
    }

    if (!isOtpHashMatch(code, otpRow.otp_hash)) {
      await connection.execute(
        'UPDATE email_otps SET attempts = attempts + 1 WHERE id = ?',
        [otpRow.otp_id],
      );

      await connection.commit();

      return res.status(400).json({
        error: 'The verification code is incorrect.',
      });
    }

    await connection.execute(`
      UPDATE users
      SET email_verified = 1, updated_at = UTC_TIMESTAMP(3)
      WHERE id = ?
    `, [otpRow.user_id]);

    await connection.execute(`
      UPDATE email_otps
      SET consumed_at = UTC_TIMESTAMP(3)
      WHERE user_id = ? AND consumed_at IS NULL
    `, [otpRow.user_id]);

    await connection.commit();

    return res.json({
      message: 'Email verified. Your account has been created successfully.',
      user: {
        id: otpRow.user_id,
        fullName: otpRow.full_name,
        email: otpRow.email,
        phoneNumber: otpRow.phone_number,
        location: otpRow.location,
        emailVerified: true,
      },
    });
  } catch (error) {
    if (connection) {
      await connection.rollback().catch(() => {});
    }

    return next(error);
  } finally {
    connection?.release();
  }
});

export default router;
