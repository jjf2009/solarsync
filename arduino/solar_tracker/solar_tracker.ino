#include <Servo.h>

Servo servo;

// ─────────────────────────────────────────────
// Pins
// ─────────────────────────────────────────────
const int eastLDR = A0;
const int westLDR = A1;

const int SERVO_PIN = 9;

// ─────────────────────────────────────────────
// Servo Limits
// Safe range to avoid servo grinding/jitter
// ─────────────────────────────────────────────
const int SERVO_MIN = 40;
const int SERVO_MAX = 140;

// ─────────────────────────────────────────────
// Tracking Settings
// ─────────────────────────────────────────────
const int THRESHOLD = 80;
const int SERVO_STEP = 5;

// ─────────────────────────────────────────────
// State
// ─────────────────────────────────────────────
int servoPosition = 90;

// ─────────────────────────────────────────────
void setup() {

  Serial.begin(9600);

  servo.attach(SERVO_PIN);

  // Move servo to center position
  servo.write(servoPosition);

  Serial.println("SolarSync Ready");
}

// ─────────────────────────────────────────────
void loop() {

  // ─────────────────────────────────────────
  // Read LDR Values
  // Small averaging reduces sensor noise
  // ─────────────────────────────────────────

  int east1 = analogRead(eastLDR);
  int east2 = analogRead(eastLDR);

  int west1 = analogRead(westLDR);
  int west2 = analogRead(westLDR);

  int east = (east1 + east2) / 2;
  int west = (west1 + west2) / 2;

  // ─────────────────────────────────────────
  // Calculate Difference
  // ─────────────────────────────────────────

  int error = east - west;

  String direction = "CENTER";

  // ─────────────────────────────────────────
  // Tracking Logic
  // ─────────────────────────────────────────

  if (error > THRESHOLD) {

    // More light on EAST sensor
    // Rotate servo RIGHT

    if (servoPosition < SERVO_MAX) {

      servoPosition += SERVO_STEP;

      servo.write(servoPosition);
    }

    direction = "RIGHT";
  }

  else if (error < -THRESHOLD) {

    // More light on WEST sensor
    // Rotate servo LEFT

    if (servoPosition > SERVO_MIN) {

      servoPosition -= SERVO_STEP;

      servo.write(servoPosition);
    }

    direction = "LEFT";
  }

  else {

    direction = "CENTER";
  }

  // ─────────────────────────────────────────
  // Serial Output
  // Format used by Node.js backend parser
  // ─────────────────────────────────────────

Serial.print("L:");
Serial.print(east);

Serial.print(",R:");
Serial.print(west);

Serial.print(",A:");
Serial.print(servoPosition);

Serial.print(",D:");
Serial.print(direction);

Serial.println();

  // ─────────────────────────────────────────
  // Delay
  // Higher delay = smoother movement
  // ─────────────────────────────────────────

  delay(100);
}