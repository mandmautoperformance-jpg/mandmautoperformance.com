#!/bin/bash

# M&M Performance - Complete Server Setup Script
# Run this on your server (161.97.76.221) as root or with sudo

set -e

echo "=========================================="
echo "M&M Performance - Server Setup"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
DOMAIN="mandmautoperformance.com"
SERVER_IP="161.97.76.221"
APP_DIR="/var/www/mandmautoperformance"
APP_USER="www-data"
GITHUB_REPO="https://github.com/richhabits/mandmautoperformance.com.git"

echo -e "${BLUE}Step 1: Update system packages${NC}"
apt update && apt upgrade -y

echo -e "${BLUE}Step 2: Install Node.js and npm${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs

echo -e "${BLUE}Step 3: Install PM2 (process manager)${NC}"
npm install -g pm2

echo -e "${BLUE}Step 4: Install Nginx${NC}"
apt install -y nginx

echo -e "${BLUE}Step 5: Clone GitHub repository${NC}"
if [ ! -d "$APP_DIR" ]; then
    mkdir -p $APP_DIR
    git clone $GITHUB_REPO $APP_DIR
else
    cd $APP_DIR
    git pull origin master
fi

echo -e "${BLUE}Step 6: Install dependencies${NC}"
cd $APP_DIR
npm install --legacy-peer-deps

echo -e "${BLUE}Step 7: Build Next.js application${NC}"
npm run build

echo -e "${BLUE}Step 8: Create .env.local with environment variables${NC}"
cat > $APP_DIR/.env.local << EOF
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ratyazffxlppzurfokxp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhdHlhemZmeGxwcHp1cmZva3hwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNzA3NjMsImV4cCI6MjA5MDc0Njc2M30.P5i4fuH3PbcP3MYCX7QWVfnAWlLy-N43OEZ4AMexjTI

# Google APIs
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyBBYPWkBSnqeFhyDnlqh2h93pXyMEzx4LA
EOF

echo -e "${BLUE}Step 9: Set up PM2 to run Next.js app${NC}"
cd $APP_DIR
pm2 start npm --name "mandm-performance" -- start
pm2 save
pm2 startup

echo -e "${BLUE}Step 10: Configure Nginx reverse proxy${NC}"
cat > /etc/nginx/sites-available/$DOMAIN << 'NGINX_CONF'
upstream nextjs {
    server localhost:3000;
}

server {
    listen 80;
    server_name mandmautoperformance.com www.mandmautoperformance.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name mandmautoperformance.com www.mandmautoperformance.com;
    
    # SSL certificates (from Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/mandmautoperformance.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mandmautoperformance.com/privkey.pem;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    
    location / {
        proxy_pass http://nextjs;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Static files caching
    location /_next/static {
        proxy_pass http://nextjs;
        proxy_cache_valid 30d;
        proxy_cache_bypass $http_pragma $http_authorization;
        add_header X-Cache-Status $upstream_cache_status;
    }
}
NGINX_CONF

ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/$DOMAIN
rm -f /etc/nginx/sites-enabled/default

echo -e "${BLUE}Step 11: Install Certbot for SSL certificates${NC}"
apt install -y certbot python3-certbot-nginx

echo -e "${YELLOW}⚠️  MANUAL STEP REQUIRED:${NC}"
echo "Run: sudo certbot certonly --nginx -d mandmautoperformance.com -d www.mandmautoperformance.com"
echo ""
echo "Then test and enable Nginx:"
echo "  sudo nginx -t"
echo "  sudo systemctl enable nginx"
echo "  sudo systemctl restart nginx"
echo ""

echo -e "${GREEN}✅ Server setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Point your domain (mandmautoperformance.com) DNS to: $SERVER_IP"
echo "2. Get SSL certificate: sudo certbot certonly --nginx -d mandmautoperformance.com"
echo "3. Restart Nginx: sudo systemctl restart nginx"
echo "4. Check app status: pm2 status"
echo "5. View logs: pm2 logs mandm-performance"
echo ""
echo "Your app should be running at: https://mandmautoperformance.com"
echo ""
