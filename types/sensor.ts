// ─── SolarSync Domain Types ──────────────────────────────────────────────────
//
// Single source of truth for all sensor-related types.
// Import from here instead of from individual files.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Tracking Direction ───────────────────────────────────────────────────────

/** Possible directions reported by the Arduino tracking algorithm. */
export type TrackingDirection = 'Left' | 'Right' | 'Centered' | 'Idle' | string;

// ─── Raw Telemetry ────────────────────────────────────────────────────────────

/**
 * Raw sensor telemetry payload.
 * Matches the shape returned by GET /api/latest and the Arduino serial output.
 */
export interface SensorTelemetry {
  /** ADC reading from the left LDR (0–1023). */
  leftLDR: number;
  /** ADC reading from the right LDR (0–1023). */
  rightLDR: number;
  /** Current servo angle in degrees (0–180). */
  servoAngle: number;
  /** Current tracking direction as reported by the Arduino. */
  trackingDirection: TrackingDirection;
  /** True when the Arduino is actively connected via serial. */
  connectionStatus: boolean;
  /** ISO 8601 timestamp of the last received packet. */
  timestamp: string;
}

// ─── API Response ─────────────────────────────────────────────────────────────

/**
 * Shape of the JSON response from the backend REST API.
 * Mirrors SensorTelemetry — kept separate so the API contract
 * can diverge from the internal domain model in the future.
 */
export type SensorApiResponse = SensorTelemetry;

// ─── Store State ──────────────────────────────────────────────────────────────

/**
 * Full shape of the Zustand sensor store state,
 * extending telemetry with UI-level flags.
 */
export interface SensorState extends SensorTelemetry {
  /** True while the first telemetry request is in-flight. */
  loading: boolean;
  /** Non-null when the last fetch failed (e.g. backend offline). */
  error: string | null;
}

// ─── Store Actions ────────────────────────────────────────────────────────────

/** Actions available on the sensor Zustand store. */
export interface SensorActions {
  setTelemetry: (data: SensorTelemetry) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

/** Combined store type (state + actions). */
export type SensorStore = SensorState & SensorActions;

// ─── Component Prop Types ─────────────────────────────────────────────────────

/** Props for the HeaderBar component. */
export interface HeaderBarProps {
  connectionStatus: boolean;
}

/** Props for the SensorCard component. */
export interface SensorCardProps {
  label: string;
  value: number;
  isActive: boolean;
}

/** Props for the ServoIndicator component. */
export interface ServoIndicatorProps {
  servoAngle: number;
  trackingDirection: TrackingDirection;
}

/** Props for the StatusCard component. */
export interface StatusCardProps {
  backendOnline: boolean;
  arduinoConnected: boolean;
  timestamp: string | null;
}
