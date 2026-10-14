# WCDI Backend

Express API for the React frontend.

## Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Set `VITE_API_BASE_URL` in the frontend to the public API origin. Set `CORS_ORIGIN` to the exact frontend origins, separated by commas. Production does not allow wildcard CORS origins.

## Admin sign-in

Admin access uses a six-digit email code. Configure `ADMIN_EMAIL`, a random `ADMIN_JWT_SECRET` of at least 32 characters, and a working SMTP account with `EMAIL_ENABLED=true`. Codes expire after `ADMIN_OTP_MINUTES`, allow at most five guesses, and sign-in requests are rate limited. Password login and the shared API-token bypass are not supported.

## Endpoints

- `GET /` lists the API routes; `GET /health` is the health check.
- `POST /auth/request-otp` accepts `{ "email": "admin@example.com" }`.
- `POST /auth/verify-otp` accepts `{ "email": "admin@example.com", "challengeId": "…", "code": "123456" }` and returns a bearer token.
- `POST /contact`, `POST /volunteers`, and `POST /newsletter` accept public submissions.
- `GET /content` reads public CMS content.
- `GET /dashboard`, `GET /contact`, `GET /volunteers`, `GET /newsletter`, `PUT /content`, and `POST /uploads/image` require `Authorization: Bearer <session-token>`.

## Production storage

The default store is `data/db.json`, selected by `DATA_FILE`. It must point to a persistent writable disk in production; ephemeral container filesystems lose submissions, CMS content, and outstanding login codes on restart. The JSON store is intended for a single backend process. Use a shared database before running multiple instances.

## Email and images

SMTP is required for admin login codes. Contact, volunteer, and newsletter notifications are best effort, so submission saving does not depend on notification delivery. Admin image uploads require `CLOUDINARY_URL` and are limited to 10 MB.

Donations are handled by the Donorbox widget embedded in the frontend. The backend does not process or store donation transactions.
