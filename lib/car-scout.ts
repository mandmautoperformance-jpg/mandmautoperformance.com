import { createHash } from 'crypto';

/**
 * War Room — Car Auto-Scout.
 *
 * Uses Gemini with Google Search grounding (live web results) to hunt for
 * underpriced UK car listings, then scores each find on profit vs. effort.
 * Called on a schedule (Vercel cron daily + GitHub Actions hourly) and on
 * demand from the War Room's "Scan now" button.
 *
 * The REST API is called directly because the installed @google/generative-ai
 * SDK predates the google_search tool for Gemini 2.x models.
 */

const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const FALLBACK_MODELS = [MODEL, 'gemini-2.5-flash', 'gemini-2.5-flash-lite'].filter(
  (m, i, arr) => arr.indexOf(m) === i,
);

export type ScoutKind = 'car' | 'land';

export interface ScoutSource {
  url: string;
  title: string;
}

export interface ScoutFind {
  kind: ScoutKind;
  dedupe_key: string;
  title: string;
  url: string | null;
  source: string | null;
  location: string | null;
  asking_price_pence: number | null;
  est_value_pence: number | null;
  projected_profit_pence: number | null;
  effort_score: number | null;
  verdict: string;
  summary: string;
  reasons: string[];
  sources: ScoutSource[];
}

/**
 * Shared secret for cron callers. Derived from the Resend key so the GitHub
 * scheduled workflow (which holds the same secret) and Vercel cron can both
 * compute it without any new secret management. Override with CRON_SECRET.
 */
export function getCronSecret(): string | null {
  if (process.env.CRON_SECRET) return process.env.CRON_SECRET;
  const seed = process.env.RESEND_API_KEY;
  if (!seed) return null;
  return createHash('sha256').update(seed).digest('hex');
}

const CAR_PROMPT = `Search the web for CURRENT cars listed for sale in the UK right now that look UNDERPRICED
versus their realistic market value. Focus on performance, luxury and modern-classic cars priced
between £5,000 and £150,000, on sites like AutoTrader, PistonHeads, eBay Motors, Gumtree,
Collecting Cars, Car & Classic and dealer sites. Prefer recently-posted listings where the seller
signals urgency (quick sale, relocation, price reduced).

Find up to 8 DISTINCT real listings from your search results. For each one estimate:
- the realistic UK market value,
- the NET flip profit after realistic costs (transport, inspection, light recon, selling fees),
- how much WORK the flip needs on a 1-10 scale (1 = buy, clean, relist; 10 = major recon,
  paperwork problems, or hard-to-sell).

Verdict rules: "PERFECT" = strong net profit (>=15% of buy price) AND effort 1-3.
"STRONG" = good profit with modest effort. "OK" = thin margin or notable effort. "PASS" = not worth it.

Return a STRICT JSON array ONLY (no markdown, no commentary), each item exactly:
{"title":"year make model, mileage","url":"the DIRECT link to the advert page exactly as it appears in your search results — this field is REQUIRED whenever any result URL exists; only use null if truly no URL was returned","source":"site name",
"location":"town/region","askingPriceGbp":number,"estimatedValueGbp":number,"projectedProfitGbp":number,
"effortScore":number,"verdict":"PERFECT|STRONG|OK|PASS","summary":"1-2 sentences: the angle and any catch",
"reasons":["short reason","..."]}

Money must be numbers in GBP. askingPriceGbp, estimatedValueGbp, projectedProfitGbp and effortScore are
REQUIRED positive numbers on every item — if you cannot estimate a market value for a listing, OMIT that
listing entirely rather than returning null or 0. Only include listings you actually found in the search
results — never invent listings.`;

