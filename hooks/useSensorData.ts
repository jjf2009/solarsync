import { useEffect, useRef, useCallback } from 'react';
import Constants from 'expo-constants';
import { useSensorStore } from '@/store/sensorStore';

// ─── Backend URL ──────────────────────────────────────────────────────────────

const getBackendUrl = (): string => {
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    return `http://${ip}:5000`;
  }
  return 'http://localhost:5000';
};

const backendUrl = getBackendUrl();

// ─── Demo Mode helpers ────────────────────────────────────────────────────────

// Refs are kept outside the hook so demo state persists across renders
const demoAngleRef = { current: 90 };
const demoDirectionRef = { current: 'Centered' };

function generateDemoTelemetry() {
  const now = Date.now();
  const leftSim = Math.round(512 + 400 * Math.sin(now / 15000));
  const rightSim = Math.round(512 - 400 * Math.sin(now / 15000));

  const diff = leftSim - rightSim;
  const threshold = 40;

  if (Math.abs(diff) > threshold) {
    if (diff > 0) {
      demoAngleRef.current = Math.max(demoAngleRef.current - 3, 15);
      demoDirectionRef.current = 'Left';
    } else {
      demoAngleRef.current = Math.min(demoAngleRef.current + 3, 165);
      demoDirectionRef.current = 'Right';
    }
  } else {
    demoDirectionRef.current =
      demoAngleRef.current === 90 ? 'Centered' : 'Idle';
  }

  return {
    leftLDR: Math.max(leftSim, 0),
    rightLDR: Math.max(rightSim, 0),
    servoAngle: demoAngleRef.current,
    trackingDirection: demoDirectionRef.current,
    connectionStatus: false,
    timestamp: new Date().toISOString(),
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Polls GET /api/latest every 2 seconds.
 * On success: writes live telemetry to the Zustand store.
 * On failure: falls back to animated demo data.
 *
 * Returns the backend URL so the caller can display it in error messages.
 */
export function useSensorData(): string {
  const setTelemetry = useSensorStore((s) => s.setTelemetry);
  const setLoading = useSensorStore((s) => s.setLoading);
  const setError = useSensorStore((s) => s.setError);

  // Track whether initial fetch is complete (drives the loading spinner)
  const hasFirstLoaded = useRef(false);

  const fetchLatestData = useCallback(async () => {
    if (!hasFirstLoaded.current) {
      setLoading(true);
    }

    try {
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

      const json = await response.json();

      setTelemetry({
        leftLDR: json.leftLDR,
        rightLDR: json.rightLDR,
        servoAngle: json.servoAngle,
        trackingDirection: json.trackingDirection,
        connectionStatus: json.connectionStatus,
        timestamp: json.timestamp,
      });
      setError(null);
    } catch (err) {
      console.warn('Telemetry server offline:', err);

      const demoData = generateDemoTelemetry();
      setTelemetry(demoData);
      setError(
        `Unable to reach API server at ${backendUrl}. Running in simulated Telemetry Mode.`
      );
    } finally {
      if (!hasFirstLoaded.current) {
        hasFirstLoaded.current = true;
        setLoading(false);
      }
    }
  }, [setTelemetry, setLoading, setError]);

  useEffect(() => {
    fetchLatestData();
    const interval = setInterval(fetchLatestData, 2000);
    return () => clearInterval(interval);
  }, [fetchLatestData]);

  return backendUrl;
}
