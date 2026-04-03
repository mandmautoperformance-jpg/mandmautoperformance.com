# 🤖 Agent Intelligence & Context (AGENTS.md)

## Project Overview
**M&M Auto Performance** is a 2026 elite automotive rental platform targeting the London & Hertfordshire corridor. We combine AI-powered automation, real-time booking, and a "Rich Habits" philosophy of rewarding disciplined drivers.

**Repository**: `https://github.com/richhabits/mandmautoperformance.com.git`
**Organization**: `richhabits`
**Branch**: `main`
**Environment**: 2026 Next.js High-Performance Production

---

## Branding & Visual Identity

### Color System
- **Gunmetal Grey** (`#23272E`): Foundation, backgrounds, professionalism, stealth
- **Electric Turquoise** (`#00F5FF`): Primary actions, CTAs, performance indicators, booking flow
- **Baby Blue** (`#89CFF0`): AI features, trust badges, informational elements, status

### Typography & Styling
- **Framework**: Next.js 15 (React 19) with App Router
- **Styling**: Tailwind CSS with custom performance theme
- **Animations**: Framer Motion for smooth transitions
- **Icons**: Lucide React for consistent iconography

---

## Key Platform Features

### 1. **AI Sky Concierge** (24/7 Automated Service)
- Instant booking with document verification
- Real-time availability checks
- Natural language interface (Claude 3.5 Sonnet)
- Multi-step booking flow with instant confirmation
- Uses Baby Blue palette for "trusted AI" feeling

### 2. **Fleet Telemetry & Tracking**
- Real-time vehicle location on map
- Driver Habit Score (discipline-based rewards)
- Performance metrics and analytics
- Fleet management dashboard for admins

### 3. **Dynamic London-Herts Pricing**
- Real-time rate adjustment based on demand
- Location-based pricing (Mayfair, St Albans, Watford, Radlett)
- Surge pricing during peak hours
- Loyalty discounts for repeat customers

### 4. **GitHub-Integrated Admin**
- Admin triggers deployments via repo actions
- CI/CD pipeline with Vercel
- Automated site updates from GitHub commits

---

## Architecture & Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **React Version**: React 19
- **Styling**: Tailwind CSS v4
- **State Management**: React Context + Zustand (for complex state)
- **Animation**: Framer Motion
- **HTTP Client**: Fetch API + SWR for data fetching
- **Forms**: React Hook Form + Zod validation

### Backend & Services
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (JWT-based)
- **Storage**: Supabase Storage (for document uploads)
- **Real-time**: Supabase Realtime (for live tracking)
- **File Processing**: Sharp for image optimization

### AI & Automation
- **AI Provider**: Vercel AI SDK with Claude 3.5 Sonnet + GPT-4o fallback
- **Document Verification**: Custom AI model trained on UK driving docs
- **Chat**: Real-time chat via Supabase Edge Functions
- **LLM Integration**: Streaming responses for Concierge

### DevOps & Deployment
- **Hosting**: Vercel (automatic deployments on push to `main`)
- **CI/CD**: GitHub Actions
- **Environment Variables**: Managed in Vercel dashboard
- **Database Migrations**: Supabase CLI
- **Monitoring**: Vercel Analytics + Sentry (error tracking)

---

## Directory Structure

```
mandmautoperformance.com/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── booking/
│   │   │   └── [id]/page.tsx   # Booking detail
│   │   ├── fleet/
│   │   │   └── page.tsx        # Fleet listing
│   │   ├── dashboard/
│   │   │   ├── user/page.tsx   # User dashboard
│   │   │   └── admin/page.tsx  # Admin dashboard
│   │   └── api/                # API routes
│   │       ├── bookings/       # Booking endpoints
│   │       ├── vehicles/       # Fleet endpoints
│   │       ├── verify-docs/    # Document verification
│   │       └── telemetry/      # Real-time tracking
│   ├── components/             # Reusable React components
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── FleetCard.tsx
│   │   ├── BookingWidget.tsx
│   │   ├── AIConcierge.tsx
│   │   ├── AdminPanel.tsx
│   │   └── ...
│   ├── lib/                    # Utility functions
│   │   ├── supabase.ts         # Supabase client
│   │   ├── ai.ts               # AI SDK wrapper
│   │   ├── validation.ts       # Zod schemas
│   │   └── ...
│   └── styles/
│       └── globals.css         # Global styles
├── public/                     # Static assets
├── .env.example                # Environment template
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript config
├── next.config.js              # Next.js config
├── package.json
├── AGENTS.md                   # This file (AI context)
├── API.md                      # API documentation
├── COMPONENT_LIBRARY.md        # Component specifications
└── README.md                   # Project overview
```

---

## Development Standards

### Code Quality
- **Language**: TypeScript (strict mode)
- **Formatting**: Prettier with 2-space indent
- **Linting**: ESLint with strict config
- **Git**: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, etc.)
- **Branch Protection**: `main` branch requires PR reviews

### Component Development
- All UI components must be:
  - **Responsive**: Mobile-first, tested at 320px, 768px, 1024px, 1440px
  - **Accessible**: WCAG 2.1 AA compliant (color contrast, keyboard nav, ARIA)
  - **Performant**: Memoized, lazy-loaded where appropriate
  - **Typed**: Full TypeScript with JSDoc comments
  - **Tested**: Unit tests (Jest) + Storybook documentation

