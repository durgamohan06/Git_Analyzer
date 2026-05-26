# Project Answers

## 1. How to run

This project uses npm workspaces, so the cleanest setup on a fresh machine is from the repository root.

```bash
git clone <repo-url>
cd <repo-folder>
npm install
```

Create the environment files if they are not already there:

```bash
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env
```

If you are on PowerShell, the same thing is:

```powershell
Copy-Item backend\.env.example backend\.env
Copy-Item frontend\.env.example frontend\.env
```

Set these values before running:

- `frontend/.env` should contain `VITE_API_BASE_URL=http://localhost:3001`
- `backend/.env` can set `PORT=3001`, `CORS_ORIGIN=http://localhost:5173`, and optionally `GITHUB_TOKEN`

Start both apps in separate terminals:

```bash
npm run dev:backend
npm run dev:frontend
```

The frontend usually opens on `http://localhost:5173`. The backend usually runs on `http://localhost:3001`.

For a production build:

```bash
npm run build
```

## 2. Stack choice

I used React, Vite, TypeScript, Tailwind CSS, Recharts, Node.js, and Express because the project is mostly a data-heavy dashboard, not a large business app with complex backend workflows. That stack is quick to iterate with, but still gives enough structure to keep the API and chart data typed.

It worked well here for a few reasons. Vite kept the frontend fast to develop and easy to restart. TypeScript mattered more than usual because the dashboard depends on a lot of shaped GitHub data, and bugs show up quickly if the types drift. Tailwind made the layout and responsive work faster, which mattered under time pressure. Recharts was a good fit because the dashboard needed standard interactive charts without spending time building every chart primitive by hand. Express stayed simple on the backend, which was useful because the server mostly fetches GitHub data, normalizes it, and returns clean JSON.

One worse alternative would have been a heavier full-stack framework like Django or a more opinionated monolith for this assessment. It would have added extra setup and language overhead without really helping the core job, which was to ship a responsive analytics dashboard quickly. Another weaker option would have been building charts manually with SVG from scratch. That would have been slower and more fragile for very little gain in this project.

## 3. One real edge case

One edge case the app handles correctly is GitHub rate limiting and upstream timeout handling in `backend/src/services/githubService.ts` around lines 20-90.

What happens there is simple: every GitHub request runs through an `AbortController`, and the code also checks `x-ratelimit-remaining` when GitHub returns a 403. If the request takes too long, the backend throws a `GITHUB_TIMEOUT` error. If GitHub says the rate limit is exhausted, it throws a `GITHUB_RATE_LIMIT` error.

Without that handling, the app would fail in a much uglier way. The frontend would just sit there waiting, or it would surface a generic upstream failure with no clue whether the issue was timeout, rate limit, or a real bad username. That matters because the UI depends on giving a specific message back to the user instead of a dead-end error state.

## 4. AI usage

AI was used, but not as the main author of the project. The work was done during a 12-hour assessment window, so ChatGPT and Cursor were used mainly for acceleration, scaffolding, debugging help, and some UI iteration. The actual architecture decisions, feature direction, testing, bug fixing, refactoring, and final cleanup were manual.

- **ChatGPT**
  - Used for: initial scaffolding prompts, GitHub API service structure, analytics helper ideas, README drafting, and some compare-feature brainstorming.
  - What it generated: starter file layouts, service/controller skeletons, chart data helper patterns, and draft documentation text.

- **Cursor**
  - Used for: in-editor iteration on TypeScript errors, component wiring, and layout adjustments while building the dashboard and compare mode.
  - What it generated: targeted refactors, component splits, and small fixes that were faster to apply inside the codebase than by hand from scratch.

- **Claude**
  - Not used on this project.

One concrete modification I made to AI output was in the compare UI. The first draft was too broad and leaned on extra abstraction that made the page harder to scan. I manually simplified it into smaller cards, tightened the responsive grid, and kept the comparison view readable on mobile. I also cleaned up a few TypeScript assumptions in the analytics layer so nullable GitHub fields did not turn into chart crashes.

## 5. Honest gap

The biggest unfinished area is that the insight layer is still rule-based. It gives useful summaries like frontend/backend tendency, open-source presence, and engagement signals, but it is still based on heuristics rather than deeper historical analysis.

It did not get completed further because the assessment window was already being spent on getting the core dashboard, compare mode, error handling, and responsive UI into a stable state. Building a stronger insight system would have taken longer than the time budget allowed.

With another day, I would improve this by adding deeper comparison scoring and historical trend storage. The practical version would be to cache or persist snapshots over time, then compare recent activity against past activity instead of only using the current repository list. That would make the insights less static and more useful for real evaluation.
