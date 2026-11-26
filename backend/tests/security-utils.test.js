import test from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, verifyPassword } from '../src/utils/password.js';
import { createOtpCode, hashOtp, isOtpHashMatch } from '../src/utils/otp.js';

process.env.OTP_HASH_SECRET = 'test-only-secret-value-at-least-32-characters-long';

test('passwords are hashed and can be verified without storing plaintext', async () => {
  const password = 'LaundryDemo#2026';
  const storedHash = await hashPassword(password);

  assert.notEqual(storedHash, password);
  assert.equal(await verifyPassword(password, storedHash), true);
  assert.equal(await verifyPassword('wrong-password', storedHash), false);
});

test('OTP codes contain exactly six numeric digits', () => {
  const code = createOtpCode();
  assert.match(code, /^\d{6}$/);
});

test('OTP hashes can be checked without storing the raw code', () => {
  const code = '012345';
  const storedHash = hashOtp(code);

  assert.notEqual(storedHash, code);
  assert.equal(isOtpHashMatch(code, storedHash), true);
  assert.equal(isOtpHashMatch('999999', storedHash), false);
});
