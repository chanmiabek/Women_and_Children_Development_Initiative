import { Router } from 'express';
import { authenticateAdmin } from '../services/authService.js';
import { config } from '../config.js';
import { cleanText } from '../utils/validation.js';

export const authRouter = Router();

authRouter.post('/auth/login', async (req, res, next) => {
  try {
    const username = cleanText(req.body?.username, 120);
    const password = String(req.body?.password || '');
    const token = await authenticateAdmin(username, password);

    if (!token) {
      return res.status(401).json({ ok: false, message: 'Invalid admin username or password.' });
    }

    res.json({
      ok: true,
      message: 'Admin authenticated.',
      data: {
        token,
        username,
        expiresInHours: config.admin.sessionHours,
        expiresAt: new Date(Date.now() + config.admin.sessionHours * 60 * 60 * 1000).toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
});
