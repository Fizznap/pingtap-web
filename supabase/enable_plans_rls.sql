
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Plans are viewable by everyone" ON plans;

CREATE POLICY "Plans are viewable by everyone"
ON plans FOR SELECT
USING (true);
