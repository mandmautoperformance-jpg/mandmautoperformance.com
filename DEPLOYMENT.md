# M&M Auto Performance — Deployment Checklist

## What's Been Built

✅ **7 Missing Pages** — `/fleet`, `/booking`, `/login`, `/signup`, `/dashboard`, `/about`, `/contact`
✅ **3 Additional Pages** — `/analytics`, `/settings`, `/admin` (redirect to admin-dashboard)
✅ **1 Dynamic Page** — `/booking/[id]` (individual vehicle details)
✅ **4 API Routes** — Payments (Stripe), Document upload (Vision API), Admin stats
✅ **1 Webhook** — Stripe payment confirmation handler
✅ **7 Security Fixes** — API key exposure, CORS, TypeScript errors, Unsplash domain, localStorage SSR, admin route fixes
✅ **Auth Middleware** — JWT validation for all protected API routes
✅ **AdminGodMode** — Fully integrated into admin dashboard

## Environment Variables Required

Add these to your Vercel dashboard (Settings → Environment Variables):

### Required (Core Functionality)
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GEMINI_API_KEY=your-gemini-api-key
NEXT_PUBLIC_SITE_URL=https://mandmautoperformance.com
```

### Payment Processing (Stripe)
```
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
```

### Document Verification (Google Vision API)
```
GOOGLE_VISION_KEY_FILE=/path/to/service-account-key.json
GOOGLE_VISION_PROJECT_ID=your-project-id
```

### Optional (Enhanced Features)
```
GOOGLE_MAPS_API_KEY=your-maps-api-key
SENDGRID_API_KEY=your-sendgrid-key
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
SLACK_WEBHOOK_URL=your-slack-webhook
```

## Pre-Deployment Setup

### 1. Supabase Configuration
- [ ] Create `booking_documents` table (if not exists)
- [ ] Create `payment_intents` column in bookings table
- [ ] Enable Row Level Security (RLS) on all tables
- [ ] Create Supabase Storage bucket: `booking-documents` (private)

### 2. Stripe Setup
- [ ] Create Stripe account at stripe.com
- [ ] Get Secret Key (sk_live_...)
- [ ] Get Publishable Key (pk_live_...)
- [ ] Create webhook endpoint pointing to `/api/payments/webhook`
- [ ] Add webhook secret to env vars

### 3. Google Vision API
- [ ] Create Google Cloud project
- [ ] Enable Vision API
- [ ] Create service account
- [ ] Download JSON key file
- [ ] Store in secure location (reference in env var)

### 4. Database Migrations
Run these Supabase migrations:

```sql
-- Add payment columns to bookings table
ALTER TABLE bookings ADD COLUMN stripe_payment_intent_id VARCHAR(255);
ALTER TABLE bookings ADD COLUMN status VARCHAR(50) DEFAULT 'pending_verification';

-- Create booking_documents table
CREATE TABLE booking_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type VARCHAR(50),
  storage_path VARCHAR(255),
  extracted_text TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on booking_documents
ALTER TABLE booking_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own documents"
  ON booking_documents FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own documents"
  ON booking_documents FOR INSERT
  WITH CHECK (user_id = auth.uid());
```

## Deployment Steps

### Option 1: GitHub Push (Recommended)
1. Extract the ZIP file to your local repo
2. `git add . && git commit -m "Add all missing pages, APIs, security fixes"`
3. `git push origin main`
4. Vercel auto-deploys in ~2 minutes

### Option 2: Vercel UI
1. Go to Vercel Dashboard → Import Project
2. Select your GitHub repo
3. Set environment variables (see above)
4. Click Deploy

## Post-Deployment Checklist

- [ ] All nav links work (no 404s)
- [ ] Fleet page loads and shows vehicles
- [ ] Booking page works (test flow)
- [ ] Admin dashboard shows real stats (not fake numbers)
- [ ] Payment form appears in booking flow
- [ ] Contact form submits without error
- [ ] Images load (check Unsplash domain working)
- [ ] Google Analytics tracking active
- [ ] SEO meta tags in place
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] Robots.txt blocks `/admin-dashboard`

## Testing Checklist

### Feature Testing
- [ ] Create user account (signup)
- [ ] Sign in with account (login)
- [ ] Browse fleet with filters
- [ ] View individual vehicle details
- [ ] Start booking flow (no payment yet)
- [ ] Upload documents (mock test)
- [ ] Access dashboard (see user stats)
- [ ] Access admin dashboard (see real stats)
- [ ] Test MIA chat on homepage

### Security Testing
- [ ] Verify Gemini API key NOT in browser (DevTools → Network)
- [ ] Verify CORS restricts to your domain
- [ ] Verify JWT auth required on `/api/admin/*`
- [ ] Test invalid JWT returns 401
- [ ] Verify localStorage guards prevent SSR errors

### Performance Testing
- [ ] Homepage loads <3s (Lighthouse score)
- [ ] Fleet page paginated or lazy-loaded
- [ ] Images optimized and served via CDN
- [ ] No console errors in DevTools

## What's Still To Do (Phase 2)

1. **Real Stripe integration** — Wire payment form to checkout
2. **Document verification automation** — Build smart OCR rules
3. **Email notifications** — SendGrid templates for confirmations
4. **SMS/WhatsApp** — Booking alerts via Twilio
5. **Admin verification dashboard** — Approve/reject documents
6. **Advanced analytics** — Real-time booking metrics
7. **Social auth completion** — Google/Apple/Twitter OAuth flow
8. **Legal pages** — Full T&Cs and data processing docs

## Support

**Immediate Issues?**
- Check Vercel build logs
- Verify all env vars set correctly
- Check Supabase tables exist and RLS is configured
- Verify GitHub secrets are synced to Vercel

**Deployment successful when:**
- Site is live at mandmautoperformance.com
- All pages accessible and no 404s
- Admin stats pull real data (not fake numbers)
- Payment intent API returns valid Stripe key

Go live. Track issues. Report back.
