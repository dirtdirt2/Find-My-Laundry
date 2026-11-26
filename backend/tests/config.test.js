import test from 'node:test';
import assert from 'node:assert/strict';
import { validateEnvironment } from '../src/config/env.js';

test('environment validation accepts Railway MySQL service variables', () => {
  const result = validateEnvironment({
    MYSQLHOST: 'mysql.railway.internal',
    MYSQLPORT: '3306',
    MYSQLUSER: 'root',
    MYSQLPASSWORD: 'example-only',
    MYSQLDATABASE: 'railway',
    OTP_HASH_SECRET: '0123456789abcdef0123456789abcdef',
    PORT: '8080',
    NODE_ENV: 'production',
    TRUST_PROXY: '1',
  });

  assert.equal(result.port, 8080);
  assert.equal(result.nodeEnv, 'production');
  assert.equal(result.trustProxy, true);
});

test('environment validation rejects short OTP secrets', () => {
  assert.throws(() => validateEnvironment({
    DB_HOST: '127.0.0.1',
    DB_USER: 'root',
    DB_NAME: 'find_my_laundry',
    OTP_HASH_SECRET: 'too-short',
  }), /at least 32 characters/);
});
