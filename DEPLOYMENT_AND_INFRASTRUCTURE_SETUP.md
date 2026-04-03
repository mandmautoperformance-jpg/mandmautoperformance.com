# Deployment & Infrastructure Setup Guide
## M&M Auto Performance — Week 1 Go-Live

**Server IP**: 161.97.76.221
**Domain**: mandmautoperformance.com
**Status**: Ready for deployment
**Timeline**: Week 1 (3 days to production)

---

## 🚀 INFRASTRUCTURE OVERVIEW

### Your Tech Stack (As Deployed)

```
┌─────────────────────────────────────┐
│  mandmautoperformance.com (Domain)  │
│         ↓ (DNS Points)              │
│    161.97.76.221 (Your Server)      │
│         ↓                           │
├─────────────────────────────────────┤
│  GitHub                             │ ← Source code
│  ↓ (Auto-deploy via Vercel)         │
│  Vercel (Frontend Hosting)          │ ← Next.js apps
│  Edge Network (Global CDN)          │ ← Images, static
│         ↓                           │
│  Supabase (Database)                │ ← PostgreSQL
│  - Auth (OAuth)                     │ ← Google/Apple/X
│  - Realtime (WebSocket)             │ ← Score updates
│  - Edge Functions                   │ ← API endpoints
│         ↓                           │
│  Gemini API (Free Tier)             │ ← MIA AI
│  Google Maps API (£50 budget)       │ ← Routing/maps
│  Google Vision API (£10/mo)         │ ← Document OCR
│         ↓                           │
│  Stripe / PayPal (Payments)         │ ← Booking charges
│  SendGrid (Email)                   │ ← Transactional
│  Sentry (Monitoring)                │ ← Error tracking
└─────────────────────────────────────┘
```

---

## 🔧 DNS SETUP (Critical First Step)

### Current State
- Domain: `mandmautoperformance.com`
- Server IP: `161.97.76.221`
- Status: Need to point DNS to Vercel or reverse proxy

### Option A: DNS → Vercel (RECOMMENDED)
This is the fastest path. Vercel acts as your frontend, Supabase as your backend.

**Step 1: Update DNS Records**

Contact your domain registrar (GoDaddy, Namecheap, etc.) and add:

```
Type    Name                        Value
────────────────────────────────────────────────────
A       mandmautoperformance.com    161.97.76.221 (your server)
CNAME   www                         mandmautoperformance.com
```

OR (if using Vercel nameservers):

```
Delete existing records and point these to Vercel's nameservers:
ns1.vercel-dns.com
ns2.vercel-dns.com
ns3.vercel-dns.com
ns4.vercel-dns.com
```

**Verification:**
```bash
# Check DNS propagation (wait 24-48 hours for full propagation)
nslookup mandmautoperformance.com
dig mandmautoperformance.com
# Should resolve to your IP or Vercel's IP

# Verify CNAME
nslookup www.mandmautoperformance.com
```

**Step 2: Setup Vercel Deployment**

```bash
# 1. Push code to GitHub
git remote add origin https://github.com/richhabits/mandmautoperformance.com.git
git push -u origin main

# 2. Import project into Vercel
# - Go to vercel.com
# - Click "New Project"
# - Select GitHub repo
# - Configure environment variables:
#   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
#   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... (from Supabase)
#   GEMINI_API_KEY=AIzaSy... (from Google AI Studio)
#   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy... (from Google Cloud)
# - Click Deploy

# 3. Add custom domain
# - In Vercel project settings → Domains
# - Add mandmautoperformance.com
# - Follow DNS setup instructions
```

**Step 3: SSL/TLS Certificate**

Vercel auto-generates free SSL via Let's Encrypt. After DNS points:
- HTTPS enabled automatically
- Certificate valid for 1 year
- Auto-renews

---

## 🗄️ SUPABASE SETUP (Database)

### Step 1: Create Supabase Project

```bash
# 1. Go to supabase.com
# 2. Create new project:
#    - Name: M&M Auto Performance
#    - Database password: [STRONG PASSWORD]
#    - Region: eu-west-1 (London - closest to Herts)
#    - Plan: Free (scales to 500K rows)

# 3. Save credentials:
PROJECT_URL = "https://xxxxx.supabase.co"
ANON_KEY = "eyJ..."
SERVICE_ROLE_KEY = "eyJ..." (keep secret!)
```

### Step 2: Run Database Schema

