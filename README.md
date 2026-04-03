# M&M Auto Performance 🏎️

**Elite High-Performance Automotive Rental Platform**
_London & Hertfordshire's Premier AI-Powered Booking Experience_

---

## 🎯 Quick Links

- **Website**: https://mandmautoperformance.com
- **GitHub**: https://github.com/richhabits/mandmautoperformance.com
- **Documentation**: See `AGENTS.md` for AI context
- **Component Library**: See `COMPONENT_LIBRARY.md`
- **API Docs**: See `API.md`

---

## ✨ Features

### 🤖 AI Sky Concierge
24/7 automated booking with instant document verification. Natural language interface powered by Claude 3.5 Sonnet.

### ⚡ Lightning-Fast Booking
Real-time availability, instant document processing (< 2 minutes), and immediate confirmation.

### 📍 Real-time Fleet Tracking
Live GPS tracking with Habit Score rewards for disciplined driving.

### 💰 Dynamic Pricing
Real-time rate adjustment based on demand across London & Hertfordshire.

### 🏆 Habit Score Rewards
Earn points with every booking. Better driving = exclusive benefits & discounts.

### 📊 Admin Dashboard
GitHub-integrated admin panel with deployment triggers and fleet management.

---

## 🛠 Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS
- **Backend**: Supabase (PostgreSQL), Edge Functions
- **AI**: Vercel AI SDK (Claude + GPT-4o)
- **Styling**: Tailwind CSS + Framer Motion
- **Deployment**: Vercel (automatic on push to `main`)
- **Database**: Supabase

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Vercel account (for deployment)
- Supabase account (for database)

### Local Setup

1. **Clone the repository**:
```bash
git clone https://github.com/richhabits/mandmautoperformance.com.git
cd mandmautoperformance.com
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
```bash
cp .env.example .env.local
```

Then fill in your Supabase & Vercel credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
OPENAI_API_KEY=sk-xxx...
ANTHROPIC_API_KEY=sk-ant-xxx...
ADMIN_SECRET_KEY=xxx...
```

4. **Run the development server**:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
src/
├── app/                  # Next.js App Router
│   ├── page.tsx         # Home page
│   ├── layout.tsx       # Root layout
│   ├── api/             # API routes
│   ├── booking/         # Booking pages
│   ├── fleet/           # Fleet listing
│   └── dashboard/       # User & admin dashboards
├── components/          # React components
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── FleetCard.tsx
│   ├── BookingWidget.tsx
│   ├── AIConcierge.tsx
│   └── ...
├── lib/                 # Utilities
│   ├── supabase.ts     # Database client
│   ├── ai.ts           # AI SDK wrapper
│   └── ...
└── styles/
    └── globals.css      # Global styles

tailwind.config.ts       # Tailwind configuration
AGENTS.md               # AI context & documentation
COMPONENT_LIBRARY.md    # Component specifications
API.md                  # API endpoint documentation
```

---

## 🎨 Design System

### Colors
```css
/* Brand Colors */
--performance-grey: #23272E;      /* Gunmetal - Foundation */
--performance-turquoise: #00F5FF; /* Turquoise - Actions */
--performance-babyblue: #89CFF0;  /* Baby Blue - AI/Trust */
```

All components use these colors via Tailwind custom classes:
- `bg-performance-grey`
- `text-performance-turquoise`
- `border-performance-babyblue`

### Typography
- **Headings**: Bold, uppercase variations for emphasis
- **Body**: Regular weight, 16px base
- **Accent**: Turquoise for CTAs, Baby Blue for AI elements

---

## 📚 Component Library

All reusable components are in `src/components/`:

- **Navbar** — Global navigation with responsive menu
- **Hero** — Landing page hero section
- **FleetCard** — Individual vehicle display card
- **BookingWidget** — Multi-step booking interface
- **AIConcierge** — AI chat widget
- **AdminPanel** — Admin dashboard interface

See `COMPONENT_LIBRARY.md` for full specifications.

---

## 🔌 API Integration

### Authentication
All API requests require a JWT token from Supabase Auth:

```typescript
const { data: { session } } = await supabase.auth.getSession();
const headers = {
  'Authorization': `Bearer ${session.access_token}`
};
```

### Example: Fetch Vehicles
```typescript
const response = await fetch('/api/vehicles?startDate=2026-04-10&endDate=2026-04-12', {
  headers
});
const { data: vehicles } = await response.json();
```

See `API.md` for complete endpoint documentation.

---

## 🧪 Testing

### Run Tests
```bash
npm run test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Generate Coverage Report
```bash
npm run test:coverage
```

### E2E Tests
```bash
npm run test:e2e
```

---

## 🔍 Linting & Formatting

### Lint Code
```bash
npm run lint
```

