'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Loader, AlertCircle } from 'lucide-react';
import { useBookingStore, useChatStore } from '@/lib/store';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface AIConciergeProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

export const AIConcierge: React.FC<AIConciergeProps> = ({
  isOpen,
  onClose,
  userId,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        'Welcome to M&M Auto Performance! 🏎️ I\'m MIA, your Motor Intelligence Assistant. How can I help you today? I can assist with bookings, fleet information, or answer any questions about our services.',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get Zustand store state
  const { conversationId, setConversationId } = useBookingStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userInputValue = inputValue;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userInputValue,
      timestamp: new Date(),
    };

    // Snapshot history (excluding the just-added user message) for AI context.
    const historyForApi = messages
      .filter((m) => !m.isTyping)
      .map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    // Add a placeholder assistant message we stream into live.
    const assistantId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: 'assistant', content: '', timestamp: new Date(), isTyping: true },
    ]);

    const updateAssistant = (content: string, isTyping: boolean) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, content, isTyping } : m)),
      );
    };

    try {
      // Create conversation if not exists
      let currentConversationId = conversationId;
      if (!currentConversationId) {
        currentConversationId = `conv-${Date.now()}`;
        setConversationId(currentConversationId);
      }

      // Call the real API endpoint for chat
      const response = await fetch('/api/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId ?? '',
        },
        body: JSON.stringify({
          message: userInputValue,
          conversation_id: currentConversationId,
          history: historyForApi,
        }),
      });

      if (!response.ok) {
        throw new Error('MIA is unavailable right now. Please try again in a moment.');
      }

      // Handle streaming response with a buffer (SSE frames can split across chunks).
      let fullResponse = '';
      let streamError: string | null = null;
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      if (reader) {
        let isReading = true;
        while (isReading) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const frames = buffer.split('\n\n');
          buffer = frames.pop() ?? ''; // keep the last partial frame

          for (const frame of frames) {
            const line = frame.split('\n').find((l) => l.startsWith('data: '));
            if (!line) continue;
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === 'chunk') {
                fullResponse += data.content;
                updateAssistant(fullResponse, true);
              } else if (data.type === 'complete') {
                if (data.fullResponse) fullResponse = data.fullResponse;
                isReading = false;
              } else if (data.type === 'error') {
                streamError = data.error || 'Failed to get AI response';
                isReading = false;
              }
            } catch {
              // Ignore partial/non-JSON frames
            }
          }
        }
      }

      if (streamError) throw new Error(streamError);

      updateAssistant(
        fullResponse || "I couldn't generate a response. Please try again.",
        false,
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get response from AI';
      setError(errorMessage);
      // Replace the streaming placeholder with the error text.
      updateAssistant(errorMessage, false);
    } finally {
      setIsLoading(false);
    }
  };

  // When closed, render nothing. The parent page owns the floating launcher
  // button; rendering a second one here would overlap it and swallow clicks.
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-performance-grey border border-performance-turquoise/30 rounded-2xl shadow-2xl shadow-performance-turquoise/30 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-performance-babyblue/20 to-performance-turquoise/20 border-b border-performance-turquoise/30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          <div>
            <h3 className="font-bold text-white">MIA Concierge</h3>
            <p className="text-xs text-gray-400">Motor Intelligence Assistant</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-performance-turquoise/20 rounded-lg transition-colors"
        >
          <X size={20} className="text-gray-400" />
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-900/30 border-b border-red-500/30 px-4 py-2 flex items-center gap-2">
          <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-200">{error}</p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-performance-grey/50">
        {messages.map((message) => (
          message.isTyping && !message.content ? null : (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-performance-turquoise text-performance-grey'
                  : 'bg-performance-babyblue/20 text-gray-100 border border-performance-babyblue/30'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p
                className={`text-xs mt-1 ${
                  message.role === 'user'
                    ? 'text-performance-grey/70'
                    : 'text-gray-400'
                }`}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
          )
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-performance-babyblue/20 text-gray-100 border border-performance-babyblue/30 px-4 py-2 rounded-lg flex items-center gap-2">
              <Loader size={16} className="animate-spin" />
              <p className="text-sm">Thinking...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 border-t border-performance-turquoise/20">
        <div className="grid grid-cols-2 gap-2">
          {['📅 Book', '🚗 Fleet', '💰 Pricing', '📋 Docs'].map((action) => (
            <button
              key={action}
              onClick={() => {
                setInputValue(action.split(' ')[1].toLowerCase());
              }}
              className="text-xs px-3 py-2 bg-performance-turquoise/10 hover:bg-performance-turquoise/20 text-performance-turquoise rounded border border-performance-turquoise/20 transition-all"
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-performance-turquoise/20 px-4 py-3 flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask me anything..."
          className="flex-1 px-4 py-2 bg-performance-turquoise/10 border border-performance-turquoise/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-performance-turquoise focus:ring-2 focus:ring-performance-turquoise/20"
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || !inputValue.trim()}
          className="p-2 bg-performance-turquoise hover:bg-performance-turquoise/90 text-performance-grey rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default AIConcierge;
