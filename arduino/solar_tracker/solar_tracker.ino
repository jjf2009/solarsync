#include <Servo.h>

Servo servo;

// ─────────────────────────────────────────────
// Pins
// ─────────────────────────────────────────────
const int eastLDR = A0;
const int westLDR = A1;
const int panelOutputPin = A2;

const int SERVO_PIN = 9;

// ─────────────────────────────────────────────
// Servo Limits
// ─────────────────────────────────────────────
const int SERVO_MIN = 10;    // East
const int SERVO_MAX = 100;   // West

// ─────────────────────────────────────────────
// Tracking Settings
// ─────────────────────────────────────────────
const int THRESHOLD = 100;
const int SERVO_STEP = 1;

// ─────────────────────────────────────────────
// Night Detection
// ─────────────────────────────────────────────
const int NIGHT_THRESHOLD = 300;
const int HOME_POSITION = SERVO_MIN;

// ─────────────────────────────────────────────
// State
// ─────────────────────────────────────────────
int servoPosition = HOME_POSITION;

const char* trackerState = "NIGHT";

// ─────────────────────────────────────────────
// Read Averaged Sensor Value
// ─────────────────────────────────────────────
int readAverage(int pin) {

  long total = 0;

  for (int i = 0; i < 5; i++) {

    total += analogRead(pin);

    delay(2);
  }

  return total / 5;
}

// ─────────────────────────────────────────────
// Move Servo
// ─────────────────────────────────────────────
void moveServo(int target) {

  target = constrain(target, SERVO_MIN, SERVO_MAX);

  if (target == servoPosition)
    return;

  servoPosition = target;

  servo.write(servoPosition);
}

// ─────────────────────────────────────────────
// Setup
// ─────────────────────────────────────────────
void setup() {

  Serial.begin(9600);

  servo.attach(SERVO_PIN);

  servo.write(HOME_POSITION);

  servoPosition = HOME_POSITION;

  delay(500);

  Serial.println("SolarSync Ready");
}

// ─────────────────────────────────────────────
// Main Loop
// ─────────────────────────────────────────────
void loop() {

  // Read Sensors
  int east = readAverage(eastLDR);
  int west = readAverage(westLDR);
  int panelOutput = readAverage(panelOutputPin);

  int error = east - west;

  int lightLevel = (east + west) / 2;

  // ─────────────────────────────────────────
  // NIGHT MODE
  // ─────────────────────────────────────────

  if (lightLevel < NIGHT_THRESHOLD) {

    if (servoPosition > HOME_POSITION) {

      moveServo(servoPosition - 1);

      trackerState = "RETRN";
    }
    else {

      trackerState = "NIGHT";
    }
  }

  // ─────────────────────────────────────────
  // DAY MODE
  // ─────────────────────────────────────────

  else {

    if (error > THRESHOLD) {

      // Move RIGHT

      if (servoPosition >= SERVO_MAX) {

        trackerState = "HRGHT";
      }
      else {

        moveServo(servoPosition + SERVO_STEP);

        trackerState = "RIGHT";
      }
    }

    else if (error < -THRESHOLD) {

      // Move LEFT

      if (servoPosition <= SERVO_MIN) {

        trackerState = "HLEFT";
      }
      else {

        moveServo(servoPosition - SERVO_STEP);

        trackerState = "LEFT ";
      }
    }

    else {

      // Aligned

      if (servoPosition <= SERVO_MIN) {

        trackerState = "HLEFT";
      }
      else if (servoPosition >= SERVO_MAX) {

        trackerState = "HRGHT";
      }
      else {

        trackerState = "CNTER";
      }
    }
  }

  // ─────────────────────────────────────────
  // Serial Output
  // Format:
  // L:820,R:310,A:75,P:412,D:RIGHT
  // ─────────────────────────────────────────

  Serial.print("L:");
  Serial.print(east);

  Serial.print(",R:");
  Serial.print(west);

  Serial.print(",A:");
  Serial.print(servoPosition);

  Serial.print(",P:");
  Serial.print(panelOutput);

  Serial.print(",D:");
  Serial.println(trackerState);

  delay(150);
}
