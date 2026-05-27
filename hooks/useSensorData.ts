import { useEffect, useRef, useCallback } from 'react';
import { useSensorStore } from '@/store/sensorStore';
import { fetchLatestSensorData, mapResponseToTelemetry } from '@/services/api';
import { startPolling, generateDemoTelemetry } from '@/services/polling';
import { API_BASE_URL, POLLING_INTERVAL_MS } from '@/constants/config';

/**
 * Custom hook to manage real-time telemetry polling.
 * Connects to the backend via central API and Polling services,
 * updating the Zustand sensorStore. Falls back to simulated Demo Mode
 * if connection drops.
 *
 * @returns The active backend base URL for display in system error messages.
 */
export function useSensorData(): string {
  const setTelemetry = useSensorStore((s) => s.setTelemetry);
  const setLoading = useSensorStore((s) => s.setLoading);
  const setError = useSensorStore((s) => s.setError);

  const hasFirstLoaded = useRef(false);

  const tick = useCallback(async () => {
    if (!hasFirstLoaded.current) {
      setLoading(true);
    }

    try {
      const data = await fetchLatestSensorData();
      setTelemetry(mapResponseToTelemetry(data));
      setError(null);
    } catch (err) {
      console.warn('Telemetry server offline:', err);
      const demoData = generateDemoTelemetry();
      setTelemetry(demoData);
      setError(
        `Unable to reach API server at ${API_BASE_URL}. Running in simulated Telemetry Mode.`
      );
    } finally {
      if (!hasFirstLoaded.current) {
        hasFirstLoaded.current = true;
        setLoading(false);
      }
    }
  }, [setTelemetry, setLoading, setError]);

  useEffect(() => {
    const stopPolling = startPolling(tick, POLLING_INTERVAL_MS);
    return () => stopPolling();
  }, [tick]);

  return API_BASE_URL;
}
