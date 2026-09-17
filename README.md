# FinTrack

A personal finance tracker: fixed monthly expenses (rent, bills — including ones that recur only
until a set end month), variable credit-card spending, income, and a dashboard summarizing it all.

Built as both a day-to-day tool and a portfolio piece: .NET Web API + EF Core + PostgreSQL on the
backend, React + TypeScript on the frontend.

## Tech stack

- **Backend:** ASP.NET Core (.NET 10) Web API, EF Core, PostgreSQL (Npgsql), Swagger
- **Frontend:** React + TypeScript (Vite), Tailwind CSS, React Router, TanStack Query, Recharts
- **Infra:** Docker Compose

## Project structure

```
backend/
  src/
    FinTrack.Domain/          entities, enums
    FinTrack.Infrastructure/  EF Core DbContext, migrations, seed data
    FinTrack.Api/             controllers, DTOs, Program.cs
frontend/
  src/
    api/          typed API client + TanStack Query hooks
    components/   layout + reusable UI (Card, Modal, Button, ...)
    context/      shared month-selector state
    pages/        one page per resource (Dashboard, Fixed Expenses, ...)
```

## Data model

- **FixedExpense** / **Income** — recur monthly on the day-of-month of `startDate`. Leave
  `endDate` empty for an ongoing bill (e.g. rent), or set it to model something like "gym
  membership, monthly, until January 2027".
- **CreditCardExpense** — a single dated transaction, not recurring.
- **Category** — shared by all three, drives the dashboard's category breakdown chart.
- **CreditCard** — lets credit-card expenses be grouped/filtered per card.

No authentication yet (single-user, local use) — see "Roadmap" below.

## Running it

### Option A — Docker Compose (one command)

```bash
cp .env.example .env
docker compose up --build
```

- Frontend: http://localhost:5173
- API + Swagger: http://localhost:5007/swagger
- Postgres: localhost:5432 (credentials from `.env`)

Migrations run automatically on API startup in the `Development` environment.

### Option B — Local dev (hot reload)

Start just Postgres via Docker, run the API and frontend natively:

```bash
cp .env.example .env
docker compose up -d postgres

cd backend
dotnet run --project src/FinTrack.Api    # http://localhost:5007, swagger at /swagger

cd ../frontend
cp .env.example .env
npm install
npm run dev                               # http://localhost:5173
```

## Roadmap

- Authentication (JWT) for public deployment
- Credit-card installment splitting (e.g. "12x of R$100")
- Per-credit-card statement/closing-day totals
