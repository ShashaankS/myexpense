-- Create profiles table linked to auth.users
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users (id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only read/update their own profile
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Add user_id to expenses table
ALTER TABLE expenses ADD COLUMN user_id UUID NOT NULL;

-- Add foreign key to profiles
ALTER TABLE expenses ADD CONSTRAINT expenses_user_id_fk
  FOREIGN KEY (user_id) REFERENCES profiles (id) ON DELETE CASCADE;

-- Create index on user_id for faster queries
CREATE INDEX expenses_user_id_idx ON expenses (user_id);

-- Update RLS on expenses to allow only user's own expenses
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Drop existing policy (the allow-all policy from initial migration)
DROP POLICY IF EXISTS "Allow all operations" ON expenses;

-- RLS Policies: Users can only read/write their own expenses
CREATE POLICY "Users can view their own expenses" ON expenses
  FOR SELECT USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = expenses.user_id));

CREATE POLICY "Users can create their own expenses" ON expenses
  FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM profiles WHERE id = expenses.user_id));

CREATE POLICY "Users can update their own expenses" ON expenses
  FOR UPDATE USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = expenses.user_id));

CREATE POLICY "Users can delete their own expenses" ON expenses
  FOR DELETE USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = expenses.user_id));
