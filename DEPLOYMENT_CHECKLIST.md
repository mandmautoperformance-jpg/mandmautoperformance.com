# 🚀 M&M Auto Performance - Production Deployment Checklist

**Project:** M&M Auto Performance (MIA - Motor Intelligence Assistant)
**Domain:** mandmautoperformance.com (161.97.76.221)
**Current Server:** Vercel (auto-deploy from GitHub)
**Deployment Date:** Monday, April 7, 2026
**Deployer:** [Your Name]

---

## ✅ PRE-DEPLOYMENT (Saturday - Sunday)

### Code & Git
- [ ] All code pushed to `main` branch in GitHub
- [ ] Latest commit: `246f228` (Admin system) merged
- [ ] No uncommitted changes in working directory
- [ ] Git history clean (no failed commits)
- [ ] `.env.example` updated with all required variables

### Testing & Quality
- [ ] No critical errors in code audit
- [ ] Components verified locally: `npm run dev`
- [ ] Setup wizard tested (API validation)
- [ ] Booking flow tested end-to-end
- [ ] MIA chatbot responds correctly
- [ ] OAuth providers ready (Google, Apple, X)
- [ ] Photo upload/OCR tested

### Infrastructure Requirements
- [ ] Vercel account created
- [ ] GitHub integration authorized
- [ ] Project imported into Vercel
- [ ] Domain registrar access confirmed
- [ ] DNS records documented & ready

### API Keys & Credentials
- [ ] Supabase project created (eu-west-1 region)
- [ ] Supabase schema migrated
- [ ] Gemini API enabled & key obtained
- [ ] Google Maps API enabled & key obtained
- [ ] Google Vision API enabled & key obtained
- [ ] Stripe account created (or use test keys)
- [ ] SendGrid account created (optional but recommended)
- [ ] All keys documented securely
- [ ] No keys committed to Git

### Database & Data
- [ ] Supabase database schema applied
- [ ] RLS policies configured
- [ ] Test data loaded (sample vehicles, etc.)
- [ ] Database backups configured
- [ ] Row-level security verified

### Documentation
- [ ] `SETUP_QUICKSTART.md` reviewed
- [ ] `DEPLOYMENT_AND_INFRASTRUCTURE_SETUP.md` reviewed
- [ ] `UK_LEGAL_COMPLIANCE_GUIDE.md` reviewed
- [ ] Admin handoff docs prepared
- [ ] Runbook for common issues created

---

## 🔧 VERCEL DEPLOYMENT (Monday Morning - Step 1)

### Step 1: Import GitHub Repository
- [ ] Login to vercel.com
- [ ] Click "New Project"
- [ ] Select GitHub integration
- [ ] Find & select: `richhabits/mandmautoperformance.com`
- [ ] Click "Import"
- [ ] Framework: Select "Next.js"
- [ ] Build Command: `npm run build` (should auto-detect)
- [ ] Output Directory: `.next`
- [ ] Install Command: `npm install`

### Step 2: Environment Variables (CRITICAL)
Add these in Vercel Project Settings → Environment Variables:

**Required (Core APIs):**
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSy...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...
NEXT_PUBLIC_GOOGLE_VISION_API_KEY=AIzaSy...
```

**Recommended (Optional but suggested):**
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
SENDGRID_API_KEY=SG...
NEXT_PUBLIC_ENABLE_AI_CONCIERGE=true
NEXT_PUBLIC_ENABLE_TELEMATICS=true
```

**Feature Flags:**
```
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://mandmautoperformance.com
NEXT_PUBLIC_DOMAIN=mandmautoperformance.com
```

- [ ] All 5 required keys entered
- [ ] No typos in variable names
- [ ] All values copied correctly
- [ ] Marked as "Production" environment
- [ ] Click "Save"

### Step 3: Deploy to Vercel
- [ ] In Vercel dashboard, click "Deploy"
- [ ] Wait for build to complete (5-10 minutes)
- [ ] Check build logs for errors
- [ ] Verify no failed deployments
- [ ] Auto-generated Vercel URL ready: `https://mandmautoperformance-xxx.vercel.app`

