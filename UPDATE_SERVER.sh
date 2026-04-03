#!/bin/bash

# M&M Performance - Server Update Script
# Run this to pull latest from GitHub and restart app

APP_DIR="/var/www/mandmautoperformance"
cd $APP_DIR

echo "🔄 Pulling latest code from GitHub..."
git pull origin master

echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

echo "🏗️  Building application..."
npm run build

echo "♻️  Restarting PM2 app..."
pm2 restart mandm-performance

echo "✅ Update complete!"
pm2 logs mandm-performance --lines 20
