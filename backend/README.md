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
- `GET /dashboard`
- `GET /content`
- `PUT /content`
- `GET /contact`
- `GET /volunteers`
- `GET /newsletter`

Data is stored in `backend/data/db.json` by default. Set `ADMIN_API_TOKEN` in `.env` to protect `/dashboard`, `/content` writes, and list endpoints with `Authorization: Bearer <token>`.

## Email

Set `EMAIL_ENABLED=true` and fill `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, and `ADMIN_EMAIL`. Contact, volunteer, and newsletter submissions will still save if email delivery fails.

## Donations

Online donations are handled entirely by the Donorbox widget embedded in the frontend. The backend does not process or store donation transactions.