**Test Vercel Deployment:**
- [ ] Visit generated URL (https://mandmautoperformance-xxx.vercel.app)
- [ ] Page loads without 500 errors
- [ ] Setup wizard visible at `/setup`
- [ ] No console errors (F12 → Console)

---

## 🌐 DNS & DOMAIN SETUP (Monday Midday - Step 2)

### Step 1: Get Vercel DNS Records
- [ ] In Vercel dashboard: Settings → Domains
- [ ] Click "Add Domain"
- [ ] Enter: `mandmautoperformance.com`
- [ ] Vercel shows DNS records to add

**Vercel will provide:**
```
Type: A
Name: @
Value: [Vercel IP]

OR

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Step 2: Update Domain Registrar
- [ ] Login to domain registrar (GoDaddy, Namecheap, etc.)
- [ ] Go to DNS settings
- [ ] **Option A (Recommended):** Point A record to Vercel IP
- [ ] **Option B (Alternative):** Add CNAME for www subdomain
- [ ] Remove old A record (161.97.76.221) if present
- [ ] Save DNS changes
- [ ] Wait 5-30 minutes for propagation

**Verify DNS Update:**
```bash
# In terminal:
nslookup mandmautoperformance.com
# Should resolve to Vercel IP, not 161.97.76.221
```

- [ ] DNS propagation confirmed (use whatsmydns.net)
- [ ] Vercel recognizes domain in settings
- [ ] SSL certificate issued automatically (Let's Encrypt)

### Step 3: Test Production Domain
- [ ] Visit `https://mandmautoperformance.com` in browser
- [ ] Page loads (not Vercel default page)
- [ ] SSL certificate valid (lock icon in address bar)
- [ ] No certificate warnings
- [ ] Setup wizard visible at `/setup`
- [ ] Performance acceptable (<2s load time)

---

## ⚙️ SYSTEM CONFIGURATION (Monday Afternoon - Step 3)

### Step 1: Run Setup Wizard
- [ ] Visit `https://mandmautoperformance.com/setup`
- [ ] Complete 5-step wizard:
  - [ ] Step 1: Supabase URL (validates .supabase.co)
  - [ ] Step 2: Supabase Anon Key (validates length)
  - [ ] Step 3: Gemini API Key (validates AIzaSy format)
  - [ ] Step 4: Google Maps API Key
  - [ ] Step 5: Google Vision API Key
- [ ] Click "Activate System"
- [ ] See success page with checkmarks
- [ ] `.env.local` content copied to clipboard (for local testing later)

### Step 2: Verify Admin Dashboard
- [ ] After activation, redirected to `/admin-dashboard`
- [ ] Overview tab shows system status
- [ ] API Configuration shows 5 active APIs
- [ ] Growth & Marketing tab loads
- [ ] All sections functional

### Step 3: Configure Optional APIs (if available)
In Admin Dashboard → API Configuration:
- [ ] Add Stripe keys (if payment testing)
- [ ] Add SendGrid keys (if email testing)
- [ ] Add Twilio/WhatsApp (if SMS testing)
- [ ] Mark as "Active" when configured

---

## 🧪 TESTING & VERIFICATION (Monday Afternoon)

### Authentication & Identity
- [ ] Google OAuth signup works
- [ ] Apple OAuth signup works
- [ ] X (Twitter) OAuth signup works
- [ ] Email/password signup works (if enabled)
- [ ] User session persists across pages
- [ ] Logout works correctly

### Core Features
- [ ] Driver's Passport loads after signup
- [ ] Telematics score displays (0 initially)
- [ ] Vault documents tab accessible
- [ ] Preferences tab editable
- [ ] Wallet tab shows M&M Credits

### Booking Flow
- [ ] Homepage loads with fleet cards
- [ ] Vehicle selection works
- [ ] Date/time picker functional
- [ ] Booking quote calculated correctly
- [ ] Payment flow initiates (test mode)
- [ ] Confirmation email sent (check spam folder)
- [ ] Booking appears in driver's Garage

### AI Concierge (MIA)
- [ ] MIA chat widget appears
- [ ] Message input functional
- [ ] Bot responds to queries
- [ ] Response time < 2 seconds
- [ ] Typing indicator shows
- [ ] Message history persists

### Document Management
- [ ] Document upload works
- [ ] Google Vision OCR processes images
- [ ] License verification extracts data
- [ ] Uploaded files secure/encrypted
- [ ] Document deletion works

### Admin Functions
- [ ] Admin dashboard accessible
- [ ] API configuration editable
- [ ] Lead scraper data loads
- [ ] Marketing templates display
- [ ] Legal compliance checklist works

### Performance
- [ ] First Contentful Paint (FCP) < 2s
- [ ] Largest Contentful Paint (LCP) < 3s
- [ ] Cumulative Layout Shift (CLS) < 0.1
- [ ] No console errors (F12 → Console)
- [ ] No 404 responses
- [ ] Images load efficiently

### Security
- [ ] HTTPS enforced (lock icon visible)
- [ ] No sensitive data in URL params
- [ ] API keys not exposed in frontend code
- [ ] CORS headers correct
- [ ] CSP headers present (check response headers)
- [ ] No XSS vulnerabilities detected

### Mobile Responsiveness
- [ ] Works on iPhone (test in DevTools)
- [ ] Works on Android (test in DevTools)
- [ ] Touch interactions responsive
- [ ] No horizontal scroll on mobile
- [ ] Images resize correctly

---

## 📊 MONITORING & ALERTS (Monday Evening)

### Set Up Vercel Monitoring
- [ ] Vercel Analytics enabled
- [ ] Error tracking active (Sentry if integrated)
- [ ] Performance metrics tracked
- [ ] Alerts configured:
  - [ ] Error rate exceeds 5%
  - [ ] Response time exceeds 3s
  - [ ] Downtime detected

### Check Real-Time Metrics
- [ ] Visit Vercel Dashboard → Analytics
- [ ] Monitor metrics for 1 hour:
  - [ ] Error rate: Should be 0-1%
  - [ ] Latency (p95): Should be < 1.5s
  - [ ] Requests per minute: Normal range
  - [ ] Users online: Should be > 0 (at least testers)

### Database Monitoring
- [ ] Supabase dashboard open
- [ ] Database status: "Healthy"
- [ ] Query performance normal
- [ ] No connection errors
- [ ] Row count stable (not growing unexpectedly)
- [ ] Backups scheduled & automated

### Logging & Debugging
- [ ] Vercel build logs reviewed for warnings
- [ ] Browser console clean (no critical errors)
- [ ] Network tab shows successful API calls
- [ ] Database logs show normal queries
- [ ] Error rates < 1%

---

## ✨ POST-DEPLOYMENT (Monday Evening)

### Documentation & Handoff
- [ ] `ADMIN_COMPLETE_SETUP.md` shared with team
- [ ] Deployment notes documented
- [ ] Admin credentials secured
- [ ] Emergency contacts documented
- [ ] Rollback procedure documented

### Announce & Market
- [ ] Tweet launch announcement
- [ ] Email to beta users
- [ ] Update social media
- [ ] Monitor feedback channels

### Monitoring Setup
- [ ] Team alerted to deployment
- [ ] On-call rotation updated
- [ ] Incident response plan shared
- [ ] Health check dashboard bookmarked

---

## 🚨 ROLLBACK TRIGGERS

**Automatically rollback if ANY of these occur:**

| Trigger | Threshold | Action |
|---------|-----------|--------|
| Error rate | > 5% | Rollback to previous commit |
| API latency (p95) | > 3 seconds | Rollback |
| Database down | Any downtime | Rollback |
| Critical user flow broken | Any broken | Rollback |
| SSL certificate invalid | Any error | Immediate alert + rollback |
| Setup wizard fails | > 10% failure | Investigate + rollback if critical |

**How to Rollback:**
1. Vercel Dashboard → Deployments
2. Find last known good deployment
3. Click "Promote to Production"
4. Verify rollback in 2-3 minutes
5. Check monitoring for recovery
6. Alert team via Slack

---

## 📞 EMERGENCY CONTACTS

| Role | Contact | Availability |
|------|---------|---------------|
| Product Owner | [Your Name] | 24/7 |
| DevOps | [If applicable] | Business hours |
| API Support | Vercel Support | 24/7 |
| Database Support | Supabase Support | 24/7 |

---

## ✅ FINAL SIGN-OFF

- [ ] All checklist items completed
- [ ] System tested end-to-end
- [ ] Performance acceptable
- [ ] Monitoring active
- [ ] Team notified
- [ ] Rollback plan ready
- [ ] **DEPLOYMENT COMPLETE** ✅

**Deployment Status:** LIVE 🚀
**Domain:** https://mandmautoperformance.com
**Live Time:** [Time/Date]
**Deployed By:** [Name]
**Verified By:** [Name]

---

## 📝 Post-Launch Notes

[Space for any issues found or notes during deployment]

