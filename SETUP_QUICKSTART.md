# MIA Setup Quick Start

## 🚀 Activate Your System (5 Minutes)

Your M&M Auto Performance platform needs 5 API keys to go live. The Admin Setup Wizard makes this easy.

### Option 1: Web Setup (Recommended)
```bash
npm run dev
# Visit http://localhost:3000/setup
# Follow the wizard step-by-step
# Keys are validated as you enter them
```

### Option 2: Manual Setup
1. Copy `.env.example` to `.env.local`
2. Fill in your 5 API keys (see below)
3. Run: `npm run dev`

---

## 📝 Getting Your API Keys (10 Minutes Total)

### 1️⃣ Supabase (2 min)
- Go to: https://supabase.com
- Click "New Project"
- Region: **eu-west-1** (London - closest to Hertfordshire)
- Organization: Use existing or create new
- **Copy these:**
  - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
  - `Anon Key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2️⃣ Google Cloud (5 min)
- Go to: https://console.cloud.google.com
- Create new project: `mandmautoperformance`
- Enable these APIs:
  - Generative AI API (Gemini)
  - Cloud Vision API
  - Maps API
- Create API Keys (Credentials → Create Credentials → API Key)
- You'll get ONE key but can restrict it per API
- **Copy these:**
  - Gemini key → `NEXT_PUBLIC_GEMINI_API_KEY`
  - Vision key → `NEXT_PUBLIC_GOOGLE_VISION_API_KEY`
  - Maps key → `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

### 3️⃣ OAuth Providers (Optional for MVP)
- Already configured in your code
- Enable these in Supabase Dashboard → Authentication:
  - Google OAuth
  - Apple OAuth
  - X (Twitter) OAuth

---

## ✅ Setup Wizard Flow

```
Step 1: Supabase URL
  └─ Validates format (must contain "supabase.co")

Step 2: Supabase Anon Key
  └─ Validates length (JWT tokens are 100+ chars)

Step 3: Gemini API Key
  └─ Validates Google format (starts with AIzaSy)

Step 4: Google Maps API Key
  └─ Same validation as Gemini

Step 5: Google Vision API Key
  └─ Same validation as above

Step 6: Activate
  └─ Saves to localStorage (dev) / server (prod)
  └─ Generates .env.local (auto-copied to clipboard)
  └─ Redirects to Admin Dashboard
```

---

## 🔐 After Activation

Your setup wizard will:
1. ✅ Validate all 5 keys
2. ✅ Save to secure storage
3. ✅ Generate `.env.local` file
4. ✅ Copy to your clipboard automatically

**Next steps:**
1. Paste the `.env.local` content into your actual `.env.local` file
2. Restart dev server: `npm run dev`
3. Visit http://localhost:3000
4. Test: Signup → Book Car → Chat with MIA

---

## 📍 Expected Keys Format

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_GOOGLE_VISION_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Invalid Supabase URL" | Make sure URL contains "supabase.co" and is the full URL |
| "Key seems too short" | Google API keys are long (39+ chars). Double-check copy/paste |
| "Invalid Google key format" | Google keys start with "AIzaSy" - check if you copied correctly |
| Setup won't load | Clear browser localStorage: DevTools → Application → Clear All |
| Changes not saving | Check browser console for errors (F12 → Console tab) |

---

## 🎯 Success Criteria

After setup, you should see:
- ✅ Green checkmark on setup page
- ✅ "Admin Dashboard" link appears
- ✅ Database connected (check Supabase dashboard for new tables)
- ✅ OAuth providers working on /login
- ✅ MIA chatbot responds to messages

---

## 📅 Timeline

| Task | Time | Status |
|------|------|--------|
| Get Supabase keys | 2 min | ▓▓▓▓▓░ |
| Get Google keys | 5 min | ▓▓▓▓▓░ |
| Run setup wizard | 3 min | ▓▓▓▓▓░ |
| Test locally | 5 min | ▓▓▓▓▓░ |
| **Total** | **15 min** | |

---

## 🚀 Next: Deployment

Once your system is activated locally:
1. Push to GitHub (already done ✓)
2. Connect to Vercel (WEEK_1_EXECUTION_PLAN.md)
3. Deploy to production (Monday)

See `DEPLOYMENT_AND_INFRASTRUCTURE_SETUP.md` for full deployment guide.
