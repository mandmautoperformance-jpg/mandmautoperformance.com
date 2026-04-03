# M&M Auto Performance
## Day 1 Action Checklist

**Today's Date**: April 3, 2026
**Mission**: Get images ordered + infrastructure started
**Goal by End of Day**: Visual assets in progress, GitHub/Vercel/Supabase live
**Time to Complete**: 4-6 hours of active work

---

## ⏱️ TIMELINE

- **Hour 0-1** (NOW): Make decision on images
- **Hour 1-3**: Start image generation OR hire designer
- **Hour 3-4**: Setup infrastructure
- **Hour 4-6**: Team onboarding
- **EOD**: Report status to stakeholders

---

## 🎨 STEP 1: DECIDE ON IMAGES (15 minutes)

Choose ONE:

### Option A: AI Generation (Recommended - Fastest ⚡)
- **Tool**: DALL-E 3 or Midjourney
- **Time**: 2-4 hours
- **Cost**: £50-150
- **Action NOW**:
  - [ ] Go to openai.com (DALL-E) or midjourney.com
  - [ ] Sign up / log in
  - [ ] Open `IMAGE_GENERATION_QUICK_START.md`
  - [ ] Copy first prompt from `VISUAL_ASSET_GENERATION_GUIDE.md`
  - [ ] Generate Hero Main Image (Lamborghini)
  - [ ] Request 3 variations, pick best
  - [ ] Download JPG (1920×1080px)
  - [ ] Repeat for remaining hero + fleet images
  - **Parallel**: Start infrastructure setup below while waiting for generations

### Option B: Professional Photographer
- **Tool**: Fiverr, Upwork, or local photographer
- **Time**: 5-7 days
- **Cost**: £500-1,500
- **Action NOW**:
  - [ ] Go to fiverr.com (search "automotive product photography")
  - [ ] Or post on upwork.com (Automotive Photography category)
  - [ ] Use brief from `IMAGE_GENERATION_QUICK_START.md`
  - [ ] Attach `VISUAL_ASSET_GENERATION_GUIDE.md`
  - [ ] Set budget £500-1,500, timeline 5-7 days
  - [ ] Order now (photographer will deliver by April 10)

### Option C: Stock Photos
- **Tool**: Shutterstock, Getty, iStock
- **Time**: 4-8 hours
- **Cost**: £100-300 (licenses)
- **Action NOW**:
  - [ ] Go to shutterstock.com
  - [ ] Search "luxury car professional photography white background"
  - [ ] Download 10 professional automotive images
  - [ ] Post-process in Photoshop/Lightroom (add turquoise accents)
  - [ ] Crop to 800×600 and 1920×1080 as needed

**👉 DECISION**: Which option will you choose? **_____________**

---

## 💻 STEP 2: INFRASTRUCTURE SETUP (Parallel to Image Generation)

### 2.1: GitHub Repository (10 minutes)

- [ ] Go to github.com (login or create account)
- [ ] Click "New repository"
  - Name: `mandmautoperformance.com`
  - Description: "AI-powered luxury car rental platform"
  - Privacy: Private
  - Add README.md: Yes
  - Add .gitignore: Node
  - License: MIT
- [ ] Click "Create repository"
- [ ] Copy clone URL: `git clone https://github.com/richhabits/mandmautoperformance.com.git`
- [ ] Save this URL for dev team

### 2.2: Vercel Project (10 minutes)

