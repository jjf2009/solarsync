import { Request, Response } from 'express';
import { getLatestReading as getCachedReading } from '../services/serialService';
import {
  getLatestReading as getDbLatestReading,
  getRecentReadings,
} from '../models/sensorModel';

// GET /api/latest
// Returns the most recent sensor reading (from in-memory cache first, DB as fallback)
export async function getLatest(req: Request, res: Response): Promise<void> {
  const cached = getCachedReading();

  if (cached) {
    res.json({ source: 'live', data: cached });
    return;
  }

  // Fallback: query the database
  const dbReading = await getDbLatestReading();
  if (dbReading) {
    res.json({ source: 'db', data: dbReading });
    return;
  }

  res.status(404).json({ message: 'No sensor data available yet.' });
}

// GET /api/history?limit=50
// Returns recent readings from the database
export async function getHistory(req: Request, res: Response): Promise<void> {
  const limit = Math.min(Number(req.query['limit'] ?? 50), 500);
  const readings = await getRecentReadings(limit);
  res.json({ count: readings.length, data: readings });
}
