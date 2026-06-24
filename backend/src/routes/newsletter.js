import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.js';
import { notifyAdmin, sendSubscriberWelcome } from '../services/emailService.js';
import { insert, list, upsertSubscriber } from '../store/jsonStore.js';
import { normalizeNewsletter } from '../utils/validation.js';

export const newsletterRouter = Router();

newsletterRouter.post('/newsletter', async (req, res, next) => {
  try {
    const payload = normalizeNewsletter(req.body || {});
    const item = await insert('newsletter', payload);
    const subscriber = await upsertSubscriber(payload.email, payload);
    await Promise.allSettled([
      sendSubscriberWelcome(subscriber),
      notifyAdmin('New WCDI newsletter subscriber', subscriber)
    ]);
    res.status(201).json({
      ok: true,
      message: 'Newsletter subscription saved.',
      data: { submission: item, subscriber }
    });
  } catch (error) {
    next(error);
  }
});

newsletterRouter.get('/newsletter', requireAdmin, async (req, res, next) => {
  try {
    res.json({ ok: true, data: await list('newsletter') });
  } catch (error) {
    next(error);
  }
});
