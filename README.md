# Dev Weekends 2

Monorepo starter with a Vite React TypeScript frontend and an Express TypeScript backend.

## Structure

- `frontend/` - Vite + React + Tailwind
- `backend/` - Express API
- Shared env examples in each app folder

## Next steps

1. Install dependencies in each workspace.
2. Run the frontend and backend dev scripts separately or through the root workspace scripts.
3. Add feature modules on top of the existing route and service skeletons.

## GitHub Search Feature

- Backend endpoint: `GET /api/github/:username`
- Frontend entry: `frontend/src/App.tsx`
- Shared API helper: `frontend/src/services/http.ts`
- Dashboard components: `frontend/src/components/dashboard/`

### Run locally

1. Install dependencies in the root, `frontend`, and `backend` workspaces.
2. Start the backend with `npm run dev:backend`.
3. Start the frontend with `npm run dev:frontend`.
4. Add `VITE_API_BASE_URL` to `frontend/.env` and optionally `GITHUB_TOKEN` to `backend/.env`.

# Git_Analyzer
