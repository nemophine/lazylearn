// Database Configuration and Connection
// Kysely setup with PostgreSQL (JavaScript version)

import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';

// Load environment variables
import { config } from 'dotenv';
config();

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

// Create Kysely instance with dynamic schema
export const db = new Kysely({
  dialect: new PostgresDialect({
    pool,
  }),
});

// Test database connection
export const testConnection = async () => {
  try {
    const result = await pool.query('SELECT 1');
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Graceful shutdown
export const closeConnection = async () => {
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