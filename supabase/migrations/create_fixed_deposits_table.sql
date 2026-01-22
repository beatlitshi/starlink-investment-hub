-- Create fixed_deposits table for managing user fixed-term deposits
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS fixed_deposits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_auth_id UUID NOT NULL,
  amount DECIMAL(12, 2) NOT NULL CHECK (amount >= 100),
  apy DECIMAL(5, 2) NOT NULL CHECK (apy > 0),
  duration INTEGER NOT NULL CHECK (duration IN (6, 12, 24, 36)),
  start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  maturity_date TIMESTAMPTZ NOT NULL,
  expected_return DECIMAL(12, 2) NOT NULL,
  current_value DECIMAL(12, 2) NOT NULL,
  actual_return DECIMAL(12, 2) DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('active', 'matured', 'withdrawn')) DEFAULT 'active',
  withdrawn_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_fixed_deposits_user_id ON fixed_deposits(user_id);
CREATE INDEX IF NOT EXISTS idx_fixed_deposits_user_auth_id ON fixed_deposits(user_auth_id);
CREATE INDEX IF NOT EXISTS idx_fixed_deposits_status ON fixed_deposits(status);
CREATE INDEX IF NOT EXISTS idx_fixed_deposits_maturity_date ON fixed_deposits(maturity_date);

-- Enable Row Level Security (RLS)
ALTER TABLE fixed_deposits ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own deposits
CREATE POLICY "Users can view own deposits"
  ON fixed_deposits
  FOR SELECT
  USING (auth.uid() = user_auth_id);

-- Policy: Users can insert their own deposits (via API with proper validation)
CREATE POLICY "Users can create own deposits"
  ON fixed_deposits
  FOR INSERT
  WITH CHECK (auth.uid() = user_auth_id);

-- Policy: Users can update their own deposits (for withdrawals)
CREATE POLICY "Users can update own deposits"
  ON fixed_deposits
  FOR UPDATE
  USING (auth.uid() = user_auth_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_fixed_deposits_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on row update
DROP TRIGGER IF EXISTS update_fixed_deposits_timestamp ON fixed_deposits;
CREATE TRIGGER update_fixed_deposits_timestamp
  BEFORE UPDATE ON fixed_deposits
  FOR EACH ROW
  EXECUTE FUNCTION update_fixed_deposits_updated_at();

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON fixed_deposits TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON fixed_deposits TO service_role;

-- Add comment for documentation
COMMENT ON TABLE fixed_deposits IS 'Stores user fixed-term deposits with guaranteed APY returns';
