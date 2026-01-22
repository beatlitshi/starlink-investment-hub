# ========================================
# SUPABASE TABLE SETUP GUIDE
# ========================================
# Run this SQL in your Supabase Dashboard → SQL Editor
# ========================================

## Step-by-Step Instructions:

1. Go to: https://supabase.com/dashboard/project/vkmbltekdbpnapwhtlzy/sql
2. Click "New Query"
3. Copy and paste the ENTIRE SQL below
4. Click "Run" (or press F5)
5. Verify: Go to Table Editor → Check if "fixed_deposits" table exists

---

-- Create fixed_deposits table
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_fixed_deposits_user_id ON fixed_deposits(user_id);
CREATE INDEX IF NOT EXISTS idx_fixed_deposits_user_auth_id ON fixed_deposits(user_auth_id);
CREATE INDEX IF NOT EXISTS idx_fixed_deposits_status ON fixed_deposits(status);
CREATE INDEX IF NOT EXISTS idx_fixed_deposits_maturity_date ON fixed_deposits(maturity_date);

-- Enable RLS
ALTER TABLE fixed_deposits ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own deposits"
  ON fixed_deposits FOR SELECT
  USING (auth.uid() = user_auth_id);

CREATE POLICY "Users can create own deposits"
  ON fixed_deposits FOR INSERT
  WITH CHECK (auth.uid() = user_auth_id);

CREATE POLICY "Users can update own deposits"
  ON fixed_deposits FOR UPDATE
  USING (auth.uid() = user_auth_id);

-- Auto-update timestamp
CREATE OR REPLACE FUNCTION update_fixed_deposits_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_fixed_deposits_timestamp ON fixed_deposits;
CREATE TRIGGER update_fixed_deposits_timestamp
  BEFORE UPDATE ON fixed_deposits
  FOR EACH ROW
  EXECUTE FUNCTION update_fixed_deposits_updated_at();

-- Permissions
GRANT SELECT, INSERT, UPDATE ON fixed_deposits TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON fixed_deposits TO service_role;

COMMENT ON TABLE fixed_deposits IS 'Stores user fixed-term deposits with guaranteed APY returns';

---

## After Running SQL:

✅ Verify table exists: Supabase Dashboard → Table Editor → fixed_deposits
✅ Check columns: id, user_id, user_auth_id, amount, apy, duration, start_date, maturity_date, etc.
✅ RLS enabled: Should show "RLS enabled" badge in table view

---

## Troubleshooting:

- **Error: relation "users" does not exist**
  → Run users table creation first (check other migrations)

- **Error: permission denied**
  → Make sure you're logged in as project owner

- **Table already exists**
  → Safe to ignore if using "IF NOT EXISTS"
