
SELECT relname, relrowsecurity
FROM pg_class c
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE c.relname = 'installations' AND n.nspname = 'public';
