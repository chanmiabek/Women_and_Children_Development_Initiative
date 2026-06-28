import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config.js';
import { authRouter } from './routes/auth.js';
import { contentRouter } from './routes/content.js';
import { dashboardRouter } from './routes/dashboard.js';
import { donationsRouter } from './routes/donations.js';
import { newsletterRouter } from './routes/newsletter.js';
import { paymentsRouter } from './routes/payments.js';
import { submissionsRouter } from './routes/submissions.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(cors({
    origin(origin, callback) {
      if (config.allowAllCorsOrigins) return callback(null, true);
      if (!origin || config.corsOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked origin: ${origin}`));
    }
  }));
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));
  app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: 'draft-7',
    legacyHeaders: false
  }));

  app.get('/', (req, res) => {
    res.json({
      ok: true,
      service: 'wcdi-backend',
      message: 'WCDI backend API is running.',
      endpoints: [
        'GET /health',
        'POST /auth/login',
        'POST /contact',
        'POST /volunteers',
        'POST /newsletter',
        'POST /donations',
        'POST /payments/paystack/initialize',
        'GET /payments/paystack/verify/:reference',
        'POST /payments/mpesa/stk-push',
        'POST /payments/mpesa/callback',
        'GET /dashboard',
        'GET /content',
        'PUT /content'
      ]
    });
  });

  app.get('/health', (req, res) => {
    res.json({
      ok: true,
      service: 'wcdi-backend',
      environment: config.nodeEnv,
      timestamp: new Date().toISOString()
    });
  });

  app.use(authRouter);
  app.use(submissionsRouter);
  app.use(newsletterRouter);
  app.use(donationsRouter);
  app.use(paymentsRouter);
  app.use(dashboardRouter);
  app.use(contentRouter);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
