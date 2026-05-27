// Parses a raw serial line from the Arduino.
// Expected format: "L:820,R:310,A:75,D:LEFT"
export interface ParsedSensorData {
  leftLDR: number;
  rightLDR: number;
  servoAngle: number;
  trackingDirection: string;
}

export function parseSerialLine(line: string): ParsedSensorData | null {
  try {
    const parts = line.trim().split(',');
    if (parts.length !== 4) return null;

    const getValue = (part: string): string => part.split(':')[1] ?? '';

    const leftLDR = parseInt(getValue(parts[0]), 10);
    const rightLDR = parseInt(getValue(parts[1]), 10);
    const servoAngle = parseInt(getValue(parts[2]), 10);
    const trackingDirection = getValue(parts[3]);

    if (isNaN(leftLDR) || isNaN(rightLDR) || isNaN(servoAngle)) return null;

    return { leftLDR, rightLDR, servoAngle, trackingDirection };
  } catch {
    return null;
  }
}

