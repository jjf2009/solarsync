// ─── SolarSync Mock / Demo Data ───────────────────────────────────────────────
//
// Used when the backend is unreachable (Demo Mode) and during development
// without hardware connected.
// ─────────────────────────────────────────────────────────────────────────────

import type { SensorTelemetry } from '@/types/sensor';

// ─── Single Snapshot ─────────────────────────────────────────────────────────

export const mockTelemetry: SensorTelemetry = {
  leftLDR: 612,
  rightLDR: 438,
  servoAngle: 72,
  panelOutput: 512,
  trackingDirection: 'Left',
  connectionStatus: false,
  timestamp: new Date().toISOString(),
};

// ─── Demo Animation Frames ────────────────────────────────────────────────────

export const demoFrames: SensorTelemetry[] = [
  { leftLDR: 612, rightLDR: 438, servoAngle: 72, panelOutput: 512, trackingDirection: 'Left',     connectionStatus: false, timestamp: '' },
  { leftLDR: 640, rightLDR: 410, servoAngle: 68, panelOutput: 530, trackingDirection: 'Left',     connectionStatus: false, timestamp: '' },
  { leftLDR: 670, rightLDR: 390, servoAngle: 64, panelOutput: 555, trackingDirection: 'Left',     connectionStatus: false, timestamp: '' },
  { leftLDR: 690, rightLDR: 380, servoAngle: 60, panelOutput: 570, trackingDirection: 'Left',     connectionStatus: false, timestamp: '' },
  { leftLDR: 700, rightLDR: 690, servoAngle: 60, panelOutput: 600, trackingDirection: 'Centered', connectionStatus: false, timestamp: '' },
  { leftLDR: 695, rightLDR: 710, servoAngle: 64, panelOutput: 590, trackingDirection: 'Right',    connectionStatus: false, timestamp: '' },
  { leftLDR: 680, rightLDR: 730, servoAngle: 68, panelOutput: 575, trackingDirection: 'Right',    connectionStatus: false, timestamp: '' },
  { leftLDR: 660, rightLDR: 750, servoAngle: 72, panelOutput: 560, trackingDirection: 'Right',    connectionStatus: false, timestamp: '' },
  { leftLDR: 640, rightLDR: 760, servoAngle: 76, panelOutput: 540, trackingDirection: 'Right',    connectionStatus: false, timestamp: '' },
  { leftLDR: 630, rightLDR: 755, servoAngle: 80, panelOutput: 530, trackingDirection: 'Right',    connectionStatus: false, timestamp: '' },
  { leftLDR: 640, rightLDR: 640, servoAngle: 80, panelOutput: 610, trackingDirection: 'Centered', connectionStatus: false, timestamp: '' },
  { leftLDR: 655, rightLDR: 620, servoAngle: 77, panelOutput: 595, trackingDirection: 'Left',     connectionStatus: false, timestamp: '' },
];

// ─── Historical Data ──────────────────────────────────────────────────────────

export const mockHistory: SensorTelemetry[] = Array.from(
  { length: 12 },
  (_, i) => {
    const angle  = 30 + Math.round(Math.sin((i / 11) * Math.PI) * 120);
    const left   = 300 + Math.round(Math.sin((i / 11) * Math.PI) * 400);
    const right  = 1023 - left;
    const panel  = Math.round(Math.sin((i / 11) * Math.PI) * 700 + 100);

    return {
      leftLDR:          Math.max(0, Math.min(1023, left)),
      rightLDR:         Math.max(0, Math.min(1023, right)),
      servoAngle:       Math.max(0, Math.min(180, angle)),
      panelOutput:      Math.max(0, Math.min(1023, panel)),
      trackingDirection: left > right ? 'Left' : left < right ? 'Right' : 'Centered',
      connectionStatus: false,
      timestamp:        new Date(Date.now() - (11 - i) * 5 * 60 * 1000).toISOString(),
    };
  }
);

// ─── Status Card Demo Payloads ────────────────────────────────────────────────

export const mockOfflineStatus = {
  backendOnline: false,
  arduinoConnected: false,
  timestamp: null,
} as const;

export const mockOnlineStatus = {
  backendOnline: true,
  arduinoConnected: true,
  timestamp: new Date().toISOString(),
} as const;
