# M&M AUTO PERFORMANCE
## ASSETS READY CHECKLIST (Before Week 1 Kickoff)

**This checklist ensures you have everything needed to start development immediately.**

---

## 🖼️ VISUAL ASSETS

**Status**: 🟢 **GENERATION GUIDE READY** — Use `IMAGE_GENERATION_QUICK_START.md` for step-by-step instructions
**Detailed Prompts**: See `VISUAL_ASSET_GENERATION_GUIDE.md` for complete AI generation prompts
**Asset Tracker**: See `VISUAL_ASSETS_TRACKER.json` for metadata and status tracking

### Hero Section Images (1920×1080px)
- [ ] 1x Hero main image — Lamborghini Revuelto, Chilterns golden hour
  - Prompt available in VISUAL_ASSET_GENERATION_GUIDE.md
  - High-contrast, Gunmetal + Turquoise color grading
  - Option A: AI generation (DALL-E/Midjourney) — 2-4 hours, £50-150
  - Option B: Professional photographer — 5-7 days, £500-1500
  - Option C: Stock photos — 4-8 hours, £100-300

- [ ] 3x Secondary hero images (carousel rotation)
  - Porsche 911 Turbo S (London night scene)
  - Rolls-Royce Ghost (Hertfordshire estate)
  - Ferrari 296 GTB (Chilterns road)
  - All prompts in VISUAL_ASSET_GENERATION_GUIDE.md

### Fleet Card Images (800×600px, clean white background)
- [ ] Luxury Sedan — Mercedes-Benz S-Class
- [ ] Sports Car — Porsche 911 Carrera S
- [ ] Supercar — Lamborghini Huracán
- [ ] Exotic — Ferrari 488 Pista
- [ ] Premium SUV — Range Rover Sport
- [ ] Convertible — BMW M440i xDrive

**Specs per image:**
- Resolution: **EXACT 800×600px** (component-sized)
- Format: JPG (optimized for web)
- File size: 150-250KB each (use TinyPNG for optimization)
- Background: Clean, professional white (90%+ brightness)
- Lighting: Studio professional, turquoise accent lights on wheels/details
- All prompts in VISUAL_ASSET_GENERATION_GUIDE.md

### Brand Assets
- [ ] Logo (horizontal SVG) — Gunmetal/Turquoise color scheme
- [ ] Logo (vertical SVG) — Scalable vector format
- [ ] Favicon (192×192px PNG, transparent background)
- [ ] Social media profile images (optional for Phase 2)
  - Twitter: 400×400px
  - Instagram: 1080×1080px
  - LinkedIn: 1200×627px

---

## 📝 COPY & CONTENT

### Homepage Copy
- [ ] Hero headline (current: "Elite Performance. Pure Speed.")
- [ ] Hero subheading (current: "Experience high-performance...")
- [ ] 3x Feature section copy (Why Choose M&M)
- [ ] CTA button text ("Book Your Experience" or custom)

### Fleet Descriptions
- [ ] Per-vehicle short description (2-3 sentences)
  - Lamborghini: "Italian legend. Unmistakable presence. Dominate every road."
  - Porsche: "The thinking person's supercar. Engineering perfection."
  - Etc.

### Social Media Content
- [ ] 3x Launch day tweets (pre-drafted, scheduled)
- [ ] 5x Week 1 Instagram posts (captions + hashtags)
- [ ] 2x LinkedIn posts (B2B angle)
- [ ] Press release (200 words, Herts + London focus)

### Email Templates
- [ ] Booking confirmation email
- [ ] Driver Habit Score report (post-trip)
- [ ] Loyalty rewards notification
- [ ] Admin alerts (maintenance, telematics)

---

## 🚗 VEHICLE FLEET DATA

### For Each Vehicle (6+ cars minimum)

**Technical Specs:**
- [ ] Model name & year
- [ ] Horsepower
- [ ] 0-60 time
- [ ] Top speed
- [ ] Engine type
- [ ] Transmission
- [ ] Fuel type

