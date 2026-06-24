import { Router } from 'express';
import { authenticateAdmin } from '../services/authService.js';
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
        expiresInHours: Number(process.env.ADMIN_SESSION_HOURS || 8)
      }
    });
  } catch (error) {
    next(error);
  }
});