const LAND_PROMPT = `Search the web for CURRENT plots of land listed for sale in the UK right now that look
UNDERPRICED versus their realistic market value. Look on Rightmove, Zoopla, OnTheMarket, Addland,
UK Land & Farms, Savills, Strutt & Parker and UK property auction houses (Clive Emson, Auction House,
SDL, Allsop). Plots between £10,000 and £2,000,000. The best angles: paddocks with road frontage,
plots with lapsed or nearby planning permission, probate / quick-sale situations, agricultural land
on a settlement edge with development potential, and auction lots with low guide prices.

Find up to 8 DISTINCT real listings from your search results. For each one estimate:
- the realistic UK market value as-is,
- the NET flip profit after realistic costs (legal/conveyancing, survey, SDLT where relevant, selling fees),
- how much WORK the flip needs on a 1-10 scale (1 = clean title, resell as-is; 10 = planning battle,
  access or covenant problems, long holding period).

Verdict rules: "PERFECT" = strong net profit (>=15% of buy price) AND effort 1-3.
"STRONG" = good profit with modest effort. "OK" = thin margin or notable effort. "PASS" = not worth it.

Return a STRICT JSON array ONLY (no markdown, no commentary), each item exactly:
{"title":"acreage + description, e.g. 2.4 acre paddock with road frontage","url":"the DIRECT link to the
advert page exactly as it appears in your search results — REQUIRED whenever any result URL exists; only
null if truly none","source":"site name","location":"town/county","askingPriceGbp":number,
"estimatedValueGbp":number,"projectedProfitGbp":number,"effortScore":number,
"verdict":"PERFECT|STRONG|OK|PASS","summary":"1-2 sentences: the angle and any catch",
"reasons":["short reason","..."]}

Money must be numbers in GBP. askingPriceGbp, estimatedValueGbp, projectedProfitGbp and effortScore are
REQUIRED positive numbers on every item — if you cannot estimate a market value for a listing, OMIT that
listing entirely rather than returning null or 0. Only include listings you actually found in the search
results — never invent listings.`;

const PROMPTS: Record<ScoutKind, string> = { car: CAR_PROMPT, land: LAND_PROMPT };

const toPence = (v: unknown): number | null => {
  // Number(null) is 0, which silently turned "model couldn't estimate" into
  // £0 rows — reject null/absent and non-positive amounts outright.
  if (v == null || v === '') return null;
  const n = typeof v === 'string' ? parseFloat(v.replace(/[^0-9.]/g, '')) : Number(v);
  return Number.isFinite(n) && n > 0 ? Math.round(n * 100) : null;
};

/**
 * Match the scan's grounding sources (the real web pages Google Search fed the
 * model) to one find by word overlap with its title, so every card can link to
 * where the vehicle is actually advertised even when the model omits the URL.
 */
function matchSources(title: string, chunks: ScoutSource[]): ScoutSource[] {
  if (chunks.length === 0) return [];
  const words = title
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length >= 3);
  const scored = chunks
    .map((c) => ({
      c,
      score: words.reduce((s, w) => s + (c.title.toLowerCase().includes(w) ? 1 : 0), 0),
    }))
    .sort((a, b) => b.score - a.score);
  const hits = scored.filter((s) => s.score > 0).slice(0, 3).map((s) => s.c);
  // No title overlap at all → still give the top search sources as leads.
  return hits.length > 0 ? hits : chunks.slice(0, 2);
}

function parseFinds(kind: ScoutKind, text: string, chunks: ScoutSource[]): ScoutFind[] {
  const start = text.indexOf('[');
  const end = text.lastIndexOf(']');
  if (start === -1 || end === -1 || end <= start) return [];
  let items: any[];
  try {
    items = JSON.parse(text.slice(start, end + 1));
  } catch {
    return [];
  }
  if (!Array.isArray(items)) return [];

  return items
    .filter((it) => it && typeof it === 'object' && it.title)
    .slice(0, 12)
    .map((it) => {
      const title = String(it.title).slice(0, 300);
      const url = it.url && /^https?:\/\//i.test(String(it.url)) ? String(it.url).slice(0, 1000) : null;
      const asking = toPence(it.askingPriceGbp);
      const effort = it.effortScore == null ? NaN : Number(it.effortScore);
      const verdictRaw = String(it.verdict || '').toUpperCase();
      const verdict = ['PERFECT', 'STRONG', 'OK', 'PASS'].includes(verdictRaw) ? verdictRaw : 'OK';
      return {
        kind,
        // Car keys keep the original formula so already-seen listings stay
        // deduped; other kinds get a prefix to avoid cross-kind collisions.
        dedupe_key: createHash('sha1')
          .update((kind === 'car' ? '' : `${kind}|`) + (url || `${title.toLowerCase()}|${asking ?? ''}`))
          .digest('hex'),
        title,
        url,
        source: it.source ? String(it.source).slice(0, 120) : null,
        location: it.location ? String(it.location).slice(0, 200) : null,
        asking_price_pence: asking,
        est_value_pence: toPence(it.estimatedValueGbp),
        projected_profit_pence: toPence(it.projectedProfitGbp),
        effort_score: Number.isFinite(effort) ? Math.max(1, Math.min(10, Math.round(effort))) : null,
        verdict,
        summary: String(it.summary || '').slice(0, 600),
        reasons: Array.isArray(it.reasons)
          ? it.reasons.map((r: unknown) => String(r)).filter(Boolean).slice(0, 6)
          : [],
        sources: matchSources(title, chunks),
      };
    })
    // A find with no asking price or no market value can't answer "how much
    // profit / how much work" — drop it rather than show empty numbers.
    .filter((f) => f.asking_price_pence != null && f.est_value_pence != null);
}

