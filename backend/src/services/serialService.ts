import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import dotenv from 'dotenv';
import { parseSerialLine, ParsedSensorData } from '../utils/parser';
import { insertReading } from '../models/sensorModel';

dotenv.config();

// Holds the most recent parsed reading in memory for fast API responses
let latestReading: ParsedSensorData | null = null;

export function getLatestReading(): ParsedSensorData | null {
  return latestReading;
}

export function startSerialService(): void {
  const portPath = process.env.SERIAL_PORT ?? '/dev/ttyACM0';
  const baudRate = Number(process.env.SERIAL_BAUD ?? 9600);

  const port = new SerialPort({ path: portPath, baudRate });
  const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

  port.on('open', () => {
    console.log(`[Serial] Connected to ${portPath} at ${baudRate} baud`);
  });

  parser.on('data', async (line: string) => {
    const data = parseSerialLine(line);
    if (!data) {
      console.warn('[Serial] Skipping unreadable line:', line);
      return;
    }

    // Update in-memory cache
    latestReading = data;
    console.log('[Serial] Reading:', data);

    // Persist to MySQL
    try {
      await insertReading(data);
    } catch (err) {
      console.error('[Serial] DB insert failed:', err);
    }
  });

  port.on('error', (err: Error) => {
    console.error('[Serial] Port error:', err.message);
  });

  port.on('close', () => {
    console.warn('[Serial] Port closed.');
  });
}
