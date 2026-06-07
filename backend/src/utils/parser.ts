// Parses a raw serial line from the Arduino.
// Expected format: "L:820,R:310,A:75,P:412,D:RIGHT"
export interface ParsedSensorData {
  leftLDR: number;
  rightLDR: number;
  servoAngle: number;
  panelOutput: number;
  trackingDirection: string;
}

export function parseSerialLine(line: string): ParsedSensorData | null {
  try {
    const parts = line.trim().split(',');
    if (parts.length !== 5) return null;

    const getValue = (part: string): string => part.split(':')[1] ?? '';

    const leftLDR         = parseInt(getValue(parts[0]), 10);
    const rightLDR        = parseInt(getValue(parts[1]), 10);
    const servoAngle      = parseInt(getValue(parts[2]), 10);
    const panelOutput     = parseInt(getValue(parts[3]), 10);
    const trackingDirection = getValue(parts[4]).trim();

    if (
      isNaN(leftLDR)     ||
      isNaN(rightLDR)    ||
      isNaN(servoAngle)  ||
      isNaN(panelOutput)
    ) return null;

    // Validate ranges
    if (leftLDR    < 0 || leftLDR    > 1023) return null;
    if (rightLDR   < 0 || rightLDR   > 1023) return null;
    if (servoAngle < 0 || servoAngle > 180)  return null;
    if (panelOutput < 0 || panelOutput > 1023) return null;

    return { leftLDR, rightLDR, servoAngle, panelOutput, trackingDirection };
  } catch {
    return null;
  }
}
