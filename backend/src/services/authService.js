import { createHmac, randomBytes, randomInt, timingSafeEqual } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { createOtpChallenge, deleteOtpChallenge, verifyOtpChallenge } from '../store/jsonStore.js';
import { sendAdminOtp } from './emailService.js';

function assertAdminConfigured() {
  if (!config.admin.email || config.admin.jwtSecret.length < 32) {
    const error = new Error('Admin sign-in is not configured.');
    error.status = 503;
    throw error;
  }
  if (!Number.isFinite(config.admin.sessionHours) || config.admin.sessionHours < 1 || config.admin.sessionHours > 24) {
    const error = new Error('Admin session duration is not configured correctly.');
    error.status = 503;
    throw error;
  }
  if (!Number.isFinite(config.admin.otpMinutes) || config.admin.otpMinutes < 1 || config.admin.otpMinutes > 15) {
    const error = new Error('Admin code expiry is not configured correctly.');
    error.status = 503;
    throw error;
  }
}

function hashOtp(challengeId, code) {
  return createHmac('sha256', config.admin.jwtSecret).update(`${challengeId}:${code}`).digest();
}

export async function requestAdminOtp() {
  assertAdminConfigured();
  const challengeId = randomBytes(32).toString('hex');
  const email = config.admin.email.toLowerCase();

  const code = String(randomInt(0, 1_000_000)).padStart(6, '0');
  const expiresAt = Date.now() + config.admin.otpMinutes * 60 * 1000;
  try {
    await createOtpChallenge({
      challengeId,
      email,
      codeHash: hashOtp(challengeId, code).toString('hex'),
      attempts: 0,
      expiresAt
    });
  } catch (error) {
    console.error('[auth] Could not persist an admin OTP challenge.', error);
    const storageError = new Error('Admin sign-in is temporarily unavailable because the server could not store the login code.');
    storageError.status = 503;
    throw storageError;
  }

  try {
    await sendAdminOtp(email, code, config.admin.otpMinutes);
  } catch (error) {
    try {
      await deleteOtpChallenge(challengeId);
    } catch (cleanupError) {
      console.error('[auth] Could not remove the undelivered admin OTP challenge.', cleanupError);
    }
    throw error;
  }
  return challengeId;
}

export async function authenticateAdminWithOtp(challengeId, code) {
  assertAdminConfigured();
  if (!/^[a-f0-9]{64}$/.test(challengeId) || !/^\d{6}$/.test(code)) {
    return null;
  }

  const result = await verifyOtpChallenge(
    challengeId,
    config.admin.email.toLowerCase(),
    (storedHash) => {
      const expected = Buffer.from(storedHash, 'hex');
      const provided = hashOtp(challengeId, code);
      return expected.length === provided.length && timingSafeEqual(expected, provided);
    },
    Date.now(),
    config.admin.otpMaxAttempts
  );
  if (result.status !== 'valid') return null;

  return jwt.sign(
    { sub: config.admin.email, email: config.admin.email, role: 'admin' },
    config.admin.jwtSecret,
    { expiresIn: `${config.admin.sessionHours}h` }
  );
}

export function verifyAdminToken(token) {
  assertAdminConfigured();
  return jwt.verify(token, config.admin.jwtSecret);
}
