# GitHub Developer Intelligence Platform

SaaS-style GitHub analytics dashboard for searching, comparing, and inspecting public developer profiles.

## 1. Project Overview

This project is a full-stack dashboard built on top of the GitHub public API. It takes a GitHub username, fetches profile and repository data, and turns that data into a cleaner analytics view with charts, summaries, and a compare mode for two developers side by side.

The main goal was not to build a generic GitHub viewer. The focus was on a recruiter-friendly analytics layer: quick profile scanning, repository patterns, language distribution, activity signals, and a comparison view that makes two developers easy to contrast.

## 2. Features

- GitHub username search
- Profile analytics and repository summaries
- Language analysis with top language breakdowns
- Dashboard charts for stars, forks, activity, and trends
- Developer statistics cards
- AI-style rule-based insights for frontend/backend/fullstack tendencies
- Compare developers mode with side-by-side analytics
- Recently updated repositories
- Loading states and skeleton loaders
- Invalid username handling
- Timeout handling
- GitHub API rate-limit handling
- Empty dataset handling for charts and lists
- Responsive mobile-friendly layout

## 3. Screenshots

Add screenshots here before submission.

- `screenshots/dashboard.png`
- `screenshots/compare.png`
- `screenshots/mobile.png`

## 4. Tech Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS, Recharts
- Backend: Node.js, Express, TypeScript
- Architecture: npm workspaces monorepo with separate frontend/backend apps
- Data flow: typed JSON REST API between frontend and backend

## 5. Architecture Overview

The repository is split into two workspaces:

- `frontend/` handles UI, charts, state, and client-side analytics helpers.
- `backend/` fetches GitHub data, normalizes it into typed dashboard objects, and returns structured API responses.

The important thing here is that the data shaping happens in one place. The backend is responsible for the raw GitHub requests, timeouts, rate-limit checks, and mapping. The frontend then consumes typed dashboard objects and renders them through reusable chart and card components.

Compare mode follows the same pattern. The backend returns two dashboard payloads in one response, and the frontend decides how to show the two sides and the comparison metrics.

## 6. Folder Structure

```text
.
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── analytics/
│   │   │   ├── compare/
│   │   │   ├── dashboard/
│   │   │   └── search/
│   │   ├── lib/
│   │   ├── services/
│   │   └── types/
│   ├── .env
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   └── types/
│   ├── .env.example
│   └── package.json
└── package.json
```

## 7. Setup Instructions

Prerequisites:

- Node.js 18+ or newer
- npm
- Git

From a fresh clone, install dependencies from the repository root:

```bash
npm install
```

That installs both workspaces because the root `package.json` uses npm workspaces.

Create the environment files if they are not already present:

```bash
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env
```

On PowerShell, the same commands work with `Copy-Item`:

```powershell
Copy-Item backend\.env.example backend\.env
Copy-Item frontend\.env.example frontend\.env
```

## 8. Environment Variables

Backend (`backend/.env`):

- `PORT` - backend port, usually `3001`
- `CORS_ORIGIN` - allowed frontend origin
- `GITHUB_TOKEN` - optional GitHub token for higher rate limits
- `GITHUB_API_TIMEOUT_MS` - timeout for GitHub requests

Frontend (`frontend/.env`):

- `VITE_API_BASE_URL` - backend URL, for example `http://localhost:3001`

Example frontend env:

```bash
VITE_API_BASE_URL=http://localhost:3001
```

## 9. API Endpoints

Backend routes are mounted under `/api`.

- `GET /health` - backend health check
- `GET /api/health` - API health check
- `GET /api/github/:username` - single developer dashboard payload
- `GET /api/github/compare/:username1/:username2` - compare payload for two developers

Example requests:

```bash
curl http://localhost:3001/api/health
curl http://localhost:3001/api/github/vercel
curl http://localhost:3001/api/github/compare/vercel/gaearon
```

The compare endpoint returns both sides in one structured payload. If one user is invalid or unavailable, the other side can still return successfully.

## 10. Running Frontend

Start the frontend dev server from the repo root:

```bash
npm run dev:frontend
```

The Vite app usually runs on `http://localhost:5173`.

If you need to run it directly from the workspace folder:

```bash
cd frontend
npm run dev
```

## 11. Running Backend

Start the backend dev server from the repo root:

```bash
npm run dev:backend
```

If you need to run it directly from the workspace folder:

```bash
cd backend
npm run dev
```

The backend typically listens on port `3001` unless `PORT` is set differently.

## 12. Error Handling Strategy

The backend uses a centralized error model instead of throwing raw strings.

- Invalid usernames are validated with Zod before hitting GitHub.
- GitHub 404s become a clean `GITHUB_USER_NOT_FOUND` response.
- GitHub rate limits are detected from upstream headers and returned as `GITHUB_RATE_LIMIT`.
- Timeout failures are turned into a `GITHUB_TIMEOUT` response.
- The frontend wraps API failures in a typed `ApiError` so the UI can show specific messages for 404, 429, and 504 cases.

This keeps the dashboard from breaking when GitHub is slow, rate-limited, or missing data.

## 13. Future Improvements

- Add Redis caching for GitHub responses
- Add authentication and saved comparisons
- Add deeper time-series trends for repo activity
- Replace rule-based insights with richer scoring or model-backed analysis
- Add automated tests for analytics transforms and route handlers
- Add visual regression tests for dashboard layouts

## 14. Deployment Notes

- Frontend: deploy as a static site on Vercel, Netlify, or similar
- Backend: deploy as a Node service on Render, Fly.io, Railway, Docker, or a similar platform
- Set `VITE_API_BASE_URL` to the deployed backend URL
- Set `GITHUB_TOKEN` in production if possible to avoid low unauthenticated rate limits

The current setup is intentionally simple to deploy. The frontend and backend are independent enough that they can be deployed separately without changing the core architecture.
