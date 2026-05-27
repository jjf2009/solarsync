// ─── SolarSync App Configuration ─────────────────────────────────────────────
//
// All environment-level and application-level constants live here.
// Change the API base URL to point at your laptop's IP when testing on device.
// ─────────────────────────────────────────────────────────────────────────────

import Constants from 'expo-constants';

/**
 * Resolves the backend URL at runtime.
 * When running in Expo Go, the host IP is taken from the Metro bundler's
 * hostUri so the device can reach the laptop's Node.js server on port 3000.
 * Falls back to localhost for web/simulator usage.
 */
export function resolveBackendUrl(): string {
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    return `http://${ip}:3000`;
  }
  return 'http://localhost:3000';
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const API_BASE_URL = resolveBackendUrl();

/** Full endpoint to fetch the latest sensor reading. */
export const API_ENDPOINTS = {
  latest: `${API_BASE_URL}/api/latest`,
  history: `${API_BASE_URL}/api/history`,
  health: `${API_BASE_URL}/api/health`,
} as const;


// ─── Polling ──────────────────────────────────────────────────────────────────

/** How often (ms) the app polls the backend for fresh telemetry. */
export const POLLING_INTERVAL_MS = 2_000;

/** Number of consecutive failures before the app switches to Demo Mode. */
export const POLLING_MAX_FAILURES = 3;

// ─── Serial Communication ─────────────────────────────────────────────────────

/** Default baud rate used by the Arduino sketch and the Node.js SerialPort config. */
export const SERIAL_BAUD_RATE = 9600;

// ─── Servo ────────────────────────────────────────────────────────────────────

/** Physical minimum servo angle in degrees. */
export const SERVO_MIN_ANGLE = 0;

/** Physical maximum servo angle in degrees. */
export const SERVO_MAX_ANGLE = 180;

/** Neutral / center position of the servo in degrees. */
export const SERVO_CENTER_ANGLE = 90;

// ─── LDR Sensor Thresholds ────────────────────────────────────────────────────

/** Raw ADC range of the Arduino analog input (10-bit). */
export const LDR_MIN_RAW = 0;
export const LDR_MAX_RAW = 1023;

/**
 * Difference in LDR readings below which the tracker considers the panel
 * already centred and skips a servo adjustment.
 */
export const LDR_DEADBAND = 50;

/**
 * Raw ADC value above which an LDR is treated as "in bright sunlight".
 * Used to colour-code the sensor cards in the UI.
 */
export const LDR_HIGH_THRESHOLD = 700;

/**
 * Raw ADC value below which an LDR is treated as "in shadow / low light".
 */
export const LDR_LOW_THRESHOLD = 200;

// ─── UI Timing ────────────────────────────────────────────────────────────────

/** Duration (ms) of entry animations on the dashboard cards. */
export const ANIMATION_DURATION_MS = 400;

/** Delay (ms) between staggered card animations. */
export const ANIMATION_STAGGER_MS = 80;
