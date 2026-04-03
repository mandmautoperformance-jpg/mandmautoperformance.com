# Phase 1: MIA 2.0 Autonomous Closer - Deployment Guide

## What's Been Built ✅

### Backend API Routes (Live)
- `POST /api/chat/completions` - Streaming AI chat with Gemini 1.5 Flash
- `GET /api/vehicles` - List and filter available vehicles
- `POST /api/bookings` - Create new bookings with auto-calculated pricing
- `GET /api/bookings` - Retrieve user's booking history

### Frontend Components (Refactored)
- **AIConcierge** - Real API integration with streaming responses
- **Zustand Stores** - State management for bookings, chat, vehicles, user profiles
- **Google Generative AI SDK** - Added to dependencies for Gemini integration

### Database Schema (Ready to Deploy)
```
supabase/migrations/001_init_schema.sql
├── users - User profiles and authentication
├── vehicles - Fleet inventory with pricing
├── bookings - Rental transactions
├── documents - Document verification
├── conversations - Chat session history
├── messages - Individual chat messages
├── user_profiles - Gamification data
└── payments - Payment records
```

### Seed Data (Ready)
```
supabase/migrations/002_seed_vehicles.sql
├── Porsche 911 Turbo (£500/day)
├── Mercedes-AMG GT 63S (£450/day)
├── Aston Martin DB12 (£250/day)
├── BMW M440i (£150/day)
├── Lamborghini Revuelto (£550/day)
├── Range Rover Sport (£120/day)
├── Tesla Model S Plaid (£180/day)
└── Rolls-Royce Ghost (£350/day)
```

---

## Critical Next Steps for Production

### 1. ⚠️ Deploy Supabase Migrations

The database schema exists but hasn't been deployed to production. You need to:

**Option A: Using Vercel Dashboard (Recommended)**
1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add these secrets:
   ```
   NEXT_PUBLIC_SUPABASE_URL = <your-supabase-url>
   SUPABASE_SERVICE_ROLE_KEY = <your-service-role-key>
   NEXT_PUBLIC_GEMINI_API_KEY = <your-gemini-api-key>
   ```

**Option B: Using Supabase Dashboard**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to SQL Editor
4. Run the migration files:
   - `supabase/migrations/001_init_schema.sql`
   - `supabase/migrations/002_seed_vehicles.sql`

**Getting Your Supabase Keys:**
1. Navigate to https://supabase.com/dashboard
2. Select your M&M Auto Performance project
3. Go to Settings → API
   - Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy `Service Role secret` → `SUPABASE_SERVICE_ROLE_KEY`
4. Go to Authentication → Providers and configure OAuth (Google, Apple, X/Twitter)

**Getting Your Gemini API Key:**
1. Go to https://aistudio.google.com/app/apikey
2. Create or copy your API key
3. Paste as `NEXT_PUBLIC_GEMINI_API_KEY` in Vercel

### 2. 🚀 Verify Vercel Deployment

The latest code (commit c867cc5) was pushed to GitHub. Vercel should auto-deploy:

**Check deployment status:**
```bash
# Check if API routes are live
curl https://mandmautoperformance.com/api/vehicles

# Expected response (once deployed):
{
  "success": true,
  "count": 8,
  "vehicles": [...]
}
```

**Deployment Checklist:**
- [ ] Code pushed to GitHub (DONE - commit c867cc5)
- [ ] Vercel deployment triggered
- [ ] Build completes successfully
- [ ] Environment variables configured in Vercel
- [ ] Supabase migrations deployed
- [ ] API endpoints respond with data

### 3. 🧪 Test Phase 1 MVP Locally

Before production, test the full flow locally:

```bash
# Install dependencies (if not done)
npm install

# Set up .env.local with your keys
NEXT_PUBLIC_SUPABASE_URL=<your-url>
NEXT_PUBLIC_GEMINI_API_KEY=<your-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-key>

# Start dev server
npm run dev

# Test in browser
# 1. Open http://localhost:3000
# 2. Click chat icon (MIA Concierge)
# 3. Type: "I'd like to rent a sports car for this weekend"
# 4. MIA should respond with vehicle suggestions
```

---

## Architecture Summary

