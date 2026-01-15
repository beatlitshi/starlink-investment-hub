# 🚀 IMPORTANT: Database Setup Required

## ⚠️ ACTION NEEDED BEFORE USING NEW FEATURES

The latest update includes:
- ✅ Withdrawal System
- ✅ Crypto Deposit System  
- ✅ Stock Price Control
- ✅ **SELL Stocks Feature**

### 📋 Run This SQL in Supabase NOW:

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Copy and paste the contents of `DATABASE_SETUP.sql`
3. Click **"Run"**

This will create the missing tables:
- `withdrawals` - For user withdrawal requests
- `stock_controls` - For admin stock price control
- Plus missing columns in `users` table

### 🎯 What's Fixed:

1. **Error: "Could not find table 'public.withdrawals'"** → FIXED
2. **Stock prices changing every second** → NOW updates every 60 seconds
3. **No SELL option** → SELL tab added with full functionality

### 🔧 New Features:

#### **SELL Stocks** (User Panel)
- Click "Sell Stocks" tab
- Select stock from your holdings
- Enter shares to sell (or click "Sell All")
- Get money back to your balance instantly

#### **Slower Price Updates**
- Prices now update every **60 seconds** instead of every second
- No more shaking portfolio values!

---

## 🎮 How to Use SELL Feature:

1. User buys stocks (Buy Stocks tab)
2. Goes to **Sell Stocks** tab
3. Sees all their holdings with profit/loss
4. Clicks on a stock to select it
5. Enters how many shares to sell
6. Clicks "Sell" → Money added to balance

**Example:**
- You own 10 shares of STLK at €245 each
- Click STLK in holdings → Enter 5 shares → Sell
- You get €1,225 (5 × €245) back
- Now you own 5 shares

---

Run the SQL setup and you're ready to go! 🚀
