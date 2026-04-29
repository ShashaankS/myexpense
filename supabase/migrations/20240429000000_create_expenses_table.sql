-- Create expenses table with proper schema
-- Migration: Create expenses table
-- Date: 2024-04-29

CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    amount DECIMAL(15, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description VARCHAR(500) NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    idempotency_key VARCHAR(255) UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_created_at ON expenses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_idempotency_key ON expenses(idempotency_key);

-- Enable Row Level Security
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (update for your auth needs)
CREATE POLICY "Allow all operations on expenses" ON expenses
    FOR ALL USING (true) WITH CHECK (true);
