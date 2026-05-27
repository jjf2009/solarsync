// ─── SolarSync Color Tokens ───────────────────────────────────────────────────
//
// Single source of truth for every color used in the app.
// Components and screens MUST import colors from here, not hardcode values.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Base Palette ─────────────────────────────────────────────────────────────

/** Core dark navy background family used throughout the app. */
export const palette = {
  // Backgrounds
  navy900: '#0B0F1A',
  navy800: '#0F1628',
  navy700: '#151E35',
  navy600: '#1C2A4A',

  // Glass surfaces (semi-transparent overlays)
  glass100: 'rgba(255, 255, 255, 0.04)',
  glass200: 'rgba(255, 255, 255, 0.08)',
  glass300: 'rgba(255, 255, 255, 0.12)',

  // Solar accent — amber / gold
  solar500: '#F59E0B',
  solar400: '#FBB94E',
  solar300: '#FCD682',
  solar200: 'rgba(245, 158, 11, 0.20)',
  solar100: 'rgba(245, 158, 11, 0.08)',

  // Active / success — emerald
  emerald500: '#10B981',
  emerald400: '#34D399',
  emerald200: 'rgba(16, 185, 129, 0.20)',
  emerald100: 'rgba(16, 185, 129, 0.10)',

  // Warning / caution — amber (lighter)
  amber500: '#F59E0B',
  amber400: '#FBBF24',
  amber200: 'rgba(251, 191, 36, 0.20)',

  // Error / offline — rose
  rose500: '#F43F5E',
  rose400: '#FB7185',
  rose200: 'rgba(244, 63, 94, 0.20)',
  rose100: 'rgba(244, 63, 94, 0.10)',

  // Sky blue accent (servo / direction indicators)
  sky500: '#0EA5E9',
  sky400: '#38BDF8',
  sky200: 'rgba(14, 165, 233, 0.20)',
  sky100: 'rgba(14, 165, 233, 0.08)',

  // Neutral text
  white: '#FFFFFF',
  gray100: '#F1F5F9',
  gray300: '#94A3B8',
  gray500: '#64748B',
  gray700: '#334155',
} as const;

// ─── Semantic Color Map ───────────────────────────────────────────────────────

/**
 * Semantic aliases consumed by components.
 * Prefer these over raw palette values so design changes propagate everywhere.
 */
export const colors = {
  // ── Backgrounds ────────────────────────────────────────────────────────────
  backgroundPrimary: palette.navy900,
  backgroundSecondary: palette.navy800,
  backgroundCard: palette.navy700,
  backgroundGlass: palette.glass200,
  backgroundGlassActive: palette.glass300,

  // ── Text ───────────────────────────────────────────────────────────────────
  textPrimary: palette.white,
  textSecondary: palette.gray300,
  textMuted: palette.gray500,

  // ── Borders ────────────────────────────────────────────────────────────────
  borderGlass: palette.glass200,
  borderGlassActive: palette.glass300,

  // ── Accent — Solar ─────────────────────────────────────────────────────────
  accentSolar: palette.solar500,
  accentSolarLight: palette.solar400,
  accentSolarBg: palette.solar200,

  // ── Status — Online / Active ───────────────────────────────────────────────
  statusOnline: palette.emerald500,
  statusOnlineLight: palette.emerald400,
  statusOnlineBg: palette.emerald200,

  // ── Status — Offline / Error ───────────────────────────────────────────────
  statusOffline: palette.rose500,
  statusOfflineLight: palette.rose400,
  statusOfflineBg: palette.rose200,

  // ── Status — Warning ───────────────────────────────────────────────────────
  statusWarning: palette.amber500,
  statusWarningLight: palette.amber400,
  statusWarningBg: palette.amber200,

  // ── Servo / Direction indicators ───────────────────────────────────────────
  accentSky: palette.sky500,
  accentSkyLight: palette.sky400,
  accentSkyBg: palette.sky200,

  // ── LDR sensor bars ────────────────────────────────────────────────────────
  /** Dominant / higher-intensity LDR */
  ldrActive: palette.solar500,
  ldrActiveBg: palette.solar100,
  /** Subdued / lower-intensity LDR */
  ldrIdle: palette.sky500,
  ldrIdleBg: palette.sky100,
} as const;

export type ColorKey = keyof typeof colors;
export type PaletteKey = keyof typeof palette;
