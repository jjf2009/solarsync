You are an expert React Native and Expo engineer helping me build SolarSync.
Write clean, simple, maintainable code. Prioritize clarity over
unnecessary abstraction.
Think like a senior mobile developer.
---
## Project Overview
We are building SolarSync, an IoT-based smart solar tracking and monitoring system that automatically adjusts panel direction based on light intensity and provides real-time monitoring through a mobile application.
The app includes:

The app includes:

Dual LDR-based sunlight detection
Automatic servo motor solar tracking
Arduino UNO hardware control
Real-time sensor monitoring
Node.js backend server
Serial communication between Arduino and laptop
REST API endpoints for sensor data
MySQL database logging
Expo Go mobile application
Live dashboard for tracking system status
Historical sensor data storage
Servo angle monitoring
Light intensity analytics
Manual and automatic tracking modes (future enhancement)

Keep the implementation simple and readable.
---
## Tech Stack

## Hardware
Arduino Uno R3
TowerPro SG90 Micro Servo
LDR Photoresistor
Breadboard
Jumper wires
10kΩ resistors
Cardboard frame structure

## Embedded Programming
Arduino IDE
Embedded C / Arduino C++
## Backend
Node.js
Express.js
SerialPort package
## Database
MySQL
## Mobile Application
Expo
React Native
## Communication
USB Serial Communication
REST API

Do not introduce new major libraries unless there is a strong reason.
Ask before installing anything new.
---
## Development Philosophy
Build feature by feature.
For every feature:
1. Read this file first.

2. Keep the implementation simple.

3. Avoid overengineering.

4. Prefer readable code over clever code.

5. Build the smallest useful version first.

6. Refactor only when repetition appears.
---
## Decision Making
If something is unclear or could be improved, suggest a better
approach. If a new library would significantly help, recommend it,
explain why, and ask before adding it.
Do not install new libraries without approval.
---
## Architecture
Use this folder structure:
```

```text id="q3gf7r"
```text id="xif09w"
solar-sync/
│
├── app/
│   ├── index.tsx
│   ├── _layout.tsx
│   └── +not-found.tsx
│
├── components/
│   ├── HeaderBar.tsx
│   ├── SensorCard.tsx
│   ├── ServoIndicator.tsx
│   ├── StatusCard.tsx
│   ├── LoadingState.tsx
│   └── ErrorState.tsx
│
├── services/
│   ├── api.ts
│   └── polling.ts
│
├── hooks/
│   └── useSensorData.ts
│
├── store/
│   └── sensorStore.ts
│
├── constants/
│   ├── colors.ts
│   ├── config.ts
│   └── mockData.ts
│
├── types/
│   └── sensor.ts
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts
│   │   │
│   │   ├── routes/
│   │   │   └── sensorRoutes.ts
│   │   │
│   │   ├── controllers/
│   │   │   └── sensorController.ts
│   │   │
│   │   ├── services/
│   │   │   └── serialService.ts
│   │   │
│   │   ├── models/
│   │   │   └── sensorModel.ts
│   │   │
│   │   ├── utils/
│   │   │   └── parser.ts
│   │   │
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
├── arduino/
│   ├── solar_tracker.ino
│   ├── sensors/
│   └── servo_control/
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── app.json
├── babel.config.js
├── tsconfig.json
├── package.json
├── package-lock.json
├── .gitignore
├── README.md
└── docker-compose.yml
```



