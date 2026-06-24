import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';

function assertAdminConfigured() {
  const missing = [];
  if (!config.admin.passwordHash) missing.push('ADMIN_PASSWORD_HASH');
  if (!config.admin.jwtSecret) missing.push('ADMIN_JWT_SECRET');
  if (missing.length) {
    const error = new Error('Admin authentication is not fully configured.');
    error.status = 503;
    error.details = { missing };
    throw error;
  }
}

export async function authenticateAdmin(username, password) {
  assertAdminConfigured();
  if (username !== config.admin.username) return null;
  const valid = await bcrypt.compare(String(password || ''), config.admin.passwordHash);
  if (!valid) return null;

  return jwt.sign(
    { sub: config.admin.username, role: 'admin' },
    config.admin.jwtSecret,
    { expiresIn: `${config.admin.sessionHours}h` }
  );
}

export function verifyAdminToken(token) {
  assertAdminConfigured();
  return jwt.verify(token, config.admin.jwtSecret);
}
