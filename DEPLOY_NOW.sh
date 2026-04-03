#!/bin/bash

# M&M Performance - Complete Vercel Deployment Script
# This script will deploy your project and set all environment variables

echo "🚀 M&M Performance - Vercel Deployment Script"
echo "=============================================="
echo ""

# Step 1: Check if logged into Vercel
echo "Step 1: Checking Vercel authentication..."
npx vercel whoami > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo "❌ Not authenticated with Vercel. Opening browser for login..."
    echo ""
    echo "You will be taken to Vercel. Sign in, then come back here."
    echo "Press Enter when you've completed the browser login..."
    read
    npx vercel login
else
    echo "✓ Already authenticated with Vercel"
fi

echo ""
echo "Step 2: Deploying project to Vercel..."
echo ""

# Deploy to Vercel
npx vercel --prod \
    --env NEXT_PUBLIC_SUPABASE_URL=https://ratyazffxlppzurfokxp.supabase.co \
    --env NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhdHlhemZmeGxwcHp1cmZva3hwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNzA3NjMsImV4cCI6MjA5MDc0Njc2M30.P5i4fuH3PbcP3MYCX7QWVfnAWlLy-N43OEZ4AMexjTI \
    --env NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyBBYPWkBSnqeFhyDnlqh2h93pXyMEzx4LA

DEPLOY_RESULT=$?

if [ $DEPLOY_RESULT -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "Your site is now live at: https://mandmautoperformance.com"
    echo ""
    echo "🎉 Next steps:"
    echo "1. Visit your deployment URL"
    echo "2. Test the booking flow"
    echo "3. Check admin panel at /admin"
    echo ""
    echo "⚠️  IMPORTANT - Rotate your API keys:"
    echo "The following keys were exposed during setup and should be rotated:"
    echo "- Supabase Anon Key"
    echo "- Google API Key"
    echo ""
    echo "Go to:"
    echo "- Supabase: https://app.supabase.com/project/ratyazffxlppzurfokxp/settings/api"
    echo "- Google Cloud: https://console.cloud.google.com/apis/credentials"
else
    echo ""
    echo "❌ Deployment failed. Please check the error above."
    echo ""
    echo "Troubleshooting:"
    echo "1. Make sure you're authenticated: npx vercel login"
    echo "2. Make sure you're in the project directory"
    echo "3. Try again: npm run deploy"
fi

exit $DEPLOY_RESULT
