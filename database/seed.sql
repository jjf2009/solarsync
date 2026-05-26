-- SolarSync Seed Data
-- Optional: populate with sample readings for development/testing

USE solarsync;

INSERT INTO sensor_readings (ldr1, ldr2, angle, direction) VALUES
  (512, 480, 90,  'STABLE'),
  (600, 400, 75,  'LEFT'),
  (350, 650, 105, 'RIGHT'),
  (520, 510, 90,  'STABLE'),
  (700, 300, 60,  'LEFT'),
  (290, 710, 120, 'RIGHT'),
  (500, 495, 90,  'STABLE');
