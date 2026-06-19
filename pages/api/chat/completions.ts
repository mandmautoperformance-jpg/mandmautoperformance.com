import type { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseServer } from '@/lib/supabase-server';
import { streamChatCompletion } from '@/lib/gemini-client';

interface ChatRequest {
  message: string;
  conversation_id?: string;
  booking_context?: {
    vehicle_id?: string;
    pickup_date?: string;
    return_date?: string;
  };
}

async function getConversationHistory(conversationId: string) {
  const supabase = getSupabaseServer();

  const { data: messages, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
    .limit(20); // Get last 20 messages for context

  if (error) {
    console.error('Error fetching conversation:', error);
    return [];
  }

  return messages;
}

async function saveMessage(
  conversationId: string,
  role: 'user' | 'assistant',
  content: string,
  tokensUsed?: number,
) {
  const supabase = getSupabaseServer();

  const { error } = await supabase.from('messages').insert([
    {
      conversation_id: conversationId,
      role,
      content,
      tokens_used: tokensUsed || 0,
    },
  ]);

  if (error) {
    console.error('Error saving message:', error);
  }
}

async function createConversation(userId: string, bookingId?: string) {
  const supabase = getSupabaseServer();

  const { data: conversation, error } = await supabase
    .from('conversations')
    .insert([
      {
        user_id: userId,
        booking_id: bookingId || null,
        status: 'active',
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }

  return conversation;
}

export const config = {
  api: {
    responseLimit: '50mb',
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Enable CORS and streaming
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userId = req.headers['x-user-id'] as string || 'test-user-001';
  const { message, conversation_id: conversationId, booking_context } = req.body as ChatRequest;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    let currentConversationId = conversationId;

    // Create conversation if doesn't exist
    if (!currentConversationId) {
      const conversation = await createConversation(userId);
      currentConversationId = conversation.id;
    }

    const safeConversationId = currentConversationId as string;

    // Get conversation history
    const history = await getConversationHistory(safeConversationId);

    // Save user message
    await saveMessage(safeConversationId, 'user', message);

    // Build messages for Gemini
    const messages = [
      ...history.map((msg: any) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      {
        role: 'user' as const,
        content: message,
      },
    ];

    // Stream response from Gemini
    let fullResponse = '';

    try {
      const response = await streamChatCompletion(messages, (chunk) => {
        fullResponse += chunk;
        // Send chunk to client as Server-Sent Event
        res.write(`data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`);
      });

      // Save assistant message
      await saveMessage(safeConversationId, 'assistant', fullResponse);

      // Send completion event
      res.write(
        `data: ${JSON.stringify({
          type: 'complete',
          conversationId: safeConversationId,
          fullResponse,
        })}\n\n`,
      );

      res.write('[DONE]\n');
      res.end();
    } catch (streamError) {
      console.error('Streaming error:', streamError);
      res.write(
        `data: ${JSON.stringify({
          type: 'error',
          error: 'Failed to get AI response',
        })}\n\n`,
      );
      res.end();
    }
  } catch (error) {
    console.error('Chat error:', error);
    res.write(
      `data: ${JSON.stringify({
        type: 'error',
        error: error instanceof Error ? error.message : 'Internal server error',
      })}\n\n`,
    );
    res.end();
  }
}
