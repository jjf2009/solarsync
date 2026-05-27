# SolarSync ☀️🔄

SolarSync is an IoT-based smart solar tracking and monitoring system that automatically adjusts a solar panel's physical direction based on light intensity, and delivers real-time sensor analytics, alignment tracking, and hardware telemetry directly to a mobile application.

The project features a **high-fidelity glassmorphism dashboard** built with React Native and Expo Go, powered by a Node.js & Express API, backed by a MySQL database, and running on autonomous Arduino UNO hardware.

---

## 🌟 Core Features

- **Dual LDR Sunlight Tracking**: Pinpoint light detection using left and right photoresistors to guide the panel towards the brightest light source.
- **Micro-Servo Alignment**: Closed-loop automatic feedback system using a TowerPro SG90 Servo to pivot the panel incrementally.
- **Express API Backend**: Centralized Node.js controller that handles real-time USB Serial communications, parses telemetry lines, and logs sensor data to MySQL.
- **MySQL Analytics Storage**: Secure persistent database logs recording historical LDR levels, tracking directions, and servo angles for energy yield optimization.
- **Zustand State Telemetry**: High-performance React Native state store that drives animations, sensor readings, and connection statuses in real time.
- **Premium Glassmorphic UI**: Sleek styling with custom NativeWind Tailwind styles, glowing visual cards, and smooth micro-animations.
- **Zero-Hardware Demo Mode**: Automated fallback simulation that enables developers to run the app with live sweeping telemetry even without physical devices or active backends.

---

## 🏗️ System Architecture

SolarSync coordinates physical tracking, database history logging, and mobile telemetry visualization:

```
                  ┌──────────────────────────────┐
                  │   SolarSync Mobile Client    │
                  │   (React Native & Expo Go)   │
                  └──────────────┬───────────────┘
                                 │
                     HTTP Polling (Every 2s)
                                 │
                  ┌──────────────▼───────────────┐
                  │    Node.js Express Server    │
                  │       (Backend Port 3000)    │
                  └──────┬───────────────▲───────┘
                         │               │
                 MySQL Queries     USB Serial (9600 Baud)
                         │               │
            ┌────────────▼────┐   ┌──────┴───────────────┐
            │ MySQL Database  │   │  Arduino UNO Board   │
            │  ("solarsync")  │   │  (Pins A0, A1, D9)   │
            └─────────────────┘   └──────────┬───────────┘
                                             │
                                   Hardware Actuation
                                             │
                                  ┌──────────▼───────────┐
                                  │ LDR Sensors & Servo  │
                                  └──────────────────────┘
```

The workspace is organized cleanly as follows (fully detailed in [AGENTS.md](file:///home/jjf2009/Desktop/Projects/IOTPROJECT/AGENTS.md)):
- **`app/`**: Expo Router navigation tree and primary screens.
- **`components/`**: Modular, high-fidelity UI dashboard parts (`SensorCard`, `ServoIndicator`, etc.).
- **`services/`**: Network operations and frontend API polling clients.
- **`constants/`**: Design tokens, threshold settings, and environment resolvers.
- **`backend/`**: Express controllers, raw USB SerialPort listener, and MySQL service models.
- **`arduino/`**: Embedded C++ tracking sketch, LDR drivers, and servo controllers.
- **`database/`**: Core SQL bootstrap schemas and seed scripts.

---

## 🔌 Hardware Setup (At a Glance)

To run the full hardware package, wire your components to the Arduino Uno R3 as follows:

- **TowerPro SG90 Micro Servo**:
  - Orange/Yellow (Signal) ➡️ **Digital Pin 9 (PWM)**
  - Red (VCC) ➡️ **5V Pin**
  - Brown/Black (GND) ➡️ **GND Pin**
- **Left LDR Sunlight Sensor**:
  - Wired into **Analog Pin A0** (with a `10kΩ` pull-down resistor to Ground in a voltage divider circuit).
- **Right LDR Sunlight Sensor**:
  - Wired into **Analog Pin A1** (with a `10kΩ` pull-down resistor to Ground in a voltage divider circuit).

> [!NOTE]
> For detailed instructions, wiring diagrams, and cardboard frame design layouts, please check the [Comprehensive User Manual](file:///home/jjf2009/Desktop/Projects/IOTPROJECT/docs/setup_guide.md#%EF%B8%8F-hardware-assembly--wiring-guide).

---

## 🚀 Quick Start Running Commands

Follow these quick commands to spin up the system. Make sure you have **Node.js (v18+)** and **MySQL Server** installed.

### 1. Arduino Firmware
Open `arduino/solar_tracker.ino` in your **Arduino IDE**, select **Arduino Uno**, select your port, and click **Upload**.

### 2. Database Creation
Ensure MySQL is running, then log into your MySQL client and create the database:
```sql
CREATE DATABASE IF NOT EXISTS solarsync;
```
*(The backend automatically creates the required tables on server boot)*

### 3. Backend REST Server
Navigate to the `backend` directory, install packages, and start the developer server:
```bash
cd backend
npm install
npm run dev
```
*(Make sure to verify and adjust your port and credentials in `backend/.env`!)*

### 4. Expo Mobile Application
From the root directory, install dependencies and start the Expo Go bundler:
```bash
npm install
npm start
```
Use the **Expo Go** application on your physical iOS or Android phone to scan the terminal's QR code, or press `a` (Android Emulator) / `i` (iOS Simulator) / `w` (Web browser) to run it locally.

---

## 🧪 Zero-Hardware Demo Mode

If you do not have the physical hardware or a local MySQL server running, **you can still test-drive the application immediately!**

The SolarSync mobile app includes an integrated, automatic **Demo Mode** fallback:
1. The app polls the Express backend `/api/latest` endpoint every 2 seconds.
2. If it experiences **3 consecutive connection failures** (e.g. backend server offline), the polling controller automatically shifts state to Demo Mode.
3. Once active, the Zustand store simulates live sunlight transitions, pivots the glowing servo visualizer, and flips the dashboard connection badge to a flashing green **`DEMO MODE (Simulation)`** status.
4. This ensures that the high-fidelity visual cards, color shifts based on sun position, and responsive alerts are fully functional for local demonstrations.

---

## 📖 Deep-Dive Setup & User Manual

Looking for in-depth wiring details, serial port permissions on Linux (`udev` rules), database seeding, network configurations, or detailed troubleshooting guides? 

Check out the full **[SolarSync User Manual & Setup Guide](file:///home/jjf2009/Desktop/Projects/IOTPROJECT/docs/setup_guide.md)**.

---

## 👥 Contributors
- **IoT hardware & Arduino Development**: Google Deepmind Antigravity & Pair Developer
- **Backend Architecture**: Express API Team
- **UI/UX Design & Frontend**: Expo & NativeWind Mobile Engineers
