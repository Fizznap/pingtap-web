
-- 1. Update Check Constraint for Status
ALTER TABLE public.subscriptions DROP CONSTRAINT IF EXISTS subscriptions_status_check;
ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_status_check 
    CHECK (status IN ('active', 'expired', 'cancelled', 'pending'));

-- 2. Add RLS Policies
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
    FOR SELECT USING (auth.uid() = customer_id);

DROP POLICY IF EXISTS "Users can create own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can create own subscriptions" ON public.subscriptions
    FOR INSERT WITH CHECK (auth.uid() = customer_id);