### Format Code
```bash
npm run format
```

### Type Checking
```bash
npm run type-check
```

---

## 📦 Building for Production

### Build Static Export
```bash
npm run build
```

### Preview Production Build
```bash
npm run build && npm run start
```

---

## 🚢 Deployment

### Automatic Deployment (Recommended)
1. Make changes locally
2. Commit with conventional message: `git commit -m "feat: new feature"`
3. Push to `main`: `git push origin main`
4. Vercel automatically builds and deploys
5. See deployment progress in Vercel dashboard

### Manual Deployment to Vercel
```bash
npm install -g vercel
vercel
```

### Database Migrations
```bash
# Using Supabase CLI
supabase migration new your_migration_name
supabase migration up
```

---

## 🛡️ Security

### Environment Variables
- Never commit `.env.local` file
- Add sensitive keys to Vercel dashboard only
- Use `NEXT_PUBLIC_` prefix only for public variables

### Authentication
- All API routes check for valid JWT
- Passwords hashed with bcrypt
- CORS restricted to `mandmautoperformance.com`

### Rate Limiting
- 100 requests per minute per user
- 1000 requests per minute per IP

---

## 📊 Performance

### Lighthouse Targets
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

### Current Benchmarks
- Page load: < 2 seconds
- Booking completion: < 3 minutes
- Document verification: < 2 minutes
- API response time: < 100ms

---

## 🐛 Debugging

### Enable Debug Mode
```bash
npm run dev -- --debug
```

### Check Supabase Logs
1. Go to Supabase dashboard
2. Navigate to Logs section
3. Filter by date and function

### Monitor Vercel Errors
1. Visit vercel.com dashboard
2. Select project
3. Go to Monitoring section
4. View error logs and analytics

---

## 📝 Git Workflow

### Conventional Commits
```bash
# Feature
git commit -m "feat: add new booking flow"

# Bug fix
git commit -m "fix: resolve document verification issue"

# Documentation
git commit -m "docs: update API documentation"

# Chore
git commit -m "chore: update dependencies"
```

### Create Feature Branch
```bash
git checkout -b feat/your-feature-name
# Make changes...
git push -u origin feat/your-feature-name
# Create PR on GitHub
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feat/your-feature`
3. Commit changes: `git commit -m "feat: describe change"`
4. Push to branch: `git push origin feat/your-feature`
5. Open Pull Request

### Code Review Checklist
- ✅ TypeScript types are correct
- ✅ Components are responsive
- ✅ Accessibility is WCAG 2.1 AA compliant
- ✅ Tests pass
- ✅ Linting passes
- ✅ No hardcoded colors (use Tailwind classes)
- ✅ Commit message is conventional

---

## 📖 Documentation

### For Developers
- `AGENTS.md` — AI context and project overview
- `COMPONENT_LIBRARY.md` — Component specifications
- `API.md` — API endpoint documentation
- `README.md` — This file

### External Resources
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Vercel AI SDK](https://sdk.vercel.ai/)

---

## 🎯 Key Metrics

- **Uptime**: 99.9%
- **Booking Completion Rate**: > 75%
- **Average Booking Time**: < 3 minutes
- **Document Verification Accuracy**: > 99.5%
- **Customer Satisfaction (NPS)**: > 70

---

## 📧 Support

### Development Questions
- Email: dev@mandmautoperformance.com
- GitHub Issues: https://github.com/richhabits/mandmautoperformance.com/issues

### Bug Reports
Please include:
- Environment (local/staging/production)
- Steps to reproduce
- Expected vs actual behavior
- Screenshots or error logs

---

## 📄 License

This project is proprietary software developed for M&M Auto Performance under the RichHabits organization.

---

## 🙏 Acknowledgments

Built with:
- Next.js team (framework)
- Vercel (hosting & AI SDK)
- Supabase (database & auth)
- Tailwind Labs (CSS framework)
- Anthropic (Claude AI)

---

## 🔄 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-04-03 | Initial release with core features |

---

**Last Updated**: April 3, 2026
**Maintained By**: M&M Auto Performance Development Team
**Environment**: Production (2026 Next.js 15 Stack)

---

## 🚀 Quick Command Reference

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Testing
npm run test             # Run all tests
npm run test:e2e         # Run E2E tests
npm run test:coverage    # Generate coverage

# Code Quality
npm run lint             # Lint code
npm run format           # Format code
npm run type-check       # Check types

# Database
supabase migration new   # Create migration
supabase migration up    # Apply migrations

# Deployment
git push origin main     # Trigger Vercel deploy
vercel                   # Manual Vercel deploy
```

---

**Ready to build? Start with the components in `src/components/` and reference `AGENTS.md` for full project context.**
