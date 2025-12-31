
-- Insert default plans if table is empty
INSERT INTO public.plans (name, speed_mbps, price_monthly, price_quarterly, price_yearly, features, is_active)
SELECT 'Basic', 50, 499, 1497, 5988, ARRAY['50 Mbps Speed', 'Unlimited Data', 'No Contract'], true
WHERE NOT EXISTS (SELECT 1 FROM public.plans WHERE name = 'Basic');

INSERT INTO public.plans (name, speed_mbps, price_monthly, price_quarterly, price_yearly, features, is_active)
SELECT 'Pro', 100, 799, 2397, 9588, ARRAY['100 Mbps Speed', 'Unlimited Data', 'Priority Support'], true
WHERE NOT EXISTS (SELECT 1 FROM public.plans WHERE name = 'Pro');

INSERT INTO public.plans (name, speed_mbps, price_monthly, price_quarterly, price_yearly, features, is_active)
SELECT 'Ultra', 300, 1199, 3597, 14388, ARRAY['300 Mbps Speed', 'Unlimited Data', 'Static IP', 'Gaming Optimized'], true
WHERE NOT EXISTS (SELECT 1 FROM public.plans WHERE name = 'Ultra');
