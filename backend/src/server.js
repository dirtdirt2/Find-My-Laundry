import 'dotenv/config';
import app from './app.js';
import { validateEnvironment } from './config/env.js';
import { initializeDatabase } from './db/init.js';
import { pool } from './db/pool.js';

const config = validateEnvironment();

try {
  await initializeDatabase();
  const server = app.listen(config.port, '0.0.0.0', () => {
    console.info(`[server] Find My Laundry API listening on port ${config.port}`);
    console.info(`[server] Health check: /api/health`);
  });

  const shutdown = (signal) => {
    console.info(`[server] ${signal} received. Closing HTTP and MySQL connections...`);
    server.close(async () => {
      await pool.end();
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
} catch (error) {
  console.error('[server] Startup failed:', error.message);
  await pool.end();
  process.exit(1);
}
