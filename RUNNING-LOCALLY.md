# Running M&M locally (test for free, push when it works)

The whole point: **test on your own machine at £0** — no Vercel deploys, no
Actions minutes, no wasted API credit — and only push when it actually works.

## One-time setup (5 minutes)

```bash
# 1. Install dependencies (once)
npm install

# 2. Create your local env file from the template
cp .env.example .env.local

# 3. Open .env.local and paste your keys where it says "PASTE …"
#    - Supabase anon + service_role:  Supabase dashboard → Project Settings → API
#    - Gemini key:                    aistudio.google.com/app/apikey
#    - Stripe TEST keys (sk_test_…):  Stripe dashboard → Developers → API keys
#    (.env.local is gitignored — it never gets committed or pushed.)
```

## Every day

```bash
npm run dev
```

Open **http://localhost:3000**. Edit code → the browser refreshes instantly.
Nothing you do here touches production, costs credit, or burns Actions minutes.

Before you push, sanity-check it builds like production will:

```bash
npm run build      # catches type errors / build breaks locally, for free
```

## When it works → push

```bash
git add -A
git commit -m "what you changed"
git push
```

Pushing does **NOT** auto-deploy any more (that's the money-saver). When you're
ready to put it live, trigger a deploy on purpose:

- GitHub → **Actions** tab → **Deploy to Vercel** → **Run workflow**, **or**
- just tell me "deploy it" and I'll trigger it.

## The simple rule

> **Local = free playground. Push = save your work. Deploy = go live, on purpose.**

## What still costs money (and how it's kept low)

| Thing | When it runs | Cost |
|---|---|---|
| `npm run dev` / `npm run build` | your machine | £0 |
| GitHub CI typecheck | on push / PR | free tier (~1 min) |
| Vercel deploy | only when you trigger it | on demand |
| War Room scout scan | every 3 hours *(once live on master)* | small, dial the cron |
