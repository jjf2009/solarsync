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
    res.json({
      leftLDR: cached.leftLDR,
      rightLDR: cached.rightLDR,
      servoAngle: cached.servoAngle,
      panelOutput: cached.panelOutput,
      trackingDirection: cached.trackingDirection,
      connectionStatus: true,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  try {
    // Fallback: query the database
    const dbReading = await getDbLatestReading();
    if (dbReading) {
      res.json({
        leftLDR: dbReading.leftLDR,
        rightLDR: dbReading.rightLDR,
        servoAngle: dbReading.servoAngle,
        panelOutput: dbReading.panelOutput,
        trackingDirection: dbReading.trackingDirection,
        connectionStatus: false,
        timestamp: dbReading.timestamp ?? new Date().toISOString(),
      });
      return;
    }
  } catch (err) {
    console.error('[Controller] Fallback DB query failed:', err);
  }

  res.status(404).json({ message: 'No sensor data available yet.' });
}

// GET /api/history?limit=50
// Returns recent readings from the database
export async function getHistory(req: Request, res: Response): Promise<void> {
  try {
    const limit = Math.min(Number(req.query['limit'] ?? 50), 500);
    const readings = await getRecentReadings(limit);
    res.json({ count: readings.length, data: readings });
  } catch (err) {
    console.error('[Controller] DB history query failed:', err);
    res.status(500).json({ message: 'Failed to retrieve sensor history.' });
  }
}
