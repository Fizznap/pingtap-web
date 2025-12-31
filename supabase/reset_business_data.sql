
-- 1. Truncate Business Tables (Cascade to handle FKs)
TRUNCATE TABLE 
  public.invoices, 
  public.payments, 
  public.installations, 
  public.ticket_messages, 
  public.support_tickets, 
  public.subscriptions 
RESTART IDENTITY CASCADE;

-- 2. Normalize Profiles (Reset everyone to 'customer' equivalent role if 'user' isn't the enum)
-- Schema uses: role text check (role in ('customer', 'admin', 'technician')) default 'customer'
UPDATE public.profiles 
SET role = 'customer' 
WHERE role NOT IN ('customer');

-- 3. Verify Plans (Count them)
SELECT count(*) as active_plans_count FROM public.plans WHERE is_active = true;
