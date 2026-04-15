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

## GitHub Pages deployment

GitHub Pages only hosts the frontend. The backend must stay deployed somewhere else and the frontend must call that hosted API through `VITE_API_URL`.

### What is already configured

- The frontend now uses `HashRouter`, which avoids refresh 404 issues on GitHub Pages.
- Vite is configured with the GitHub Pages base path `/house-service-website/`.
- A workflow at `.github/workflows/deploy-pages.yml` builds `frontend` and deploys it to GitHub Pages from `main`.

### GitHub setup steps

1. Push this repository to GitHub.
2. Open the repository on GitHub.
3. Go to `Settings` -> `Pages`.
4. Under `Build and deployment`, choose `GitHub Actions` as the source.
5. Go to `Settings` -> `Secrets and variables` -> `Actions` -> `Variables`.
6. Add these repository variables:
   - `VITE_API_URL` = your deployed backend URL, for example `https://your-backend-host/api`
   - `VITE_GOOGLE_MAPS_API_KEY` = your Google Maps browser key
7. Push to `main` again or run the `Deploy frontend to GitHub Pages` workflow manually from the `Actions` tab.
8. After the workflow finishes, your site will be published at:
   - `https://makaz12.github.io/house-service-website/`

### Important note

If the backend is still only running on localhost, the deployed GitHub Pages site will load but login, booking, and any live API feature will fail until `VITE_API_URL` points to a real deployed backend.

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
