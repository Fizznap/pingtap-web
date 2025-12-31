
-- TICKET RLS FIX
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can create tickets" ON public.support_tickets;

CREATE POLICY "Users can create tickets"
ON public.support_tickets FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = customer_id);

-- PLANS RLS FIX (Re-apply to be sure)
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Plans are viewable by everyone" ON public.plans;

CREATE POLICY "Plans are viewable by everyone"
ON public.plans FOR SELECT
USING (true);
