
SELECT polname, polcmd, polroles, polqual::text, polwithcheck::text
FROM pg_policies
WHERE tablename = 'support_tickets';
