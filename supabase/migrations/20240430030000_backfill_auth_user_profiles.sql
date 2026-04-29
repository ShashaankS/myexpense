-- Backfill profiles for existing auth users

INSERT INTO profiles (user_id, email, created_at, updated_at)
SELECT
  id AS user_id,
  email,
  NOW() AS created_at,
  NOW() AS updated_at
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM profiles);
