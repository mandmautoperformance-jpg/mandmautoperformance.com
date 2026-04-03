#!/bin/bash

# M&M AUTO PERFORMANCE - FINAL VERCEL DEPLOYMENT
# All API keys pre-configured
# Just run: bash VERCEL_DEPLOY_FINAL.sh

echo "🚀 DEPLOYING M&M AUTO PERFORMANCE TO VERCEL"
echo "==========================================="
echo ""

# Your API Keys (Pre-filled)
SUPABASE_URL="https://ratyazffxlppzurfokxp.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhdHlhemZmeGxwcHp1cmZva3hwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNzA3NjMsImV4cCI6MjA5MDc0Njc2M30.P5i4fuH3PbcP3MYCX7QWVfnAWlLy-N43OEZ4AMexjTI"
GOOGLE_KEY="AIzaSyBBYPWkBSnqeFhyDnlqh2h93pXyMEzx4LA"

echo "✅ API Keys configured:"
echo "   - Supabase: ratyazffxlppzurfokxp"
echo "   - Google: AIzaSyBBYPWkB..."
echo ""

# Step 1: Install Vercel CLI if needed
echo "📦 Checking Vercel CLI..."
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Step 2: Create .env.local for testing
echo "📝 Creating .env.local for local testing..."
cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_KEY
NEXT_PUBLIC_GEMINI_API_KEY=$GOOGLE_KEY
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$GOOGLE_KEY
NEXT_PUBLIC_GOOGLE_VISION_API_KEY=$GOOGLE_KEY
NEXT_PUBLIC_ENABLE_AI_CONCIERGE=true
NEXT_PUBLIC_ENABLE_TELEMATICS=true
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://mandmautoperformance.com
NEXT_PUBLIC_DOMAIN=mandmautoperformance.com
EOF

echo "✅ .env.local created"
echo ""

# Step 3: Deploy to Vercel
echo "🚀 Deploying to Vercel..."
echo ""

vercel deploy --prod \
  --env NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL \
  --env NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_KEY \
  --env NEXT_PUBLIC_GEMINI_API_KEY=$GOOGLE_KEY \
  --env NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$GOOGLE_KEY \
  --env NEXT_PUBLIC_GOOGLE_VISION_API_KEY=$GOOGLE_KEY \
  --env NEXT_PUBLIC_ENABLE_AI_CONCIERGE=true \
  --env NEXT_PUBLIC_ENABLE_TELEMATICS=true \
  --env NODE_ENV=production \
  --env NEXT_PUBLIC_API_URL=https://mandmautoperformance.com \
  --env NEXT_PUBLIC_DOMAIN=mandmautoperformance.com

echo ""
echo "✅ DEPLOYMENT COMPLETE!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "NEXT STEPS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Wait for domain to propagate (10-30 min)"
echo ""
echo "2. Visit: https://mandmautoperformance.com"
echo "   Should show your M&M homepage"
echo ""
echo "3. Visit: https://mandmautoperformance.com/setup"
echo "   Complete 5-step wizard (your keys already pre-filled!)"
echo ""
echo "4. Click 'Activate System'"
echo ""
echo "5. Your site is LIVE! 🚀"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
