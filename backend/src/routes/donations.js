import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.js';
import { notifyAdmin, sendDonorReceipt } from '../services/emailService.js';
import { insert, list } from '../store/jsonStore.js';
import { normalizeDonation } from '../utils/validation.js';

export const donationsRouter = Router();

donationsRouter.post('/donations', async (req, res, next) => {
  try {
    const item = await insert('donations', normalizeDonation(req.body || {}));
    await Promise.allSettled([
      sendDonorReceipt(item),
      notifyAdmin('New WCDI donation recorded', item)
    ]);
    res.status(201).json({ ok: true, message: 'Donation recorded.', data: item });
  } catch (error) {
    next(error);
  }
});

donationsRouter.get('/donations', requireAdmin, async (req, res, next) => {
  try {
    res.json({ ok: true, data: await list('donations') });
  } catch (error) {
    next(error);
  }
});
