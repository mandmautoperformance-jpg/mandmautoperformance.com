# M&M AUTO PERFORMANCE
## Launch Checklist & Go-Live Playbook

**Launch Date**: [SET BY OWNER]
**Status**: Ready for Phase 1 Execution
**Version**: 1.0

---

## 📋 PRE-LAUNCH (Weeks 1-8)

### Week 1: Infrastructure & Database
- [ ] Create Vercel project (link GitHub repo)
- [ ] Configure Vercel environment variables
  - [ ] NEXT_PUBLIC_SUPABASE_URL
  - [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
  - [ ] ANTHROPIC_API_KEY
  - [ ] OPENAI_API_KEY
  - [ ] ADMIN_SECRET_KEY
- [ ] Create Supabase project
- [ ] Apply migrations: `supabase migration up`
- [ ] Verify database tables created:
  - [ ] vehicles
  - [ ] bookings
  - [ ] users
  - [ ] telemetry
- [ ] Configure Row Level Security (RLS) policies
- [ ] Test Supabase Auth integration

### Week 2: Core Components & API
- [ ] Get Gemini 1.5 Flash API key
- [ ] Test Gemini API limits (12.5M free tokens/month)
- [ ] Wire Sky Concierge to Gemini endpoint
- [ ] Implement rate limiting (100 req/min per user)
- [ ] Test BookingWidget with dummy bookings
- [ ] Setup Google Vision OCR for document scanning
- [ ] Test document upload flow
- [ ] Integrate Supabase Realtime for GPS tracking
- [ ] Add Google Maps API key
- [ ] Test live vehicle tracking on map

### Week 3: Testing & Deployment
- [ ] Run Jest unit tests: `npm run test`
  - [ ] Target coverage: >80%
  - [ ] All tests passing
- [ ] Run Playwright E2E tests
  - [ ] Booking flow (end-to-end)
  - [ ] Sky Concierge chat
  - [ ] Admin dashboard
- [ ] Run Lighthouse audit: `npm run build && lighthouse http://localhost:3000`
  - [ ] Performance: ≥90
  - [ ] Accessibility: ≥90
  - [ ] Best Practices: ≥90
  - [ ] SEO: ≥90
- [ ] Manual testing on iOS Safari + Android Chrome
- [ ] Load test (simulate 100 concurrent users)
- [ ] Security audit (OWASP Top 10 check)
- [ ] Verify all API endpoints responding < 100ms

### Week 4-5: Business Automation
- [ ] Build Annual Returns module
  - [ ] Query bookings by date range
  - [ ] Calculate revenue + VAT
  - [ ] Export CSV format
  - [ ] Export PDF format (HMRC-compliant)
- [ ] Build Social Media Scheduler
  - [ ] Create Gemini prompt templates
  - [ ] Pull vehicle + weather data
  - [ ] Generate 5 posts daily
- [ ] Setup social integrations
  - [ ] X (Twitter) API authentication
  - [ ] Instagram Graph API authentication
  - [ ] LinkedIn OAuth
- [ ] Deploy cron jobs
  - [ ] Daily post scheduling
  - [ ] Habit Score calculation
  - [ ] Maintenance alerts

### Week 6: Telematics
- [ ] Build Habit Score algorithm
  - [ ] Track acceleration, braking, speed
  - [ ] Calculate 0-100 score per trip
  - [ ] Award loyalty points
- [ ] Implement maintenance alerts
  - [ ] Alert if Habit Score < 40
  - [ ] Schedule vehicle maintenance
- [ ] Test telemetry data pipeline
- [ ] Verify data accuracy in analytics

### Week 7-9: SEO & Marketing
- [ ] Create dynamic landing page templates
  - [ ] /hire-supercar-st-albans
  - [ ] /hire-supercar-watford
  - [ ] /hire-supercar-harpenden
  - [ ] /delivery-to-mayfair
- [ ] Implement JSON-LD schema markup
  - [ ] CarRental schema
  - [ ] LocalBusiness schema
  - [ ] AggregateRating (4.9/5 stars)
- [ ] Setup Google My Business
  - [ ] Verify all locations
  - [ ] Add business hours
  - [ ] Upload photos
- [ ] Configure App Store Optimization
  - [ ] Keyword research
  - [ ] Screenshot optimization
  - [ ] Submit to App Store / Google Play
- [ ] Prepare marketing materials
  - [ ] Press release
  - [ ] Social media content calendar
  - [ ] Email templates

---

## 🚨 48 HOURS BEFORE LAUNCH

### Database & Infrastructure
- [ ] **BACKUP**: Full production database backup (test restore)
- [ ] Verify Vercel scaling settings
  - [ ] Max CPU: Auto-scale enabled
  - [ ] Timeout: 30 seconds
  - [ ] Memory: 3GB
- [ ] Check Supabase row limits (free tier = 500K rows)
  - [ ] If approaching limit, prepare upgrade to paid
- [ ] Verify API key quotas
  - [ ] Gemini: 12.5M tokens/month
  - [ ] Google Maps: Check daily usage limit
  - [ ] SendGrid: 100 free emails/day

### Code & Testing
- [ ] Run full test suite: `npm run test`
  - [ ] ✅ **ALL TESTS PASSING** (100%)
- [ ] Run E2E tests: `npm run test:e2e`
  - [ ] ✅ **ALL SCENARIOS PASSING**
- [ ] Lint check: `npm run lint`
  - [ ] ✅ **ZERO ERRORS**
- [ ] Type check: `npm run type-check`
  - [ ] ✅ **ZERO ERRORS**
- [ ] Build prod: `npm run build`
  - [ ] ✅ **BUILD SUCCESSFUL**
- [ ] Load test with 100 concurrent users
  - [ ] Response time < 500ms p95
  - [ ] Error rate < 0.1%
  - [ ] Uptime ≥ 99.9%

### Security & Monitoring
- [ ] Verify .env variables are NOT committed
- [ ] Run security scan (OWASP)
  - [ ] No SQL injection vulnerabilities
  - [ ] No XSS vulnerabilities
  - [ ] CORS properly configured
- [ ] Setup Sentry for error tracking
  - [ ] Test error alert
- [ ] Setup Vercel Analytics
  - [ ] Verify tracking enabled
- [ ] Test incident response
  - [ ] Can you reach on-call lead?
  - [ ] Rollback procedure tested?

### Mobile & Cross-Browser
- [ ] Test on iPhone 12 (Safari)
  - [ ] Booking flow works
  - [ ] Maps display correctly
  - [ ] Push notifications (if applicable)
- [ ] Test on Android 12 (Chrome)
  - [ ] Booking flow works
  - [ ] Maps display correctly
  - [ ] GPS tracking accurate
- [ ] Test on Desktop (Chrome, Firefox, Safari)
- [ ] Verify responsive design (breakpoints: 320px, 768px, 1024px, 1440px)

### Content & Messaging
- [ ] Verify all copy is final (no placeholder text)
- [ ] Check brand consistency
  - [ ] Colors correct (#2C2F33, #00CED1, #89CFF0)
  - [ ] Fonts correct (Arial)
  - [ ] Logo placement
- [ ] Verify testimonials/reviews are accurate
- [ ] Check all CTAs are working

---

## 📅 24 HOURS BEFORE LAUNCH

### Final Verification
- [ ] Vercel environment variables confirmed (recheck)
- [ ] Supabase connection string working
- [ ] API endpoints all responding
- [ ] Database connection pooling working
- [ ] Rate limiting enforced

### Social Media Prep
- [ ] 3x launch tweets drafted (12pm, 3pm, 6pm UTC+0)
- [ ] Instagram post drafted + image ready
- [ ] LinkedIn post drafted + image ready
- [ ] Email campaign drafted (if list available)

### Stakeholder Comms
- [ ] Notify all team members of launch time
- [ ] Send on-call rotation schedule
- [ ] Brief support team on common issues
- [ ] Brief finance on first 7-day metrics to track

### Monitoring Setup
- [ ] Sentry alerts configured
- [ ] Vercel deployment notifications enabled
- [ ] Slack/email alerts setup for errors
- [ ] Dashboard ready for real-time monitoring

---

## 🚀 LAUNCH DAY - MORNING

### T-2 Hours (Before Public Announcement)
- [ ] Check all systems: production health check
- [ ] Verify Sky Concierge is responding
- [ ] Test booking from start to finish
- [ ] Check GPS tracking with test vehicle
- [ ] Confirm email notifications sending

### T-1 Hour
- [ ] Final code push to `main` branch
- [ ] Monitor Vercel deployment logs
  - [ ] Waiting for build: ⏳
  - [ ] Building: ⏳
  - [ ] Deploying: ⏳
  - [ ] Live: ✅
- [ ] Verify deployment successful
- [ ] Test live site at https://mandmautoperformance.com

### T-0 (Launch Time)
- [ ] ✅ **SITE IS LIVE**
- [ ] Complete test booking on live site
- [ ] Verify booking confirmation email sent
- [ ] Check GPS tracking real-time update
- [ ] Confirm admin dashboard accessing data

---

## 🌍 LAUNCH DAY - NOON ONWARDS

### Hour 1 (12:00 PM)
- [ ] Post 1st launch tweet
- [ ] Monitor replies & engagement
- [ ] Check website traffic (Vercel Analytics)
- [ ] Monitor error rate (Sentry)

### Hour 4 (3:00 PM)
- [ ] Post 2nd launch tweet
- [ ] Check first bookings coming in
- [ ] Verify booking confirmations being sent
- [ ] Monitor system performance

### Hour 7 (6:00 PM)
- [ ] Post 3rd launch tweet
- [ ] Post Instagram story/feed post
- [ ] Enable Google My Business promotional post
- [ ] Send press release to local Herts media

### Hour 12 (Midnight)
- [ ] First full day metrics:
  - [ ] Page views: ___
  - [ ] Bookings received: ___
  - [ ] Error count: ___
  - [ ] Uptime: ___
- [ ] All systems stable? ✅ or ⚠️

---

## 📊 DAYS 2-7 (POST-LAUNCH CRITICAL WINDOW)

### Daily Checklist (Each Morning)
- [ ] Check Sentry for errors
- [ ] Review Vercel Analytics
- [ ] Verify uptime > 99%
- [ ] Scan social media mentions
- [ ] Check email/support inquiries
- [ ] Review customer feedback

### Metrics to Track
- **Traffic**: Page views, unique users, bounce rate
- **Conversions**: Bookings, completion rate
- **Technical**: Error rate, API response time, uptime
- **User Sentiment**: NPS, reviews, social mentions
- **Cost**: API usage (Gemini tokens, Google Maps), storage

### Bug Fix Protocol
1. Error occurs → Sentry alert triggered
2. On-call engineer investigates
3. If critical: Hotfix branch created
4. Test fix on staging
5. Merge to main → Auto-deploy to production
6. Verify fix on live site
7. Notify stakeholder

### Escalation Contacts
- **Critical Production Issue**: [Tech Lead Phone]
- **Billing/API Issues**: [DevOps Email]
- **Customer Support Questions**: [Support Manager Email]

---

## ✅ WEEK 2 (STABILIZATION)

- [ ] Monitor daily metrics
- [ ] Respond to all customer support inquiries (< 2 hour SLA)
- [ ] Publish 2-3 customer testimonials
- [ ] Share booking success stories on social media
- [ ] Review and address any UX bugs
- [ ] Check API rate limiting is working
- [ ] Plan Week 3+ features

---

## 🏁 SUCCESS CRITERIA (GO/NO-GO DECISION)

### ✅ GO LIVE IF:
- [ ] Site is live and accessible from anywhere in UK
- [ ] All core features working (Booking, Sky Concierge, GPS tracking)
- [ ] ≥99.5% uptime in first 24 hours
- [ ] 0 critical errors in Sentry
- [ ] Response time < 100ms p95
- [ ] ≥10 bookings in first 24 hours
- [ ] Payment processing working
- [ ] Email confirmations being sent
- [ ] Admin can see all bookings in real-time

### ⛔ DO NOT GO LIVE IF:
- [ ] Booking flow not working end-to-end
- [ ] Sky Concierge not responding
- [ ] GPS tracking not showing vehicle locations
- [ ] Payment processing failing
- [ ] Database connection errors
- [ ] Any critical security vulnerabilities found
- [ ] Load test failed (cannot handle 100 concurrent users)
- [ ] Lighthouse audit < 80 on any metric

---

## 📋 POST-LAUNCH TASKS (WEEK 2-3)

- [ ] Collect first 50 customer reviews
- [ ] Publish ≥10 case studies
- [ ] Optimize based on analytics (heat maps, user sessions)
- [ ] Fix any reported bugs
- [ ] Plan Phase 2 feature rollout
- [ ] Email press release to automotive journalists
- [ ] Setup Facebook / TikTok presence (if not done)
- [ ] Begin local influencer partnerships

---

## 💰 COST TRACKING (First Month)

| Item | Budget | Actual | Notes |
|------|--------|--------|-------|
| Vercel Pro | £30 | | |
| Supabase Paid | £75 | | Migrate from free if over row limit |
| Google Maps | £50 | | Watch daily usage |
| SendGrid | £40 | | 100 free emails/day (overage costs) |
| Gemini API | £0 | | 12.5M free tokens/month |
| DNS / Domain | £10 | | Yearly |
| **TOTAL** | **£205** | | Plus developer time |

---

## 🔄 Rollback Procedure (If Critical Issue)

**IF SITE IS DOWN:**
1. Notify all stakeholders immediately (Slack, phone calls)
2. Identify critical issue
3. If fixable in < 30 min: Deploy hotfix
4. If > 30 min: Rollback to previous stable version
   ```bash
   git revert HEAD~1
   git push origin main
   # Vercel auto-deploys previous version
   ```
5. Communicate status to customers (Twitter/email)
6. Work on root cause fix while rolled back
7. Re-test thoroughly before deploying fix

---

## 👥 Team Contacts (Critical Hours)

| Role | Name | Phone | Email |
|------|------|-------|-------|
| Tech Lead | | | |
| DevOps | | | |
| QA Lead | | | |
| Product Owner | | | |
| Customer Support | | | |

**On-Call Rotation** (First 2 weeks):
- Week 1: [Name]
- Week 2: [Name]

---

## 📝 Sign-Off

**Launch Manager**: _________________ Date: _______
**Tech Lead**: _________________ Date: _______
**Product Owner**: _________________ Date: _______

---

**Last Updated**: April 3, 2026
**Status**: READY FOR EXECUTION ✅
