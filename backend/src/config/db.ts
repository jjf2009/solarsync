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
      id           INT AUTO_INCREMENT PRIMARY KEY,
      ldr1         INT           NOT NULL,
      ldr2         INT           NOT NULL,
      angle        INT           NOT NULL,
      direction    VARCHAR(10)   NOT NULL,
      panel_output INT           NOT NULL DEFAULT 0 COMMENT 'Solar panel ADC output (0-1023)',
      created_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_created_at (created_at DESC)
    )
  `;

  // Migration: add panel_output column to existing tables that lack it
  const addColumnSql = `
    ALTER TABLE sensor_readings
    ADD COLUMN IF NOT EXISTS panel_output INT NOT NULL DEFAULT 0
      COMMENT 'Solar panel ADC output (0-1023)'
  `;

  try {
    await pool.execute(createTableSql);
    // Best-effort migration for existing databases; ignore if column already exists
    try {
      await pool.execute(addColumnSql);
    } catch {
      // Column already present — safe to ignore
    }
    console.log('[DB] Database connection verified and table initialized.');
  } catch (err: any) {
    console.error(
      '[DB] Database initialization failed. Please ensure the database exists and password is correct.',
      err.message
    );
  }
}

export default pool;