```bash
# In your local repo
npm install @supabase/supabase-js

# Create migration file
cat > supabase/migrations/001_init_schema.sql << 'EOF'
-- User profiles
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE,
  phone VARCHAR,
  first_name VARCHAR,
  last_name VARCHAR,
  avatar_url VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Vault (Documents)
CREATE TABLE IF NOT EXISTS vault_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  document_type VARCHAR,
  document_url VARCHAR,
  verified BOOLEAN DEFAULT FALSE,
  ocr_data JSONB,
  verification_date TIMESTAMP,
  expiry_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Telematics (Scores)
CREATE TABLE IF NOT EXISTS telematics_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rental_id UUID,
  acceleration_smoothness NUMERIC,
  braking_smoothness NUMERIC,
  speed_compliance NUMERIC,
  return_condition NUMERIC,
  punctuality NUMERIC,
  overall_score NUMERIC,
  tier VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  favorite_marques VARCHAR[],
  engine_mapping VARCHAR,
  interior_climate NUMERIC,
  notify_fleet_updates BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Rentals
CREATE TABLE IF NOT EXISTS rentals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  vehicle_id UUID,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  miles_driven NUMERIC,
  rating NUMERIC,
  status VARCHAR DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Wallet
CREATE TABLE IF NOT EXISTS wallet (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  mm_credits NUMERIC DEFAULT 0,
  total_spent NUMERIC DEFAULT 0,
  total_earned NUMERIC DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE telematics_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own data
CREATE POLICY users_own_data ON vault_documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY vault_insert_own ON vault_documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Similar for other tables...
EOF

# Apply migration
supabase db push
```

### Step 3: Setup OAuth Providers

```bash
# In Supabase dashboard → Authentication → Providers

# Google
# 1. Go to console.cloud.google.com
# 2. Create OAuth 2.0 Client ID
# 3. Add Supabase redirect URIs:
#    https://xxxxx.supabase.co/auth/v1/callback
# 4. Copy Client ID + Secret
# 5. Paste into Supabase Google provider settings

# Apple
# 1. Go to developer.apple.com
# 2. Create App ID + Service ID
# 3. Create private key
# 4. Add Supabase redirect URI to Service ID
# 5. Copy credentials to Supabase

# X (Twitter)
# 1. Go to developer.twitter.com
# 2. Create app
# 3. Copy API Key + Secret
# 4. Add Supabase callback URL to app settings
# 5. Paste into Supabase X provider
```

---

## 🚀 DEPLOYMENT PIPELINE (GitHub → Vercel)

### Step 1: Setup GitHub Actions (Optional but Recommended)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main, develop]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install & Test
        run: |
          npm install
          npm run lint
          npm run type-check
          npm run test

      - name: Deploy to Vercel
        run: |
          npm i -g vercel
          vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

### Step 2: Auto-Deploy Setup

```bash
# In Vercel dashboard
# Project Settings → Git → Deploy on Push
# Enable: Auto-deploy on main branch push

# Every push to main:
# 1. Vercel detects change
# 2. Runs `npm run build`
# 3. Deploys to production
# 4. Updates live site
```

---

## 🔐 ENVIRONMENT VARIABLES (CRITICAL)

### Local Development (.env.local)

```bash
# Copy .env.example and fill in real values
cp .env.example .env.local

# Fill in:
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ... # Never expose this
GEMINI_API_KEY=AIzaSy...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...
STRIPE_SECRET_KEY=sk_live_... # For payments
SENDGRID_API_KEY=SG_...
```

### Vercel Production

```bash
# In Vercel dashboard:
# Settings → Environment Variables
# Add all keys (except SUPABASE_SERVICE_ROLE_KEY)

# Public keys (safe):
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

# Secret keys (safe on Vercel, never in code):
GEMINI_API_KEY
STRIPE_SECRET_KEY
SENDGRID_API_KEY
SUPABASE_SERVICE_ROLE_KEY
```

---

## 📋 WEEK 1 DEPLOYMENT CHECKLIST

### Days 1-2: Infrastructure Setup
- [ ] DNS configured (A record + CNAME)
- [ ] Vercel project created
- [ ] Supabase project created (eu-west-1)
- [ ] Database schema applied
- [ ] OAuth providers configured (Google, Apple, X)
- [ ] Environment variables set (local + Vercel)
- [ ] GitHub repo created + first push

