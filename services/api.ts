import type { SensorState } from '@/store/sensorStore';
import { API_BASE_URL } from '@/constants/config';

export const backendUrl = API_BASE_URL;


// ─── Response shape from GET /api/latest ──────────────────────────────────────

export interface LatestSensorResponse {
  leftLDR: number;
  rightLDR: number;
  servoAngle: number;
  trackingDirection: string;
  connectionStatus: boolean;
  timestamp: string;
}

// ─── Response shape from GET /api/history ─────────────────────────────────────

export interface HistorySensorResponse {
  count: number;
  data: LatestSensorResponse[];
}

// ─── API Methods ──────────────────────────────────────────────────────────────

/**
 * Fetches the latest sensor telemetry from the backend.
 * Returns a typed payload on success; throws on network or HTTP error.
 */
export async function fetchLatestSensorData(): Promise<LatestSensorResponse> {
  const response = await fetch(`${backendUrl}/api/latest`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const json = (await response.json()) as LatestSensorResponse;
  return json;
}

/**
 * Fetches the historical sensor telemetry from the backend.
 */
export async function fetchHistoricalSensorData(limit: number = 50): Promise<HistorySensorResponse> {
  const response = await fetch(`${backendUrl}/api/history?limit=${limit}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const json = (await response.json()) as HistorySensorResponse;
  return json;
}

/**
 * Maps a raw API response to the Zustand store's telemetry shape.
 * Keeps the mapping in one place so both the hook and future screens
 * consume a consistent object.
 */
export function mapResponseToTelemetry(
  data: LatestSensorResponse
): Omit<SensorState, 'loading' | 'error'> {
  return {
    leftLDR: data.leftLDR,
    rightLDR: data.rightLDR,
    servoAngle: data.servoAngle,
    trackingDirection: data.trackingDirection,
    connectionStatus: data.connectionStatus,
    timestamp: data.timestamp,
  };
}
