# 🚀 M&M Performance - GO LIVE CHECKLIST

## Pre-Deployment (Right Now)

- [ ] ✅ Code pushed to GitHub: https://github.com/richhabits/mandmautoperformance.com
- [ ] ✅ Environment variables configured
- [ ] ✅ Server scripts ready (SERVER_SETUP.sh, UPDATE_SERVER.sh)
- [ ] ✅ API keys secured

---

## Server Setup (On 161.97.76.221)

**Time Required: ~15 minutes**

### Step 1: Connect to Server
```bash
ssh root@161.97.76.221
```

### Step 2: Run Automated Setup
```bash
cd /tmp
wget https://raw.githubusercontent.com/richhabits/mandmautoperformance.com/master/SERVER_SETUP.sh
bash SERVER_SETUP.sh
```
- [ ] Server setup script completed
- [ ] Node.js installed
- [ ] Nginx configured
- [ ] PM2 process manager ready

### Step 3: Configure SSL (HTTPS)
```bash
sudo certbot certonly --nginx -d mandmautoperformance.com -d www.mandmautoperformance.com
```
- [ ] SSL certificate generated
- [ ] Certificate saved to `/etc/letsencrypt/`

### Step 4: Start Services
```bash
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl restart nginx
```
- [ ] Nginx config validated
- [ ] Nginx enabled and running

### Step 5: Verify App
```bash
pm2 status
pm2 logs mandm-performance
```
- [ ] App shows as "online" in PM2
- [ ] No errors in logs
- [ ] Can curl: `curl -k https://localhost/`

---

## DNS Configuration (Domain Registrar)

**Time Required: ~5 minutes (+ 5-15 min propagation)**

### Point Domain to Server

Go to your domain registrar (GoDaddy, Namecheap, etc.):

**Add/Update these DNS records:**

```
Type: A
Name: mandmautoperformance.com (or @)
Value: 161.97.76.221

Type: A
Name: www
Value: 161.97.76.221

Type: CNAME
Name: www.mandmautoperformance.com
Value: mandmautoperformance.com (optional, if A record not set)
```

- [ ] A record set: mandmautoperformance.com → 161.97.76.221
- [ ] A record set: www → 161.97.76.221
- [ ] DNS changes saved

**Wait 5-15 minutes for DNS to propagate**

### Verify DNS
```bash
nslookup mandmautoperformance.com
# Should return: 161.97.76.221

ping mandmautoperformance.com
# Should respond
```

- [ ] DNS resolves to 161.97.76.221
- [ ] Can ping domain successfully

---

## Final Testing

### Test HTTPS
```bash
curl -I https://mandmautoperformance.com
# Should return: HTTP/2 200
```
- [ ] HTTPS working
- [ ] SSL certificate valid
- [ ] Redirects from HTTP → HTTPS

### Test Application
1. Visit: **https://mandmautoperformance.com**
   - [ ] Page loads
   - [ ] No errors in browser console
   - [ ] Design renders correctly

2. Test Admin Panel: **https://mandmautoperformance.com/admin**
   - [ ] Admin dashboard accessible
   - [ ] API Configuration section works
   - [ ] Can see analytics

3. Test Booking Flow: **https://mandmautoperformance.com**
   - [ ] Can start booking process
   - [ ] All form steps work
   - [ ] Can see available vehicles

---

## Post-Launch (After Live)

### Security
- [ ] Rotate Supabase API keys
- [ ] Generate new Google API key
- [ ] Update .env.local on server with new keys
- [ ] Restart PM2: `pm2 restart mandm-performance`
- [ ] Enable UFW firewall
- [ ] Set up fail2ban (optional)

### Monitoring
- [ ] Set up automated backups
- [ ] Monitor server logs daily
- [ ] Set up SSL certificate auto-renewal (certbot auto-handles this)
- [ ] Monitor uptime with external service
- [ ] Set up error tracking (Sentry)

### Continuous Deployment
- [ ] Test UPDATE_SERVER.sh script
- [ ] Set up GitHub Actions (optional)
- [ ] Set up cron job for auto-updates (optional)

### Marketing & Launch
- [ ] Update social media with live URL
- [ ] Send launch announcement to leads
- [ ] Activate marketing campaigns
- [ ] Monitor traffic and performance
- [ ] Gather user feedback

---

## Quick Command Reference

**Monitor your app:**
```bash
pm2 status              # Check if running
pm2 logs                # View real-time logs
pm2 restart all         # Restart all apps
pm2 stop all            # Stop all apps
pm2 delete all          # Remove from PM2
```

**Update from GitHub:**
```bash
cd /var/www/mandmautoperformance
bash UPDATE_SERVER.sh   # Auto-pulls, builds, restarts
```

**Check server health:**
```bash
pm2 ping
free -h                 # Memory usage
df -h                   # Disk usage
systemctl status nginx  # Nginx status
```

---

## Timeline

| Step | Duration | Total Time |
|------|----------|-----------|
| SSH to server | 1 min | 1 min |
| Run SERVER_SETUP.sh | 8 min | 9 min |
| Configure SSL | 3 min | 12 min |
| Verify app running | 2 min | 14 min |
| Configure DNS | 5 min | 19 min |
| DNS propagation | 5-15 min | 24-34 min |
| Final testing | 5 min | 29-39 min |

**Total: 30-40 minutes from now to LIVE** ✅

---

## ⚠️ Important Reminders

1. **ROTATE YOUR API KEYS** - They were exposed during setup
   - Supabase: Go to project settings, regenerate anon key
   - Google: Create new API key, delete old one

2. **Keep backups** - Set up automated server backups

3. **Monitor logs** - Check `pm2 logs` regularly for errors

4. **Update regularly** - Pull from GitHub weekly: `bash UPDATE_SERVER.sh`

---

**Need help?** Check SERVER_DEPLOYMENT_GUIDE.md for detailed troubleshooting

