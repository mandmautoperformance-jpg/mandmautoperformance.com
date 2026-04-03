# 🚀 VERCEL DEPLOYMENT - ONCE YOU HAVE API KEYS

**Once you've completed LIVE_API_SETUP_NOW.md, do this.**

---

## ✅ STEP 1: CREATE VERCEL ACCOUNT (2 minutes)

### Go here:
```
https://vercel.com
```

### What to do:
1. Click **"Sign Up"**
2. Click **"Continue with GitHub"**
3. Authorize Vercel to access GitHub
4. Choose your GitHub account
5. Verify email (check mandmautoperformance@gmail.com inbox)

✅ **VERCEL ACCOUNT DONE**

---

## ✅ STEP 2: IMPORT GITHUB PROJECT (3 minutes)

### In Vercel dashboard:

1. Click **"Add New..."** → **"Project"**
2. Find and click: **`richhabits/mandmautoperformance.com`**
3. Click **"Import"**
4. Let it scan the project (takes 10 seconds)
5. Click **"Deploy"**

✅ **PROJECT IMPORTED**

---

## ✅ STEP 3: ADD ENVIRONMENT VARIABLES (5 minutes)

**CRITICAL:** Add your 5 API keys before deployment finishes

### In Vercel Project Settings:

1. Go to: **Settings** (top menu bar)
2. Left sidebar: **"Environment Variables"**
3. Click **"Add New"** for each:

**Paste these 5 values:**

```
NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJ...
NEXT_PUBLIC_GEMINI_API_KEY = AIzaSy...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = AIzaSy...
NEXT_PUBLIC_GOOGLE_VISION_API_KEY = AIzaSy...
```

(Replace xxxxx with your actual keys from LIVE_API_SETUP_NOW.md)

4. For each: Select **"Production"** checkbox
5. Click **"Save"**

✅ **ENVIRONMENT VARIABLES DONE**

---

## ✅ STEP 4: DEPLOY (5-10 minutes)

### Back in Vercel dashboard:

1. Go to: **Deployments** (top menu)
2. Find the deployment that says **"Building..."** or **"Ready"**
3. If still building, wait for it to finish (shows blue checkmark)
4. Click the deployment
5. Should show **green checkmark** = SUCCESS

✅ **DEPLOYED TO VERCEL**

---

## ✅ STEP 5: CONFIGURE DOMAIN (5 minutes)

### In Vercel dashboard:

1. Go to: **Settings** → **"Domains"** (left sidebar)
2. Click **"Add Domain"**
3. Type: **`mandmautoperformance.com`**
4. Click **"Add"**
5. Vercel shows DNS records to add

**Copy these values** (Vercel will show exact values):

Usually:
```
Type: A
Name: @
Value: [Some IP Vercel shows]
```

OR:

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

✅ **NOTE:** Save these values - you need to add them to your domain registrar

---

## ✅ STEP 6: UPDATE DNS AT YOUR REGISTRAR (5 minutes)

**Go to where you bought your domain** (GoDaddy, Namecheap, etc.)

### What to do:

1. Login to your registrar
2. Find **"DNS Settings"** or **"Name Servers"**
3. Remove old A record pointing to **161.97.76.221**
4. Add the record Vercel told you to add (from Step 5 above)
5. **Save changes**
6. **Wait 5-30 minutes** for DNS to propagate

**To verify DNS updated:**
```
Open: https://whatsmydns.net
Enter: mandmautoperformance.com
It should show Vercel's IP, not 161.97.76.221
```

✅ **DNS UPDATED**

---

## ✅ STEP 7: TEST LIVE SITE (2 minutes)

### Once DNS propagates:

1. Open browser
2. Visit: **`https://mandmautoperformance.com`**
3. Should load without errors
4. Should NOT be Vercel default page
5. Should show M&M homepage

**If not loading yet:**
- Wait another 5-10 minutes for DNS
- Try in private/incognito window
- Clear browser cache

✅ **SITE LIVE**

---

## ✅ STEP 8: RUN SETUP WIZARD (5 minutes)

Once site is live:

1. Visit: **`https://mandmautoperformance.com/setup`**
2. Should see **Setup Wizard** page
3. Complete 5-step wizard:
   - Step 1: Paste Supabase URL
   - Step 2: Paste Supabase Anon Key
   - Step 3: Paste Google API Key
   - Step 4: Paste Google API Key (same)
   - Step 5: Paste Google API Key (same)
4. Click **"Activate System"**
5. See success page ✅

✅ **SYSTEM ACTIVATED**

---

## ✅ FINAL VERIFICATION

After activation, test these:

- [ ] Homepage loads: `https://mandmautoperformance.com`
- [ ] Setup wizard accessible: `/setup`
- [ ] Admin dashboard loads: `/admin-dashboard`
- [ ] Can sign up with Google OAuth
- [ ] MIA chatbot responds
- [ ] No console errors (F12 → Console)

---

## 🎉 YOU'RE LIVE!

Once all above is done:

✅ Site live at mandmautoperformance.com
✅ Setup wizard completed
✅ All APIs configured
✅ Admin dashboard working
✅ Ready to accept bookings

**Tweet it! Email your team! You're live! 🚀**

---

## 📋 Timeline

| Step | Time |
|------|------|
| Vercel account | 2 min |
| Import project | 3 min |
| Add env vars | 5 min |
| Deploy | 5-10 min |
| Configure domain | 5 min |
| Update registrar DNS | 5 min |
| Test live site | 2 min |
| Run setup wizard | 5 min |
| **TOTAL** | **30-45 min** |

---

## 🚨 If Something Goes Wrong

| Problem | Solution |
|---------|----------|
| "Invalid environment variable" | Check for typos in API key names |
| "Build failed" | Check build logs in Vercel for error messages |
| "Domain not connecting" | Wait 10-30 min for DNS, use whatsmydns.net |
| "Setup wizard won't load" | Clear browser cache: Ctrl+Shift+Delete |
| "API keys rejected" | Make sure you copied ENTIRE key (not truncated) |

---

## ✨ Next Steps After Going Live

1. **Monitor:** Check Vercel dashboard for errors
2. **Test booking:** Make test booking to verify end-to-end
3. **Test MIA:** Chat with AI to verify it responds
4. **Check admin:** Login to `/admin-dashboard`
5. **Celebrate:** You're live! 🎉

---

**Ready to start?**

1. Complete: `LIVE_API_SETUP_NOW.md` (get all 5 API keys)
2. Come back and say: "KEYS DONE"
3. Then follow this guide

Let's go! 🚀
