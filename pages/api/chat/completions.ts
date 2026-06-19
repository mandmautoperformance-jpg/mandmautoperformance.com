import type { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseServer } from '@/lib/supabase-server';
import { streamChatCompletion } from '@/lib/gemini-client';
import { rateLimit } from '@/lib/rate-limit';

const chatRateLimit = rateLimit('chat', 30, 60_000); // 30 req/min per IP

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  message: string;
  conversation_id?: string;
  history?: ChatMessage[];
  booking_context?: {
    vehicle_id?: string;
    pickup_date?: string;
    return_date?: string;
  };
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function supabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

// All persistence below is best-effort: MIA must keep working for guests even
// when Supabase is not configured or the write fails.

async function getConversationHistory(conversationId: string): Promise<ChatMessage[]> {
  if (!supabaseConfigured() || !UUID_RE.test(conversationId)) return [];
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from('messages')
      .select('role, content')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(20);
    if (error || !data) return [];
    return data as ChatMessage[];
  } catch (err) {
    console.error('getConversationHistory failed (continuing):', err);
    return [];
  }
}

async function saveMessage(
  conversationId: string | null,
  role: 'user' | 'assistant',
  content: string,
) {
  if (!conversationId || !supabaseConfigured() || !UUID_RE.test(conversationId)) return;
  try {
    const supabase = getSupabaseServer();
    await supabase.from('messages').insert([{ conversation_id: conversationId, role, content }]);
  } catch (err) {
    console.error('saveMessage failed (continuing):', err);
  }
}

async function createConversation(userId: string): Promise<string | null> {
  if (!supabaseConfigured() || !userId || !UUID_RE.test(userId)) return null;
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from('conversations')
      .insert([{ user_id: userId, status: 'active' }])
      .select('id')
      .single();
    if (error || !data) return null;
    return data.id as string;
  } catch (err) {
    console.error('createConversation failed (continuing):', err);
    return null;
  }
}

export const config = {
  api: {
    responseLimit: '50mb',
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader(
    'Access-Control-Allow-Origin',
    process.env.NEXT_PUBLIC_SITE_URL || 'https://mandmautoperformance.com',
  );
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-user-id');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!chatRateLimit(req, res)) return;

  const { message, conversation_id, history } = req.body as ChatRequest;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Guests are welcome. A logged-in user id (UUID) unlocks persistence.
  const userId = (req.headers['x-user-id'] as string) || '';

  // Start streaming response.
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');

  try {
    // Resolve a persisted conversation only when we can (logged-in user + Supabase).
    let persistedConversationId: string | null =
      conversation_id && UUID_RE.test(conversation_id) ? conversation_id : null;
    if (!persistedConversationId && userId) {
      persistedConversationId = await createConversation(userId);
    }

    // Build context: prefer DB history, fall back to client-supplied history.
    let priorMessages: ChatMessage[] = [];
    if (persistedConversationId) {
      priorMessages = await getConversationHistory(persistedConversationId);
    }
    if (priorMessages.length === 0 && Array.isArray(history)) {
      priorMessages = history
        .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && m.content)
        .slice(-20);
    }

    const messages: ChatMessage[] = [...priorMessages, { role: 'user', content: message }];

    await saveMessage(persistedConversationId, 'user', message);

    let fullResponse = '';
    try {
      fullResponse = await streamChatCompletion(messages, (chunk) => {
        res.write(`data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`);
      });

      await saveMessage(persistedConversationId, 'assistant', fullResponse);

      res.write(
        `data: ${JSON.stringify({
          type: 'complete',
          conversationId: persistedConversationId,
          fullResponse,
        })}\n\n`,
      );
      res.end();
    } catch (streamError) {
      console.error('Streaming error:', streamError);
      res.write(
        `data: ${JSON.stringify({
          type: 'error',
          error:
            streamError instanceof Error
              ? streamError.message
              : 'Failed to get AI response',
        })}\n\n`,
      );
      res.end();
    }
  } catch (error) {
    console.error('Chat error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.write(
        `data: ${JSON.stringify({
          type: 'error',
          error: error instanceof Error ? error.message : 'Internal server error',
        })}\n\n`,
      );
      res.end();
    }
  }
}
