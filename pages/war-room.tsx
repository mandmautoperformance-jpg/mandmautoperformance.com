import React, { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

/**
 * War Room — private owner-only deal desk.
 *
 * Four engines on one screen:
 *   • 🌍 Land Flip Engine — paste a plot, AI values/negotiates/buyer-matches
 *   • 🛰️ Land Scout       — scheduled web scans for underpriced UK land
 *   • 🏎️ Car Flip Desk    — paste a car, same flip brain
 *   • 🛰️ Car Scout        — scheduled web scans for underpriced UK cars
 * Manual analyses and promoted scout finds persist to war_room_deals;
 * scout finds live in war_room_finds.
 */

type AssetClass = 'land' | 'car' | 'car2' | 'land2';
const isScout = (a: AssetClass) => a === 'car2' || a === 'land2';

interface FlipAnalysis {
  assetSummary: string;
  estimatedMarketValueGbp: number;
  fairOpeningOfferGbp: number;
  targetBuyPriceGbp: number;
  projectedResalePriceGbp: number;
  projectedProfitGbp: number;
  undervaluationScore: number;
  confidence: number;
  riskFlags: string[];
  negotiationStrategy: string;
  negotiationMessage: string;
  idealBuyerProfile: string;
  buyerChannels: string[];
  nextActions: string[];
}

interface Deal {
  id: string;
  asset_class: AssetClass;
  title: string;
  location: string | null;
  asking_price_pence: number | null;
  target_buy_pence: number | null;
  resale_pence: number | null;
  projected_profit_pence: number | null;
  stage: string;
  analysis: any;
  created_at: string;
}

interface Find {
  id: string;
  kind?: string;
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
  sources?: { url: string; title: string }[];
  status: string;
  found_at: string;
}

/** Guaranteed click-through: a targeted web search for this exact advert. */
const findSearchUrl = (f: Find): string => {
  const site = f.source && f.source.includes('.') ? ` site:${f.source}` : ' for sale UK';
  return `https://www.google.com/search?q=${encodeURIComponent(`${f.title}${site}`)}`;
};

/**
 * Readable chip label for a grounding source. Grounding URLs are Google
 * redirect links, so the page title (usually the site name) beats the host.
 */
const sourceLabel = (s: { url: string; title: string }): string => {
  if (s.title && !/^https?:\/\//i.test(s.title)) return s.title.slice(0, 40);
  try {
    return new URL(s.url).hostname.replace(/^www\./, '').slice(0, 40);
  } catch {
    return 'source';
  }
};

const VERDICT_STYLE: Record<string, { badge: string; cls: string }> = {
  PERFECT: { badge: '💎 PERFECT', cls: 'text-green-400 bg-green-400/10 border-green-400/30' },
  STRONG: { badge: '🔥 STRONG', cls: 'text-performance-turquoise bg-performance-turquoise/10 border-performance-turquoise/30' },
  OK: { badge: '👍 OK', cls: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' },
  PASS: { badge: '🚫 PASS', cls: 'text-gray-400 bg-gray-400/10 border-gray-400/30' },
};

const effortLabel = (n: number | null): string => {
  if (n == null) return 'Unknown';
  if (n <= 3) return 'Easy flip';
  if (n <= 6) return 'Some work';
  return 'Heavy project';
};

const TABS: { key: AssetClass; icon: string; label: string }[] = [
  { key: 'land', icon: '🌍', label: 'Land Flip Engine' },
  { key: 'land2', icon: '🛰️', label: 'Land Scout' },
  { key: 'car', icon: '🏎️', label: 'Car Flip Desk' },
  { key: 'car2', icon: '🛰️', label: 'Car Scout' },
];

const FLIP_STAGES = [
  { value: 'sourced', label: 'Sourced' },
  { value: 'offer_sent', label: 'Offer Sent' },
  { value: 'negotiating', label: 'Negotiating' },
  { value: 'buyer_matched', label: 'Buyer Matched' },
  { value: 'closed', label: 'Closed' },
  { value: 'passed', label: 'Passed' },
];

const STAGE_LABELS: Record<string, string> = Object.fromEntries(
  FLIP_STAGES.map((s) => [s.value, s.label]),
);

// Placeholders for the two manual analyzer tabs (scout tabs have no form).
const PLACEHOLDERS: Partial<Record<AssetClass, { title: string; loc: string; price: string }>> = {
  land: { title: '5 acres, residential development potential', loc: 'Location (e.g. St Albans, Herts)', price: 'Asking price (£)' },
  car: { title: '2019 Lamborghini Huracán, 12k miles', loc: 'Location / seller (e.g. dealer, Leeds)', price: 'Asking price (£)' },
};

const gbp = (pence: number | null | undefined): string =>
  pence == null ? '—' : `£${Math.round(pence / 100).toLocaleString()}`;
const gbpN = (n: number): string => `£${Math.round(n).toLocaleString()}`;

const WarRoom: React.FC = () => {
  const router = useRouter();
  const [state, setState] = useState<'checking' | 'ready'>('checking');
  const [token, setToken] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [tab, setTab] = useState<AssetClass>('land');
  const [deals, setDeals] = useState<Deal[]>([]);

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [asking, setAsking] = useState('');
  const [details, setDetails] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<FlipAnalysis | null>(null);
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  // Auto-Scout state
  const [finds, setFinds] = useState<Find[]>([]);
  const [scanning, setScanning] = useState(false);
  const [scanMsg, setScanMsg] = useState('');

  const loadDeals = useCallback(async (accessToken: string) => {
    try {
      const res = await fetch('/api/war-room/deals', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setDeals(data.deals || []);
      }
    } catch {
      /* non-fatal */
    }
  }, []);

  const loadFinds = useCallback(async (accessToken: string) => {
    try {
      const res = await fetch('/api/war-room/finds', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setFinds(data.finds || []);
      }
    } catch {
      /* non-fatal */
    }
  }, []);

  useEffect(() => {
    async function gate() {
      const supabase = getSupabaseBrowser();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace('/login'); return; }
      try {
        const res = await fetch('/api/war-room/status', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (!res.ok) { router.replace('/'); return; }
      } catch {
        router.replace('/'); return;
      }
      setToken(session.access_token);
      setOwnerEmail(session.user.email || '');
      await Promise.all([loadDeals(session.access_token), loadFinds(session.access_token)]);
      setState('ready');
    }
    gate();
  }, [router, loadDeals, loadFinds]);

  const resetForm = () => {
    setTitle(''); setLocation(''); setAsking(''); setDetails('');
    setAnalysis(null); setErr('');
  };
  const switchTab = (t: AssetClass) => { setTab(t); resetForm(); };

  const runAnalysis = async () => {
    setErr(''); setAnalysis(null);
    if (!title.trim()) { setErr('Add a title or paste the listing first.'); return; }
    setAnalyzing(true);
    try {
      const res = await fetch('/api/war-room/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ assetClass: tab, title, location, askingPriceGbp: asking, details }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');
      setAnalysis(data.analysis);
    } catch (e: any) {
      setErr(e?.message || 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const saveDeal = async () => {
    if (!analysis) return;
    setSaving(true);
    try {
      const res = await fetch('/api/war-room/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ assetClass: tab, title, location, askingPriceGbp: asking, analysis }),
      });
      if (res.ok) {
        const data = await res.json();
        setDeals((d) => [data.deal, ...d]);
        resetForm();
      }
    } finally {
      setSaving(false);
    }
  };

  const changeStage = async (id: string, stage: string) => {
    setDeals((d) => d.map((x) => (x.id === id ? { ...x, stage } : x)));
    await fetch('/api/war-room/deals', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, stage }),
    });
  };

  const removeDeal = async (id: string) => {
    setDeals((d) => d.filter((x) => x.id !== id));
    await fetch(`/api/war-room/deals?id=${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  const scanNow = async (kind: 'car' | 'land') => {
    setScanning(true);
    setScanMsg('');
    try {
      const res = await fetch(`/api/war-room/scan?kind=${kind}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Scan failed');
      setScanMsg(`Scan complete — ${data.scanned} listings reviewed, ${data.newFinds} new find${data.newFinds === 1 ? '' : 's'}.`);
      await loadFinds(token);
    } catch (e: any) {
      setScanMsg(e?.message || 'Scan failed');
    } finally {
      setScanning(false);
    }
  };

  const dismissFind = async (id: string) => {
    setFinds((f) => f.filter((x) => x.id !== id));
    await fetch('/api/war-room/finds', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, status: 'dismissed' }),
    });
  };

  const promoteFind = async (find: Find) => {
    // Mark promoted, then create a pipeline deal in the matching scout lane.
    setFinds((f) => f.map((x) => (x.id === find.id ? { ...x, status: 'promoted' } : x)));
    await fetch('/api/war-room/finds', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id: find.id, status: 'promoted' }),
    });
    const res = await fetch('/api/war-room/deals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        assetClass: find.kind === 'land' ? 'land2' : 'car2',
        title: find.title,
        location: find.location,
        askingPriceGbp: find.asking_price_pence != null ? find.asking_price_pence / 100 : undefined,
        analysis: {
          assetSummary: find.summary,
          targetBuyPriceGbp: find.asking_price_pence != null ? find.asking_price_pence / 100 : 0,
          projectedResalePriceGbp: find.est_value_pence != null ? find.est_value_pence / 100 : 0,
          projectedProfitGbp: find.projected_profit_pence != null ? find.projected_profit_pence / 100 : 0,
          riskFlags: find.reasons,
          sourceUrl: find.url,
          verdict: find.verdict,
          effortScore: find.effort_score,
        },
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setDeals((d) => [data.deal, ...d]);
    }
  };

  if (state === 'checking') {
    return (
      <div className="min-h-screen bg-performance-grey flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-performance-turquoise border-t-transparent rounded-full" />
      </div>
    );
  }

  const scoutTab = isScout(tab);
  const scoutKind: 'car' | 'land' = tab === 'land2' ? 'land' : 'car';
  const tabDeals = deals.filter((d) => d.asset_class === tab);
  // Older rows predate the kind column and are all car finds.
  const tabFinds = finds.filter((f) => (f.kind || 'car') === scoutKind);
  const pipelineProfit = deals
    .filter((d) => d.stage !== 'passed')
    .reduce((s, d) => s + (d.projected_profit_pence || 0), 0);
  const closedProfit = deals
    .filter((d) => d.stage === 'closed')
    .reduce((s, d) => s + (d.projected_profit_pence || 0), 0);
  const ph = PLACEHOLDERS[tab] || { title: '', loc: '', price: '' };

  return (
    <>
      <Head>
        <title>War Room</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <main className="min-h-screen bg-performance-grey text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Header */}
          <div className="flex items-start justify-between mb-8 gap-4">
            <div>
              <p className="text-performance-turquoise text-[10px] font-bold tracking-[0.45em] uppercase mb-3">
                Classified · Owner Only
              </p>
              <h1 className="font-display text-5xl font-bold text-white">War Room</h1>
              <p className="text-gray-400 mt-3 text-sm">
                Signed in as <span className="text-performance-babyblue">{ownerEmail}</span>
              </p>
            </div>
            <div className="hidden sm:flex w-14 h-14 rounded-xl bg-performance-turquoise/10 border border-performance-turquoise/30 items-center justify-center text-2xl">
              🛡️
            </div>
          </div>

          {/* Portfolio bar (flip profit only — market plays have no fixed profit) */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Metric label="Projected flip profit" value={gbp(pipelineProfit)} accent />
            <Metric label="Banked (closed)" value={gbp(closedProfit)} />
            <Metric label="Live deals" value={String(deals.filter((d) => d.stage !== 'passed').length)} />
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {TABS.map((t) => (
              <TabButton key={t.key} active={tab === t.key} onClick={() => switchTab(t.key)} icon={t.icon} label={t.label} />
            ))}
          </div>

          {/* Auto-Scout desks (cars + land) */}
          {scoutTab && (
            <ScoutDesk
              kind={scoutKind}
              finds={tabFinds}
              scanning={scanning}
              scanMsg={scanMsg}
              onScan={() => scanNow(scoutKind)}
              onPromote={promoteFind}
              onDismiss={dismissFind}
            />
          )}

          {/* Engine input */}
          {!scoutTab && (
          <div className="bg-performance-panel border border-performance-turquoise/20 rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-bold text-white mb-1">
              {tab === 'land' ? 'Source & analyse a plot' : 'Source & analyse a car'}
            </h2>
            <p className="text-gray-500 text-xs mb-5">
              Paste a listing or describe it. The AI values it, builds your negotiation line, projects the net profit and tells you who to flip it to.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={ph.title}
                className="sm:col-span-2 w-full px-4 py-3 bg-performance-turquoise/10 border border-performance-turquoise/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-performance-turquoise"
              />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={ph.loc}
                className="w-full px-4 py-3 bg-performance-turquoise/10 border border-performance-turquoise/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-performance-turquoise"
              />
              <input
                value={asking}
                onChange={(e) => setAsking(e.target.value)}
                inputMode="numeric"
                placeholder={ph.price}
                className="w-full px-4 py-3 bg-performance-turquoise/10 border border-performance-turquoise/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-performance-turquoise"
              />
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                placeholder="Paste the listing text / any details (condition, planning, mileage, why it's cheap…)"
                className="sm:col-span-2 w-full px-4 py-3 bg-performance-turquoise/10 border border-performance-turquoise/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-performance-turquoise resize-none"
              />
            </div>

            {err && <p className="text-red-400 text-sm mt-3">{err}</p>}

            <button
              onClick={runAnalysis}
              disabled={analyzing}
              className="mt-5 px-6 py-3 bg-gradient-to-r from-performance-turquoise to-performance-babyblue text-performance-grey font-bold rounded-lg hover:shadow-lg hover:shadow-performance-turquoise/30 transition-all disabled:opacity-60 flex items-center gap-2"
            >
              {analyzing ? (
                <><span className="w-4 h-4 border-2 border-performance-grey/40 border-t-performance-grey rounded-full animate-spin" /> Analysing…</>
              ) : (
                <>⚡ Analyse with AI</>
              )}
            </button>
          </div>
          )}

          {/* Analysis result */}
          {analysis && !scoutTab && <FlipResult a={analysis} onSave={saveDeal} saving={saving} />}

          {/* Pipeline */}
          <h2 className="text-xl font-bold text-white mb-4 mt-8">
            {TABS.find((t) => t.key === tab)?.label.replace(/ (Engine|Desk)$/, '')} pipeline{' '}
            <span className="text-gray-500 text-sm font-normal">({tabDeals.length})</span>
          </h2>

          {tabDeals.length === 0 ? (
            <div className="bg-performance-panel border border-performance-turquoise/15 rounded-xl p-10 text-center text-gray-500 text-sm">
              Nothing here yet. Analyse one above and add it to start tracking.
            </div>
          ) : (
            <div className="space-y-3">
              {tabDeals.map((d) => (
                <div key={d.id} className="bg-performance-panel border border-performance-turquoise/20 rounded-xl p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-semibold text-white text-sm truncate">{d.title}</p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        {`${d.location || '—'} · ask ${gbp(d.asking_price_pence)} · buy ${gbp(d.target_buy_pence)} · resell ${gbp(d.resale_pence)}`}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-performance-turquoise font-bold text-sm">{gbp(d.projected_profit_pence)}</p>
                      <p className="text-gray-600 text-[10px] uppercase tracking-wide">net profit</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <select
                      value={d.stage}
                      onChange={(e) => changeStage(d.id, e.target.value)}
                      className="bg-performance-grey border border-performance-turquoise/30 rounded-lg text-xs text-white px-3 py-2 focus:outline-none focus:border-performance-turquoise"
                    >
                      {FLIP_STAGES.map((s) => (
                        <option key={s.value} value={s.value} className="bg-performance-grey">{s.label}</option>
                      ))}
                    </select>
                    <span className="text-gray-600 text-xs">{STAGE_LABELS[d.stage] || d.stage}</span>
                    <button
                      onClick={() => removeDeal(d.id)}
                      className="text-gray-600 hover:text-red-400 text-xs ml-auto transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Honesty / roadmap note */}
          <div className="mt-12 bg-performance-grey border border-performance-turquoise/15 rounded-xl p-5">
            <p className="text-performance-babyblue text-xs font-bold uppercase tracking-wider mb-2">How automated is this?</p>
            <p className="text-gray-400 text-xs leading-relaxed">
              Live today: manual flip analysis (valuation, negotiation + ready-to-send offer, net profit,
              buyer profiling) for land &amp; cars, plus two Auto-Scouts that sweep the live web on schedule
              and score every find on profit vs work. Next build on top: auto-sending offers and
              auto-matching real buyers.
            </p>
          </div>

          <p className="text-center text-gray-600 text-xs mt-10">
            M&amp;M Auto Performance · War Room · access restricted to the owner account
          </p>
        </div>
      </main>
    </>
  );
};

const ScoutDesk: React.FC<{
  kind: 'car' | 'land';
  finds: Find[];
  scanning: boolean;
  scanMsg: string;
  onScan: () => void;
  onPromote: (f: Find) => void;
  onDismiss: (id: string) => void;
}> = ({ kind, finds, scanning, scanMsg, onScan, onPromote, onDismiss }) => (
  <div className="mb-6">
    {/* Control bar */}
    <div className="bg-performance-panel border border-performance-turquoise/20 rounded-2xl p-6 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white mb-1">
            {kind === 'land' ? '🛰️ Land Scout — the market hunts itself' : '🛰️ Car Scout — the market hunts itself'}
          </h2>
          <p className="text-gray-500 text-xs max-w-lg">
            Scans the live web for {kind === 'land' ? 'underpriced UK land — lapsed planning, probate sales, low auction guides' : 'underpriced UK cars'} on
            a schedule (daily baseline + hourly sweeps), scores every find on{' '}
            <span className="text-performance-babyblue">profit</span> vs{' '}
            <span className="text-performance-babyblue">work required</span>, and flags the no-brainers 💎.
          </p>
        </div>
        <button
          onClick={onScan}
          disabled={scanning}
          className="px-6 py-3 bg-gradient-to-r from-performance-turquoise to-performance-babyblue text-performance-grey font-bold rounded-lg hover:shadow-lg hover:shadow-performance-turquoise/30 transition-all disabled:opacity-60 flex items-center gap-2"
        >
          {scanning ? (
            <><span className="w-4 h-4 border-2 border-performance-grey/40 border-t-performance-grey rounded-full animate-spin" /> Scanning the web…</>
          ) : (
            <>📡 Scan now</>
          )}
        </button>
      </div>
      {scanMsg && <p className="text-performance-babyblue text-xs mt-4">{scanMsg}</p>}
    </div>

    {/* Finds feed */}
    {finds.length === 0 ? (
      <div className="bg-performance-panel border border-performance-turquoise/15 rounded-xl p-10 text-center text-gray-500 text-sm">
        No finds yet — hit <span className="text-performance-babyblue">Scan now</span> to run the first sweep.
        New finds also land here automatically on every scheduled scan.
      </div>
    ) : (
      <div className="space-y-4">
        {finds.map((f) => {
          const v = VERDICT_STYLE[f.verdict] || VERDICT_STYLE.OK;
          return (
            <div key={f.id} className="bg-performance-panel border border-performance-turquoise/20 rounded-xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[11px] font-bold px-2 py-1 rounded border ${v.cls}`}>{v.badge}</span>
                    {f.status === 'promoted' && (
                      <span className="text-[11px] font-bold px-2 py-1 rounded border text-performance-babyblue bg-performance-babyblue/10 border-performance-babyblue/30">In pipeline</span>
                    )}
                  </div>
                  <p className="font-semibold text-white text-sm mt-2">{f.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {f.source || 'web'}{f.location ? ` · ${f.location}` : ''} ·{' '}
                    {new Date(f.found_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-performance-turquoise font-bold text-xl">{gbp(f.projected_profit_pence)}</p>
                  <p className="text-gray-600 text-[10px] uppercase tracking-wide">projected profit</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                <Metric label="Asking" value={gbp(f.asking_price_pence)} />
                <Metric label="Est. market value" value={gbp(f.est_value_pence)} />
                <div className="rounded-xl border p-4 bg-performance-panel border-performance-turquoise/20">
                  <p className="text-lg font-bold text-white">{f.effort_score ?? '—'}/10</p>
                  <p className="text-gray-500 text-[11px] mt-0.5">Work required · {effortLabel(f.effort_score)}</p>
                </div>
              </div>

              {f.summary && <p className="text-gray-300 text-sm mb-3">{f.summary}</p>}
              {f.reasons.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {f.reasons.map((r, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded-full bg-performance-turquoise/10 border border-performance-turquoise/30 text-performance-babyblue">{r}</span>
                  ))}
                </div>
              )}

              {/* Where the vehicle is advertised — always at least one link */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-gray-600 text-[10px] uppercase tracking-wide">Advertised at:</span>
                {f.url && (
                  <a
                    href={f.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-3 py-1.5 rounded-lg bg-performance-turquoise text-performance-grey font-bold hover:bg-performance-turquoise/90 transition-all"
                  >
                    Open the advert ↗
                  </a>
                )}
                {(f.sources || []).map((s, i) => (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-performance-turquoise/10 border border-performance-turquoise/30 text-performance-babyblue hover:border-performance-turquoise/60 transition-all"
                  >
                    {sourceLabel(s)} ↗
                  </a>
                ))}
                <a
                  href={findSearchUrl(f)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-2.5 py-1.5 rounded-lg bg-performance-grey border border-performance-turquoise/20 text-gray-300 hover:text-white hover:border-performance-turquoise/50 transition-all"
                >
                  🔎 Find this advert
                </a>
              </div>

              <div className="flex items-center gap-3">
                {f.status !== 'promoted' && (
                  <button
                    onClick={() => onPromote(f)}
                    className="px-4 py-2 bg-performance-turquoise text-performance-grey text-xs font-bold rounded-lg hover:bg-performance-turquoise/90 transition-all"
                  >
                    ＋ Pursue this deal
                  </button>
                )}
                <button
                  onClick={() => onDismiss(f.id)}
                  className="text-gray-600 hover:text-red-400 text-xs ml-auto transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          );
        })}
      </div>
    )}

    <p className="text-gray-600 text-[11px] leading-relaxed mt-4">
      Every &ldquo;Open the advert&rdquo; link is live-checked before it&apos;s shown, and stored links are
      re-audited on every deploy — but sellers can still pull an advert at any time. If a direct link is
      missing, the source chips and 🔎 search will find it. Always verify price and availability on the
      listing before offering.
    </p>
  </div>
);

const FlipResult: React.FC<{ a: FlipAnalysis; onSave: () => void; saving: boolean }> = ({ a, onSave, saving }) => (
  <div className="bg-performance-panel border border-performance-turquoise/30 rounded-2xl p-6">
    <p className="text-white text-sm mb-5">{a.assetSummary}</p>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
      <Metric label="Market value" value={gbpN(a.estimatedMarketValueGbp)} />
      <Metric label="Opening offer" value={gbpN(a.fairOpeningOfferGbp)} />
      <Metric label="Max buy price" value={gbpN(a.targetBuyPriceGbp)} />
      <Metric label="Net profit" value={gbpN(a.projectedProfitGbp)} accent />
    </div>
    <div className="flex gap-6 mb-5 text-xs">
      <Gauge label="Undervaluation" pct={a.undervaluationScore} />
      <Gauge label="AI confidence" pct={a.confidence} />
    </div>
    {a.riskFlags.length > 0 && (
      <Block title="⚠️ Risk flags">
        <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
          {a.riskFlags.map((r, i) => <li key={i}>{r}</li>)}
        </ul>
      </Block>
    )}
    <Block title="🤝 Negotiation strategy"><p className="text-gray-300 text-sm">{a.negotiationStrategy}</p></Block>
    <Block title="✉️ Ready-to-send offer">
      <p className="text-gray-200 text-sm whitespace-pre-wrap bg-performance-grey/60 border border-performance-turquoise/15 rounded-lg p-3">{a.negotiationMessage}</p>
    </Block>
    <Block title="🎯 Ideal buyer">
      <p className="text-gray-300 text-sm mb-2">{a.idealBuyerProfile}</p>
      <div className="flex flex-wrap gap-2">
        {a.buyerChannels.map((c, i) => (
          <span key={i} className="text-xs px-2 py-1 rounded-full bg-performance-turquoise/10 border border-performance-turquoise/30 text-performance-babyblue">{c}</span>
        ))}
      </div>
    </Block>
    {a.nextActions.length > 0 && (
      <Block title="✅ Next actions">
        <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
          {a.nextActions.map((x, i) => <li key={i}>{x}</li>)}
        </ul>
      </Block>
    )}
    <SaveButton onSave={onSave} saving={saving} />
  </div>
);

const SaveButton: React.FC<{ onSave: () => void; saving: boolean }> = ({ onSave, saving }) => (
  <button
    onClick={onSave}
    disabled={saving}
    className="mt-2 px-5 py-2.5 bg-performance-turquoise text-performance-grey font-bold rounded-lg hover:bg-performance-turquoise/90 transition-all disabled:opacity-60"
  >
    {saving ? 'Adding…' : '＋ Add to pipeline'}
  </button>
);

const Metric: React.FC<{ label: string; value: string; accent?: boolean }> = ({ label, value, accent }) => (
  <div className={`rounded-xl border p-4 ${accent ? 'bg-performance-turquoise/10 border-performance-turquoise/40' : 'bg-performance-panel border-performance-turquoise/20'}`}>
    <p className={`text-lg font-bold ${accent ? 'text-performance-turquoise' : 'text-white'}`}>{value}</p>
    <p className="text-gray-500 text-[11px] mt-0.5">{label}</p>
  </div>
);

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: string; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`px-5 py-3 rounded-xl font-semibold text-sm border transition-all ${
      active
        ? 'bg-performance-turquoise/15 border-performance-turquoise/50 text-white'
        : 'bg-performance-panel border-performance-turquoise/15 text-gray-400 hover:text-gray-200'
    }`}
  >
    {icon} {label}
  </button>
);

const Block: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-4">
    <p className="text-performance-babyblue text-xs font-bold uppercase tracking-wider mb-2">{title}</p>
    {children}
  </div>
);

const Gauge: React.FC<{ label: string; pct: number }> = ({ label, pct }) => (
  <div className="flex-1">
    <div className="flex justify-between mb-1">
      <span className="text-gray-500">{label}</span>
      <span className="text-performance-babyblue font-bold">{Math.round(pct)}%</span>
    </div>
    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
      <div className="h-full bg-gradient-to-r from-performance-turquoise to-performance-babyblue rounded-full" style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} />
    </div>
  </div>
);

export default WarRoom;
