-- Fix RLS policy to allow users to create their own subscriptions
-- This is necessary for the temp-setup tool to work

-- Drop existing restrictive policy if it exists
DROP POLICY IF EXISTS "Users can create own subscriptions" ON subscriptions;

-- Create a new policy that allows authenticated users to insert subscriptions for themselves
CREATE POLICY "Users can insert own subscriptions"
ON subscriptions
FOR INSERT
TO authenticated
WITH CHECK (customer_id = auth.uid());

-- Also ensure users can read their own subscriptions
DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;

CREATE POLICY "Users can view own subscriptions"
ON subscriptions
FOR SELECT
TO authenticated
USING (customer_id = auth.uid());

-- Allow admins to manage all subscriptions
DROP POLICY IF EXISTS "Admins can manage all subscriptions" ON subscriptions;

CREATE POLICY "Admins can manage all subscriptions"
ON subscriptions
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);
