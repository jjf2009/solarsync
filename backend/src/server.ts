import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { startSerialService } from './services/serialService';
import { initDb } from './config/db';

const PORT = Number(process.env.PORT ?? 3000);

app.listen(PORT, async () => {
  console.log(`[Server] SolarSync backend running on http://localhost:${PORT}`);

  // Initialize DB tables
  await initDb();

  // Start listening to Arduino over serial
  startSerialService();
});

