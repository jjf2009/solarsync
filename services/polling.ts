import type { SensorState } from '@/store/sensorStore';

// ─── Demo Mode State ──────────────────────────────────────────────────────────
// Kept as module-level refs so the simulated servo angle and direction
// persist across consecutive poll ticks without needing React state.

const demoState = {
  angle: 90,
  direction: 'Centered',
};

// ─── Demo Telemetry Generator ─────────────────────────────────────────────────

/**
 * Produces plausible sensor readings when the backend is unreachable.
 * The LDR values oscillate sinusoidally so the servo appears to track the sun.
 */
export function generateDemoTelemetry(): Omit<SensorState, 'loading' | 'error'> {
  const now = Date.now();
  const leftSim = Math.round(512 + 400 * Math.sin(now / 15000));
  const rightSim = Math.round(512 - 400 * Math.sin(now / 15000));

  const diff = leftSim - rightSim;
  const threshold = 40;

  if (Math.abs(diff) > threshold) {
    if (diff > 0) {
      demoState.angle = Math.max(demoState.angle - 3, 15);
      demoState.direction = 'Left';
    } else {
      demoState.angle = Math.min(demoState.angle + 3, 165);
      demoState.direction = 'Right';
    }
  } else {
    demoState.direction = demoState.angle === 90 ? 'Centered' : 'Idle';
  }

  return {
    leftLDR: Math.max(leftSim, 0),
    rightLDR: Math.max(rightSim, 0),
    servoAngle: demoState.angle,
    trackingDirection: demoState.direction,
    connectionStatus: false,
    timestamp: new Date().toISOString(),
  };
}

// ─── Polling Helpers ──────────────────────────────────────────────────────────

/** Default poll interval in milliseconds. */
export const POLL_INTERVAL_MS = 2000;

/**
 * Creates a polling loop that calls `tick` immediately and then every
 * `intervalMs` milliseconds.
 *
 * Returns a cleanup function — call it inside a `useEffect` return or when
 * you want to stop polling.
 *
 * @param tick      Async function executed on each poll cycle.
 * @param intervalMs  Milliseconds between ticks. Defaults to POLL_INTERVAL_MS.
 */
export function startPolling(
  tick: () => Promise<void>,
  intervalMs: number = POLL_INTERVAL_MS
): () => void {
  // Fire immediately so the first render has data right away.
  tick().catch(() => {
    // Errors are handled inside tick; this prevents unhandled-promise warnings.
  });

  const id = setInterval(() => {
    tick().catch(() => {});
  }, intervalMs);

  return () => clearInterval(id);
}
