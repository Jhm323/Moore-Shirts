---
description: "Phase 1 of backend migration: Supabase schema, RLS policies, client setup (no app code wired yet)"
---

This is phase 1 of a multi-phase migration from `window.storage`/localStorage
to a real Supabase backend. This phase ONLY adds database schema, RLS
policies, and the Supabase client library — it does NOT touch `useAuth.js`,
`useLiked.js`, or `OrderForm.jsx` yet. The app should build and run exactly
as before when this phase is done; nothing user-facing changes yet.

## Step 1 — Install the client library

```bash
npm install @supabase/supabase-js
```

## Step 2 — Env vars

Add to `.env.example` (create if it doesn't exist):
```
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```
Confirm `.env` (not `.env.example`) is in `.gitignore`. The anon key is safe
to expose client-side by design — it's the RLS policies, not key secrecy,
that protect the data. Never put the `service_role` key in any `VITE_`-
prefixed variable or anywhere in client code; it bypasses RLS entirely.

## Step 3 — Supabase client util

Create `src/lib/supabase.js`:
```js
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

## Step 4 — SQL migration

Create `supabase/migrations/0001_init.sql` with the following. Do not
guess at syntax beyond what's here — if something needs adjusting, flag it
in the report rather than improvising:

```sql
-- profiles: mirrors auth.users, minimal for now
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: user can read own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: user can update own"
  on public.profiles for update
  using (auth.uid() = id);

-- auto-create a profile row whenever a new auth user signs up
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- liked_products
create table public.liked_products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id text not null,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

alter table public.liked_products enable row level security;

create policy "liked_products: user can read own"
  on public.liked_products for select
  using (auth.uid() = user_id);

create policy "liked_products: user can insert own"
  on public.liked_products for insert
  with check (auth.uid() = user_id);

create policy "liked_products: user can delete own"
  on public.liked_products for delete
  using (auth.uid() = user_id);

-- orders
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  design_id text not null,
  design_name text not null,
  size text not null,
  price numeric not null,
  shipping jsonb not null,
  status text not null default 'submitted',
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

-- anyone (guest or signed-in) can place an order, but if user_id is set
-- it must match the actual authenticated caller -- prevents a guest or
-- a signed-in user from inserting an order under someone else's id
create policy "orders: anyone can insert, own id only"
  on public.orders for insert
  with check (user_id is null or auth.uid() = user_id);

-- only signed-in users can read back their own order history; guests
-- have no read access, matching current app behavior
create policy "orders: user can read own"
  on public.orders for select
  using (auth.uid() = user_id);

-- no update/delete policies for regular users -- orders are immutable
-- from the client; only the service_role key (server-side only, never
-- in client code) can change order status later
```

## Step 5 — Apply the migration

Tell me which of these applies and do that one:
- If this project has the Supabase CLI linked already (`supabase/config.toml`
  exists), run `supabase db push`.
- Otherwise, print the full SQL from step 4 clearly in your final report so
  the user can paste it into the Supabase Dashboard → SQL Editor themselves
  — do not attempt to apply it via a method that would require credentials
  you don't have.

## Step 6 — Verify (schema only, no app changes yet)

1. `npm run build` — should succeed unchanged, since no existing file was
   modified, only new files added.
2. Report: exact list of files created, whether the migration was applied
   automatically or needs manual paste, and a reminder that phases 2-4
   (auth, likes, orders+email) are separate follow-up commands.
