-- Fix profiles foreign-key and auto-create missing profiles

-- Make profile email optional so user rows can be created automatically
ALTER TABLE profiles ALTER COLUMN email DROP NOT NULL;

-- Fix the expense user_id foreign key to reference profiles.user_id
ALTER TABLE expenses DROP CONSTRAINT IF EXISTS expenses_user_id_fk;
ALTER TABLE expenses ADD CONSTRAINT expenses_user_id_fk
  FOREIGN KEY (user_id) REFERENCES profiles (user_id) ON DELETE CASCADE;

-- Ensure index exists on expenses.user_id
CREATE INDEX IF NOT EXISTS expenses_user_id_idx ON expenses (user_id);

-- RLS policy adjustments for expenses
DROP POLICY IF EXISTS "Users can view their own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can create their own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can update their own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can delete their own expenses" ON expenses;

CREATE POLICY "Users can view their own expenses" ON expenses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own expenses" ON expenses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own expenses" ON expenses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own expenses" ON expenses
  FOR DELETE USING (auth.uid() = user_id);

-- Create trigger function if missing
CREATE OR REPLACE FUNCTION public.create_profile_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (user_id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users insertion
DROP TRIGGER IF EXISTS create_profile_after_user_insert ON auth.users;
CREATE TRIGGER create_profile_after_user_insert
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.create_profile_for_new_user();
