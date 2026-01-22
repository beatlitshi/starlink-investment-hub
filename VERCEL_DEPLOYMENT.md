# ========================================
# VERCEL DEPLOYMENT GUIDE
# ========================================

## Prerequisites:
- Code is already pushed to GitHub ✅
- Vercel account created
- GitHub repo connected to Vercel

---

## Method 1: Vercel Dashboard (Recommended)

### Step 1: Set Environment Variables
1. Go to: https://vercel.com/dashboard
2. Select your project: `starlink-investment-hub`
3. Go to: **Settings** → **Environment Variables**
4. Add these variables for **Production**, **Preview**, and **Development**:

```
NEXT_PUBLIC_SUPABASE_URL = https://vkmbltekdbpnapwhtlzy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrbWJsdGVrZGJwbmFwd2h0bHp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyOTI5MTcsImV4cCI6MjA4Mzg2ODkxN30.0aIujS7wg_nzhmMPCjb2b8qOQrH4mDTGNYTrt9OwaqI
```

5. Click **Save**

### Step 2: Deploy
- **Auto Deploy:** If GitHub is connected, Vercel auto-deploys on every push to main
- **Manual Deploy:** Go to **Deployments** → Click **Redeploy** on latest commit

### Step 3: Verify
- Open production URL (e.g., `https://starlink-investment-hub.vercel.app`)
- Test: Login → Festgeld-Staking tab → Create deposit

---

## Method 2: Vercel CLI (Alternative)

### Install Vercel CLI:
```powershell
npm install -g vercel
```

### Login:
```powershell
vercel login
```

### Link Project:
```powershell
cd c:\Users\PC\Downloads\starlink_investment_hub\starlink_investment_hub
vercel link
```
- Select your existing project

### Add Environment Variables via CLI:
```powershell
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Paste: https://vkmbltekdbpnapwhtlzy.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Paste: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Deploy to Production:
```powershell
vercel --prod
```

---

## Quick Deploy Command (if already configured):
```powershell
cd c:\Users\PC\Downloads\starlink_investment_hub\starlink_investment_hub
vercel --prod
```

---

## Post-Deployment Checklist:

✅ **Environment Variables Set:** Check Vercel Dashboard → Settings → Environment Variables
✅ **Build Successful:** Check Deployments tab for green checkmark
✅ **Supabase Table Created:** Run SQL migration in Supabase (see SUPABASE_SETUP.md)
✅ **Test Login:** Try logging in with existing user
✅ **Test Festgeld-Staking:** Create a deposit, verify balance deduction
✅ **Test Refresh:** Hard refresh page 2-3 times, ensure no "Lade Dashboard..." hang
✅ **Test Buy Stock:** Purchase stock, verify portfolio updates after refresh

---

## Common Issues:

### Issue: "Missing Supabase env vars" error
**Solution:** Set environment variables in Vercel Dashboard, then redeploy

### Issue: Build fails with module not found
**Solution:** 
```powershell
cd c:\Users\PC\Downloads\starlink_investment_hub\starlink_investment_hub
npm install
git add package-lock.json
git commit -m "Update dependencies"
git push
```

### Issue: Old code showing on production
**Solution:** Force redeploy in Vercel Dashboard → Deployments → Redeploy

### Issue: Database errors (table not found)
**Solution:** Run Supabase SQL migration (see SUPABASE_SETUP.md)

---

## GitHub Auto-Deploy Setup:

1. **Vercel Dashboard** → Your Project → **Settings** → **Git**
2. Ensure **Production Branch** = `main` (or `master`)
3. Enable **Auto-Deploy on Push**
4. Every push to main will now auto-deploy

---

## Monitoring:

- **Deployment Logs:** Vercel Dashboard → Deployments → Click deployment → View Logs
- **Runtime Logs:** Vercel Dashboard → Your Project → Logs
- **Analytics:** Vercel Dashboard → Your Project → Analytics

---

## Production URL:
After deployment, your app will be available at:
`https://starlink-investment-hub.vercel.app` (or your custom domain)
