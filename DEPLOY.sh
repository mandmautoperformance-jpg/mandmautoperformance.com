#!/bin/bash

# M&M AUTO PERFORMANCE - COMPLETE AUTOMATED DEPLOYMENT
# This script deploys to Vercel with all your API keys

echo "🚀 M&M AUTO PERFORMANCE - VERCEL DEPLOYMENT"
echo "=========================================="
echo ""

# Prompt for API keys
echo "📋 Enter your 3 API keys (from Google Cloud and Supabase):"
echo ""

read -p "1. NEXT_PUBLIC_SUPABASE_URL (https://...supabase.co): " SUPABASE_URL
read -p "2. NEXT_PUBLIC_SUPABASE_ANON_KEY (eyJ...): " SUPABASE_KEY
read -p "3. NEXT_PUBLIC_GEMINI_API_KEY (AIzaSy...): " GOOGLE_KEY

echo ""
echo "✅ Keys received!"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo ""
echo "🚀 Deploying to Vercel..."
echo ""

# Deploy with environment variables
vercel deploy \
  --env NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL \
  --env NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_KEY \
  --env NEXT_PUBLIC_GEMINI_API_KEY=$GOOGLE_KEY \
  --env NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$GOOGLE_KEY \
  --env NEXT_PUBLIC_GOOGLE_VISION_API_KEY=$GOOGLE_KEY \
  --prod

echo ""
echo "✅ DEPLOYMENT COMPLETE!"
echo ""
echo "Next steps:"
echo "1. Visit: https://mandmautoperformance.com/setup"
echo "2. Complete the 5-step wizard"
echo "3. System is LIVE!"
echo ""
echo "Questions? Check VERCEL_DEPLOY_NOW.md"
