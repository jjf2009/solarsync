-- SolarSync Database Schema
-- Run this once to set up the database

CREATE DATABASE IF NOT EXISTS solarsync;
USE solarsync;

CREATE TABLE IF NOT EXISTS sensor_readings (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  ldr1        INT           NOT NULL COMMENT 'Left LDR light intensity (0-1023)',
  ldr2        INT           NOT NULL COMMENT 'Right LDR light intensity (0-1023)',
  angle       INT           NOT NULL COMMENT 'Servo angle in degrees (0-180)',
  direction   VARCHAR(10)   NOT NULL COMMENT 'Tracking direction: LEFT, RIGHT, or STABLE',
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast latest-reading queries
CREATE INDEX idx_created_at ON sensor_readings (created_at DESC);
