# 🚀 LIVE API SETUP - DO THIS NOW (30 minutes)

**Email for ALL accounts:** mandmautoperformance@gmail.com
**Your GitHub:** [Your GitHub account]

---

## ✅ STEP 1: SUPABASE (5 minutes)

### Go here NOW:
```
https://supabase.com
```

### What to do:
1. Click **"Start your project"**
2. Click **"Sign up"**
3. Choose **"Continue with GitHub"**
4. Authorize Supabase to GitHub (click all "Allow" buttons)
5. After sign in, click **"New Project"**

**Fill in:**
- **Project name:** `mandmautoperformance`
- **Database password:** Create strong password (write it down!)
- **Region:** `eu-west-1` (IMPORTANT - this is London)
- Click **"Create new project"**
- Wait 2-3 minutes for database setup

### Get your keys:
1. Left sidebar → **Settings** (⚙️)
2. Click **"API"**
3. Copy these two values:

**VALUE 1 - Supabase URL:**
```
https://xxxxx.supabase.co
```
**Save as:** `NEXT_PUBLIC_SUPABASE_URL`

**VALUE 2 - Anon Key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxx...
```
**Save as:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`

✅ **SUPABASE DONE**

---

## ✅ STEP 2: GOOGLE CLOUD (15 minutes)

### Go here NOW:
```
https://console.cloud.google.com
```

### What to do:

**Part A: Create Project**
1. Top left: Click **project dropdown** (shows "Select a Project")
2. Click **"NEW PROJECT"**
3. **Project name:** `mandmautoperformance`
4. Click **"CREATE"**
5. Wait ~1 minute for project to initialize

**Part B: Enable APIs**

Repeat this 3 times - search for each API and enable:

1. Search bar (top): Type `Generative AI API`
   - Click result → Click **"ENABLE"**

2. Search bar: Type `Cloud Vision API`
   - Click result → Click **"ENABLE"**

3. Search bar: Type `Maps API`
   - Click result → Click **"ENABLE"**

**Part C: Get API Keys**

1. Left sidebar: Click **"APIs & Services"**
2. Left sidebar: Click **"Credentials"**
3. Click **"+ CREATE CREDENTIALS"** (blue button, top)
4. Select **"API Key"**
5. A popup shows your key - **COPY IT**

**VALUE 3 - Google API Key:**
```
AIzaSy...xxxxx...
```

This ONE key works for all three Google APIs:
- **Save as:** `NEXT_PUBLIC_GEMINI_API_KEY`
- **Save as:** `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- **Save as:** `NEXT_PUBLIC_GOOGLE_VISION_API_KEY`

(Use the same key for all 3)

✅ **GOOGLE CLOUD DONE**

---

## ✅ STEP 3: OPTIONAL - STRIPE (5 minutes)

### Go here NOW:
```
https://stripe.com
```

### What to do:
1. Click **"Sign up"**
2. Enter email: **mandmautoperformance@gmail.com**
3. Verify email
4. Create password
5. Left sidebar: **"Developers"**
6. Click **"API keys"**
7. Copy **Publishable key** (starts with `pk_test_`)
8. Copy **Secret key** (starts with `sk_test_`)

**VALUE 4 - Stripe Publishable:**
```
pk_test_xxxxx
```
**Save as:** `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

**VALUE 5 - Stripe Secret:**
```
sk_test_xxxxx
```
**Save as:** `STRIPE_SECRET_KEY`

✅ **STRIPE DONE (optional but recommended)**

---

## 📋 YOUR API KEYS (Save This Securely)

Copy this and fill in with your actual keys:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSy...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...
NEXT_PUBLIC_GOOGLE_VISION_API_KEY=AIzaSy...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

---

## ✅ DONE WITH KEYS!

You now have all API keys. **Copy the above values somewhere safe.**

**Next step:** Tell me "KEYS DONE" and I'll deploy to Vercel immediately.

---

## 🚨 IMPORTANT NOTES

- ✅ All accounts use: `mandmautoperformance@gmail.com`
- ✅ All passwords: Use strong passwords (write them down!)
- ✅ Supabase region: MUST be `eu-west-1` (London)
- ✅ Google keys: Use same key for all 3 APIs
- ✅ Stripe: Use test keys (no real charges)
- ❌ NEVER share these keys on Slack/GitHub/email
- ❌ NEVER commit to Git

---

## ⏰ Timeline

| Step | Time | Status |
|------|------|--------|
| Supabase | 5 min | ⏳ Start here |
| Google Cloud | 15 min | ⏳ Then this |
| Stripe | 5 min | ⏳ Optional |
| **TOTAL** | **30 min** | |

---

**START NOW WITH SUPABASE 👇**

```
https://supabase.com → Click "Start your project"
```

Once you have all 5 keys, come back and say **"KEYS DONE"** and I'll deploy to Vercel.

🚀 **Let's go live Monday!**
