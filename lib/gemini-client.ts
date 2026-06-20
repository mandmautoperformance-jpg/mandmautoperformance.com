import { GoogleGenerativeAI } from '@google/generative-ai';

// Prefer the server-only key; fall back to the legacy NEXT_PUBLIC_ name so
// existing deployments keep working without an env-var rename.
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '',
);

// Current, generally-available models. `gemini-1.5-flash` was shut down on
// 2026-06-01 and now 404s, so we default to 2.5-flash and fall back to the
// lite variant if the primary is ever unavailable. Override with GEMINI_MODEL.
export const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const FALLBACK_MODELS = [MODEL_NAME, 'gemini-2.5-flash', 'gemini-2.5-flash-lite'].filter(
  (m, i, arr) => arr.indexOf(m) === i,
);

function isModelUnavailable(error: unknown): boolean {
  const msg = (error instanceof Error ? error.message : String(error)).toLowerCase();
  return msg.includes('not found') || msg.includes('404') || msg.includes('not supported');
}

// System prompt for MIA Autonomous Closer. Fleet kept in sync with pages/fleet.tsx.
const MIA_SYSTEM_PROMPT = `You are MIA (Motor Intelligence Assistant), the autonomous concierge for M&M Auto Performance,
a premium vehicle hire company serving London and Hertfordshire with luxury, sports, supercar and exotic vehicles.

Your role: help customers find and book the perfect vehicle through natural conversation. Be warm, professional, confident and genuinely helpful.

Core responsibilities:
1. Understand the customer's needs (occasion, budget, dates, pickup area, passengers, preferences).
2. Recommend the best vehicle from our fleet for their needs, with the price.
3. Handle questions about price, insurance, locations and process.
4. Guide them toward a booking.
5. Offer helpful local knowledge (ULEZ, parking, driving routes) when relevant.

Our fleet (all prices GBP):
- Lamborghini Huracán — supercar — £1,500/day (£200/hr) — Mayfair, London
- Ferrari F8 Tributo — supercar — £1,800/day (£250/hr) — St Albans, Herts
- Porsche 911 Turbo S — sports — £800/day (£120/hr) — Watford, Herts
- Bentley Continental GT — luxury — £600/day (£100/hr) — Mayfair, London
- Rolls-Royce Ghost — luxury — £1,200/day (£180/hr) — Mayfair, London
- Aston Martin DB12 — sports — £950/day (£140/hr) — St Albans, Herts
- Lamborghini Revuelto — exotic — £2,200/day (£350/hr) — Mayfair, London
- Tesla Model S Plaid — luxury — £350/day (£60/hr) — Watford, Herts
- Range Rover Sport — luxury — £400/day (£70/hr) — Hemel Hempstead
- Mercedes-AMG GT 63S — sports — £700/day (£110/hr) — St Albans, Herts
- Mercedes-AMG S63 E Performance — luxury — £900/day (£140/hr) — Mayfair, London
- Mercedes-AMG C63 S E Performance — sports — £500/day (£80/hr) — St Albans, Herts
- BMW M4 Competition — sports — £350/day (£58/hr) — St Albans, Herts
- BMW M3 Competition — sports — £320/day (£55/hr) — Watford, Herts
- Audi RS3 — sports — £300/day (£50/hr) — Watford, Herts
- Mercedes-AMG CLA 45 S — sports — £280/day (£48/hr) — St Albans, Herts
- Volkswagen Golf R — sports — £250/day (£45/hr) — Hemel Hempstead

Guidelines:
- Show prices as £X,XXX/day. Mention hourly hire when useful.
- Mention the M&M Credits loyalty programme (earn 1% of the rental value back) where natural.
- Be enthusiastic but honest about trade-offs; suggest alternatives if budget is tight.
- When the customer gives dates/needs, recommend specific vehicles with prices.
- Never invent vehicles, prices or policies that aren't listed above. If you don't know, say so and offer to connect them with the team via the Contact page.
- Respect privacy; don't ask for sensitive documents in chat.
- Keep replies concise (2–3 sentences) until the customer is ready to book, then give clear next steps.

When the customer is ready to book:
- Confirm vehicle, dates, pickup area, passengers and the total.
- Explain the next step: complete the booking form, then document verification (licence & insurance) and payment.
- Be encouraging: "You're going to love this one."

Tone: conversational, helpful, a little witty, confident, never pushy.`;

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function streamChatCompletion(
  messages: ConversationMessage[],
  onChunk?: (chunk: string) => void,
): Promise<string> {
  if (!process.env.GEMINI_API_KEY && !process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
    throw new Error(
      'MIA is not configured: missing GEMINI_API_KEY. Add it in the Vercel project settings.',
    );
  }

  // Map the conversation into Gemini's user/model turns. Drop any leading
  // assistant turn (e.g. the greeting) since Gemini history must start with a user turn.
  const turns = messages
    .map((msg) => ({
      role: (msg.role === 'user' ? 'user' : 'model') as 'user' | 'model',
      parts: [{ text: msg.content }],
    }));
  while (turns.length && turns[0].role === 'model') turns.shift();

  let lastError: unknown;

  for (const modelName of FALLBACK_MODELS) {
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: MIA_SYSTEM_PROMPT,
    });

    try {
      let fullResponse = '';
      const stream = await model.generateContentStream({ contents: turns });

      for await (const chunk of stream.stream) {
        const text = chunk.text();
        if (text) {
          fullResponse += text;
          onChunk?.(text);
        }
      }

      return fullResponse;
    } catch (error) {
      lastError = error;
      console.error(`Gemini API error (model ${modelName}):`, error);
      // Only try the next model if this one is unavailable; otherwise stop.
      if (!isModelUnavailable(error)) break;
    }
  }

  const detail = lastError instanceof Error ? lastError.message : 'unknown error';
  throw new Error(`Failed to get AI response: ${detail}`);
}

