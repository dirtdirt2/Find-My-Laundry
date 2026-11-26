import mysql from 'mysql2/promise';

const host = process.env.DB_HOST || process.env.MYSQLHOST;
const port = Number(process.env.DB_PORT || process.env.MYSQLPORT || 3306);
const user = process.env.DB_USER || process.env.MYSQLUSER;
const password = process.env.DB_PASSWORD || process.env.MYSQLPASSWORD;
const database = process.env.DB_NAME || process.env.MYSQLDATABASE;

if (!host || !user || !database) {
  throw new Error('MySQL connection is not configured. Set DB_HOST, DB_USER, and DB_NAME (or the Railway MYSQL* variables).');
}

const sslEnabled = ['1', 'true', 'yes'].includes(String(process.env.DB_SSL || '').toLowerCase());
const rawConnectionLimit = Number(process.env.DB_CONNECTION_LIMIT || 10);
const connectionLimit = Number.isInteger(rawConnectionLimit) && rawConnectionLimit > 0
  ? Math.min(rawConnectionLimit, 20)
  : 10;

export const pool = mysql.createPool({
  host,
  port,
  user,
  password: password || '',
  database,
  waitForConnections: true,
  connectionLimit,
  connectTimeout: 15000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  timezone: 'Z',
  charset: 'utf8mb4',
  ssl: sslEnabled ? { rejectUnauthorized: true } : undefined,
});

export async function checkDatabaseConnection() {
  const [rows] = await pool.query('SELECT 1 AS database_ready');
  return rows[0]?.database_ready === 1;
}
