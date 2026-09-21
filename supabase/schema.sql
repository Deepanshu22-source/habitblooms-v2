-- HabitBlooms Database Schema
-- Run this in your Supabase SQL editor after creating a new project

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Habits table
create table if not exists habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  description text,
  icon text not null default '🌸',
  color text not null default '#8b5cf6',
  category text not null default 'general',
  frequency text not null default 'daily',
  target_days int[] not null default '{1,2,3,4,5,6,7}',
  reminder_time time,
  created_at timestamptz not null default now(),
  is_archived boolean not null default false
);

-- Habit completions table
create table if not exists habit_completions (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid references habits(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  completed_at date not null default current_date,
  note text,
  created_at timestamptz not null default now(),
  unique(habit_id, completed_at)
);

-- Indexes
create index if not exists habits_user_id_idx on habits(user_id);
create index if not exists habit_completions_habit_id_idx on habit_completions(habit_id);
create index if not exists habit_completions_user_id_idx on habit_completions(user_id);
create index if not exists habit_completions_completed_at_idx on habit_completions(completed_at);

-- Row Level Security
alter table habits enable row level security;
alter table habit_completions enable row level security;

-- RLS Policies for habits
create policy "Users can view own habits"
  on habits for select
  using (auth.uid() = user_id);

create policy "Users can insert own habits"
  on habits for insert
  with check (auth.uid() = user_id);

create policy "Users can update own habits"
  on habits for update
  using (auth.uid() = user_id);

create policy "Users can delete own habits"
  on habits for delete
  using (auth.uid() = user_id);

-- RLS Policies for habit_completions
create policy "Users can view own completions"
  on habit_completions for select
  using (auth.uid() = user_id);

create policy "Users can insert own completions"
  on habit_completions for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own completions"
  on habit_completions for delete
  using (auth.uid() = user_id);
