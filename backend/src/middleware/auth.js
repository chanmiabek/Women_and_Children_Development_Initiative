import { config } from '../config.js';
import { verifyAdminToken } from '../services/authService.js';

export function requireAdmin(req, res, next) {
  const header = req.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';

  if (config.admin.jwtSecret && config.admin.passwordHash) {
    try {
      req.admin = verifyAdminToken(token);
      return next();
    } catch {
      return res.status(401).json({
        ok: false,
        message: 'Admin authorization is required.'
      });
    }
  }

  if (config.adminApiToken && token === config.adminApiToken) return next();

  return res.status(401).json({
    ok: false,
    message: 'Admin authorization is required.'
  });
}
