-- ═══════════════════════════════════════════════════
-- ProposeAI — Supabase Database Setup
-- Run this entire script in: Supabase > SQL Editor > Run
-- ═══════════════════════════════════════════════════

-- 1. PROPOSALS TABLE
create table if not exists proposals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  intake jsonb not null,
  proposal jsonb not null,
  sent boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. PROFILES TABLE (stores plan info from Stripe)
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  plan text default 'free',
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. ROW LEVEL SECURITY — users only see their own data
alter table proposals enable row level security;
alter table profiles enable row level security;

create policy "Users can manage own proposals"
  on proposals for all
  using (auth.uid() = user_id);

create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

-- 4. AUTO-CREATE PROFILE on new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, plan)
  values (new.id, 'free')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. AUTO-UPDATE updated_at timestamps
create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger proposals_updated_at before update on proposals
  for each row execute procedure update_updated_at();

create trigger profiles_updated_at before update on profiles
  for each row execute procedure update_updated_at();
