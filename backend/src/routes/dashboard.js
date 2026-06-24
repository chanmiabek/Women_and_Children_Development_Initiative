import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.js';
import { readDashboard } from '../store/jsonStore.js';

export const dashboardRouter = Router();

dashboardRouter.get('/dashboard', requireAdmin, async (req, res, next) => {
  try {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.json(await readDashboard());
  } catch (error) {
    next(error);
  }
});
