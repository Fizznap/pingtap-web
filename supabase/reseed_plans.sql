
INSERT INTO plans (name, price_monthly, speed_mbps, data_limit, features, is_active)
VALUES
    ('Basic Plan', 499, 50, 'Unlimited', ARRAY['50 Mbps Speed', 'Unlimited Data', '24/7 Support'], true),
    ('Pro Plan', 799, 100, 'Unlimited', ARRAY['100 Mbps Speed', 'Prioritized Support', 'Free Installation'], true),
    ('Ultra Plan', 999, 200, 'Unlimited', ARRAY['200 Mbps Speed', 'Gaming Optimization', 'Static IP Included'], true)
ON CONFLICT (name) DO UPDATE 
SET 
    price_monthly = EXCLUDED.price_monthly,
    speed_mbps = EXCLUDED.speed_mbps,
    features = EXCLUDED.features,
    is_active = true;
