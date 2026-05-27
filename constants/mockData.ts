// ─── SolarSync Mock / Demo Data ───────────────────────────────────────────────
//
// Used when the backend is unreachable (Demo Mode) and during development
// without hardware connected.
//
// Import `mockTelemetry` for a single snapshot or `mockHistory` for a series
// of readings suitable for rendering a chart.
// ─────────────────────────────────────────────────────────────────────────────

import type { SensorTelemetry } from '@/types/sensor';

// ─── Single Snapshot ─────────────────────────────────────────────────────────

/**
 * A realistic-looking sensor snapshot used as the initial / fallback state
 * when the live API is unavailable.
 */
export const mockTelemetry: SensorTelemetry = {
  leftLDR: 612,
  rightLDR: 438,
  servoAngle: 72,
  trackingDirection: 'Left',
  connectionStatus: false,
  timestamp: new Date().toISOString(),
};

// ─── Demo Animation Frames ────────────────────────────────────────────────────

/**
 * A sequence of frames played back in Demo Mode to make the dashboard feel
 * alive even when no hardware is connected.
 * Each entry represents one polling tick.
 */
export const demoFrames: SensorTelemetry[] = [
  { leftLDR: 612, rightLDR: 438, servoAngle: 72, trackingDirection: 'Left',     connectionStatus: false, timestamp: '' },
  { leftLDR: 640, rightLDR: 410, servoAngle: 68, trackingDirection: 'Left',     connectionStatus: false, timestamp: '' },
  { leftLDR: 670, rightLDR: 390, servoAngle: 64, trackingDirection: 'Left',     connectionStatus: false, timestamp: '' },
  { leftLDR: 690, rightLDR: 380, servoAngle: 60, trackingDirection: 'Left',     connectionStatus: false, timestamp: '' },
  { leftLDR: 700, rightLDR: 690, servoAngle: 60, trackingDirection: 'Centered', connectionStatus: false, timestamp: '' },
  { leftLDR: 695, rightLDR: 710, servoAngle: 64, trackingDirection: 'Right',    connectionStatus: false, timestamp: '' },
  { leftLDR: 680, rightLDR: 730, servoAngle: 68, trackingDirection: 'Right',    connectionStatus: false, timestamp: '' },
  { leftLDR: 660, rightLDR: 750, servoAngle: 72, trackingDirection: 'Right',    connectionStatus: false, timestamp: '' },
  { leftLDR: 640, rightLDR: 760, servoAngle: 76, trackingDirection: 'Right',    connectionStatus: false, timestamp: '' },
  { leftLDR: 630, rightLDR: 755, servoAngle: 80, trackingDirection: 'Right',    connectionStatus: false, timestamp: '' },
  { leftLDR: 640, rightLDR: 640, servoAngle: 80, trackingDirection: 'Centered', connectionStatus: false, timestamp: '' },
  { leftLDR: 655, rightLDR: 620, servoAngle: 77, trackingDirection: 'Left',     connectionStatus: false, timestamp: '' },
];

// ─── Historical Data ──────────────────────────────────────────────────────────

/**
 * Simulated historical telemetry for charts and analytics screens.
 * 12 readings spaced 5 minutes apart, going backwards from now.
 */
export const mockHistory: SensorTelemetry[] = Array.from(
  { length: 12 },
  (_, i) => {
    const angle = 30 + Math.round(Math.sin((i / 11) * Math.PI) * 120); // 30 → 150 → 30
    const left  = 300 + Math.round(Math.sin((i / 11) * Math.PI) * 400);
    const right = 1023 - left;

    return {
      leftLDR: Math.max(0, Math.min(1023, left)),
      rightLDR: Math.max(0, Math.min(1023, right)),
      servoAngle: Math.max(0, Math.min(180, angle)),
      trackingDirection: left > right ? 'Left' : left < right ? 'Right' : 'Centered',
      connectionStatus: false,
      timestamp: new Date(Date.now() - (11 - i) * 5 * 60 * 1000).toISOString(),
    };
  }
);

// ─── Status Card Demo Payloads ────────────────────────────────────────────────

/** Demo payload shown when backend is confirmed offline. */
export const mockOfflineStatus = {
  backendOnline: false,
  arduinoConnected: false,
  timestamp: null,
} as const;

/** Demo payload shown when everything is running. */
export const mockOnlineStatus = {
  backendOnline: true,
  arduinoConnected: true,
  timestamp: new Date().toISOString(),
} as const;