// ---------------------------------------------------------------------------
// Link verification — the model sometimes writes a URL that doesn't match the
// page it actually saw (dead advert, generic search page, wrong listing). We
// live-check every direct URL BEFORE storing it, so "Open the advert" only
// renders when the page is real and plausibly about this find.
// ---------------------------------------------------------------------------

const LINK_TIMEOUT_MS = 6500;
const BROWSER_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

/**
 * Verdict on a single URL:
 *  - dead (drop): 404/410, DNS/connection failures, or a redirect that lands
 *    on a bare homepage — the advert is not there.
 *  - dead (drop): page loads but shares not a single distinctive title word —
 *    it's a real page about something else.
 *  - keep: 2xx with matching content; also 403/429/5xx and timeouts, where a
 *    bot-blocker or slow site means we can't disprove the link.
 */
async function checkUrlAlive(url: string, title: string): Promise<boolean> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), LINK_TIMEOUT_MS);
  try {
    const resp = await fetch(url, {
      redirect: 'follow',
      signal: ctrl.signal,
      headers: { 'User-Agent': BROWSER_UA, Accept: 'text/html,application/xhtml+xml,*/*' },
    });
    if (resp.status === 404 || resp.status === 410) return false;
    if (!resp.ok) return true; // 403/429/5xx: blocked or wobbly, not proven dead
    const finalPath = (() => {
      try {
        return new URL(resp.url || url).pathname;
      } catch {
        return '/x';
      }
    })();
    if (finalPath === '/' || finalPath === '') return false; // bounced to homepage
    const ct = resp.headers.get('content-type') || '';
    if (!ct.includes('html')) return true;
    const body = (await resp.text()).slice(0, 400_000).toLowerCase();
    const tokens = title
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length >= 4);
    if (tokens.length === 0) return true;
    // At least one distinctive word from the find's title must appear on the
    // page, or the URL points at something other than what the card claims.
    return tokens.some((w) => body.includes(w));
  } catch (err) {
    // Timeout → can't judge, keep. DNS / connection refused → dead.
    return err instanceof Error && err.name === 'AbortError';
  } finally {
    clearTimeout(timer);
  }
}

/** Live-check every direct URL concurrently; failed ones fall back to null. */
export async function validateFindLinks(finds: ScoutFind[]): Promise<ScoutFind[]> {
  return Promise.all(
    finds.map(async (f) => {
      if (!f.url) return f;
      const ok = await checkUrlAlive(f.url, f.title);
      return ok ? f : { ...f, url: null };
    }),
  );
}

/** Run one live web scan. Throws on total failure; returns [] when the web simply yielded nothing. */
export async function runScoutScan(kind: ScoutKind = 'car'): Promise<ScoutFind[]> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) throw new Error('Auto-Scout is not configured: missing GEMINI_API_KEY.');

  let lastError: unknown;
  for (const model of FALLBACK_MODELS) {
    try {
      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: PROMPTS[kind] }] }],
            tools: [{ google_search: {} }],
            generationConfig: { temperature: 0.7 },
          }),
        },
      );
      if (!resp.ok) {
        const detail = await resp.text().catch(() => '');
        lastError = new Error(`Gemini ${resp.status}: ${detail.slice(0, 300)}`);
        // Try the next model on 404/unsupported; stop on auth/quota errors.
        if (resp.status === 404 || resp.status === 400) continue;
        break;
      }
      const data = await resp.json();
      const candidate = data?.candidates?.[0];
      const text = (candidate?.content?.parts || [])
        .map((p: any) => p?.text || '')
        .join('');
      // Grounding chunks are the real pages the search surfaced — keep them so
      // every find can point back to where the vehicle is advertised.
      const chunks: ScoutSource[] = (candidate?.groundingMetadata?.groundingChunks || [])
        .map((g: any) => ({
          url: String(g?.web?.uri || ''),
          title: String(g?.web?.title || g?.web?.uri || '').slice(0, 200),
        }))
        .filter((s: ScoutSource) => /^https?:\/\//i.test(s.url))
        .slice(0, 20);
      // Verify every direct advert link is really live before it can be shown.
      return await validateFindLinks(parseFinds(kind, text, chunks));
    } catch (err) {
      lastError = err;
    }
  }

  const detail = lastError instanceof Error ? lastError.message : 'unknown error';
  throw new Error(`Scout scan failed: ${detail}`);
}
