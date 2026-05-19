create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  place_id integer not null,
  user_id uuid references auth.users(id) on delete set null,
  author text not null,
  avatar text,
  rating integer not null check (rating between 1 and 5),
  date text not null,
  text text not null,
  likes integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  place_id integer not null,
  created_at timestamptz not null default now(),
  unique (user_id, place_id)
);

alter table public.profiles enable row level security;
alter table public.comments enable row level security;
alter table public.favorites enable row level security;

create policy "Users can read profiles" on public.profiles
  for select using (true);

create policy "Users can create their own profile" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Anyone can read comments" on public.comments
  for select using (true);

create policy "Signed in users can create comments" on public.comments
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own comments" on public.comments
  for update using (auth.uid() = user_id);

create policy "Users can delete their own comments" on public.comments
  for delete using (auth.uid() = user_id);

create policy "Users can read their own favorites" on public.favorites
  for select using (auth.uid() = user_id);

create policy "Users can create their own favorites" on public.favorites
  for insert with check (auth.uid() = user_id);

create policy "Users can delete their own favorites" on public.favorites
  for delete using (auth.uid() = user_id);
