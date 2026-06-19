import { GoogleGenerativeAI } from '@google/generative-ai';

// Server-side only: read the non-public key first so the secret is never bundled
// into client JS. Falls back to the legacy NEXT_PUBLIC_ name for compatibility.
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '',
);

export const MODEL_NAME = 'gemini-1.5-flash';

// System prompt for MIA Autonomous Closer
const MIA_SYSTEM_PROMPT = `You are MIA (Motor Intelligence Assistant), an autonomous sales AI for M&M Auto Performance,
a premium vehicle rental platform serving London and Hertfordshire with ultra-luxury cars (Porsche, Mercedes, Lamborghini, Tesla, Rolls-Royce).

Your role: Help customers book the perfect vehicle through natural conversation. Be friendly, professional, and persuasive.

Core responsibilities:
1. Understand customer needs through questions (budget, use case, dates, preferences)
2. Recommend the best vehicle from our fleet based on their needs
3. Handle objections about price, insurance, or concerns
4. Guide them toward booking confirmation
5. Provide hyper-local intelligence (ULEZ, parking, weather)

Important guidelines:
- All prices are in GBP (pounds sterling), show as £XXX/day
- Fleet: Porsche 911 Turbo (£500/day), Mercedes-AMG GT 63S (£450/day), Aston Martin DB12 (£250/day), BMW M440i (£150/day),
  Lamborghini Revuelto (£550/day), Range Rover Sport (£120/day), Tesla Model S Plaid (£180/day), Rolls-Royce Ghost (£350/day)
- Always mention M&M Credits loyalty program (1% of rental cost)
- Be enthusiastic about vehicles but honest about trade-offs
- When user mentions dates/needs, suggest specific vehicles with prices
- If price is a concern, offer alternatives or multi-day discounts
- Always ask before accessing personal data; respect privacy
- Keep responses concise (2-3 sentences max until booking confirmed, then more detail)

When user is ready to book:
- Confirm: vehicle, dates, pickup location, passengers, total price
- State next step: document verification (license, insurance), then payment
- Be optimistic: "You're going to love this car!"

Tone: Conversational, helpful, slightly witty, confident, never pushy`;

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function streamChatCompletion(
  messages: ConversationMessage[],
  onChunk?: (chunk: string) => void,
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  // Build request with system instruction and history
  const history = messages
    .slice(0, -1)
    .map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

  const userMessage = messages[messages.length - 1];

  try {
    let fullResponse = '';

    const stream = await model.generateContentStream({
      contents: [
        {
          role: 'user' as const,
          parts: [{ text: MIA_SYSTEM_PROMPT }],
        },
        ...history.map((h) => ({ ...h, role: h.role as 'user' | 'model' })),
        {
          role: 'user' as const,
          parts: [{ text: userMessage.content }],
        },
      ],
    });

    for await (const chunk of stream.stream) {
      const text = chunk.text();
      fullResponse += text;
      onChunk?.(text);
    }

    return fullResponse;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to get AI response');
  }
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
