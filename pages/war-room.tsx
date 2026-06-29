import React, { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

/**
 * War Room — private owner-only deal desk.
 *
 * Two engines on one screen:
 *   • Land Flip Engine  — source undervalued land, AI-negotiate, AI buyer-match
 *   • Car Flip Desk     — the same engine aimed at performance/luxury cars
 * Both are powered by the Gemini Deal Engine and persist to war_room_deals.
 */

type AssetClass = 'land' | 'car';

interface Analysis {
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
  analysis: Analysis | Record<string, never>;
  created_at: string;
}

const STAGES: { value: string; label: string }[] = [
  { value: 'sourced', label: 'Sourced' },
  { value: 'offer_sent', label: 'Offer Sent' },
  { value: 'negotiating', label: 'Negotiating' },
  { value: 'buyer_matched', label: 'Buyer Matched' },
  { value: 'closed', label: 'Closed' },
  { value: 'passed', label: 'Passed' },
];

const gbp = (pence: number | null | undefined): string =>
  pence == null ? '—' : `£${Math.round(pence / 100).toLocaleString()}`;
const gbpFromNum = (n: number): string => `£${Math.round(n).toLocaleString()}`;

const WarRoom: React.FC = () => {
  const router = useRouter();
  const [state, setState] = useState<'checking' | 'ready'>('checking');
  const [token, setToken] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [tab, setTab] = useState<AssetClass>('land');
  const [deals, setDeals] = useState<Deal[]>([]);

  // Engine form
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [asking, setAsking] = useState('');
  const [details, setDetails] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

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
      await loadDeals(session.access_token);
      setState('ready');
    }
    gate();
  }, [router, loadDeals]);

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

  if (state === 'checking') {
    return (
      <div className="min-h-screen bg-performance-grey flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-performance-turquoise border-t-transparent rounded-full" />
      </div>
    );
  }

  const tabDeals = deals.filter((d) => d.asset_class === tab);
  const pipelineProfit = deals
    .filter((d) => d.stage !== 'passed')
    .reduce((s, d) => s + (d.projected_profit_pence || 0), 0);
  const closedProfit = deals
    .filter((d) => d.stage === 'closed')
    .reduce((s, d) => s + (d.projected_profit_pence || 0), 0);

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

          {/* Portfolio bar */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Metric label="Projected pipeline profit" value={gbp(pipelineProfit)} accent />
            <Metric label="Banked (closed)" value={gbp(closedProfit)} />
            <Metric label="Live deals" value={String(deals.filter((d) => d.stage !== 'passed').length)} />
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <TabButton active={tab === 'land'} onClick={() => switchTab('land')} icon="🌍" label="Land Flip Engine" />
            <TabButton active={tab === 'car'} onClick={() => switchTab('car')} icon="🏎️" label="Car Flip Desk" />
          </div>

          {/* Engine input */}
          <div className="bg-performance-panel border border-performance-turquoise/20 rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-bold text-white mb-1">
              {tab === 'land' ? 'Source & analyse a plot' : 'Source & analyse a car'}
            </h2>
            <p className="text-gray-500 text-xs mb-5">
              Paste a listing or describe it. The AI values it, builds your negotiation line, projects the
              net profit and tells you who to flip it to.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={tab === 'land' ? '5 acres, residential development potential' : '2019 Lamborghini Huracán, 12k miles'}
                className="sm:col-span-2 w-full px-4 py-3 bg-performance-turquoise/10 border border-performance-turquoise/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-performance-turquoise"
              />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={tab === 'land' ? 'Location (e.g. St Albans, Herts)' : 'Location / seller (e.g. dealer, Leeds)'}
                className="w-full px-4 py-3 bg-performance-turquoise/10 border border-performance-turquoise/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-performance-turquoise"
              />
              <input
                value={asking}
                onChange={(e) => setAsking(e.target.value)}
                inputMode="numeric"
                placeholder="Asking price (£)"
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

          {/* Analysis result */}
          {analysis && (
            <div className="bg-performance-panel border border-performance-turquoise/30 rounded-2xl p-6 mb-8">
              <p className="text-white text-sm mb-5">{analysis.assetSummary}</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                <Metric label="Market value" value={gbpFromNum(analysis.estimatedMarketValueGbp)} />
                <Metric label="Opening offer" value={gbpFromNum(analysis.fairOpeningOfferGbp)} />
                <Metric label="Max buy price" value={gbpFromNum(analysis.targetBuyPriceGbp)} />
                <Metric label="Net profit" value={gbpFromNum(analysis.projectedProfitGbp)} accent />
              </div>

              <div className="flex gap-6 mb-5 text-xs">
                <Gauge label="Undervaluation" pct={analysis.undervaluationScore} />
                <Gauge label="AI confidence" pct={analysis.confidence} />
              </div>

              {analysis.riskFlags.length > 0 && (
                <Block title="⚠️ Risk flags">
                  <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
                    {analysis.riskFlags.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </Block>
              )}

              <Block title="🤝 Negotiation strategy">
                <p className="text-gray-300 text-sm">{analysis.negotiationStrategy}</p>
              </Block>

              <Block title="✉️ Ready-to-send offer">
                <p className="text-gray-200 text-sm whitespace-pre-wrap bg-performance-grey/60 border border-performance-turquoise/15 rounded-lg p-3">
                  {analysis.negotiationMessage}
                </p>
              </Block>

              <Block title="🎯 Ideal buyer">
                <p className="text-gray-300 text-sm mb-2">{analysis.idealBuyerProfile}</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.buyerChannels.map((c, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded-full bg-performance-turquoise/10 border border-performance-turquoise/30 text-performance-babyblue">{c}</span>
                  ))}
                </div>
              </Block>

              {analysis.nextActions.length > 0 && (
                <Block title="✅ Next actions">
                  <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
                    {analysis.nextActions.map((a, i) => <li key={i}>{a}</li>)}
                  </ul>
                </Block>
              )}

              <button
                onClick={saveDeal}
                disabled={saving}
                className="mt-2 px-5 py-2.5 bg-performance-turquoise text-performance-grey font-bold rounded-lg hover:bg-performance-turquoise/90 transition-all disabled:opacity-60"
              >
                {saving ? 'Adding…' : '＋ Add to pipeline'}
              </button>
            </div>
          )}

          {/* Pipeline */}
          <h2 className="text-xl font-bold text-white mb-4">
            {tab === 'land' ? 'Land pipeline' : 'Car pipeline'}{' '}
            <span className="text-gray-500 text-sm font-normal">({tabDeals.length})</span>
          </h2>

          {tabDeals.length === 0 ? (
            <div className="bg-performance-panel border border-performance-turquoise/15 rounded-xl p-10 text-center text-gray-500 text-sm">
              No deals yet. Analyse one above and add it to start your pipeline.
            </div>
          ) : (
            <div className="space-y-3">
              {tabDeals.map((d) => (
                <div key={d.id} className="bg-performance-panel border border-performance-turquoise/20 rounded-xl p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-semibold text-white text-sm truncate">{d.title}</p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        {d.location || '—'} · ask {gbp(d.asking_price_pence)} · buy {gbp(d.target_buy_pence)} · resell {gbp(d.resale_pence)}
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
                      {STAGES.map((s) => (
                        <option key={s.value} value={s.value} className="bg-performance-grey">{s.label}</option>
                      ))}
                    </select>
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
              Live today: the AI brain — valuation, negotiation strategy + ready-to-send offer, profit
              projection, buyer profiling and your saved pipeline. To make it fully hands-off (auto-pulling
              live listings, auto-sending offers, and matching real buyers) we plug in data + messaging
              connectors on top of this engine — that&apos;s the next build, and the foundation is now in place.
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
