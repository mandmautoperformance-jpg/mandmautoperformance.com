import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * War Room — AI Deal Engine.
 *
 * Reuses the same Gemini key as MIA to analyse a potential flip (land or a
 * performance car): estimate value, propose a negotiation line, project the
 * profit and describe the buyer to flip it to. This is the "brain"; turning it
 * into a fully hands-off pipeline needs live data + transaction connectors,
 * which are added on top of this.
 */

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '',
);

const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const FALLBACK_MODELS = [MODEL_NAME, 'gemini-2.5-flash', 'gemini-2.5-flash-lite'].filter(
  (m, i, arr) => arr.indexOf(m) === i,
);

export type AssetClass = 'land' | 'car';

export interface DealInput {
  assetClass: AssetClass;
  title: string;
  location?: string;
  askingPriceGbp?: number;
  details?: string;
}

export interface DealAnalysis {
  assetSummary: string;
  estimatedMarketValueGbp: number;
  fairOpeningOfferGbp: number;
  targetBuyPriceGbp: number;
  projectedResalePriceGbp: number;
  projectedProfitGbp: number;
  undervaluationScore: number; // 0-100
  confidence: number; // 0-100
  riskFlags: string[];
  negotiationStrategy: string;
  negotiationMessage: string;
  idealBuyerProfile: string;
  buyerChannels: string[];
  nextActions: string[];
}

function isModelUnavailable(error: unknown): boolean {
  const msg = (error instanceof Error ? error.message : String(error)).toLowerCase();
  return msg.includes('not found') || msg.includes('404') || msg.includes('not supported');
}

function num(v: unknown, fallback = 0): number {
  const n = typeof v === 'string' ? parseFloat(v.replace(/[^0-9.-]/g, '')) : Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function strArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map((x) => String(x)).filter(Boolean).slice(0, 8);
  return [];
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

const SYSTEM = `You are the M&M War Room Deal Engine — a sharp, numerate UK-focused deal analyst that
helps an investor buy an asset below market value, negotiate the price down, and flip it to a ready buyer.
You are decisive and commercial, but you never invent fake certainty: when data is thin you lower the
confidence score and say what must be verified. All money is in GBP (£). Be realistic about UK costs
(for LAND: legal/conveyancing, surveys, planning risk, SDLT where relevant; for CARS: inspection,
transport, reconditioning, marketplace fees, VAT/margin scheme). Profit must be NET of those costs.`;

function buildPrompt(input: DealInput): string {
  const asking = input.askingPriceGbp ? `£${input.askingPriceGbp.toLocaleString()}` : 'not stated';
  const assetWord = input.assetClass === 'land' ? 'plot of land' : 'performance / luxury car';
  return `Analyse this ${assetWord} as a buy-low / flip opportunity.

ASSET TITLE: ${input.title}
LOCATION: ${input.location || 'not stated'}
ASKING PRICE: ${asking}
DETAILS PROVIDED: ${input.details || 'none beyond the title'}

Return STRICT JSON (no markdown) matching exactly this shape:
{
  "assetSummary": "1-2 sentence plain summary of what this is and the angle",
  "estimatedMarketValueGbp": number,
  "fairOpeningOfferGbp": number,      // aggressive but credible first offer
  "targetBuyPriceGbp": number,        // the most you should pay (walk-away ceiling)
  "projectedResalePriceGbp": number,  // realistic resale to the end buyer
  "projectedProfitGbp": number,       // resale minus target buy minus realistic costs (NET)
  "undervaluationScore": number,      // 0-100, how under-priced vs market the asking is
  "confidence": number,               // 0-100, your confidence given the info supplied
  "riskFlags": ["short risk", "..."],
  "negotiationStrategy": "2-4 sentences: leverage points and how to push the price down",
  "negotiationMessage": "a ready-to-send opening message to the seller making the offer",
  "idealBuyerProfile": "who buys this and why, 1-2 sentences",
  "buyerChannels": ["specific place/channel to find that buyer", "..."],
  "nextActions": ["concrete next step", "..."]
}
Only output the JSON object.`;
}

export async function analyzeDeal(input: DealInput): Promise<DealAnalysis> {
  if (!process.env.GEMINI_API_KEY && !process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
    throw new Error('Deal Engine is not configured: missing GEMINI_API_KEY.');
  }

  let lastError: unknown;
  for (const modelName of FALLBACK_MODELS) {
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: SYSTEM,
      generationConfig: { responseMimeType: 'application/json', temperature: 0.6 },
    });
    try {
      const result = await model.generateContent(buildPrompt(input));
      let text = result.response.text().trim();
      // Be tolerant of accidental markdown fences.
      text = text.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
      const raw = JSON.parse(text);

      return {
        assetSummary: String(raw.assetSummary || '').slice(0, 600),
        estimatedMarketValueGbp: num(raw.estimatedMarketValueGbp),
        fairOpeningOfferGbp: num(raw.fairOpeningOfferGbp),
        targetBuyPriceGbp: num(raw.targetBuyPriceGbp),
        projectedResalePriceGbp: num(raw.projectedResalePriceGbp),
        projectedProfitGbp: num(raw.projectedProfitGbp),
        undervaluationScore: clamp(num(raw.undervaluationScore), 0, 100),
        confidence: clamp(num(raw.confidence), 0, 100),
        riskFlags: strArray(raw.riskFlags),
        negotiationStrategy: String(raw.negotiationStrategy || '').slice(0, 1200),
        negotiationMessage: String(raw.negotiationMessage || '').slice(0, 2000),
        idealBuyerProfile: String(raw.idealBuyerProfile || '').slice(0, 600),
        buyerChannels: strArray(raw.buyerChannels),
        nextActions: strArray(raw.nextActions),
      };
    } catch (error) {
      lastError = error;
      console.error(`Deal Engine error (model ${modelName}):`, error);
      if (!isModelUnavailable(error)) break;
    }
  }

  const detail = lastError instanceof Error ? lastError.message : 'unknown error';
  throw new Error(`Deal analysis failed: ${detail}`);
}
