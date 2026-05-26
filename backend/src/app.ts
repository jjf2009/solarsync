import express from 'express';
import cors from 'cors';
import sensorRoutes from './routes/sensorRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api', sensorRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

export default app;
