
SELECT id, customer_id, status, plan_id, created_at, end_date
FROM public.subscriptions
ORDER BY created_at DESC
LIMIT 5;
