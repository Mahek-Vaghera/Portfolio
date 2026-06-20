# Portfolio Backend

Production-ready Node.js + Express + MongoDB backend for the portfolio frontend.

## Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- Brevo Email API
- dotenv
- CORS
- express-validator

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create your environment file:

- Copy `.env.example` to `.env`
- Fill in your MongoDB URI, Brevo API key, sender details, and admin credentials

3. Start the backend:

```bash
npm run dev
```

The server runs on `http://localhost:5000` by default.

## Environment Variables

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/portfolio_backend
CORS_ORIGIN=http://localhost:8080
BREVO_API_KEY=your_brevo_api_key
SENDER_NAME=Your Name
SENDER_EMAIL=verified_sender@example.com
MY_EMAIL=yourpersonalemail@example.com
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=StrongPassword123
```

## API Endpoints

### Health

```bash
GET /health
```

### Contact

#### Create contact submission

```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mahek",
    "email": "mahek@example.com",
    "subject": "Portfolio Inquiry",
    "message": "I would like to connect about a project."
  }'
```

#### List contact submissions, protected by admin credentials

Use query params:

```bash
curl "http://localhost:5000/api/contact?email=admin@example.com&password=StrongPassword123"
```

Or headers:

```bash
curl http://localhost:5000/api/contact \
  -H "x-admin-email: admin@example.com" \
  -H "x-admin-password: StrongPassword123"
```

### Feedback

#### Create feedback

```bash
curl -X POST http://localhost:5000/api/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Aman",
    "email": "aman@example.com",
    "rating": 5,
    "feedback": "Great portfolio and clean UI."
  }'
```

#### List feedback

```bash
curl http://localhost:5000/api/feedback
```

## Frontend Integration

Set the frontend environment variable:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Then start the frontend and the portfolio explorer will call the backend for the endpoints marked as remote.

## Notes

- The contact list endpoint is protected directly inside `GET /api/contact`.
- Brevo email sending uses the official Brevo REST API.
- The backend keeps request handling asynchronous and uses centralized error handling.
