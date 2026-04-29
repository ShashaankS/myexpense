# MyExpense

An expense tracker with a FastAPI backend and a Vite + React frontend. The app uses Supabase for authentication and persistence, provides a clean dashboard experience, and keeps the data flow straightforward.

## Features

- Email/password and Google OAuth sign-in via Supabase Auth.
- Create, list, filter, and sort expenses with idempotent writes.
- Minimal, responsive dashboard UI with a summary panel and quick entry.
- Server-side JWT parsing to derive the authenticated user.

## Architecture

- **Frontend:** React + TypeScript + Vite with minimal routing and local state in context/hooks.
- **Backend:** FastAPI routes call Supabase REST endpoints. The backend extracts the user id from the JWT and scopes queries by `user_id`.
- **Database:** Supabase Postgres with an `expenses` table and a `profiles` table. Migrations live in [supabase/migrations](supabase/migrations).

## Tech Stack

- FastAPI, Uvicorn, PyJWT, Supabase Python client.
- React, React Router, React Query, Tailwind CSS, Vite.

## Prerequisites

- Python 3.10+ recommended.
- Node 18+ recommended.
- A Supabase project (URL + keys) and the Supabase CLI if you want to run migrations.

## Environment Variables

### Backend (.env in backend)

```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_role_or_anon_key
SUPABASE_DB_URL=your_supabase_db_url
DEBUG=true
HOST=0.0.0.0
PORT=8000
```

Notes:
- `SUPABASE_URL` and `SUPABASE_KEY` are required.
- `SUPABASE_DB_URL` is optional and used only if you wire up CLI tooling.

### Frontend (.env in frontend)

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:8000
```

Notes:
- `VITE_API_BASE_URL` can be a full URL or host; it will be normalized to https if no scheme is provided.
- For Google OAuth, add your redirect URLs in Supabase Auth settings: `http://localhost:5173/signin` and `http://localhost:5173/signup`.

## Database Setup

1) Create a Supabase project.
2) Apply the SQL migrations in [supabase/migrations](supabase/migrations).
3) Verify the `expenses` and `profiles` tables exist and RLS policies match your needs.

If you are using the Supabase CLI:

```
supabase db push
```

## Running Locally

### Backend

```
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.

### Frontend

```
cd frontend
npm install
npm run dev
```

The UI will be available at `http://localhost:5173` by default.

## API Reference

Base URL: `http://localhost:8000`

Authentication:
- Send `Authorization: Bearer <supabase_access_token>` on each request.

Endpoints:
- `GET /` - Basic API info.
- `GET /health` - Health check.
- `GET /expenses` - List expenses.
	- Query params: `category`, `sort`, `limit`, `offset`.
	- Sort options: `date_desc`, `date_asc`, `amount_desc`, `amount_asc`.
- `POST /expenses` - Create expense.
	- Body: `amount`, `category`, `description`, `date`, optional `idempotency_key`.
- `GET /expenses/{expense_id}` - Get a single expense.
- `DELETE /expenses/{expense_id}` - Delete an expense.

## Frontend Flow

- Sign-in and sign-up call Supabase Auth directly to obtain an access token.
- The access token is stored in local storage and attached to API calls.
- The dashboard reads expenses through the backend and uses React Query for caching.

## Notes

- **Key design decisions:** Built a simple full-stack expense tracker with a FastAPI backend and Vite/React frontend. The backend uses Supabase REST for persistence and JWT-based auth checks, while the frontend keeps routing minimal and state local to provide a clean, lightweight user experience.
- **Timebox trade-offs:** I prioritized getting the core flow working first, so I focused on expense listing, creation, sorting, and authentication integration rather than polishing UI details or adding extensive error/retry handling.
- **Intentionally skipped:** I did not add pagination, advanced filtering, or extensive form validation; I also avoided a more complex client-side state management solution in favor of simpler local context and hooks.