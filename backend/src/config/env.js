export function validateEnvironment(env = process.env) {
  const missing = [];
  if (!String(env.DB_HOST || env.MYSQLHOST || '').trim()) missing.push('DB_HOST (or MYSQLHOST)');
  if (!String(env.DB_USER || env.MYSQLUSER || '').trim()) missing.push('DB_USER (or MYSQLUSER)');
  if (!String(env.DB_NAME || env.MYSQLDATABASE || '').trim()) missing.push('DB_NAME (or MYSQLDATABASE)');
  if (!String(env.OTP_HASH_SECRET || '').trim()) missing.push('OTP_HASH_SECRET');
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  if (String(env.OTP_HASH_SECRET).length < 32) {
    throw new Error('OTP_HASH_SECRET must be at least 32 characters long.');
  }

  if (!String(env.SMTP_HOST || '').trim()) missing.push('SMTP_HOST');
  if (!String(env.SMTP_USER || '').trim()) missing.push('SMTP_USER');
  if (!String(env.SMTP_PASS || '').trim()) missing.push('SMTP_PASS');

  const port = Number(env.PORT || 5000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535.');
  }

  return {
    port,
    nodeEnv: env.NODE_ENV || 'development',
    frontendOrigins: (env.FRONTEND_ORIGINS || 'http://localhost:5173')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
    trustProxy: env.TRUST_PROXY === '1' || env.TRUST_PROXY === 'true',
  };
}