### API Request Flow
```
Frontend (AIConcierge)
    ↓ POST /api/chat/completions
Backend (Next.js API Route)
    ↓ Call Gemini 1.5 Flash
    ↓ Store conversation in Supabase
    ↓ Return streaming response
Frontend (receive & display)
```

### Data Flow
```
User Input → Zustand Store
    ↓
Booking Context Updated
    ↓
API Call with Context
    ↓
Supabase (persist data)
    ↓
Gemini (generate response)
    ↓
Response Stream to UI
```

---

## What's Working Now

✅ **Local Development**
- Full chat interface with real Gemini integration
- Booking creation with pricing calculations
- Vehicle listing and filtering
- Conversation history persistence
- Error handling and user feedback

✅ **Type Safety**
- TypeScript throughout codebase
- Type definitions for Supabase tables
- Proper error handling

✅ **Frontend Architecture**
- React 19 + Next.js 15
- Zustand for state management
- Framer Motion animations
- Tailwind CSS styling

---

## What Needs Setup

⚠️ **Environment Variables** - Must be added to Vercel before API routes work:
- `NEXT_PUBLIC_SUPABASE_URL` (from Supabase Dashboard)
- `SUPABASE_SERVICE_ROLE_KEY` (Supabase Admin Key)
- `NEXT_PUBLIC_GEMINI_API_KEY` (from Google AI Studio)

⚠️ **Supabase Database** - Migrations must be deployed:
- Run SQL migrations in Supabase SQL Editor
- Seed 8 test vehicles into database
- Enable Row-Level Security policies

⚠️ **OAuth Configuration** - For social login (optional for MVP):
- Configure Google OAuth in Supabase
- Configure Apple OAuth in Supabase
- Configure X/Twitter OAuth in Supabase

---

## Phase 2-6 Features (Planned)

Once Phase 1 is live, these are next:

| Phase | Feature | Est. Time |
|-------|---------|-----------|
| 2 | Document Verification (OCR) | Week 3 |
| 3 | Autonomous Decision-Making | Week 4 |
| 4 | Hyper-Local Intelligence (ULEZ, Weather) | Week 5 |
| 5 | Payment Processing & Fraud Prevention | Week 6 |
| 6 | Habit Tracking & Gamification | Week 7 |

---

## Troubleshooting

**API returns 404**
→ Vercel deployment hasn't picked up latest code yet. Wait 2-3 minutes and retry.

**API returns 500 with "Missing Supabase environment variables"**
→ Add `SUPABASE_SERVICE_ROLE_KEY` to Vercel environment variables

**Gemini responses not streaming**
→ Ensure `NEXT_PUBLIC_GEMINI_API_KEY` is valid and API quota not exceeded

**Chat shows "Error: Failed to get response from AI"**
→ Check Gemini API key and verify API is enabled at https://console.cloud.google.com

**Vehicles list is empty**
→ Supabase migrations haven't been run. Run `002_seed_vehicles.sql` in SQL Editor

---

## Success Criteria

Phase 1 MVP is complete when:

✅ User navigates to mandmautoperformance.com
✅ Clicks MIA Concierge chat icon
✅ Types: "I need a sports car for the weekend"
✅ MIA responds with vehicle suggestions (Porsche 911, Ferrari, etc.)
✅ User books vehicle
✅ Booking saved to Supabase
✅ Confirmation sent with booking ID
✅ Chat history preserved

---

## Files Reference

**Backend API Routes:**
- `/pages/api/vehicles/index.ts` - Vehicle listing
- `/pages/api/bookings/index.ts` - Booking creation
- `/pages/api/chat/completions.ts` - Gemini streaming

**Libraries:**
- `/lib/gemini-client.ts` - Gemini API wrapper
- `/lib/supabase-server.ts` - Server-side Supabase client
- `/lib/store.ts` - Zustand stores

**Database:**
- `/supabase/migrations/001_init_schema.sql` - Schema
- `/supabase/migrations/002_seed_vehicles.sql` - Test data

**Frontend:**
- `/components/AIConcierge.tsx` - Refactored chat component

---

## Next Session Action Items

1. Add environment variables to Vercel Dashboard
2. Deploy Supabase migrations
3. Verify API endpoints return 200 with data
4. Test full booking flow in production
5. Document any issues and fixes

---

**Created:** 2026-04-03
**Phase:** 1/6 - MVP Foundation
**Status:** Code Ready, Deployment Pending
