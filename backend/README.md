# WCDI Backend

Express API for the React frontend.

## Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Set the frontend environment variable to point at the API:

```bash
VITE_API_BASE_URL=http://127.0.0.1:5000
```

## Endpoints

- `GET /`
- `GET /health`
- `POST /contact`
- `POST /volunteers`
- `POST /newsletter`
- `POST /donations`
- `POST /payments/paystack/initialize`
- `GET /payments/paystack/verify/:reference`
- `POST /payments/mpesa/stk-push`
- `POST /payments/mpesa/callback`
- `GET /dashboard`
- `GET /content`
- `PUT /content`
- `GET /contact`
- `GET /volunteers`
- `GET /newsletter`
- `GET /donations`

Data is stored in `backend/data/db.json` by default. Set `ADMIN_API_TOKEN` in `.env` to protect `/dashboard`, `/content` writes, and list endpoints with `Authorization: Bearer <token>`.

## Email

Set `EMAIL_ENABLED=true` and fill `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, and `ADMIN_EMAIL`. Contact, volunteer, newsletter, and donation submissions will still save if email delivery fails.

## Payments

Paystack initialization and verification require `PAYSTACK_SECRET_KEY`. The frontend calls the backend, receives Paystack's authorization URL, redirects the donor, and verifies the returned reference through the backend.

M-Pesa STK Push requires Daraja credentials: `MPESA_CONSUMER_KEY`, `MPESA_CONSUMER_SECRET`, `MPESA_SHORTCODE`, and `MPESA_PASSKEY`. For real callbacks, `MPESA_CALLBACK_URL` must be a public HTTPS URL that points to:

```text
https://your-domain.example/payments/mpesa/callback
```
