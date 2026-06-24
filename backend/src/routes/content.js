import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.js';
import { readContent, writeContent } from '../store/jsonStore.js';

export const contentRouter = Router();

contentRouter.get('/content', async (req, res, next) => {
  try {
    res.json({ ok: true, data: await readContent() });
  } catch (error) {
    next(error);
  }
});

contentRouter.put('/content', requireAdmin, async (req, res, next) => {
  try {
    const payload = req.body || {};
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      return res.status(400).json({ ok: false, message: 'Content payload must be an object.' });
    }
    res.json({ ok: true, data: await writeContent(payload) });
  } catch (error) {
    next(error);
  }
});
