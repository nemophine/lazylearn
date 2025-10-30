// Database Configuration and Connection
// Kysely setup with PostgreSQL

import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';
import type { Database } from './types';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'lazylearn',
  user: process.env.DB_USER || 'username',
  password: process.env.DB_PASSWORD || 'password',
};

// Create PostgreSQL connection pool
const pool = new Pool(dbConfig);

// Create Kysely instance
export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool,
  }),
});

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    const result = await db
      .selectFrom('users')
      .select('id')
      .limit(1)
      .execute();

    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};

// Graceful shutdown
export const closeConnection = async (): Promise<void> => {
  try {
    await pool.end();
    console.log('🔌 Database connection closed');
  } catch (error) {
    console.error('❌ Error closing database connection:', error);
  }
};

// Handle process termination
process.on('SIGINT', async () => {
  await closeConnection();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeConnection();
  process.exit(0);
});

export default db;