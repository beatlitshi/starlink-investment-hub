-- ==========================================
-- STARLINK INVESTMENT HUB - DATABASE SETUP
-- ==========================================
-- Run this in Supabase SQL Editor

-- 1. Add missing columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS crypto_wallet TEXT,
ADD COLUMN IF NOT EXISTS crypto_type TEXT DEFAULT 'BTC';

-- 2. Create withdrawals table
CREATE TABLE IF NOT EXISTS withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(15, 2) NOT NULL,
  iban TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- 3. Create stock_controls table (for admin price control)
CREATE TABLE IF NOT EXISTS stock_controls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT UNIQUE NOT NULL,
  target_change_percent DECIMAL(10, 2) NOT NULL,
  duration_minutes INTEGER NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_withdrawals_user_id ON withdrawals(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON withdrawals(status);
CREATE INDEX IF NOT EXISTS idx_stock_controls_symbol ON stock_controls(symbol);
CREATE INDEX IF NOT EXISTS idx_stock_controls_is_active ON stock_controls(is_active);

-- 5. Enable Row Level Security (optional but recommended)
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_controls ENABLE ROW LEVEL SECURITY;

-- 6. Create policies (adjust as needed)
CREATE POLICY "Users can view their own withdrawals" 
ON withdrawals FOR SELECT 
USING (auth.uid() IN (SELECT auth_id FROM users WHERE id = user_id));

CREATE POLICY "Users can create withdrawal requests" 
ON withdrawals FOR INSERT 
WITH CHECK (auth.uid() IN (SELECT auth_id FROM users WHERE id = user_id));

-- Admin can do everything on stock_controls (adjust based on your admin auth setup)
CREATE POLICY "Allow all for authenticated users on stock_controls" 
ON stock_controls FOR ALL 
USING (true);

-- Done! Your database is now ready.
