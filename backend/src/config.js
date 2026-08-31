import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

dotenv.config({ path: path.join(rootDir, '.env') });

function readOrigins(value) {
  if (!value) return ['http://127.0.0.1:5176', 'http://localhost:5176'];
  return value.split(',').map((origin) => origin.trim()).filter(Boolean);
}

const configuredCorsOrigin = process.env.CORS_ORIGIN || '';
const nodeEnv = process.env.NODE_ENV || 'development';

export const config = {
  rootDir,
  port: Number(process.env.PORT || 5000),
  nodeEnv,
  corsOrigins: configuredCorsOrigin ? readOrigins(configuredCorsOrigin) : (nodeEnv === 'production' ? ['*'] : readOrigins('')),
  allowAllCorsOrigins: configuredCorsOrigin.includes('*') || (!configuredCorsOrigin && nodeEnv === 'production'),
  adminApiToken: process.env.ADMIN_API_TOKEN || '',
  admin: {
    username: process.env.ADMIN_USERNAME || 'admin',
    passwordHash: process.env.ADMIN_PASSWORD_HASH || '',
    jwtSecret: process.env.ADMIN_JWT_SECRET || '',
    sessionHours: Number(process.env.ADMIN_SESSION_HOURS || 8)
  },
  dataFile: path.resolve(rootDir, process.env.DATA_FILE || './data/db.json'),
  publicBaseUrl: process.env.PUBLIC_BASE_URL || `http://127.0.0.1:${Number(process.env.PORT || 5000)}`,
  email: {
    enabled: process.env.EMAIL_ENABLED === 'true',
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.MAIL_FROM || process.env.SMTP_USER || 'no-reply@wcdi.local',
    adminTo: process.env.ADMIN_EMAIL || ''
  },
  cloudinaryUrl: process.env.CLOUDINARY_URL || ''
};
