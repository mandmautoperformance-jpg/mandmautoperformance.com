# Week 1 Execution Plan
## From Code to Live → 3 Days

**Goal**: Launch mandmautoperformance.com live with core booking system
**Team**: 3 developers (Frontend, Backend, DevOps)
**Status**: Ready to execute
**Server**: 161.97.76.221 | Domain: mandmautoperformance.com

---

## 📅 TIMELINE AT A GLANCE

```
Monday      Tuesday      Wednesday
──────────  ──────────   ──────────
Infra       Connect      Test & Go
Setup       Components   Live
(4 hrs)     (6 hrs)      (4 hrs)
  ↓           ↓            ↓
READY     INTEGRATE     🚀 LIVE
```

---

## 🔵 MONDAY: INFRASTRUCTURE SETUP (4 hours)

### 8:00 AM - DevOps Team Kickoff (30 min)

**Owner's Task:**
- [ ] Provide domain registrar login (GoDaddy/Namecheap)
- [ ] Confirm server IP: 161.97.76.221
- [ ] Verify Vercel account access
- [ ] Confirm Supabase account created

**Team Sync:**
- Discuss DNS propagation timeline (24-48 hours)
- Review deployment pipeline
- Setup Slack notifications for deploys

### 8:30 AM - DNS Configuration (1 hour)

**DevOps:**
```bash
# Contact domain registrar or login to dashboard
# Add A record:
Type: A
Name: mandmautoperformance.com
Value: 161.97.76.221

# Add CNAME:
Type: CNAME
Name: www
Value: mandmautoperformance.com

# Wait for DNS to propagate
# Verify with: nslookup mandmautoperformance.com
```

**Checklist:**
- [ ] A record added (points to 161.97.76.221)
- [ ] CNAME added (www → apex)
- [ ] DNS propagation started (check status at whatsmydns.net)

### 9:30 AM - Vercel Setup (1 hour)

**DevOps:**
```bash
# 1. Create GitHub repo
git init mandmautoperformance.com
git remote add origin https://github.com/richhabits/mandmautoperformance.com
git add .
git commit -m "Initial commit: M&M Auto Performance MVP"
git push -u origin main

# 2. Login to Vercel
# - Click "New Project"
# - Import GitHub repo
# - Select framework: Next.js
# - Configure environment variables:

NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
GEMINI_API_KEY=AIzaSy...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...

# 3. Add custom domain
# - Project Settings → Domains
# - Add mandmautoperformance.com
# - Follow Vercel's DNS instructions (CNAME to Vercel)
```

**Checklist:**
- [ ] GitHub repo created + main branch pushed
- [ ] Vercel project created
- [ ] Environment variables configured
- [ ] Custom domain added (DNS pending)

### 10:30 AM - Supabase Setup (1.5 hours)

**Backend Lead:**
```bash
# 1. Create Supabase project
# - Go to app.supabase.com
# - New Project
# - Region: eu-west-1 (London)
# - Database password: [STRONG]
# - Plan: Free (scales to 500K)

# 2. Get credentials
PROJECT_URL=https://xxxxx.supabase.co
ANON_KEY=eyJ...
SERVICE_ROLE_KEY=eyJ... (KEEP SECRET)

# 3. Create local .env.local
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
EOF

# 4. Run database schema
# Execute SQL migrations from DRIVERS_PASSPORT_SPECIFICATION.md
# In Supabase dashboard → SQL Editor → Paste schema

# 5. Enable Row Level Security (RLS)
# For every table:
ALTER TABLE [table_name] ENABLE ROW LEVEL SECURITY;

# 6. Setup OAuth
# Auth → Providers → Google
# Auth → Providers → Apple
# Auth → Providers → X
# (Add credentials from Google/Apple/X developer accounts)
```

