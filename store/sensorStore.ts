import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// ─── State Shape ─────────────────────────────────────────────────────────────

export interface SensorState {
  leftLDR: number;
  rightLDR: number;
  servoAngle: number;
  panelOutput: number;
  trackingDirection: string;
  connectionStatus: boolean;
  timestamp: string;
  loading: boolean;
  error: string | null;
}

// ─── Actions ──────────────────────────────────────────────────────────────────

export interface SensorActions {
  setTelemetry: (data: Omit<SensorState, 'loading' | 'error'>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export type SensorStore = SensorState & SensorActions;

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState: SensorState = {
  leftLDR: 0,
  rightLDR: 0,
  servoAngle: 0,
  panelOutput: 0,
  trackingDirection: '',
  connectionStatus: false,
  timestamp: '',
  loading: false,
  error: null,
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useSensorStore = create<SensorStore>()(
  subscribeWithSelector((set) => ({
    ...initialState,

    setTelemetry: (data) =>
      set({
        leftLDR: data.leftLDR,
        rightLDR: data.rightLDR,
        servoAngle: data.servoAngle,
        panelOutput: data.panelOutput,
        trackingDirection: data.trackingDirection,
        connectionStatus: data.connectionStatus,
        timestamp: data.timestamp,
        error: null,
      }),

    setLoading: (loading) => set({ loading }),

    setError: (error) => set({ error }),

    reset: () => set(initialState),
  }))
);
