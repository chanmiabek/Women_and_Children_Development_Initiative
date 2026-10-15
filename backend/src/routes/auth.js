import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticateAdminWithOtp, requestAdminOtp } from '../services/authService.js';
import { config } from '../config.js';

export const authRouter = Router();

const requestOtpLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 3,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { ok: false, message: 'Too many code requests. Try again later.' }
});

const verifyOtpLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { ok: false, message: 'Too many sign-in attempts. Try again later.' }
});

authRouter.post('/auth/request-otp', requestOtpLimit, async (req, res, next) => {
  try {
    const challengeId = await requestAdminOtp();
    res.json({
      ok: true,
      message: 'A sign-in code has been sent to the registered admin email, if email delivery is configured.',
      data: { challengeId, expiresInMinutes: config.admin.otpMinutes }
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post('/auth/verify-otp', verifyOtpLimit, async (req, res, next) => {
  try {
    const challengeId = String(req.body?.challengeId || '').trim().slice(0, 64);
    const code = String(req.body?.code || '').trim().slice(0, 6);
    const token = await authenticateAdminWithOtp(challengeId, code);

    if (!token) {
      return res.status(401).json({ ok: false, message: 'The code is invalid or has expired.' });
    }

    res.json({
      ok: true,
      message: 'Admin authenticated.',
      data: {
        token,
        email: config.admin.email,
        expiresInHours: config.admin.sessionHours,
        expiresAt: new Date(Date.now() + config.admin.sessionHours * 60 * 60 * 1000).toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
});
