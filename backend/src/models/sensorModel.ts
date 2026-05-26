import pool from '../config/db';
import { ParsedSensorData } from '../utils/parser';

export interface SensorReading extends ParsedSensorData {
  id?: number;
  created_at?: Date;
}

// Insert a new sensor reading into the database
export async function insertReading(data: ParsedSensorData): Promise<void> {
  const sql = `
    INSERT INTO sensor_readings (ldr1, ldr2, angle, direction)
    VALUES (?, ?, ?, ?)
  `;
  await pool.execute(sql, [data.ldr1, data.ldr2, data.angle, data.direction]);
}

// Get the most recent reading
export async function getLatestReading(): Promise<SensorReading | null> {
  const [rows] = await pool.execute(
    'SELECT * FROM sensor_readings ORDER BY created_at DESC LIMIT 1'
  );
  const results = rows as SensorReading[];
  return results.length > 0 ? results[0] : null;
}

// Get the last N readings for analytics
export async function getRecentReadings(limit: number = 50): Promise<SensorReading[]> {
  const [rows] = await pool.execute(
    'SELECT * FROM sensor_readings ORDER BY created_at DESC LIMIT ?',
    [limit]
  );
  return rows as SensorReading[];
}
