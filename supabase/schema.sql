-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (Extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  phone text,
  email text,
  address jsonb, -- { street, landmark, area, pincode, city, state }
  aadhar_number text,
  profile_picture_url text,
  kyc_documents jsonb, -- { aadhar_url, proof_url }
  connection_date timestamp with time zone,
  current_plan_id text, -- references plans(id) if we make plans a table
  status text check (status in ('pending', 'active', 'suspended', 'terminated')) default 'pending',
  role text check (role in ('customer', 'admin', 'technician')) default 'customer', -- Added Role
  last_payment_date timestamp with time zone,
  next_billing_date timestamp with time zone,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc', now()),
  updated_at timestamp with time zone default timezone('utc', now())
);

-- PLANS (If dynamic, otherwise hardcoded in app)
create table public.plans (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  speed_mbps integer not null,
  price_monthly integer,
  price_quarterly integer,
  price_yearly integer,
  features text[],
  is_active boolean default true
);

-- SUBSCRIPTIONS
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  customer_id uuid references public.profiles(id),
  plan_id uuid references public.plans(id),
  billing_cycle text check (billing_cycle in ('monthly', 'quarterly', 'yearly')),
  start_date timestamp with time zone default timezone('utc', now()),
  end_date timestamp with time zone,
  status text check (status in ('active', 'expired', 'cancelled')) default 'active',
  created_at timestamp with time zone default timezone('utc', now())
);

-- SUPPORT TICKETS
create table public.support_tickets (
  id uuid default uuid_generate_v4() primary key,
  customer_id uuid references public.profiles(id),
  subject text not null,
  description text,
  status text check (status in ('open', 'in_progress', 'resolved', 'closed')) default 'open',
  priority text check (priority in ('low', 'medium', 'high', 'critical')) default 'medium',
  created_at timestamp with time zone default timezone('utc', now()),
  resolved_at timestamp with time zone
);

-- RLS POLICIES
alter table public.profiles enable row level security;
alter table public.plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.support_tickets enable row level security;

-- Profiles: Users can view/edit their own profile
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Profiles: Admins can view all profiles
create policy "Admins can view all profiles" on public.profiles
  for select using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

-- Plans: Public read
create policy "Plans are viewable by everyone" on public.plans
  for select using (true);

-- Tickets: Users can view/create their own tickets
create policy "Users can view own tickets" on public.support_tickets
  for select using (auth.uid() = customer_id);

create policy "Users can create tickets" on public.support_tickets
  for insert with check (auth.uid() = customer_id);

-- Tickets: Admins can view all tickets
create policy "Admins can view all tickets" on public.support_tickets
  for select using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );
  
-- Tickets: Admins can update tickets (e.g. status)
create policy "Admins can update tickets" on public.support_tickets
  for update using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

-- Functions
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, phone)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email, new.phone);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup

-- PAYMENTS

-- PAYMENTS (Production Safe)
create table public.payments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  subscription_id uuid references public.subscriptions(id),
  amount numeric not null check (amount > 0),
  currency text default 'INR' not null,
  status text not null check (status in ('created', 'captured', 'failed', 'refunded')),
  provider_order_id text unique, -- Nullable initially
  provider_payment_id text unique, -- Razorpay Payment ID
  method text check (method in ('card', 'upi', 'netbanking', 'wallet')),
  created_at timestamp with time zone default timezone('utc', now()) not null,
  
  -- Constraints
  constraint check_status_valid check (status in ('created', 'captured', 'failed', 'refunded')),
  constraint check_payment_id_logic check (
    (status = 'captured' and provider_payment_id is not null) or 
    (status != 'captured') -- If not captured, payment_id can be null (or present if failed attempt)
  )
);

-- Trigger to prevent modification of Captured payments
create or replace function public.handle_payment_immutability()
returns trigger as $$
begin
  if (OLD.status = 'captured') then
    raise exception 'Cannot update a captured payment record.';
  end if;
  return new;
end;
$$ language plpgsql;

create trigger protect_captured_payments
  before update on public.payments
  for each row execute procedure public.handle_payment_immutability();

-- INVOICES
create table public.invoices (
  id uuid default uuid_generate_v4() primary key,
  payment_id uuid references public.payments(id) not null unique,
  user_id uuid references auth.users(id) not null,
  invoice_number text unique not null, -- INV-YYYY-001
  pdf_url text, -- Supabase Storage URL
  generated_at timestamp with time zone default timezone('utc', now()) not null
);

-- INDEXES for Performance
create index idx_payments_user_id on public.payments(user_id);
create index idx_payments_order_id on public.payments(provider_order_id);
create index idx_payments_status on public.payments(status);
create index idx_invoices_user_id on public.invoices(user_id);

-- RLS POLICIES
alter table public.payments enable row level security;
alter table public.invoices enable row level security;

-- Users can VIEW their own payments
create policy "Users can view own payments" on public.payments
  for select using (auth.uid() = user_id);

-- Admins can view all payments
create policy "Admins can view all payments" on public.payments
  for select using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

create policy "Users can view own invoices" on public.invoices
  for select using (auth.uid() = user_id);

-- TICKET MESSAGES (Chat)
create table public.ticket_messages (
  id uuid default uuid_generate_v4() primary key,
  ticket_id uuid references public.support_tickets(id) on delete cascade not null,
  sender_id uuid references auth.users(id) not null,
  sender_role text check (sender_role in ('user', 'admin')) not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc', now()) not null,
  is_internal boolean default false
);

create index idx_ticket_messages_ticket_id on public.ticket_messages(ticket_id);

-- RLS
alter table public.ticket_messages enable row level security;

-- Users can view messages for their own tickets
create policy "Users can view messages for own tickets" on public.ticket_messages
  for select using (
    exists (
      select 1 from public.support_tickets
      where id = ticket_messages.ticket_id
      and customer_id = auth.uid()
    )
  );

-- Admins can view all messages
create policy "Admins can view all messages" on public.ticket_messages
  for select using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

-- Users can send messages to their own tickets
create policy "Users can send messages to own tickets" on public.ticket_messages
  for insert with check (
    exists (
      select 1 from public.support_tickets
      where id = ticket_messages.ticket_id
      and customer_id = auth.uid()
    )
  );

-- Admins can send messages
create policy "Admins can send messages" on public.ticket_messages
  for insert with check (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

-- INSTALLATIONS (Scheduling)
create table public.installations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  subscription_id uuid references public.subscriptions(id),
  scheduled_at timestamp with time zone not null,
  slot_time text not null, -- e.g., "10:00 AM - 12:00 PM"
  status text check (status in ('pending', 'confirmed', 'completed', 'cancelled')) default 'pending',
  technician_id uuid references auth.users(id), -- Nullable until assigned
  notes text,
  created_at timestamp with time zone default timezone('utc', now())
);

-- RLS
alter table public.installations enable row level security;

-- Users can view their own installations
create policy "Users can view own installations" on public.installations
  for select using (auth.uid() = user_id);

-- Users can create their own installations (Scheduling)
create policy "Users can create own installations" on public.installations
  for insert with check (auth.uid() = user_id);

-- Admins can view all installations
create policy "Admins can view all installations" on public.installations
  for select using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

-- Admins can update installations (Assign Tech, Change Status)
create policy "Admins can update installations" on public.installations
  for update using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );
