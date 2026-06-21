# M&M Auto Performance — Claude Code Context

## Project

Next.js 15 (Pages Router) + TypeScript strict mode. Supabase Auth & PostgreSQL. Stripe payments. Gemini AI for the MIA concierge. Tailwind CSS with custom theme colours (`performance-grey`, `performance-turquoise`, `performance-babyblue`).

## Development Branch

All changes go to `claude/mm-auto-repo-setup-9iHRh`. Never push directly to `master`.

## Key Paths

- Pages: `pages/` (Next.js Pages Router)
- API routes: `pages/api/`
- Shared lib: `lib/` — auth-middleware, gemini-client, rate-limit, store, supabase-server
- Components: `components/`

## Environment Variables Required

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
GEMINI_API_KEY
NEXT_PUBLIC_SITE_URL
ADMIN_EMAILS   # comma-separated allowlist of admin login emails (gates /admin-dashboard + /api/admin/*)
```

## Code Rules

- Prefer `<Link>` from `next/link` for all internal navigation — never bare `<a>` tags.
- Use `<Image>` from `next/image` for all images.
- All API routes that touch user data must call `verifyAuth()` from `lib/auth-middleware`.
- Sensitive pages (dashboard, settings, admin) need `<meta name="robots" content="noindex, nofollow">`.
- No Tailwind dynamic class names — use explicit class strings only.

## Skill Routing

When the user's request matches an available skill, invoke it via the Skill tool.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore
- Author a backlog-ready spec/issue → invoke /spec