**Checklist:**
- [ ] Supabase project created (eu-west-1)
- [ ] Database schema applied
- [ ] RLS enabled on all tables
- [ ] OAuth providers configured
- [ ] Credentials saved to .env.local
- [ ] Local connection tested (npm run dev loads)

### 12:00 PM - EOD Monday Status

**Blockers Check:**
- ❌ DNS propagation still pending (expected, will be ready by Tuesday)
- ❌ Vercel shows "Waiting for DNS" (expected, will resolve overnight)
- ✅ Local `npm run dev` works
- ✅ Database connected
- ✅ OAuth configured

**Tomorrow Roadblock:**
- If DNS not propagated by 10 AM Tuesday, continue anyway (Vercel has fallback domain)

---

## 🟣 TUESDAY: COMPONENT INTEGRATION (6 hours)

### 8:00 AM - Status Check (15 min)

**DevOps:**
```bash
# Check DNS propagation
nslookup mandmautoperformance.com
# Should show 161.97.76.221

# Check Vercel deployment
# Dashboard should show ✅ Deployment Successful
```

### 8:15 AM - Frontend Components Integration (3 hours)

**Frontend Lead:**
```bash
# 1. Wire OAuth to components
# SocialAuthFlow.tsx → Supabase Auth

// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default supabase

// components/SocialAuthFlow.tsx
const handleAuth = async (providerId) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: providerId as 'google' | 'apple' | 'twitter',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  if (error) throw error
}

# 2. Create auth callback route
// app/auth/callback/page.tsx
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.push('/dashboard/passport')
      }
    })
  }, [router])

  return <div>Loading...</div>
}

# 3. Wire DriverPassport to database
// lib/usePassport.ts
import { useEffect, useState } from 'react'
import supabase from './supabaseClient'

export const usePassport = (userId: string) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) console.error(error)
      else setUser(data)
      setLoading(false)
    }

    fetchUser()
  }, [userId])

  return { user, loading }
}

# 4. Wire MIA chatbot to Gemini API
// lib/miaChat.ts
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

export const chat = async (userMessage: string) => {
  const result = await model.generateContent(userMessage)
  return result.response.text()
}

# 5. Wire AdminGodMode to database
// app/admin/page.tsx
// Wrap with RLS check (user must be admin)
// Fetch MIA settings from database
// Display real-time stats from rentals table
```

**Checklist:**
- [ ] OAuth working (test sign-in with Google)
- [ ] Auth callback redirects to /dashboard/passport
- [ ] DriverPassport fetches user data from Supabase
- [ ] MIA responds to chat messages
- [ ] AdminGodMode displays real data (not hardcoded)
- [ ] All components load without errors

### 11:15 AM - Backend API Endpoints (2 hours)

**Backend Lead:**
```bash
# 1. Create API routes
// app/api/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server'
import supabase from '@/lib/supabaseClient'

export async function POST(request: NextRequest) {
  const body = await request.json()

  const { data, error } = await supabase
    .from('rentals')
    .insert([body])

  if (error) return NextResponse.json({ error }, { status: 400 })
  return NextResponse.json(data, { status: 201 })
}

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('user_id')

  const { data, error } = await supabase
    .from('rentals')
    .select('*')
    .eq('user_id', userId)

  if (error) return NextResponse.json({ error }, { status: 400 })
  return NextResponse.json(data)
}

# 2. Create document verification endpoint
// app/api/verify-docs/route.ts
import { vision } from '@google-cloud/vision'

const client = new vision.ImageAnnotatorClient()

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File

  // Convert to buffer
  const buffer = Buffer.from(await file.arrayBuffer())

  // Google Vision OCR
  const [result] = await client.textDetection({
    image: { content: buffer },
  })

  const texts = result.textAnnotations
  return NextResponse.json({ ocr: texts[0]?.description })
}

# 3. Test endpoints locally
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"user_id":"test","vehicle_id":"porsche"}'

# 4. Deploy to Vercel
git add .
git commit -m "feat: integrate components with backend"
git push origin main
# Vercel auto-deploys (watch dashboard)
```

