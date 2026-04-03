# 🔑 API Keys Setup Guide - M&M Auto Performance

**Total Time:** 30-45 minutes
**Difficulty:** Easy (just copy-paste)

---

## 📋 Overview

You need **5 required API keys** to launch. Here's exactly where to get each one.

---

## 1️⃣ SUPABASE (Database & Auth) - 10 minutes

### What You're Getting:
- PostgreSQL database (500K rows free)
- User authentication system
- Real-time data syncing
- Row-level security

### Steps:

**Step 1: Create Account**
1. Go to: https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub (recommended)
4. Authorize Supabase to access GitHub

**Step 2: Create Project**
1. Click "New Project"
2. Project name: `mandmautoperformance`
3. **IMPORTANT: Region = `eu-west-1`** (London - closest to Hertfordshire)
4. Database password: Create strong password (save it!)
5. Click "Create new project"
6. Wait 2-3 minutes for database setup

**Step 3: Get Your Keys**
1. Go to: Settings (⚙️) → API
2. Copy these TWO values:
   ```
   Project URL: https://xxxxx.supabase.co
   Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. Paste into your notes

**You now have:**
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 2️⃣ GOOGLE CLOUD (Gemini, Maps, Vision) - 20 minutes

### What You're Getting:
- Gemini 1.5 Flash (12.5M tokens/month free)
- Google Maps API
- Google Vision API (document OCR)

### Steps:

**Step 1: Create Google Cloud Project**
1. Go to: https://console.cloud.google.com
2. Click project dropdown (top left)
3. Click "NEW PROJECT"
4. Project name: `mandmautoperformance`
5. Click "CREATE"
6. Wait for project to initialize (~1 min)

**Step 2: Enable APIs**
1. In top search bar, type: `Generative AI API`
2. Click on it → "ENABLE"
3. Repeat for each API:
   - Search: `Cloud Vision API` → Enable
   - Search: `Maps API` → Enable
   - Search: `Places API` → Enable (for location features)

**Step 3: Create API Keys**
1. Go to: APIs & Services → Credentials (left sidebar)
2. Click "+ CREATE CREDENTIALS"
3. Select "API Key"
4. Copy the key that appears (pop-up modal)
5. Name this key in your notes as: `GOOGLE_UNIVERSAL_KEY`
   - This single key works for Gemini, Maps, and Vision

**You now have:**
- ✅ `NEXT_PUBLIC_GEMINI_API_KEY`
- ✅ `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- ✅ `NEXT_PUBLIC_GOOGLE_VISION_API_KEY`

(Use the same Google API key for all three)

---

## 3️⃣ OPTIONAL: STRIPE (Payments) - 5 minutes

### What You're Getting:
- Payment processing
- Credit card handling
- Subscription support
- (Optional but recommended for testing)

### Steps:

1. Go to: https://stripe.com
2. Click "Sign up"
3. Create account with email
4. Verify email
5. Go to: Dashboard → Developers → API Keys
6. Copy "Publishable Key" (starts with `pk_test_`)
7. Copy "Secret Key" (starts with `sk_test_`)

**You now have:**
- ✅ `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- ✅ `STRIPE_SECRET_KEY` (Secret - never expose!)

---

## 4️⃣ OPTIONAL: SENDGRID (Email) - 5 minutes

### What You're Getting:
- Transactional email (confirmations, receipts)
- 100 emails free/month

### Steps:

1. Go to: https://sendgrid.com
2. Sign up with email
3. Verify email
4. Go to: Settings → API Keys
5. Click "Create API Key"
6. Name: `mandmautoperformance`
7. Permissions: Full Access
8. Copy the key (appears once only!)

**You now have:**
- ✅ `SENDGRID_API_KEY`

---

## ✅ Complete Checklist

### Required (For Launch)
- [ ] Supabase URL: `https://xxxxx.supabase.co`
- [ ] Supabase Anon Key: `eyJ...`
- [ ] Google Universal Key: `AIzaSy...`
- [ ] (All 3 Google APIs use this one key)

### Optional (But Recommended)
- [ ] Stripe Publishable Key: `pk_test_...`
- [ ] Stripe Secret Key: `sk_test_...`
- [ ] SendGrid API Key: `SG...`

---

## 🔒 Security Best Practices

### NEVER:
- ❌ Share API keys in Slack/email/GitHub
- ❌ Commit keys to Git repository
- ❌ Post on public forums
- ❌ Save in unencrypted notes
- ❌ Use personal APIs for business

### DO:
- ✅ Store in password manager (1Password, LastPass)
- ✅ Rotate keys quarterly
- ✅ Use `.env.local` locally (not committed)
- ✅ Use Vercel environment variables for production
- ✅ Create separate keys for dev/prod/staging

---

## 🚀 Next Steps

Once you have all 5 keys:

1. **Go to:** `https://mandmautoperformance.com/setup`
2. **Complete the Setup Wizard** (5 minutes)
   - Step 1: Paste Supabase URL
   - Step 2: Paste Supabase Anon Key
   - Step 3: Paste Google Key
   - Step 4: Paste Google Key (same)
   - Step 5: Paste Google Key (same)
3. **Click "Activate System"**
4. **Done!** System is now live

---

## 🆘 Troubleshooting

### "Invalid Supabase URL"
- Make sure URL is: `https://xxxxx.supabase.co`
- Must contain "supabase.co"
- Check for extra spaces

### "Key seems too short"
- Supabase Anon Keys are 100+ characters
- Google keys are 39+ characters
- Double-check you copied the full key

### "Invalid Google key format"
- Google keys start with: `AIzaSy`
- Check you copied from correct field
- Try creating a new API key

### "Keys don't work after pasting"
- Clear browser cache: Ctrl+Shift+Delete
- Try in private/incognito window
- Verify no extra spaces at start/end

---

## 📝 Key Storage Template

Use this format to organize your keys safely:

```
PROJECT: M&M Auto Performance
DOMAIN: mandmautoperformance.com
LAUNCH DATE: April 7, 2026

REQUIRED KEYS:
1. Supabase URL:
   https://_____.supabase.co

2. Supabase Anon Key:
   eyJ___________________________

3. Google API Key (Universal):
   AIzaSy_____________________

OPTIONAL KEYS:
4. Stripe Publishable:
   pk_test_____________________

5. Stripe Secret:
   sk_test_____________________ (KEEP SECRET!)

6. SendGrid API Key:
   SG._______________________

CREATED: [Date]
LAST ROTATED: [Date]
NEXT ROTATION: [Date]
```

---

## ⏱️ Timeline

| Step | Time | Status |
|------|------|--------|
| Supabase setup | 10 min | ⏳ Do this first |
| Google Cloud setup | 20 min | ⏳ Then this |
| Stripe setup (optional) | 5 min | ⏳ Optional |
| SendGrid setup (optional) | 5 min | ⏳ Optional |
| **Total** | **30-45 min** | |

---

## 🎯 You're Ready!

Once you have all keys:
1. Visit `/setup` page
2. Complete 5-step wizard
3. System activates automatically
4. **Go live!** 🚀

---

**Questions? See the error message above or check SETUP_QUICKSTART.md**

Good luck! 🚗⚡
