/**
 * solar_tracker.ino
 * SolarSync - Main Arduino Sketch
 *
 * Hardware:
 *   - Arduino UNO R3
 *   - TowerPro SG90 Micro Servo  (signal -> pin 9)
 *   - LDR Left                   (A0, voltage divider with 10kΩ to GND)
 *   - LDR Right                  (A1, voltage divider with 10kΩ to GND)
 *
 * Wiring summary:
 *   LDR_LEFT:   A0 -> junction of LDR and 10kΩ resistor (5V -> LDR -> A0 -> 10kΩ -> GND)
 *   LDR_RIGHT:  A1 -> same pattern as above
 *   SERVO:      pin 9 (signal), 5V, GND
 *
 * Serial Protocol (sent to Node.js backend every loop):
 *   Format: "L:<ldrLeft>,R:<ldrRight>,A:<angle>,D:<direction>\n"
 *   Example: "L:820,R:310,A:75,D:LEFT\n"
 *
 *   direction values: "LEFT" | "RIGHT" | "CENTER"
 *
 * Loop interval: 200ms
 */

#include "sensors/ldr.h"
#include "servo_control/servo_control.h"

// --- Configuration ---
#define LOOP_INTERVAL_MS 200  // How often to run tracking logic (ms)

// --- State ---
String tracking_direction = "CENTER";

// ─────────────────────────────────────────────
void setup() {
  Serial.begin(9600);  // Match baud rate in Node.js serialService.ts

  ldr_init();
  servo_init();

  Serial.println("SolarSync ready.");
}

// ─────────────────────────────────────────────
void loop() {
  int ldr_left  = ldr_read_left();
  int ldr_right = ldr_read_right();
  int diff      = ldr_left - ldr_right;

  // --- Tracking Logic ---
  if (diff > LDR_THRESHOLD) {
    // More light on the left: move panel left (decrease angle)
    servo_step_left();
    tracking_direction = "LEFT";
  } else if (diff < -LDR_THRESHOLD) {
    // More light on the right: move panel right (increase angle)
    servo_step_right();
    tracking_direction = "RIGHT";
  } else {
    // Both sides equal: panel is aligned, hold position
    tracking_direction = "CENTER";
  }

  // --- Serial Output ---
  // Node.js backend parses this line in serialService.ts / parser.ts
  Serial.print("L:");
  Serial.print(ldr_left);
  Serial.print(",R:");
  Serial.print(ldr_right);
  Serial.print(",A:");
  Serial.print(servo_get_angle());
  Serial.print(",D:");
  Serial.println(tracking_direction);

  delay(LOOP_INTERVAL_MS);
}
