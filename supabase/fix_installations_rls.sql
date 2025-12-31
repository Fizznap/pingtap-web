
-- Enable RLS
ALTER TABLE public.installations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own installations" ON public.installations;
DROP POLICY IF EXISTS "Users can create own installations" ON public.installations;
DROP POLICY IF EXISTS "Admins can view all installations" ON public.installations;
DROP POLICY IF EXISTS "Admins can update installations" ON public.installations;

-- Re-create Policies

-- Users can view their own installations
CREATE POLICY "Users can view own installations" ON public.installations
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own installations
CREATE POLICY "Users can create own installations" ON public.installations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can view all installations
CREATE POLICY "Admins can view all installations" ON public.installations
  FOR SELECT USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

-- Admins can update installations
CREATE POLICY "Admins can update installations" ON public.installations
  FOR UPDATE USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );
