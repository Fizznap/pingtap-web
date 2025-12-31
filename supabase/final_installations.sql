-- Enable UUID extension if not enabled
create extension if not exists "uuid-ossp";

-- Drop existing objects to allow clean recreation (Dev/Staging only)
-- In production, use ALTER TABLE instead.
drop index if exists idx_one_active_install_per_sub;
drop table if exists public.installations cascade;

-- 1. Create Table
create table public.installations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  subscription_id uuid references public.subscriptions(id) not null,
  scheduled_date date not null,
  slot_start time without time zone not null,
  slot_end time without time zone not null,
  status text not null check (status in ('pending', 'confirmed', 'completed', 'cancelled')) default 'pending',
  technician_id uuid references auth.users(id),
  notes text,
  created_at timestamp with time zone default timezone('utc', now()) not null,

  -- 2. Constraints
  constraint check_slot_order check (slot_end > slot_start)
);

-- 3. Unique Index for Business Logic
-- "One subscription can have only one ACTIVE installation at a time"
create unique index idx_one_active_install_per_sub 
on public.installations (subscription_id) 
where status in ('pending', 'confirmed');

-- 4. RLS Policies
alter table public.installations enable row level security;

-- Customer: View Own
create policy "Users can view own installations" on public.installations
  for select using (auth.uid() = user_id);

-- Customer: Create Own
create policy "Users can create own installations" on public.installations
  for insert with check (auth.uid() = user_id);

-- Admin: View All
create policy "Admins can view all installations" on public.installations
  for select using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

-- Admin: Update All
create policy "Admins can update installations" on public.installations
  for update using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

-- Technician: View Assigned
create policy "Technicians can view assigned installations" on public.installations
  for select using (
    auth.uid() = technician_id
  );

-- Technician: Update Assigned
create policy "Technicians can update assigned installations" on public.installations
  for update using (
    auth.uid() = technician_id
  );