- [ ] Go to vercel.com (login or create account)
- [ ] Click "New Project"
- [ ] Import GitHub repo: `mandmautoperformance.com`
- [ ] Framework Preset: Next.js
- [ ] Configure Project Name: `mandmautoperformance`
- [ ] Environment Variables: Leave for later (we'll add after API keys)
- [ ] Click "Deploy"
- [ ] Wait for build to complete
- [ ] Note your preview URL: `https://mandmautoperformance.vercel.app`

### 2.3: Supabase Project (10 minutes)

- [ ] Go to app.supabase.com (login or create account)
- [ ] Click "New Project"
  - Name: `mandmautoperformance`
  - Database Password: [Create strong password, save securely]
  - Region: eu-west-1 (London - closest to Herts)
- [ ] Click "Create new project"
- [ ] Wait for setup (2-3 minutes)
- [ ] Go to Project Settings → API
  - [ ] Copy `Project URL` (save to `.env.local`)
  - [ ] Copy `Anon Key` (save to `.env.local`)
  - [ ] Copy `Service Role Key` (save securely, don't commit)

### 2.4: API Keys (20 minutes)

**Gemini API (Free - 12.5M tokens/month)**
- [ ] Go to aistudio.google.com
- [ ] Click "Get API key"
- [ ] Create new API key
- [ ] Copy key: `GEMINI_API_KEY`
- [ ] Save to `.env.local`

**Google Maps API (£50 budget)**
- [ ] Go to console.cloud.google.com
- [ ] Create new project: "M&M Auto"
- [ ] Enable APIs: Maps JavaScript API, Maps Embed API
- [ ] Create API key
- [ ] Set monthly budget: £50
- [ ] Copy key: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- [ ] Save to `.env.local`

### 2.5: Local Environment Setup (10 minutes)

**On your computer**:
```bash
# Clone repo
git clone https://github.com/richhabits/mandmautoperformance.com.git
cd mandmautoperformance.com

# Copy environment template
cp .env.example .env.local

# Edit .env.local with your credentials:
# NEXT_PUBLIC_SUPABASE_URL = [from Supabase]
# NEXT_PUBLIC_SUPABASE_ANON_KEY = [from Supabase]
# GEMINI_API_KEY = [from Google AI Studio]
# NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = [from Google Cloud]

# Install dependencies
npm install

# Start development server
npm run dev
```

**Verify**: Open http://localhost:3000
- [ ] Site loads without errors
- [ ] Components visible (Navbar, Hero, etc.)
- [ ] No console errors
- [ ] Note: Images will be placeholders for now

---

## 👥 STEP 3: TEAM SETUP (Parallel to Above)

### 3.1: Assign Team Roles

- [ ] **Development Lead** (Overall architecture, reviews)
  - Name: _________________
  - Email: _________________

- [ ] **Backend/Full-Stack Developer** (API, database, auth)
  - Name: _________________
  - Email: _________________

- [ ] **Frontend Developer** (Components, UI, responsive)
  - Name: _________________
  - Email: _________________

- [ ] **DevOps Engineer** (Infrastructure, deployment)
  - Name: _________________
  - Email: _________________

- [ ] **Product Manager** (Backlog, decisions, sprints)
  - Name: _________________
  - Email: _________________

- [ ] **QA Engineer** (Optional but recommended)
  - Name: _________________
  - Email: _________________

### 3.2: Share Documentation

**Email to Development Lead:**
```
Subject: M&M Auto Performance - Complete Build Package

Hi [Dev Lead],

Here are all the technical documents for the M&M Auto project:

📚 READ THESE FIRST:
1. AGENTS.md (architecture, standards, tech stack)
2. Build_Guide.docx (week-by-week breakdown)
3. COMPONENT_LIBRARY.md (component specs)

📋 REFERENCE DURING BUILD:
4. API.md (REST API specification)
5. GIT_SETUP.md (git workflow)
6. LAUNCH_CHECKLIST.md (go-live procedures)

💻 ACCESS GITHUB REPO:
https://github.com/richhabits/mandmautoperformance.com

🚀 START:
1. Clone repo
2. npm install
3. Copy .env.example to .env.local
4. Fill with API keys (I'll send separately)
5. npm run dev
6. Report any setup issues

Timeline: Week 1 kickoff on [DATE], 9-week execution plan.

Thanks!
```

**Email to Product Manager:**
```
Subject: M&M Auto Performance - Master Roadmap & Strategy

Hi [PM],

Here's your complete project roadmap:

📊 STRATEGY:
1. MASTER_INSTRUCTION_PROMPT.md (source of truth)
2. EXECUTIVE_DELIVERY_SUMMARY.md (business overview)
3. Master_Roadmap.xlsx (project timeline + budget)

📋 EXECUTION:
4. Build_Guide.docx (week-by-week tasks)
5. LAUNCH_CHECKLIST.md (go-live procedures)

💰 FINANCIAL:
- Investment: £36,255 (12 weeks)
- Break-even: Month 2-3
- Projected margin: 70% gross, 50% net

🎯 KEY DATES:
- Week 1 kickoff: [DATE]
- MVP go-live: End of Week 3
- Full launch: End of Week 9

First standup: [DATE/TIME]

Thanks!
```

### 3.3: Schedule Meetings

- [ ] **Week 1 Kickoff Meeting** (1 hour)
  - When: [SET DATE - suggest tomorrow or next Mon]
  - Who: All team + stakeholders
  - Agenda: Project overview, timeline, expectations, Q&A

- [ ] **Dev Environment Setup Workshop** (2 hours)
  - When: [SET DATE - 1 day after kickoff]
  - Who: Dev team only
  - Agenda: Clone repo, npm install, .env setup, first test

- [ ] **Daily Standup** (15 min)
  - When: 9:30am daily (starting Week 1)
  - Format: Yesterday/Today/Blockers
  - Who: Dev team + PM

---

## ✅ CHECKLIST - COMPLETE BY EOD TODAY

### Images
- [ ] Chosen method: **______________**
- [ ] If AI: Generated at least 1 image, uploading rest tonight
- [ ] If Designer: Hired on Fiverr/Upwork, delivery 5-7 days
- [ ] If Stock: Downloaded 10+ professional automotive photos

### GitHub
- [ ] Repository created
- [ ] Initialized with README, .gitignore, LICENSE
- [ ] Clone URL saved: ________________

### Vercel
- [ ] Project created and linked to GitHub
- [ ] First deploy successful
- [ ] Preview URL saved: ________________

### Supabase
- [ ] Project created
- [ ] Database initialized
- [ ] Project URL noted: ________________
- [ ] Anon Key noted: ________________

### API Keys
- [ ] Gemini API key obtained: ✅
- [ ] Google Maps API key obtained: ✅
- [ ] Budget set on Google Maps: £50/month ✅

### Local Environment
- [ ] Repo cloned to computer
- [ ] Dependencies installed (npm install ✅)
- [ ] .env.local created and filled ✅
- [ ] npm run dev works on http://localhost:3000 ✅

### Team
- [ ] All roles assigned (6 people or fewer)
- [ ] GitHub invites sent to dev team
- [ ] Documentation shared with all
- [ ] Week 1 kickoff meeting scheduled

### Status Report
- [ ] Ready to share with stakeholders: ✅

---

## 📊 REPORT STATUS TO STAKEHOLDERS

**Send this email EOD:**

```
Subject: M&M Auto Performance - Week 0 Status Report ✅

Project Status: 🟢 ON TRACK

COMPLETED TODAY (April 3, 2026):
✅ All code components built and tested
✅ Complete technical documentation (5 guides)
✅ Complete strategic documentation (7 roadmaps)
✅ GitHub repository created
✅ Vercel project live
✅ Supabase project initialized
✅ API keys obtained (Gemini, Google Maps)
✅ Local development environment working
✅ Team roles assigned and onboarded
✅ Week 1 kickoff scheduled

IN PROGRESS:
🔄 Visual assets (images) - ETA 24 hours
   Method chosen: [AI / Designer / Stock]
   If AI: Generating tonight
   If Designer: Hired, delivery April 8-10
   If Stock: Sourcing from Shutterstock

NEXT MILESTONES:
📅 Week 1 Kickoff: [DATE]
📅 MVP Go-Live: End of Week 3
📅 Full Launch: End of Week 9

INVESTMENT SUMMARY:
💰 Total: £36,255 (over 12 weeks)
💰 Infrastructure: £30/month (Month 1-3)
💰 Break-even: Month 2-3
💰 Projected revenue: £30K-100K by Month 3

TEAM READINESS:
✅ Development Lead: Assigned
✅ Backend Developer: Assigned
✅ Frontend Developer: Assigned
✅ DevOps: Assigned
✅ Product Manager: Assigned
✅ QA (optional): Assigned

All systems go. Ready for Week 1 execution.

Next update: Tomorrow EOD with image status.
```

---

## 🎯 PRIORITY ORDER

**If you only have 2 hours, do these in order:**

1. **Choose image method** (5 min) — Decide: AI, Designer, or Stock?
2. **Setup Supabase** (10 min) — Get DB and API keys
3. **Setup Vercel** (10 min) — Link GitHub, first deploy
4. **Get API keys** (15 min) — Gemini, Google Maps
5. **Clone repo locally** (10 min) — Get it running
6. **Email dev team** (10 min) — Share docs, schedule kickoff
7. **Start image generation** (1+ hours) — First AI image or order photographer

**By end of day: Images ordered, infrastructure live, team onboarded.**

---

## ⚠️ IF YOU GET STUCK

**GitHub issues?**
- Reference: GIT_SETUP.md

**Supabase questions?**
- Go to: supabase.com/docs

**Vercel deployment issues?**
- Check: Vercel dashboard → Deployments → Build logs

**API key problems?**
- Verify: API key in .env.local matches exactly
- Confirm: No extra spaces or quotes

**npm install errors?**
- Try: `npm cache clean --force` then `npm install`

**Still stuck?**
- Review README.md for detailed setup
- Check console for specific error messages
- Share error with dev team for help

---

## 🚀 YOU'RE DONE WHEN...

- [ ] Images are ordered (AI generating, designer hired, or stock photos purchased)
- [ ] GitHub repo is live and cloned
- [ ] Vercel deployment is working
- [ ] Supabase is initialized
- [ ] Local `npm run dev` works
- [ ] API keys are in `.env.local`
- [ ] Team is onboarded
- [ ] Week 1 kickoff meeting is scheduled

**Once all are checked ✅, you're officially ready for Week 1 execution.**

---

## 📞 EMERGENCY CONTACTS

If something is blocking you:

- **Technical issues**: Review AGENTS.md or README.md
- **Component questions**: Check COMPONENT_LIBRARY.md
- **API documentation**: See API.md
- **Git workflow**: Reference GIT_SETUP.md
- **Timeline questions**: Review Master_Roadmap.xlsx

---

**Generated**: April 3, 2026
**Mission**: Infrastructure live + images ordered by EOD
**Next Step**: Week 1 Kickoff (scheduled for [DATE])

🚀 **Let's build this thing.**

---

## QUICK COPY-PASTE: Essential URLs & Credentials Template

```
🔗 GITHUB
Repo: https://github.com/richhabits/mandmautoperformance.com
Clone: git clone https://github.com/richhabits/mandmautoperformance.com.git

🔗 VERCEL
Project: https://vercel.com/dashboard
URL: https://mandmautoperformance.vercel.app (production)

🔗 SUPABASE
Project: https://app.supabase.com
Project URL: [INSERT]
Anon Key: [INSERT]

🔑 API KEYS
GEMINI_API_KEY: [INSERT]
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: [INSERT]

📁 LOCAL
Clone location: [INSERT PATH]
.env.local: [CREATED ✅]
npm run dev: http://localhost:3000

👥 TEAM ASSIGNMENTS
Dev Lead: [NAME]
Backend Dev: [NAME]
Frontend Dev: [NAME]
DevOps: [NAME]
PM: [NAME]
QA: [NAME]

📅 DATES
Week 1 Kickoff: [SET DATE]
Dev Setup Workshop: [SET DATE]
Daily Standup: 9:30am
```

---

**FINAL STEP: Print this checklist, check off items as you go, and report back with completion status.**

🎯 **Target: All items checked ✅ by end of business today.**

Good luck! 🚀
