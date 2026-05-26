// Parses a raw serial line from the Arduino.
// Expected format: "LDR1:512,LDR2:480,ANGLE:90,DIR:RIGHT"
export interface ParsedSensorData {
  ldr1: number;
  ldr2: number;
  angle: number;
  direction: string;
}

export function parseSerialLine(line: string): ParsedSensorData | null {
  try {
    const parts = line.trim().split(',');
    if (parts.length !== 4) return null;

    const getValue = (part: string): string => part.split(':')[1] ?? '';

    const ldr1 = parseInt(getValue(parts[0]), 10);
    const ldr2 = parseInt(getValue(parts[1]), 10);
    const angle = parseInt(getValue(parts[2]), 10);
    const direction = getValue(parts[3]);

    if (isNaN(ldr1) || isNaN(ldr2) || isNaN(angle)) return null;

    return { ldr1, ldr2, angle, direction };
  } catch {
    return null;
  }
}