### Day 3: Testing & Go-Live
- [ ] `npm run dev` works locally
- [ ] Vercel deployment successful
- [ ] https://mandmautoperformance.com loads
- [ ] Social auth works (test login flow)
- [ ] Database reads/writes work
- [ ] MIA API responds
- [ ] Admin dashboard loads

### Verification Commands

```bash
# Local setup
npm install
npm run dev
# Visit http://localhost:3000

# Check environment
npm run type-check
npm run lint

# Build for production
npm run build

# View Vercel deployment
vercel projects list
vercel deployments

# Test Supabase connection
curl https://xxxxx.supabase.co/rest/v1/users \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY"

# Verify DNS
nslookup mandmautoperformance.com
dig mandmautoperformance.com
```

---

## ⚠️ CRITICAL SECURITY CHECKLIST

### Before Going Live
- [ ] Never commit .env.local to GitHub
- [ ] All secrets in Vercel environment variables only
- [ ] RLS policies enabled on all Supabase tables
- [ ] Rate limiting configured (100 req/min per user)
- [ ] CORS properly configured (only mandmautoperformance.com)
- [ ] SSL/TLS enabled (automatic on Vercel)
- [ ] Input validation on all forms
- [ ] Error messages don't leak system info
- [ ] Sentry error tracking configured
- [ ] Monitoring alerts setup

### After Go-Live
- [ ] Monitor error logs (Sentry)
- [ ] Check uptime (Vercel analytics)
- [ ] Review API usage (Google Cloud)
- [ ] Monitor database queries (Supabase)
- [ ] Check for security issues daily

---

## 🚨 ROLLBACK PROCEDURE (If Something Breaks)

### Option A: Revert Vercel Deployment
```bash
# In Vercel dashboard:
# Deployments → Previous deployment → Promote to Production
# (Takes 2-3 minutes)
```

### Option B: Revert GitHub Code
```bash
# If code pushed has bugs:
git revert <commit-hash>
git push origin main
# Vercel auto-redeploys
```

### Option C: Database Rollback
```bash
# Supabase has daily backups
# Contact Supabase support to restore backup
# (Usually restores in 30 mins)
```

---

## 📊 DEPLOYMENT TRACKING

### Vercel Dashboard Metrics
- **Uptime**: Target 99.5%
- **Page Load**: Target <2s
- **API Response**: Target <100ms
- **Database Latency**: Target <50ms

### Monitor These Daily (Week 1-4)
```bash
# Check uptime
curl -I https://mandmautoperformance.com
# Should return 200 OK

# Check API
curl https://mandmautoperformance.com/api/health
# Should return { "status": "ok" }

# Check database
# In Supabase dashboard → SQL Editor
# SELECT COUNT(*) FROM users;
# Should increase as users sign up
```

---

## 🔗 USEFUL LINKS

| Service | URL | What to Do |
|---------|-----|-----------|
| **Vercel** | vercel.com | Deploy frontend |
| **Supabase** | supabase.com | Manage database |
| **GitHub** | github.com | Version control |
| **Google Cloud** | console.cloud.google.com | API keys + billing |
| **Domain Registrar** | godaddy.com / namecheap.com | Update DNS |
| **Sentry** | sentry.io | Error tracking |
| **Stripe** | stripe.com | Payments (setup Week 2) |

---

## 💬 QUICK REFERENCE: Commands

```bash
# Local development
npm install
npm run dev          # http://localhost:3000
npm run build        # Build for production
npm run lint         # Check code style
npm run type-check   # TypeScript validation

# Database management
supabase status      # Check connection
supabase db push     # Apply migrations
supabase db pull     # Download schema

# Deployment
git push origin main # Trigger auto-deploy
vercel --prod        # Manual Vercel deploy

# Verification
nslookup mandmautoperformance.com
curl -I https://mandmautoperformance.com
```

---

## ✅ SUCCESS CRITERIA

**Week 1 deployment is successful when:**

✅ mandmautoperformance.com loads in browser
✅ Social auth works (can sign in with Google)
✅ Database stores user data
✅ MIA chatbot responds
✅ Admin dashboard accessible
✅ HTTPS enabled
✅ <2s page load time
✅ Zero errors in Sentry (or only tracked, not breaking)

---

**Status**: Ready to deploy
**Timeline**: 3 days (Week 1)
**Dependencies**: DNS propagation (24-48 hours)
**Rollback**: < 10 minutes if needed

🚀 **You're ready. Let's go live.**
