import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'solarsync',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function initDb(): Promise<void> {
  const createTableSql = `
    CREATE TABLE IF NOT EXISTS sensor_readings (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      ldr1        INT           NOT NULL,
      ldr2        INT           NOT NULL,
      angle       INT           NOT NULL,
      direction   VARCHAR(10)   NOT NULL,
      created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_created_at (created_at DESC)
    )
  `;
  try {
    await pool.execute(createTableSql);
    console.log('[DB] Database connection verified and table initialized.');
  } catch (err: any) {
    console.error('[DB] Database initialization failed. Please ensure the database exists and password is correct.', err.message);
  }
}

export default pool;