```
**app/** is for Expo Router routes and screens only. Screens should compose components, call hooks, and consume store data. Do not place reusable UI blocks, API logic, or large business logic directly inside screens.

---

**components/** is for reusable UI components. Create a component when:

* it is reused in multiple screens
* it improves readability
* it represents a clear UI concept

Examples for this project:

* SensorCard
* StatusCard
* AnalyticsChart
* ServoIndicator
* HeaderBar

Do not over-engineer components too early.

---

**services/** contains external communication and application services.
Examples:

* backend API calls
* polling logic
* WebSocket connections
* serial communication helpers

Keep network and communication logic centralized here.

---

**constants/** stores application constants and configuration values.
Examples:

* API base URL
* theme colors
* sensor thresholds
* mock data
* application settings

Avoid hardcoding repeated values inside components or screens.

---

**hooks/** contains reusable React hooks.
Examples:

* useSensorData
* usePolling
* useServoStatus

Hooks should encapsulate reusable stateful logic and side effects.

---

**store/** holds Zustand stores or global state management.
Examples of state to keep here:

* live sensor readings
* servo angle
* connection status
* analytics data
* loading states

Persist important state using AsyncStorage when needed.

---

**assets/** stores static application resources.
Examples:

* images
* icons
* fonts
* illustrations

Keep assets organized into subfolders.

---

**backend/** contains the Node.js backend server and API layer.
Responsibilities:

* serial communication with Arduino
* REST API endpoints
* MySQL database integration
* sensor data processing

Backend business logic should stay inside services and controllers.

---

**backend/src/routes/** defines API endpoints only.
Routes should:

* receive requests
* call controllers
* return responses

Avoid placing database queries or business logic directly inside routes.

---

**backend/src/controllers/** handles request processing and response formatting.
Controllers should:

* validate requests
* coordinate services
* return API responses

Keep controllers lightweight.

---

**backend/src/services/** contains reusable backend business logic.
Examples:

* serial port listeners
* sensor analytics
* data processing
* Arduino communication

This layer should contain the main backend logic.

---

**backend/src/models/** manages database interaction logic.
Responsibilities:

* SQL queries
* data retrieval
* database abstraction

Keep database access isolated from controllers.

---

**backend/src/utils/** contains utility and helper functions.
Examples:

* parsers
* validators
* formatting helpers
* conversion functions

Do not place feature-specific business logic here.

---

**arduino/** contains all embedded system code running on the Arduino UNO.
Responsibilities:

* reading LDR values
* controlling servo movement
* serial communication
* sunlight tracking logic

Keep hardware logic modular and easy to debug.

---

**database/** stores database schema and SQL-related files.
Examples:

* schema.sql
* seed.sql
* migration scripts

Keep database structure version controlled.

---

**docs/** contains all project documentation.
Examples:

* SRS document
* architecture notes
* API documentation
* setup guide
* project report

Documentation should stay updated alongside development.

---

**README.md** should explain:

* project overview
* setup instructions
* architecture
* run commands
* contributors
* demo information

This should help anyone quickly understand and run the project.

---

**.env** stores environment variables and secrets.
Examples:

* database credentials
* API ports
* backend URLs

Never commit sensitive values to Git repositories.

---
## UI Rules
For any UI task:
- Replicate the provided design exactly.
- Match layout, spacing, padding, font sizes, font hierarchy, colors,
border radius, shadows, alignment, and proportions.

- Do not approximate. Do not simplify unless explicitly asked.
---
## Styling Rules
Use NativeWind classes. Do not use StyleSheet unless it is not possible
to style with className.
Use the NativeWind version installed in this project. Check
package.json. Do not upgrade without approval.
Reuse class patterns through utilities in global.css.
### Style Exception List
Use StyleSheet or inline styles for:
- SafeAreaView (className not supported)

- KeyboardAvoidingView (behavior props)

- Modal (visible, transparent props)

- Animated.View (animated style values)

- Dynamic styles calculated at runtime

- Platform specific styles

- Pressable or TouchableOpacity pressed states

- Shadows (different per platform)
Everywhere else, use NativeWind.
---
## Image Rule
Use centralized image imports.
1. Check if constants/images.ts exists.

2. If not, create it.

3. Import all app images there.

4. Use them through the centralized object.
```ts

import mascot from "@/assets/images/mascot.png";
export const images = {

mascot,

};

```
```tsx

<Image source={images.mascot} />

```
Do not import image assets directly inside screens or components.
---

## TypeScript
- Strict mode.

- No `any`.

- Keep types simple and readable.
---
## Feature Implementation
When building a feature:
1. Read this file first.

2. Identify the files to change.

3. Keep changes focused.

4. Do not rewrite unrelated code.

5. Follow existing patterns.

6. Make sure the feature works end to end.

7. Fix lint and type errors before finishing.
---
## Secrets
- Never expose secret keys in client code.

- Use server routes for tokens, AI calls, and any external API access.
---

## Communication
Be concise. Explain what changed and how to test it.
---
## Final Reminder
Before every feature:
- Read this file.

- Follow it strictly.

- Build clean, simple code.

- Replicate UI exactly when designs are provided.