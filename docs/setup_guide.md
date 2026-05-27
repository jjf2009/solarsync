# SolarSync Setup Guide & User Manual

Welcome to **SolarSync**, an IoT-based smart solar tracking and monitoring system. SolarSync automatically adjusts a solar panel's direction using dual Light Dependent Resistors (LDRs) and a servo motor, while providing live telemetry (sensor readings, servo angle, alignment status) on a premium React Native / Expo Go mobile application.

This guide provides a comprehensive step-by-step walkthrough to assemble the hardware, upload the embedded software, provision the MySQL database, configure and start the Node.js backend server, and run the mobile application.

---

## 📋 Table of Contents
1. [System Architecture](#-system-architecture)
2. [Hardware Assembly & Wiring Guide](#%EF%B8%8F-hardware-assembly--wiring-guide)
3. [Arduino UNO Firmware Setup](#-arduino-uno-firmware-setup)
4. [MySQL Database Provisioning](#-mysql-database-provisioning)
5. [Node.js Backend Configuration & Launch](#%EF%B8%8F-nodejs-backend-configuration--launch)
6. [Expo Mobile Application Setup](#-expo-mobile-application-setup)
7. [Simulated Demo Mode (Hardware-Free Testing)](#-simulated-demo-mode-hardware-free-testing)
8. [Troubleshooting Guide](#%EF%B8%8F-troubleshooting-guide)

---

## 🏗️ System Architecture

SolarSync uses a three-tier architectural system to coordinate hardware control, database logging, and high-fidelity mobile monitoring:

```mermaid
graph TD
    subgraph Hardware Layer (Arduino Uno)
        LDR_L[Left LDR] -->|Analog input A0| UNO[Arduino UNO R3]
        LDR_R[Right LDR] -->|Analog input A1| UNO
        UNO -->|PWM Pin 9| Servo[SG90 Servo Motor]
    end

    subgraph Server Layer (Node.js & MySQL)
        UNO <-->|USB Serial Communication 9600 Baud| NodeServer[Node.js / Express Server]
        NodeServer -->|SQL Queries / Logging| MySQL[(MySQL Database)]
    end

    subgraph Client Layer (React Native / Expo)
        ExpoApp[Expo Mobile App] <-->|HTTP REST API / Polling| NodeServer
    end
```

1. **Hardware Layer (Arduino UNO)**: Reads analog light values from two LDR sensors. If a light intensity imbalance is detected, it steps the servo motor left or right to align the solar panel. It prints the latest telemetry string to the USB serial interface.
2. **Server Layer (Node.js & Express)**: Opens the serial port connection to the Arduino, parses the incoming serial telemetry, logs each entry to the MySQL database, and serves JSON endpoints (`/api/latest` and `/api/history`) for client consumption.
3. **Client Layer (Expo & Zustand)**: A premium glassmorphic mobile dashboard that polls the server every 2 seconds, maintaining real-time alignment visualizers, sensor grids, and system status widgets.

---

## 🛠️ Hardware Assembly & Wiring Guide

### Bill of Materials (BOM)
* **Microcontroller**: Arduino Uno R3 (or compatible board) + USB Type-B cable
* **Actuator**: TowerPro SG90 Micro Servo (or compatible 5V servo)
* **Light Sensors**: 2x LDR Photoresistors
* **Resistors**: 2x 10kΩ resistors (used as pull-down resistors in voltage dividers)
* **Breadboard**: 1x standard half-sized breadboard
* **Wiring**: Jumper wires (male-to-male and male-to-female)
* **Frame**: Cardboard cutout to serve as the rotating platform/panel holding the LDRs

### Circuit Connection Table

| Component | Arduino Pin | Description |
| :--- | :--- | :--- |
| **SG90 Servo (Orange/Yellow)** | **Pin 9 (PWM)** | Servo PWM Control Signal |
| **SG90 Servo (Red)** | **5V** | Power (VCC) |
| **SG90 Servo (Brown/Black)** | **GND** | Ground |
| **Left LDR Junction** | **Pin A0** | Left Sunlight Analog Reading |
| **Right LDR Junction** | **Pin A1** | Right Sunlight Analog Reading |
| **Both LDRs VCC Pin** | **5V** | Shared 5V Power rails |
| **Both Resistors GND Pin** | **GND** | Shared ground rail |

### Schematic Diagram (Voltage Divider Detail)
Each LDR is wired as a voltage divider with a `10kΩ` pull-down resistor to measure variable resistance based on light level:
```text
  5V Power Rail
       |
     [LDR] (Variable photoresistor)
       |
       +-------> Analog Input (A0 for Left, A1 for Right)
       |
    [10kΩ] (Fixed resistor)
       |
  GND Rail
```

---

## 🤖 Arduino UNO Firmware Setup

The Arduino firmware acts as a standalone autonomous tracker that logs current status via USB Serial.

### Prerequisites
1. Download and install **[Arduino IDE](https://www.arduino.cc/en/software)** on your computer.
2. Ensure the standard `Servo` library is installed (installed by default in the Arduino IDE).

### Steps to Upload
1. Connect the Arduino Uno to your laptop using the USB cable.
2. Open the Arduino IDE.
3. Select **File -> Open** and navigate to:
   ```path
   arduino/solar_tracker.ino
   ```
4. In the IDE menu bar:
   - Select **Tools -> Board -> Arduino Uno**.
   - Select **Tools -> Port** and choose the COM port matching your Arduino (e.g., `COM3` on Windows, `/dev/ttyUSB0` or `/dev/ttyACM0` on Linux).
5. Click the **Upload** button (the right arrow icon in the top left corner).
6. Verify successful uploading by looking at the status terminal (should show `Done uploading`).
7. (Optional) Open **Tools -> Serial Monitor** and set the baud rate to **9600**. You should see live lines printed in the format:
   `L:512,R:512,A:90,D:CENTER`

---

## 🗄️ MySQL Database Provisioning

The Node.js server automatically verifies database connections and initializes the required table on boot. However, you must ensure a MySQL server instance is running and accessible.

### Standard MySQL Installation
1. Start your local MySQL Server (using tools like XAMPP, WampServer, or a native system service).
2. Open your terminal or a database GUI tool (like phpMyAdmin, DBeaver, or Workbench).
3. Connect with your root user credentials.
4. Run the following command to create the database:
   ```sql
   CREATE DATABASE IF NOT EXISTS solarsync;
   ```
5. *(Optional)* If you would like to pre-load sample readings for immediate analytics viewing, execute the seed script:
   ```bash
   mysql -u [your_username] -p solarsync < database/seed.sql
   ```

---

## ⚡ Node.js Backend Configuration & Launch

The Node.js backend handles reading USB Serial commands, processing sensor inputs, updating MySQL logs, and exposing HTTP REST APIs.

### Setup Steps
1. Navigate to the `backend/` directory in your terminal:
   ```bash
   cd backend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Configure the environment variables:
   - Duplicate or open `.env`.
   - Update database credentials and define the specific USB serial port of your Arduino:
     ```env
     PORT=3000
     DB_HOST=localhost
     DB_PORT=3306
     DB_USER=root
     DB_PASSWORD=yourpassword
     DB_NAME=solarsync
     SERIAL_PORT=/dev/ttyUSB0   # Update to your COM port (e.g. COM3 for Windows)
     SERIAL_BAUD=9600
     ```

### Running the Backend
* **Development Mode** (Hot reloading with `ts-node-dev`):
  ```bash
  npm run dev
  ```
* **Production Build & Launch**:
  ```bash
  npm run build
  npm start
  ```

Upon startup, you should see console logs confirming:
- The server port binding (`[Server] SolarSync backend running on http://localhost:3000`)
- Database connectivity (`[DB] Database connection verified and table initialized.`)
- Serial port connection status (`[Serial] Connected to /dev/ttyUSB0 at 9600 baud`)

---

## 📱 Expo Mobile Application Setup

The SolarSync mobile app is built with Expo and React Native, using NativeWind for visual styling and Zustand for state management.

### Installation
1. Navigate to the root project folder:
   ```bash
   cd ..
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```

### Execution
1. Start the Expo development bundler:
   ```bash
   npm start
   ```
   *(Alternatively, run `npm run android`, `npm run ios`, or `npm run web` to directly target specific devices.)*
2. In your terminal, you will see a QR code.

### Connecting a Mobile Device (Expo Go)
* Install **Expo Go** from the App Store (iOS) or Google Play Store (Android) on your physical phone.
* **Important**: Both your computer running the bundler and your phone **MUST be on the same local Wi-Fi network**.
* Scan the QR code in the terminal using your phone camera (iOS) or the scan tool inside the Expo Go app (Android).
* **Automatic IP Resolution**: In `constants/config.ts`, the app dynamically resolves your computer's local IP via the Metro bundler's `hostUri` port `3000`. No manual code editing is needed to establish connections when using standard Expo Go!

---

## 🧪 Simulated Demo Mode (Hardware-Free Testing)

Don't have the hardware, database, or backend set up yet? You can still test the application instantly!

SolarSync features an **automated Demo Mode** that boots up when the backend API is offline:
1. When you run `npm start` and launch the app in Expo Go or your browser, it attempts to contact the Node.js API.
2. If it encounters **3 consecutive connection failures** (e.g., backend is offline or database isn't initialized), the polling service automatically switches the frontend to **Demo Mode**.
3. In Demo Mode, the app:
   - Simulates realistic LDR photoresistor value variations (sweeping up and down).
   - Simulates servo motor rotation sweeping between `0°` and `180°`.
   - Simulates the tracking alignment directions (`LEFT`, `RIGHT`, `CENTER`).
   - Updates the status card from "Offline" to a glowing green "DEMO MODE (Backend Simulation)" indicator.
   
This allows you to fully inspect the glassmorphism UI cards, check color transitions based on light intensity, test active state transitions, and demonstrate the software to stakeholders without connecting a single wire!

---

## 🛠️ Troubleshooting Guide

### 1. Serial Port Communication Failures
* **Error**: `[Serial] Port error: Error: Port not found` or `Access denied`.
* **Fix (Linux/macOS)**: 
  - Ensure the current user has access permissions to read/write serial ports by adding them to the dialout group:
    ```bash
    sudo usermod -a -G dialout $USER
    ```
    *(Log out and log back in to apply changes).*
* **Fix (Windows)**:
  - Check **Device Manager -> Ports (COM & LPT)** to find the exact port number assigned to the Arduino Uno, and update `SERIAL_PORT` in your backend `.env` file (e.g., `SERIAL_PORT=COM3`).
  - Make sure the Arduino IDE's Serial Monitor is **closed**; only one program can open the COM port at a time.

### 2. MySQL Connection Errors
* **Error**: `[DB] Database initialization failed. ... Access denied for user ...`.
* **Fix**: Ensure your MySQL server service is active and running on port 3306. Check your `.env` database parameters (`DB_USER`, `DB_PASSWORD`, `DB_NAME`). If using an empty password, specify `DB_PASSWORD=` or leave it blank.

### 3. Mobile Device Cannot Reach Laptop Backend
* **Symptoms**: UI remains stuck in "Loading..." or falls back to "Demo Mode", showing an offline status error in the terminal.
* **Fix**: 
  - Ensure both the phone and your computer are on the **exact same Wi-Fi SSID**.
  - Ensure your computer's system firewall (or anti-virus software) allows inbound TCP connections on port **3000** (used by the backend) and port **8081** (used by the Expo Metro bundler).
  - If your network isolates devices (like public campus or corporate Wi-Fi), use your phone's personal hotspot to connect your laptop, or use a local emulator (Android Studio Emulator or iOS Simulator) on the same machine.
