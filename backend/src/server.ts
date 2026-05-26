import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { startSerialService } from './services/serialService';

const PORT = Number(process.env.PORT ?? 3000);

app.listen(PORT, () => {
  console.log(`[Server] SolarSync backend running on http://localhost:${PORT}`);

  // Start listening to Arduino over serial
  startSerialService();
});