export async function getTokenCount(text: string): Promise<number> {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.countTokens(text);
    return result.totalTokens;
  } catch (error) {
    console.error('Token counting error:', error);
    return 0;
  }
}

// Vehicle recommendation based on user context
export async function suggestVehicle(userMessage: string, budget?: number): Promise<string> {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const suggestionPrompt = `Based on this customer request: "${userMessage}"
${budget ? `Their budget is £${budget}/day.` : 'No specific budget mentioned.'}

From our fleet, which vehicle is the best match? Respond in format:
VEHICLE: [Model Name]
PRICE: £XXX/day
REASON: [2-3 sentence explanation]`;

  try {
    const result = await model.generateContent(suggestionPrompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Vehicle suggestion error:', error);
    throw new Error('Failed to suggest vehicle');
  }
}

// Check if conversation is ready to close booking
export async function detectClosingOpportunity(
  messages: ConversationMessage[],
  currentBookingState: any,
): Promise<boolean> {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const lastUserMessage = messages[messages.length - 1].content;

  const closingPrompt = `Analyze this customer message: "${lastUserMessage}"

Current booking state:
- Vehicle selected: ${currentBookingState.vehicle_id || 'No'}
- Dates confirmed: ${currentBookingState.pickup_date ? 'Yes' : 'No'}
- Pickup location: ${currentBookingState.pickup_location || 'No'}

Is the customer ready to proceed with booking? Answer only: YES or NO`;

  try {
    const result = await model.generateContent(closingPrompt);
    const response = result.response.text().trim().toUpperCase();
    return response === 'YES';
  } catch (error) {
    console.error('Closing detection error:', error);
    return false;
  }
}

// Extract booking details from conversation
export interface ExtractedBookingDetails {
  vehicle_preference?: string;
  pickup_date?: string;
  return_date?: string;
  pickup_location?: string;
  budget?: number;
  passengers?: number;
  use_case?: string;
}

export async function extractBookingDetails(
  conversationText: string,
): Promise<ExtractedBookingDetails> {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const extractionPrompt = `From this booking conversation, extract details as JSON:
"${conversationText}"

Extract into JSON (use null if not mentioned):
{
  "vehicle_preference": string|null,
  "pickup_date": string|null (YYYY-MM-DD),
  "return_date": string|null (YYYY-MM-DD),
  "pickup_location": string|null,
  "budget": number|null (in GBP per day),
  "passengers": number|null,
  "use_case": string|null (e.g. "weekend getaway", "business trip")
}

Return ONLY valid JSON, no markdown.`;

  try {
    const result = await model.generateContent(extractionPrompt);
    const jsonText = result.response.text().trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Detail extraction error:', error);
    return {};
  }
}
