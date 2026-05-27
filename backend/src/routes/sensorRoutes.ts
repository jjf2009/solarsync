import { Router } from 'express';
import { getLatest, getHistory } from '../controllers/sensorController';

const router = Router();

// GET /api/health  - health check
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GET /api/latest  – most recent sensor reading
router.get('/latest', getLatest);

// GET /api/history – last N readings from DB
router.get('/history', getHistory);

export default router;

