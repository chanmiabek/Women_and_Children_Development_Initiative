import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.js';
import { notifyAdmin } from '../services/emailService.js';
import { insert, list } from '../store/jsonStore.js';
import { normalizeContact, normalizeVolunteer } from '../utils/validation.js';

export const submissionsRouter = Router();

submissionsRouter.post('/contact', async (req, res, next) => {
  try {
    const item = await insert('contacts', normalizeContact(req.body || {}));
    await Promise.allSettled([notifyAdmin('New WCDI contact message', item)]);
    res.status(201).json({ ok: true, message: 'Contact message received.', data: item });
  } catch (error) {
    next(error);
  }
});

submissionsRouter.get('/contact', requireAdmin, async (req, res, next) => {
  try {
    res.json({ ok: true, data: await list('contacts') });
  } catch (error) {
    next(error);
  }
});

submissionsRouter.post('/volunteers', async (req, res, next) => {
  try {
    const item = await insert('volunteers', normalizeVolunteer(req.body || {}));
    await Promise.allSettled([notifyAdmin('New WCDI volunteer application', item)]);
    res.status(201).json({ ok: true, message: 'Volunteer application received.', data: item });
  } catch (error) {
    next(error);
  }
});

submissionsRouter.get('/volunteers', requireAdmin, async (req, res, next) => {
  try {
    res.json({ ok: true, data: await list('volunteers') });
  } catch (error) {
    next(error);
  }
});