**Rental Specs:**
- [ ] Daily rate (£)
- [ ] Hourly rate (£)
- [ ] Availability status (Available/Booked/Maintenance)
- [ ] Current location (St Albans, Watford, etc.)
- [ ] Features (GPS, Premium Sound, etc.)

**Insurance & Compliance:**
- [ ] Vehicle registration number
- [ ] Insurance expiry date
- [ ] MOT expiry date
- [ ] Last service date
- [ ] Mileage

---

## 🎨 BRAND GUIDELINES CONFIRMATION

### Colors
- [ ] Gunmetal Grey (#2C2F33) — Approved
- [ ] Electric Turquoise (#00CED1) — Approved
- [ ] Baby Blue (#89CFF0) — Approved
- [ ] Secondary colors (if any) — Documented

### Typography
- [ ] Font choices confirmed (Arial recommended)
- [ ] Heading styles locked
- [ ] Body text styles locked
- [ ] Link colors assigned

### Tone & Voice
- [ ] Brand voice documented ("Professional, confident, local")
- [ ] Customer communication style confirmed
- [ ] Social media tone established
- [ ] Email template voice approved

---

## 🔑 API KEYS & CREDENTIALS

### Required (Must-Have Before Week 1)
- [ ] **Google AI Studio** (Gemini 1.5 Flash API key)
  - Sign up at: https://aistudio.google.com/
  - Free: 12.5M tokens/month
  - Copy API key to `.env.local`

- [ ] **Google Maps API** (for vehicle location display)
  - Create at: https://console.cloud.google.com/
  - Enable: Maps JavaScript API, Maps Embed API
  - Set billing + monthly budget (recommend £50)
  - Copy API key to `.env.local`

- [ ] **Supabase Project** (database & auth)
  - Create at: https://app.supabase.com/
  - Create free-tier project
  - Run migrations from schema/
  - Copy URL + ANON_KEY to `.env.local`

- [ ] **GitHub Repository** (code hosting)
  - Create private repo: `mandmautoperformance.com`
  - Add team members
  - Setup branch protection on `main`

- [ ] **Vercel Project** (hosting)
  - Connect GitHub repo to Vercel
  - Add environment variables from `.env.example`
  - Enable auto-deploy on `main` push

### Optional (Nice-to-Have)
- [ ] **SendGrid** (transactional email)
  - Free tier: 100 emails/day
  - For: Booking confirmations, trip reports

- [ ] **Groq API** (AI fallback)
  - Free tier: Good for backup
  - Sign up at: https://console.groq.com/

- [ ] **Sentry** (error tracking)
  - Free tier: 5K events/month
  - Set up for production error alerts

---

## 📋 LEGAL & COMPLIANCE

- [ ] **Insurance documents** (business, liability, fleet)
- [ ] **Terms of Service** (rental agreement template)
- [ ] **Privacy Policy** (GDPR-compliant)
- [ ] **Data Processing Agreement** (for Supabase, Vercel)
- [ ] **Vehicle rental licensing** (check Herts/London requirements)
- [ ] **DVLA checks** (know customer verification)

---

## 👥 TEAM ASSIGNMENTS

### Development Team (Minimum 3 people)
- [ ] **Lead Developer** — Overall architecture, reviews
- [ ] **Backend/Full-Stack Dev** — API, database, authentication
- [ ] **Frontend Dev** — Components, UI, responsive design
- [ ] *(Optional)* **QA Engineer** — Testing, launch verification

### Operations
- [ ] **Product Manager** — Backlog, sprint planning, decisions
- [ ] **DevOps** — Infrastructure, deployment, monitoring
- [ ] **Customer Support Lead** — Day 1 support readiness

### Marketing
- [ ] **Social Media Manager** — Daily posts, engagement
- [ ] **Content Creator** — Copy, testimonials, case studies
- [ ] **PR/Media Relations** — Press releases, journalist outreach

---

## 🔍 PRE-DEVELOPMENT CHECKLIST

### Code Repository
- [ ] GitHub repo created & initialized
- [ ] `.gitignore` configured (ignore `.env.local`, `node_modules/`)
- [ ] `main` branch protection enabled (require PR reviews)
- [ ] Branch naming convention established
- [ ] Commit message template created

### Environment Setup
- [ ] Node.js 18+ installed locally
- [ ] npm/yarn package manager ready
- [ ] `.env.example` copied to `.env.local`
- [ ] All API keys filled in `.env.local`
- [ ] Database migrations tested locally

### Development Tools
- [ ] VSCode (or IDE) with extensions installed
  - Tailwind CSS IntelliSense
  - ESLint
  - Prettier
  - Thunder Client (API testing)
- [ ] Git configured (user.name, user.email)
- [ ] SSH keys set up for GitHub

### Documentation
- [ ] Team has read `MASTER_INSTRUCTION_PROMPT.md`
- [ ] Team has read `AGENTS.md` (project context)
- [ ] Team has read `Build_Guide.docx` (week-by-week plan)
- [ ] Team has shared understanding of timeline

---

## 📊 SUCCESS CRITERIA FOR "WEEK 1 READY"

✅ You're ready to start Week 1 development if:
- [ ] All fleet photos acquired (or AI-generated placeholders ready)
- [ ] All API keys obtained + tested
- [ ] GitHub repo initialized with clean structure
- [ ] `.env.local` fully populated
- [ ] Team members assigned + trained
- [ ] First standup meeting scheduled
- [ ] Vercel + Supabase projects live and connected
- [ ] Everyone has read core documentation

❌ Do NOT start development if:
- [ ] API keys missing (you'll waste time on auth issues)
- [ ] Fleet data incomplete (blocks FleetCard component)
- [ ] GitHub repo not ready (version control chaos)
- [ ] Team doesn't understand timeline (scope creep)
- [ ] Database not initialized (blocks API development)

---

## 🎯 DELIVERABLE BY END OF WEEK 0

Before Week 1 kickoff, deliver:

1. **Fleet Photos Package**
   - All vehicle images (6+ cars) with specs
   - Hero images (3 variations)
   - Brand assets (logo, favicon, socials)

2. **Content Package**
   - Homepage copy approved
   - Fleet descriptions per vehicle
   - Social media content calendar (Week 1-4)
   - Press release

3. **Credentials Package**
   - All API keys documented
   - `.env.local` template filled
   - Database initialized + migrations applied
   - GitHub repo ready

4. **Team Package**
   - All team members onboarded
   - Roles assigned
   - First standup scheduled
   - Slack/comms channel created

5. **Sign-Off**
   - Product Owner approval
   - Tech Lead sign-off
   - Launch Manager ready

---

## 📞 WEEK 0 MEETINGS

- [ ] **Kickoff Meeting (1 hour)**
  - Overview of `MASTER_INSTRUCTION_PROMPT.md`
  - Timeline walk-through
  - Q&A

- [ ] **Dev Setup Workshop (2 hours)**
  - Clone repo, install dependencies
  - Configure `.env.local`
  - Test local development environment
  - First component build (Navbar.tsx)

- [ ] **Stakeholder Briefing (1 hour)**
  - Share Master Roadmap
  - Review timeline + budget
  - Set expectations
  - Q&A

- [ ] **Week 1 Sprint Planning (1 hour)**
  - Review Build Guide Week 1 tasks
  - Assign tickets in project board
  - Set daily standup time

---

## 💾 FINAL HANDOFF (Sign Off Below)

Once all items are checked, sign here:

**Development Lead**: _________________ Date: _______
**Product Owner**: _________________ Date: _______
**Operations Lead**: _________________ Date: _______

---

## NEXT STEP: Week 1 Kickoff 🚀

Once this checklist is complete, you're cleared for launch.

**Reference:** See `Build_Guide.docx` for Week 1 detailed tasks.

---

**Generated:** April 3, 2026
**Status:** 🟢 READY FOR SIGN-OFF
