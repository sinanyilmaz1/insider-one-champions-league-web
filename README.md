# Insider One Champions League — Web

Vue 3 frontend for the Insider One Champions League simulator. Generate fixtures, play weeks, edit match results, watch standings update live, and see Monte Carlo championship predictions from week 3 onwards.

Companion repos:

- [`insider-one-champions-league-api`](https://github.com/sinanyilmaz1/insider-one-champions-league-api) — Backend API (Laravel + PostgreSQL)
- [`insider-one-prediction-service`](https://github.com/sinanyilmaz1/insider-one-prediction-service) — Stateless Monte Carlo prediction microservice

## Stack

- Vue 3 + Composition API
- Vite 8
- TypeScript
- Pinia (state)
- Vue Router (navigation)
- Tailwind v4 with custom theme tokens
- Axios with typed `ApiError` interceptor
- Vitest + jsdom (unit tests)
- ESLint + oxlint + Prettier
- Husky + commitlint + lint-staged (conventional commits)

## Prerequisites

- Node.js 22+ (`.nvmrc` provided — run `nvm use`)
- Running API on `http://127.0.0.1:8000` (see [api repo README](https://github.com/sinanyilmaz1/insider-one-champions-league-api))

## Setup

```bash
nvm use
npm install
cp .env.example .env.development
npm run dev
```

Default: dev server on **http://localhost:5173**, talking to the API at `VITE_API_BASE_URL=http://127.0.0.1:8000/api`.

## Environment variables

| Variable            | Purpose                                                |
| ------------------- | ------------------------------------------------------ |
| `VITE_API_BASE_URL` | Base URL of the API (e.g. `http://127.0.0.1:8000/api`) |

> **Note on secrets:** `VITE_*` variables are bundled into the JS shipped to the browser. They are **not secrets** — anyone can read them in DevTools. Do not put auth tokens or anything you don't want public in here.

## Project structure

```
src/
├── api/              axios client, endpoints, types
│   ├── client.ts     interceptor turns errors into typed ApiError
│   ├── endpoints.ts  thin functions over each backend route
│   └── types.ts      camelCase types matching the API contract
├── assets/
├── components/       Vue components grouped by feature
│   ├── common/       Toast, ConfirmDialog, AppHeader
│   ├── fixtures/     WeekCard, FixtureGrid
│   ├── simulation/   StandingsTable, MatchesByWeek, PredictionsPanel, SimulationControls, MatchEditModal
│   └── teams/        TeamsTable
├── composables/      useFormatPercent, useNavigationGuard, useToast
├── router/           route definitions
├── stores/           Pinia stores (teams, fixtures, simulation)
└── views/            top-level page views (Teams, Fixtures, Simulation)
```

## User flow

1. **Teams view** (`/`) — see the four seeded clubs. Hit **Generate** to create the fixture list. If results already exist, you're prompted with a 409 → reset-and-regenerate dialog.
2. **Fixtures view** (`/fixtures`) — see the full season schedule grouped by week. Hit **Start Simulation** to move to the simulation view.
3. **Simulation view** (`/simulation`) — the main screen:
   - Standings table (live)
   - Played-by-week panel (collapses to the most recent week)
   - **Play Week** / **Play All** / **Reset** controls
   - Predictions panel — appears once `lastPlayedWeek >= 3`, hidden otherwise
   - Click any played match → **MatchEditModal** to edit the score; standings and predictions recompute
   - Navigation guard prompts before leaving mid-simulation

## Backend contract

This FE consumes the API contract documented in the [api repo README](https://github.com/sinanyilmaz1/insider-one-champions-league-api). Highlights:

- **camelCase** for all JSON keys (request body and response)
- Every mutation returns the **full simulation state** envelope — no follow-up GETs needed after `play-week`, `play-all`, `reset`, or match edit
- **Predictions are an array** — empty when `lastPlayedWeek < 3` or when the microservice is unreachable. The FE renders an empty state in either case; no error toast.

## API error handling

Everything goes through `client.ts`'s axios interceptor, which transforms HTTP errors into a typed `ApiError`:

```ts
interface ApiError {
  status: number | null
  message: string
  validationErrors?: Record<string, string[]>
  isConflict: boolean // 409
  isRateLimited: boolean // 429 — friendly toast: "Too many requests. Please slow down..."
}
```

- **409** flagged separately so reset-and-regenerate flows can detect it without parsing messages
- **422** validation errors land inline in the match-edit modal (not in toasts)
- **429** friendly message override
- **Network errors** → `status: null, message: 'Network error'`

## Common commands

```bash
npm run dev              # vite dev server
npm run build            # type-check + production build
npm run preview          # preview the prod build
npm run test:unit        # vitest in watch mode
npm run test:unit:ci     # vitest one-shot (used in CI)
npm run lint             # eslint + oxlint --fix
npm run lint:check       # eslint + oxlint, no fix
npm run format           # prettier --write
npm run type-check       # vue-tsc --build
```

## Tests

28 unit tests covering:

- `useFormatPercent` composable (proportions vs percents, rounding)
- Axios client interceptor (passthrough, 4xx/422/429/network/missing-message paths)
- Simulation store (computed: `canShowPredictions`, `isSeasonComplete`, `playedMatchesByWeek`, `weekPanelWeekNumber`, `weekPanelFixtures`; actions: `playWeek`, `refresh`)
- Teams store (initial state, success, failure)
- App component smoke test

```bash
npm run test:unit:ci
```

## CI

GitHub Actions runs type-check + lint + tests on every push to `development` and every PR to `master`.

## Branching and commits

- Feature work happens on `development`.
- Each completed step is merged to `master` via PR.
- Commits follow [Conventional Commits](https://www.conventionalcommits.org/) — `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`. Enforced by commitlint via Husky.
- ESLint --fix runs on staged files via lint-staged on commit.