### Styling Rules
- **No inline styles**: Always use Tailwind utility classes
- **Custom CSS**: Only in `globals.css` for resets/fundamentals
- **Dark mode**: Already built-in (all components use dark theme)
- **Color system**: Use `performance-*` custom colors, never hardcoded hex
- **Animations**: Use Framer Motion for all transitions

### API Endpoints
- **Pattern**: `/api/[resource]/[action]`
- **Authentication**: JWT Bearer token (Supabase Auth)
- **Response Format**: `{ data?: T; error?: string; status: number }`
- **Rate Limiting**: 100 requests per minute per user
- **Validation**: Zod schemas for all inputs

---

## Key Workflows

### AI Concierge Flow
1. User opens chat widget
2. AI Concierge greets with availability & options
3. User describes needs (dates, vehicle type, passengers)
4. AI suggests options and prices
5. User confirms, proceeds to document upload
6. AI verifies documents (license, insurance, ID)
7. Auto-booking created on verification success
8. Confirmation email + receipt sent

### Admin Deployment Flow
1. Make changes locally, commit with `git commit -m "feat: new booking flow"`
2. Push to `main` branch
3. GitHub Actions run tests & lint
4. Vercel builds and deploys automatically
5. Admin can trigger rollback via GitHub if needed

### Real-time Telemetry
1. Vehicle starts trip, sends GPS coordinates every 10 seconds
2. Supabase Realtime updates map in real-time
3. Habit Score calculates based on acceleration, cornering, speed
4. Dashboard displays live metrics
5. Trip ends, analytics compiled and stored

---

## Environment Variables

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxx...

# Vercel AI SDK
OPENAI_API_KEY=sk-xxx...
ANTHROPIC_API_KEY=sk-ant-xxx...

# Admin
ADMIN_SECRET_KEY=xxx...

# Feature Flags
NEXT_PUBLIC_ENABLE_TELEMETRY=true
NEXT_PUBLIC_ENABLE_AI_CONCIERGE=true
```

---

## Performance Benchmarks

- **Page Load**: < 2 seconds (Lighthouse target: 90+)
- **Booking Flow**: < 60 seconds from open to confirmation
- **Document Verification**: < 2 minutes (AI processing)
- **Map/Telemetry**: Real-time updates < 200ms
- **Database Queries**: < 100ms (with caching)

---

## Testing & QA

### Test Coverage
- **Unit Tests**: Components, utilities (Jest)
- **Integration Tests**: API endpoints, booking flow (Playwright)
- **E2E Tests**: Full user journeys (Cypress)
- **Accessibility Tests**: Axe + manual WCAG audit

### Staging Workflow
1. Create feature branch: `git checkout -b feat/new-feature`
2. Develop & test locally
3. Push to GitHub, create PR
4. Automatic deploy to preview URL
5. Test on preview, get approval
6. Merge to `main` for production deployment

---

## Monitoring & Debugging

### Error Tracking
- **Sentry**: Catches frontend errors in production
- **Vercel Analytics**: Tracks performance metrics
- **Supabase Logs**: Database & API logs

### Developer Tools
- **React DevTools**: Component inspection
- **Next.js Debug Mode**: `npm run dev -- --debug`
- **Supabase Studio**: Direct database access

---

## Brand Voice & Messaging

### Tone
- **Professional yet personable**: Confident without being arrogant
- **Fast & action-oriented**: "Get it done" mentality
- **Trustworthy & transparent**: No hidden fees, clear pricing

### Key Messages
- "Elite Performance. Pure Speed."
- "AI-Powered. Instantly Verified. Habit-Rewarded."
- "For the disciplined, the fast, and the elite."

### AI Concierge Persona
- Name: "Sky"
- Personality: Professional concierge, warm but efficient
- Communication: Natural, helpful, never robotic
- Colors: Baby Blue (AI trust indicator)

---

## Security Considerations

- **Authentication**: All endpoints require valid JWT
- **Sensitive Data**: Never log API keys, passwords, or card numbers
- **CORS**: Only allow `mandmautoperformance.com` + admin subdomains
- **SQL Injection**: All queries parameterized via Supabase ORM
- **CSRF Protection**: SameSite cookies, CSRF tokens on forms
- **Rate Limiting**: 100 req/min per user, 1000 req/min per IP

---

## Quick Start for AI Agents

### Setup
```bash
git clone https://github.com/richhabits/mandmautoperformance.com.git
cd mandmautoperformance.com
npm install
cp .env.example .env.local  # Fill with Vercel/Supabase credentials
npm run dev  # Start dev server on http://localhost:3000
```

### Making Changes
```bash
# Create feature branch
git checkout -b feat/your-feature

# Make changes following standards above
# ...

# Test locally
npm run test
npm run lint

# Commit with conventional message
git commit -m "feat: add new booking flow"

# Push and create PR
git push -u origin feat/your-feature
```

### Key Files to Understand First
1. `src/app/layout.tsx` — Root layout (where Navbar, AIConcierge live)
2. `src/components/` — Component library (start here for building)
3. `tailwind.config.ts` — Brand colors and custom configuration
4. `src/lib/supabase.ts` — Database client setup
5. `COMPONENT_LIBRARY.md` — Full component specs

---

## Success Metrics

- **Booking Completion Rate**: > 75%
- **Average Booking Time**: < 3 minutes
- **Customer Satisfaction**: NPS > 70
- **Uptime**: 99.9%
- **AI Verification Accuracy**: > 99.5%
- **Document Processing Time**: < 2 minutes

---

**Last Updated**: April 3, 2026
**Maintained By**: M&M Auto Performance Development Team
**Contact**: dev@mandmautoperformance.com
