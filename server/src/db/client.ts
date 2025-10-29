import { Kysely, PostgresDialect } from 'kysely';
import pg from 'pg';

import type { Database } from '../types/database';

const { Pool } = pg;

let dbInstance: Kysely<Database> | null = null;

export function createDb(): Kysely<Database> {
  if (dbInstance) return dbInstance;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

  const pool = new Pool({
    connectionString,
    max: 10,
    ssl:
      process.env.NODE_ENV === 'production'
        ? {
            rejectUnauthorized: false,
          }
        : undefined,
  });

  dbInstance = new Kysely<Database>({
    dialect: new PostgresDialect({
      pool,
    }),
  });

  return dbInstance;
}

export function getDb(): Kysely<Database> {
  if (!dbInstance) {
    throw new Error('Database has not been initialized');
  }
  return dbInstance;
}

export async function destroyDb() {
  if (!dbInstance) return;
  await dbInstance.destroy();
  dbInstance = null;
}
