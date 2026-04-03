# Server Deployment Guide - M&M Performance

## Quick Start (5 minutes)

### 1. SSH into Your Server
```bash
ssh root@161.97.76.221
```

### 2. Download and Run Setup Script
```bash
cd /tmp
wget https://raw.githubusercontent.com/richhabits/mandmautoperformance.com/master/SERVER_SETUP.sh
chmod +x SERVER_SETUP.sh
sudo bash SERVER_SETUP.sh
```

### 3. Configure SSL Certificate
```bash
sudo certbot certonly --nginx -d mandmautoperformance.com -d www.mandmautoperformance.com
```

### 4. Test and Start Nginx
```bash
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl restart nginx
```

### 5. Verify App is Running
```bash
pm2 status
pm2 logs mandm-performance
```

---

## Directory Structure

```
/var/www/mandmautoperformance/
├── .env.local                 # Environment variables (created by setup)
├── .next/                     # Next.js build output
├── node_modules/
├── pages/
├── components/
├── public/
├── package.json
└── (all other project files)
```

---

## Important Commands

### Check App Status
```bash
pm2 status
```

### View Live Logs
```bash
pm2 logs mandm-performance
```

### Restart App
```bash
pm2 restart mandm-performance
```

### Stop App
```bash
pm2 stop mandm-performance
```

### Update from GitHub
```bash
cd /var/www/mandmautoperformance
bash UPDATE_SERVER.sh
```

---

## Environment Variables

Located at: `/var/www/mandmautoperformance/.env.local`

**Current Configuration:**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `NEXT_PUBLIC_GEMINI_API_KEY` - Google Gemini API key

**To change:** Edit `.env.local` then restart with `pm2 restart mandm-performance`

---

## DNS Configuration

Point your domain to your server IP:

**For mandmautoperformance.com:**
- A Record: `mandmautoperformance.com` → `161.97.76.221`
- A Record: `www.mandmautoperformance.com` → `161.97.76.221`

Wait 5-15 minutes for DNS to propagate.

---

## Monitoring

### Check if Server is Running
```bash
curl https://mandmautoperformance.com/api/health
```

### View Nginx Logs
```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Check Disk Space
```bash
df -h
```

### Check Memory Usage
```bash
free -h
```

---

## Troubleshooting

### App not starting?
```bash
pm2 logs mandm-performance
# Check logs for errors
```

### Domain not resolving?
```bash
nslookup mandmautoperformance.com
# Should return: 161.97.76.221
```

### SSL certificate issues?
```bash
sudo certbot renew --dry-run
sudo certbot renew
```

### Nginx not working?
```bash
sudo nginx -t  # Test config
sudo systemctl restart nginx
```

---

## Automated Updates

To automatically pull and deploy updates from GitHub, set up a cron job:

```bash
# Edit crontab
crontab -e

# Add this line to update every hour:
0 * * * * cd /var/www/mandmautoperformance && bash UPDATE_SERVER.sh >> /var/log/mandm-update.log 2>&1
```

---

## Security Best Practices

1. ✅ Keep SSL certificates updated (auto-renews with certbot)
2. ✅ Rotate API keys regularly
3. ✅ Monitor server logs for unusual activity
4. ✅ Use strong SSH keys
5. ✅ Disable root SSH login
6. ✅ Use a firewall (UFW recommended)

---

## Support

**GitHub Repository:**
https://github.com/richhabits/mandmautoperformance.com

**Live Site:**
https://mandmautoperformance.com

