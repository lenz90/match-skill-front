# Talent Matching Frontend Prototype

Frontend-only React + Vite + TypeScript + Tailwind prototype for an internal consulting talent marketplace.

## What is implemented

- Real Supabase Google authentication (`@supabase/supabase-js`)
- Session bootstrap with `getSession` and `onAuthStateChange`
- Role persistence in Supabase `app_users` table
- Onboarding role selection when authenticated user has no `app_users` row
- Mocked manager and consultant dashboards remain frontend-only (no backend/API for matching data)

## 1) Environment variables

Create a `.env` file in project root:

```bash
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## 2) Supabase Google Provider

In Supabase dashboard:

1. Go to **Authentication → Providers → Google**
2. Enable Google provider
3. Add your Google OAuth Client ID and secret

## 3) Supabase URL Configuration

In Supabase dashboard:

1. Go to **Authentication → URL Configuration**
2. Set your site URL (local or deployed)
3. Add additional redirect URLs as needed

The app uses:

```ts
redirectTo: window.location.origin
```

This avoids hardcoding localhost or a deployed domain.

## 4) Create `app_users` table

Run this SQL in Supabase SQL editor:

```sql
create table if not exists public.app_users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique,
  email text not null,
  full_name text null,
  avatar_url text null,
  role text not null check (role in ('MANAGER', 'CONSULTANT')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Recommended RLS policies (adjust for your security model):

```sql
alter table public.app_users enable row level security;

create policy "Users can read own row"
  on public.app_users for select
  using (auth.uid() = auth_user_id);

create policy "Users can insert own row"
  on public.app_users for insert
  with check (auth.uid() = auth_user_id);
```

## 5) Run locally

```bash
npm install
npm run dev
```

## Auth flow summary

1. No session → login page with **Continue with Google**
2. Session exists but no `app_users` row → onboarding page asks role (MANAGER/CONSULTANT)
3. Role saved in `app_users` → redirect to dashboard by role
4. Sign out returns to login page
