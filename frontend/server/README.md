# Mahek Portfolio — Reference Backend (optional)

The React app is a **static site** and works fully on its own. This folder is a
*completely optional* Node/Express backend you can deploy (Render, Fly, Railway,
your own VPS) to:

1. Send real "thank-you" emails via **Brevo** (Sendinblue).
2. Persist **feedback** and **history** in **MongoDB**.

When the frontend sees `VITE_API_BASE_URL`, the following endpoints are sent
here instead of the local mock — everything else stays mocked:

| Method | Path                    | What it does                                     |
| ------ | ----------------------- | ------------------------------------------------ |
| POST   | `/api/contact/message`  | Validates body, emails you the message.          |
| POST   | `/api/feedback`         | Stores feedback in Mongo, sends thank-you email. |
| GET    | `/api/feedback`         | Returns all feedback (emails masked).            |

If MongoDB is unreachable, the server **does not crash** — it falls back to an
in-memory store. If Brevo is not configured, emails are skipped (logged only).

## Quick start

```bash
cd server
cp .env.example .env     # fill in BREVO_API_KEY, MONGODB_URI, OWNER_EMAIL
npm install
npm start
```

Then in the React app root, create `.env.local`:

```
VITE_API_BASE_URL=http://localhost:8787
```

Restart Vite — the contact and feedback endpoints are now live.
