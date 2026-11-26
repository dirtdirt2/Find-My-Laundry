import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from './pool.js';

const backendRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const schemaPath = resolve(backendRoot, 'database/schema.sql');

/**
 * Applies idempotent CREATE TABLE and sample INSERT statements.
 * For future structural changes, create ordered migration files rather than
 * editing an already-applied schema and assuming CREATE TABLE will update it.
 */
export async function initializeDatabase() {
  const schema = await readFile(schemaPath, 'utf8');
  const statements = schema
    .replace(/^[ \t]*--.*$/gm, '')
    .split(';')
    .map((statement) => statement.trim())
    .filter(Boolean);

  const connection = await pool.getConnection();
  try {
    for (const statement of statements) {
      await connection.query(statement);
    }
  } finally {
    connection.release();
  }

  console.info('[database] MySQL schema ready and sample shops seeded if missing.');
}
