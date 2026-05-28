/**
 * servo_control.h
 * SolarSync - Servo Control Module
 *
 * Controls the TowerPro SG90 Micro Servo for solar panel tracking.
 * Servo signal pin -> Digital pin 9 (PWM capable).
 *
 * The servo sweeps from 0° to 180°.
 * Panel starts at 90° (center / facing directly up).
 * Moves LEFT  (toward 0°)   when left LDR reads more light.
 * Moves RIGHT (toward 180°) when right LDR reads more light.
 *
 * Step size controls how fast the panel reacts per loop iteration.
 */

#ifndef SERVO_CONTROL_H
#define SERVO_CONTROL_H

#include <Arduino.h>
#include <Servo.h>

// --- Pin Definition ---
#define SERVO_PIN 9

// --- Angle Limits ---
#define SERVO_MIN_ANGLE   0
#define SERVO_MAX_ANGLE 180
#define SERVO_HOME_ANGLE 90  // Starting position (center)

// --- Movement Step ---
// Degrees to move per tracking loop iteration.
// Keep small to prevent jerky movement.
#define SERVO_STEP 2

// Internal servo object
static Servo _servo;

// Current angle (global state for this module)
static int _current_angle = SERVO_HOME_ANGLE;

/**
 * Initialize the servo and move it to the home (center) position.
 * Call once in setup().
 */
void servo_init() {
  _servo.attach(SERVO_PIN);
  _current_angle = SERVO_HOME_ANGLE;
  _servo.write(_current_angle);
  delay(500); // Let the servo settle
}

/**
 * Get the current servo angle (degrees).
 */
int servo_get_angle() {
  return _current_angle;
}

/**
 * Move the servo to an absolute angle.
 * Clamps to [SERVO_MIN_ANGLE, SERVO_MAX_ANGLE].
 */
void servo_set_angle(int angle) {
  _current_angle = constrain(angle, SERVO_MIN_ANGLE, SERVO_MAX_ANGLE);
  _servo.write(_current_angle);
}

/**
 * Move the servo one step to the left (decrease angle).
 */
void servo_step_left() {
  servo_set_angle(_current_angle - SERVO_STEP);
}

/**
 * Move the servo one step to the right (increase angle).
 */
void servo_step_right() {
  servo_set_angle(_current_angle + SERVO_STEP);
}

/**
 * Return the servo to the home (center) position.
 */
void servo_go_home() {
  servo_set_angle(SERVO_HOME_ANGLE);
}

#endif // SERVO_CONTROL_H
