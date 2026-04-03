# 🚀 M&M PERFORMANCE - FINAL GO-LIVE CHECKLIST
## Complete Setup from Server to Google Rankings

**Status:** ✅ ALL CODE & INFRASTRUCTURE READY  
**Next Action:** Run this checklist to go fully LIVE

---

## PHASE 1: SERVER & DOMAIN (DONE - Verify)

- [ ] Server running at 161.97.76.221
- [ ] Domain mandmautoperformance.com points to server
- [ ] HTTPS/SSL working (https://mandmautoperformance.com)
- [ ] App running with PM2: `pm2 status` shows "online"
- [ ] Environment variables set: `.env.local` configured
- [ ] No errors in logs: `pm2 logs mandm-performance`

**Verify command:**
```bash
curl -I https://mandmautoperformance.com
# Should return: HTTP/2 200
```

---

## PHASE 2: SEARCH ENGINES (Do This TODAY - 30 mins)

### ✅ Google Search Console
```
1. Go to: https://search.google.com/search-console
2. Add property: mandmautoperformance.com
3. Verify via DNS TXT record
4. Submit sitemap: /sitemap.xml
5. Request crawl: index home page
```

**In 24 hours:** Check "Coverage" to see pages indexed

### ✅ Google Analytics 4
```
1. Go to: https://analytics.google.com
2. Create new GA4 property
3. Get Measurement ID (G-XXXXXXXXXX)
4. Update server: NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX in .env.local
5. Restart: pm2 restart mandm-performance
```

### ✅ Bing Webmaster
```
1. Go to: https://www.bing.com/webmasters
2. Add site: mandmautoperformance.com
3. Verify ownership
4. Submit sitemap
```

**Result:** Site indexed in Google, Bing, Yahoo within 24 hours

---

## PHASE 3: LEGAL & COMPLIANCE (Do This TODAY - 15 mins)

- [ ] Privacy Policy live: `/privacy`
- [ ] Terms & Conditions live: `/terms`
- [ ] Cookie Policy live: `/cookie-policy`
- [ ] Robots.txt accessible: `/robots.txt`
- [ ] Sitemap accessible: `/sitemap.xml`
- [ ] RSS Feed working: `/rss.xml`

**Test:**
```bash
curl https://mandmautoperformance.com/privacy | head -20
curl https://mandmautoperformance.com/robots.txt
```

---

## PHASE 4: PERFORMANCE OPTIMIZATION (Do This TODAY - 20 mins)

### Check Page Speed
```
1. Visit: https://pagespeed.web.dev/
2. Enter: mandmautoperformance.com
3. Target: >90 score
4. Fix issues shown
```

**Quick wins if score < 90:**
- Compress images
- Enable caching headers
- Minify CSS/JS
- Remove unused fonts

### Core Web Vitals
```
1. Open Chrome DevTools (F12)
2. Go to Lighthouse tab
3. Run "Mobile" audit
4. Fix issues (usually images, fonts)
```

---

## PHASE 5: MOBILE APP (This Week)

### Option A: PWA (Easiest - Do First)
```bash
npm install next-pwa
# Add to next.config.js (already done in code)
npm run build
pm2 restart mandm-performance

# Users can now:
# - Visit site
# - "Install App" button appears
# - Install like native app
```

### Option B: Google Play Store (Android)
Follow: `MOBILE_APP_LAUNCH.md` - Phase: Google Play Store  
**Time:** 1 day setup + 1-3 hours review = 1 day total

### Option C: Apple App Store (iOS)
Follow: `MOBILE_APP_LAUNCH.md` - Phase: Apple App Store  
**Time:** 1 day setup + 24-48 hours review = 2 days total

**Recommended:** Do PWA first (instant), then Play/App Store

---

## PHASE 6: INITIAL MARKETING (This Week)

### Social Media Links
- [ ] LinkedIn: Link to mandmautoperformance.com
- [ ] Instagram: Add link to bio
- [ ] Twitter: Share launch announcement
- [ ] Facebook: Create page, add website

**Template Post:**
```
🚀 LIVE NOW: M&M Performance

Premium AI-powered vehicle rental in London & Hertfordshire

✨ Features:
- Driver's Passport gamification system
- Instant booking with AI concierge
- 25+ luxury vehicles
- Same-day delivery

Book now: mandmautoperformance.com
```

### Email Campaign
- [ ] List all contacts
- [ ] Create launch email
- [ ] Send to 50+ prospects
- [ ] Track opens & clicks

### Local Listings
- [ ] Google My Business: https://business.google.com
- [ ] Yell.com (UK business directory)
- [ ] Trustpilot: Add business profile
- [ ] TripAdvisor: List services

---

## PHASE 7: ANALYTICS SETUP (Do This Week)

### Google Analytics 4
- [ ] Events tracking configured
- [ ] Booking conversions tracked
- [ ] Goals set up
- [ ] E-commerce items configured

**Events to track:**
```
- page_view
- booking_start
- booking_complete
- booking_cancelled
- fleet_viewed
- ai_concierge_opened
- driver_passport_viewed
```

### Setup Alerts
```
In GA4:
1. Conditions → Booking conversion > 10 in a day
2. Alerting → Create alert
3. Email: your@email.com
```

---

## PHASE 8: SECURITY CHECKLIST (Do ASAP)

⚠️ **API KEYS ROTATION - CRITICAL**

Your API keys are now deployed and could be exposed. Immediately:

### Supabase
```
1. Go to: https://app.supabase.com
2. Select project: ratyazffxlppzurfokxp
3. Settings → API → Anon Key
4. Click ⟲ to regenerate
5. Copy new key
6. SSH to server: ssh root@161.97.76.221
7. Edit .env.local: nano /var/www/mandmautoperformance/.env.local
8. Update NEXT_PUBLIC_SUPABASE_ANON_KEY=<new-key>
9. Restart: pm2 restart mandm-performance
```

### Google API Key
```
1. Go to: https://console.cloud.google.com
2. APIs → Credentials
3. Delete old API key
4. Create new key
5. Restrict to:
   - Geocoding API
   - Vision API
   - Maps API
6. Update on server as above
7. Restart PM2
```

---

## PHASE 9: SEO CONTENT CREATION (This Month)

### Blog Posts to Create

**Week 1:** Ultimate Guides
```
1. "Complete Guide to Luxury Car Rental in London (2026)"
   - 2000+ words
   - Includes: Types of cars, pricing, booking tips
   - Keywords: luxury car hire London

2. "Executive Car Rental vs Self-Drive: Complete Comparison"
   - 1500+ words
   - Keywords: executive car rental
```

**Week 2:** Local Guides
```
3. "Hertfordshire Weekend Escape: Best Routes & Rentals"
   - 1500+ words
   - Keywords: car rental Hertfordshire

4. "London Airport Transfers: Premium Transportation Guide"
   - 1500+ words
   - Keywords: airport car rental London
```

**Week 3:** How-to Articles
```
5. "How to Book a Luxury Car: Step-by-Step Guide"
   - 1000+ words
   - Keywords: book luxury car
```

### Publishing
- [ ] Create `/blog` directory
- [ ] Write 5 posts (1,500-2,000 words each)
- [ ] Publish on schedule (1 per week)
- [ ] Add internal links to booking page
- [ ] Share on social media

**Result:** Expect 500-2,000 monthly visits from blog after 2-3 months

---

## PHASE 10: RANKINGS MONITORING (Ongoing)

### Monthly Check-In (Set Calendar Reminder)

**1st of each month:**
```bash
# Check rankings on your target keywords
# Go to: https://www.google.com/search?q=luxury+car+hire+london

# Track in spreadsheet:
| Keyword | Rank | Change | Traffic |
|---------|------|--------|---------|
| luxury car hire london | 45 | ↑ | 23 |

# Check Analytics
# Check Search Console
# Check Backlinks (Ahrefs/SEMrush if using paid tools)
```

### Target Timeline
```
Month 1: 100-500 visits
Month 2: 500-1,500 visits
Month 3: 1,000-3,000 visits
Month 4: 1,500-4,000 visits
Month 6: 3,000-10,000 visits
```

---

## PHASE 11: INFRASTRUCTURE MONITORING (Ongoing)

### Daily
- [ ] Check server health: `pm2 status`
- [ ] Monitor logs: `pm2 logs` (watch for errors)
- [ ] Check uptime

### Weekly
- [ ] Test booking flow end-to-end
- [ ] Check page speed (PageSpeed Insights)
- [ ] Review Google Analytics
- [ ] Check for crawl errors in Search Console

### Monthly
- [ ] Full security audit
- [ ] Backup check
- [ ] Update dependencies: `npm update`
- [ ] Performance audit
- [ ] SEO audit

---

## READY-TO-EXECUTE COMMANDS

### Verify Everything is Live
```bash
# 1. Check server
curl -I https://mandmautoperformance.com

# 2. Check app running
ssh root@161.97.76.221
pm2 status

# 3. Check DNS
nslookup mandmautoperformance.com
# Should return: 161.97.76.221

# 4. Check SSL
openssl s_client -connect mandmautoperformance.com:443

# 5. Check Google can see you
site:mandmautoperformance.com
# In Google search - should return your pages
```

### One-Command Update
```bash
# When you push new code to GitHub:
ssh root@161.97.76.221
cd /var/www/mandmautoperformance
bash UPDATE_SERVER.sh
# Done! New code deployed
```

---

## SUCCESS METRICS

### Launch Week
- [ ] ✅ Site loads in <2 seconds
- [ ] ✅ SSL/HTTPS working
- [ ] ✅ Mobile responsive
- [ ] ✅ All pages load without errors
- [ ] ✅ Booking flow works end-to-end

### Month 1
- [ ] ✅ Google crawled your site (Search Console)
- [ ] ✅ Some pages indexed (usually 10-50)
- [ ] ✅ Receiving search traffic
- [ ] ✅ Analytics showing visitors
- [ ] ✅ 5+ blog posts published

### Month 3
- [ ] ✅ 20+ pages indexed in Google
- [ ] ✅ Ranking for long-tail keywords (position 50+)
- [ ] ✅ 1,000+ monthly visits
- [ ] ✅ 5-10 bookings from organic search
- [ ] ✅ Reviews starting to come in

### Month 6
- [ ] ✅ Top 20 rankings for medium keywords
- [ ] ✅ 5,000+ monthly visits
- [ ] ✅ 50+ reviews on Google/Trustpilot
- [ ] ✅ Mobile app downloaded 1,000+ times

---

## 🎯 QUICK-START (If You Want to Launch TODAY)

**In 2 hours you can be fully live:**

```bash
# 1. Verify server (5 mins)
curl https://mandmautoperformance.com

# 2. Add to Google Search Console (10 mins)
# Follow PHASE 2 above

# 3. Add to Google Analytics (10 mins)
# Follow PHASE 2 above

# 4. Set up Google My Business (15 mins)
# Go to: https://business.google.com

# 5. Publish to social media (20 mins)
# LinkedIn, Twitter, Instagram

# 6. Check page speed (10 mins)
# Go to: https://pagespeed.web.dev/

# 7. Request Google index (5 mins)
# Search Console → URL Inspection → Request Indexing

DONE! ✅ You're live and Google knows about you
```

**Result:** Site indexed and ranking within 24-48 hours

---

## SUPPORT CONTACTS

**Issues?**
- Check logs: `pm2 logs`
- Server help: SSH as root, run diagnostic
- Deploy issues: Check GitHub commits
- SEO issues: Check Search Console

**Documentation:**
- Server guide: `SERVER_DEPLOYMENT_GUIDE.md`
- SEO guide: `SEO_IMPLEMENTATION_GUIDE.md`
- Mobile: `MOBILE_APP_LAUNCH.md`
- GitHub repo: https://github.com/richhabits/mandmautoperformance.com

---

**Ready? Start with PHASE 1-2 verification, then go live! 🚀**

