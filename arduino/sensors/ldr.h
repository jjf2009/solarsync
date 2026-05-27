/**
 * ldr.h
 * SolarSync - LDR Sensor Module
 *
 * Handles reading of two LDR (Light Dependent Resistor) sensors.
 * LDR_LEFT  -> Analog pin A0 (left side of panel)
 * LDR_RIGHT -> Analog pin A1 (right side of panel)
 *
 * Each LDR is part of a voltage divider with a 10kΩ resistor to GND.
 * Higher analog value = more light hitting that side.
 */

#ifndef LDR_H
#define LDR_H

#include <Arduino.h>

// --- Pin Definitions ---
#define LDR_LEFT_PIN  A0
#define LDR_RIGHT_PIN A1

// --- Threshold ---
// Minimum difference between LDR readings to trigger a servo move.
// Helps prevent jitter when both sides receive similar light.
#define LDR_THRESHOLD 50

/**
 * Initialize LDR pins as inputs.
 * Call once in setup().
 */
void ldr_init() {
  pinMode(LDR_LEFT_PIN, INPUT);
  pinMode(LDR_RIGHT_PIN, INPUT);
}

/**
 * Read the left LDR analog value (0–1023).
 */
int ldr_read_left() {
  return analogRead(LDR_LEFT_PIN);
}

/**
 * Read the right LDR analog value (0–1023).
 */
int ldr_read_right() {
  return analogRead(LDR_RIGHT_PIN);
}

/**
 * Returns the light difference: left - right.
 * Positive = more light on the left.
 * Negative = more light on the right.
 */
int ldr_difference() {
  return ldr_read_left() - ldr_read_right();
}

#endif // LDR_H