**Checklist:**
- [ ] POST /api/bookings creates rental (Supabase)
- [ ] GET /api/bookings lists user's rentals
- [ ] POST /api/verify-docs performs OCR
- [ ] All endpoints return proper JSON
- [ ] Vercel deployment successful
- [ ] APIs accessible at https://mandmautoperformance.com/api

### 1:00 PM - Lunch Break (1 hour)

### 2:00 PM - End of Day

**Status:**
- ✅ Components connected to real APIs
- ✅ OAuth working
- ✅ Database reads/writes working
- ✅ Vercel deployment live
- ⏳ DNS propagation (check Thursday morning if not yet)

**Tomorrow Blockers:**
- None expected. Ready for testing.

---

## 🟢 WEDNESDAY: TESTING & GO-LIVE (4 hours)

### 8:00 AM - Complete Integration Test (2 hours)

**QA Lead:**
```bash
# Test Suite
1. Sign up flow
   [ ] Click "Sign in with Google"
   [ ] Authenticate
   [ ] Redirect to /dashboard/passport
   [ ] User data visible

2. Document upload
   [ ] Upload driver's license
   [ ] OCR extracts text
   [ ] Verification status updates
   [ ] Vault shows "Verified"

3. Booking flow
   [ ] Select vehicle (Porsche)
   [ ] Select dates
   [ ] Payment preview shows M&M Credits
   [ ] Click "Book Now"
   [ ] Booking created in database
   [ ] Confirmation email sent

4. MIA chat
   [ ] Send "I need a Porsche"
   [ ] MIA responds with options
   [ ] Chat history persists
   [ ] No errors in console

5. Admin dashboard
   [ ] View bookings count
   [ ] View revenue
   [ ] Generate Annual Returns
   [ ] Download PDF

6. Performance
   [ ] Page load < 2 seconds
   [ ] No console errors
   [ ] Images load fast
   [ ] Mobile responsive

7. Security
   [ ] RLS working (can't see other users' data)
   [ ] HTTPS enforced
   [ ] No secrets in console
   [ ] Auth required for /dashboard
```

**Run Tests:**
```bash
# Unit tests
npm run test

# Type check
npm run type-check

# Lint
npm run lint

# Build for production
npm run build

# Lighthouse audit
npm run lighthouse
# Target: 75+ on all metrics
```

**Checklist:**
- [ ] All sign-up flows work
- [ ] All booking flows work
- [ ] MIA responds correctly
- [ ] Admin dashboard functional
- [ ] <2s page load
- [ ] No errors in Sentry
- [ ] Mobile responsive
- [ ] HTTPS working
- [ ] RLS policies enforced

### 10:00 AM - Final Verification (1 hour)

**DevOps:**
```bash
# Production checks
nslookup mandmautoperformance.com
# Should resolve to 161.97.76.221

curl -I https://mandmautoperformance.com
# Should return 200 OK with HTTPS headers

curl https://mandmautoperformance.com/api/health
# Should return { "status": "ok" }

# Check all environment variables
# Vercel Settings → Environment Variables
# Confirm all keys are set

# Monitor Sentry
# https://sentry.io → M&M project
# Should show zero new errors
```

### 11:00 AM - LAUNCH! 🚀 (1 hour)

**Owner:**
- [ ] Approve go-live (sign off on testing)

**Marketing:**
- [ ] Tweet #1: "🚀 M&M Auto Performance is LIVE! Meet MIA, your AI concierge. Book a Porsche in 60 seconds. mandmautoperformance.com #StAlbans #Watford"
- [ ] Tweet #2: "Sign in with Google, upload your license (30 sec OCR verify), unlock your Driver's Passport. No forms. Just supercars. #MIA"
- [ ] Update LinkedIn profile
- [ ] Update social media bios with link

