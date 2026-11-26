import { createHash, randomInt, timingSafeEqual } from 'node:crypto';

const OTP_VALIDITY_MS = 10 * 60 * 1000;

export function createOtpCode() {
  return String(randomInt(0, 1_000_000)).padStart(6, '0');
}

export function hashOtp(code) {
  const secret = process.env.OTP_HASH_SECRET;
  return createHash('sha256').update(`${code}:${secret}`).digest('hex');
}

export function isOtpHashMatch(code, storedHash) {
  const submitted = Buffer.from(hashOtp(code), 'hex');
  const stored = Buffer.from(String(storedHash || ''), 'hex');
  return submitted.length === stored.length && stored.length === 32
    && timingSafeEqual(submitted, stored);
}

export function getOtpExpiryDate() {
  return new Date(Date.now() + OTP_VALIDITY_MS);
}

export function logDevelopmentOtp(email, code) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Console OTP delivery is disabled in production. Configure an email provider before enabling registration.');
  }
  console.info(`\n[DEV EMAIL OTP] ${email}: ${code}\nThis code expires in 10 minutes. Never use console OTP delivery in production.\n`);
}
