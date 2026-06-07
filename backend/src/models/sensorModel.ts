import pool from '../config/db';
import { ParsedSensorData } from '../utils/parser';
import { RowDataPacket } from 'mysql2';

export interface SensorReading extends ParsedSensorData {
  id?: number;
  timestamp?: string;
}

interface DbRow extends RowDataPacket {
  id: number;
  ldr1: number;
  ldr2: number;
  angle: number;
  direction: string;
  panel_output: number;
  created_at: string | Date;
}

function mapRowToReading(row: DbRow): SensorReading {
  return {
    id: row.id,
    leftLDR: row.ldr1,
    rightLDR: row.ldr2,
    servoAngle: row.angle,
    trackingDirection: row.direction,
    panelOutput: row.panel_output ?? 0,
    timestamp: new Date(row.created_at).toISOString(),
  };
}

// Insert a new sensor reading into the database
export async function insertReading(data: ParsedSensorData): Promise<void> {
  const sql = `
    INSERT INTO sensor_readings (ldr1, ldr2, angle, direction, panel_output)
    VALUES (?, ?, ?, ?, ?)
  `;
  await pool.execute(sql, [
    data.leftLDR,
    data.rightLDR,
    data.servoAngle,
    data.trackingDirection,
    data.panelOutput,
  ]);
}

// Get the most recent reading
export async function getLatestReading(): Promise<SensorReading | null> {
  const [rows] = await pool.query<DbRow[]>(
    `SELECT * FROM sensor_readings ORDER BY created_at DESC LIMIT 1`
  );
  return rows.length > 0 ? mapRowToReading(rows[0]) : null;
}

// Get the last N readings for analytics
export async function getRecentReadings(
  limit: number = 50
): Promise<SensorReading[]> {
  const safeLimit = Number(limit) || 50;
  const [rows] = await pool.query<DbRow[]>(
    `SELECT * FROM sensor_readings ORDER BY created_at DESC LIMIT ${safeLimit}`
  );
  return rows.map(mapRowToReading);
}