**Monitoring (First 24 Hours):**
```bash
# Check every 30 minutes
curl -I https://mandmautoperformance.com
# Monitor Sentry for errors
# Watch Vercel analytics for traffic
# Check database usage (should be <5% of free tier)
```

### 12:00 PM - Status Report

**To Stakeholders:**
```
🚀 LIVE STATUS REPORT

PRODUCTION:
✅ mandmautoperformance.com is LIVE
✅ HTTPS enabled
✅ OAuth working (Google, Apple, X)
✅ Database connected (Supabase)
✅ MIA chatbot responding
✅ Bookings being accepted
✅ Admin dashboard live

METRICS (Hour 1):
- 0 errors in Sentry
- 0 downtime
- Page load: 1.8s
- API response: 89ms
- Uptime: 100%

NEXT 24 HOURS:
- Monitor for issues
- Respond to first users
- Prepare for Week 2 features (Telematics, Wall of Fame)

READY TO SCALE
```

---

## 📊 SUCCESS CRITERIA

**By End of Wednesday:**
- ✅ mandmautoperformance.com loads
- ✅ Users can sign up with OAuth
- ✅ Users can upload documents + verify
- ✅ Users can book cars
- ✅ MIA responds to messages
- ✅ Admin can view dashboard
- ✅ Zero critical errors
- ✅ <2s page load time
- ✅ HTTPS enabled
- ✅ Marketing announces launch

---

## 🚨 CONTINGENCY PLANS

### If DNS Not Propagated by Wednesday
- ✅ Vercel provides fallback domain: `mandmautoperformance.vercel.app`
- ✅ Works immediately, no waiting for DNS
- ✅ Add custom domain later (within 48 hours)
- ✅ Users can still access booking system

### If OAuth Not Working
- ✅ Fallback: Email + password login (simple form)
- ✅ Implement OAuth fully in Week 2
- ✅ Database stores hashed passwords securely

### If Booking API Fails
- ✅ Manual fallback: Form sends email to support
- ✅ Team processes manually (1-minute response)
- ✅ User gets booking confirmation
- ✅ Fix API in next deploy (usually <30 min)

### If MIA API Fails (Gemini Down)
- ✅ Fallback: Groq API (automatic failover in code)
- ✅ Users still get responses (might be slower)
- ✅ Investigation can happen post-launch

---

## ✅ HANDOFF TO WEEK 2

**By End of Wednesday:**

**Frontend Team Takes:**
- [ ] Weekly component polish
- [ ] Add loading skeletons
- [ ] Keyboard navigation
- [ ] Toast notifications

**Backend Team Takes:**
- [ ] Real-time telematics scoring
- [ ] Wall of Fame gallery
- [ ] Annual Returns generator

**DevOps Team Takes:**
- [ ] Monitoring/alerting setup
- [ ] Daily backups
- [ ] Performance optimization
- [ ] Scale infrastructure if needed

---

## 📞 EMERGENCY CONTACTS (Week 1)

| Role | Contact | Availability |
|------|---------|--------------|
| **Owner** | [Phone] | 8am-8pm daily |
| **DevOps Lead** | [Phone] | On-call 24/7 |
| **Backend Lead** | [Phone] | 8am-10pm daily |
| **Frontend Lead** | [Phone] | 8am-6pm daily |
| **QA Lead** | [Phone] | 8am-6pm daily |

---

## 🎯 POST-LAUNCH METRICS

**Monitor These Daily:**

```
Uptime:     Target 99.5% ✅
Load Time:  Target <2s ✅
API Speed:  Target <100ms ✅
Errors:     Target <5 per day ✅
Users:      Track daily growth
Bookings:   Track daily conversions
Revenue:    Track daily total
```

---

**Timeline**: 3 days, Monday-Wednesday
**Team**: 3-5 people
**Status**: Ready to execute
**Confidence Level**: 🟢 HIGH

🚀 **You're ready. Let's build history.**
