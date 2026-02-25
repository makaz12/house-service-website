# Home Services Booking App

Full-stack mini project for booking home services (plumbing, painting, tiling, etc.) with account creation, appointment scheduling, and optional call-agent request flow.

## Stack

- Frontend: React + Vite + React Router
- Backend: Node.js + Express
- Database: SQLite + Prisma ORM
- Security: password hashing, JWT auth, validation, basic rate limiting, helmet
- Maps: Google Maps API support for selecting job location

## Features

- Browse available services
- Register/Login with email and password
- Book a service with date/time slot and location
- View/cancel your appointments
- Request callback from an agent instead of booking directly

## Backend setup

1. `cd backend`
2. Copy `.env.example` to `.env`.
3. Run:
   - `npm install`
   - `npx prisma generate`
   - `npx prisma migrate dev --name init`
   - `npm run prisma:seed`
4. Start API:
   - `npm run dev`

API base URL: `http://localhost:4000/api`

## Frontend setup

1. `cd frontend`
2. Copy `.env.example` to `.env`
3. Set:
   - `VITE_API_URL=http://localhost:4000/api`
   - `VITE_GOOGLE_MAPS_API_KEY=<your_key>`
4. Run:
   - `npm install`
   - `npm run dev`

Frontend URL: `http://localhost:5173`

## Main API endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/services`
- `GET /api/services/:id`
- `GET /api/services/:id/availability?date=YYYY-MM-DD`
- `POST /api/appointments`
- `GET /api/appointments/me`
- `PATCH /api/appointments/:id/cancel`
- `POST /api/agent-requests`
