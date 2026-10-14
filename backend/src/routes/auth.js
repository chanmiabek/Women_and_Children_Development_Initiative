import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticateAdminWithOtp, requestAdminOtp } from '../services/authService.js';
import { config } from '../config.js';
import { cleanText } from '../utils/validation.js';

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
    const email = cleanText(req.body?.email, 254).toLowerCase();
    const challengeId = await requestAdminOtp(email);
    res.json({
      ok: true,
      message: 'If this email is authorized, a sign-in code has been sent.',
      data: { email, challengeId, expiresInMinutes: config.admin.otpMinutes }
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post('/auth/verify-otp', verifyOtpLimit, async (req, res, next) => {
  try {
    const email = cleanText(req.body?.email, 254).toLowerCase();
    const challengeId = cleanText(req.body?.challengeId, 64);
    const code = cleanText(req.body?.code, 6);
    const token = await authenticateAdminWithOtp(email, challengeId, code);

    if (!token) {
      return res.status(401).json({ ok: false, message: 'The code is invalid or has expired.' });
    }

    res.json({
      ok: true,
      message: 'Admin authenticated.',
      data: {
        token,
        email,
        expiresInHours: config.admin.sessionHours,
        expiresAt: new Date(Date.now() + config.admin.sessionHours * 60 * 60 * 1000).toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
});
