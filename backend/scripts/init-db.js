import 'dotenv/config';
import { validateEnvironment } from '../src/config/env.js';
import { initializeDatabase } from '../src/db/init.js';
import { pool } from '../src/db/pool.js';

try {
  validateEnvironment();
  await initializeDatabase();
  console.info('[database] Initialization complete.');
} catch (error) {
  console.error('[database] Initialization failed:', error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
