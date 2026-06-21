'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, X, Loader, AlertCircle, Volume2, VolumeX } from 'lucide-react';
import { useBookingStore } from '@/lib/store';

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
        "Welcome to M&M Auto Performance! 🏎️ I'm MIA, your Motor Intelligence Assistant. How can I help you today? I can assist with bookings, fleet information, or answer any questions about our services.",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  const { conversationId, setConversationId } = useBookingStore();

  // Pick the best available British female voice for MIA. Neural / "Natural"
  // voices (Microsoft Sonia/Libby, Google UK English Female) sound human;
  // the old local voices sound robotic, so we rank them last.
  const pickVoice = useCallback((voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
    if (!voices.length) return null;

    // Ranked by how warm/human + British-female each voice sounds.
    const ranked: ((v: SpeechSynthesisVoice) => boolean)[] = [
      // Best: Microsoft neural British females (Edge) — Sonia is sultry & natural
      (v) => /sonia/i.test(v.name) && /Natural|Online/i.test(v.name),
      (v) => /libby/i.test(v.name) && /Natural|Online/i.test(v.name),
      (v) => /(maisie|olivia|ada)/i.test(v.name) && /Natural|Online/i.test(v.name),
      // Chrome's neural British female
      (v) => /google uk english female/i.test(v.name),
      // Any en-GB "Natural"/"Online" female-sounding neural voice
      (v) => v.lang === 'en-GB' && /Natural|Online/i.test(v.name),
      // macOS / iOS British females
      (v) => v.lang === 'en-GB' && /(kate|serena|stephanie|martha|fiona|moira)/i.test(v.name),
      // Any en-GB voice flagged female
      (v) => v.lang === 'en-GB' && /female/i.test(v.name),
      // Any en-GB voice at all (British accent beats American robot)
      (v) => v.lang === 'en-GB',
      // Last resort: any English female
      (v) => v.lang.startsWith('en') && /(samantha|female|google us english)/i.test(v.name),
    ];

    for (const test of ranked) {
      const match = voices.find(test);
      if (match) return match;
    }
    return voices.find((v) => v.lang.startsWith('en')) ?? voices[0];
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const synth = window.speechSynthesis;
    synthRef.current = synth;

    // getVoices() is async in Chrome — it returns [] until 'voiceschanged'
    // fires, so we must (re)select once the list is populated.
    const loadVoices = () => {
      const voices = synth.getVoices();
      if (voices.length) voiceRef.current = pickVoice(voices);
    };
    loadVoices();
    synth.addEventListener('voiceschanged', loadVoices);

    return () => {
      synth.removeEventListener('voiceschanged', loadVoices);
      synth.cancel();
    };
  }, [pickVoice]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const speak = useCallback((text: string, messageId: string) => {
    const synth = synthRef.current;
    if (!synth) return;

    if (speakingId === messageId) {
      synth.cancel();
      setSpeakingId(null);
      return;
    }

    synth.cancel();

    // Clean text for speech: drop markdown, soften emoji, and add gentle
    // pauses after punctuation so she breathes instead of rattling it out.
    const clean = text
      .replace(/[*_`#]/g, '')
      .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}]/gu, '')
      .replace(/\s+/g, ' ')
      .replace(/([,;])\s/g, '$1  ')
      .replace(/([.!?])\s/g, '$1   ')
      .trim();

    const utter = new SpeechSynthesisUtterance(clean);
    // Slower + slightly lower than default = warm, unhurried, sultry rather
    // than the clipped robotic default.
    utter.rate = 0.88;
    utter.pitch = 0.95;
    utter.volume = 1;

    // Use the British female voice resolved at load time.
    const voice = voiceRef.current ?? pickVoice(synth.getVoices());
    if (voice) {
      utter.voice = voice;
      utter.lang = voice.lang;
    } else {
      utter.lang = 'en-GB';
    }

    setSpeakingId(messageId);
    utter.onend = () => setSpeakingId(null);
    utter.onerror = () => setSpeakingId(null);
    synth.speak(utter);
  }, [speakingId, pickVoice]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userInputValue = inputValue;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userInputValue,
      timestamp: new Date(),
    };

    const historyForApi = messages
      .filter((m) => !m.isTyping)
      .map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

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
      let currentConversationId = conversationId;
      if (!currentConversationId) {
        currentConversationId = `conv-${Date.now()}`;
        setConversationId(currentConversationId);
      }

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
          buffer = frames.pop() ?? '';

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

      const final = fullResponse || "I couldn't generate a response. Please try again.";
      updateAssistant(final, false);

      // Auto-read the response if the user has enabled it
      if (autoSpeak && final) {
        speak(final, assistantId);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get response from AI';
      setError(errorMessage);
      updateAssistant(errorMessage, false);
    } finally {
      setIsLoading(false);
    }
  };

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
        <div className="flex items-center gap-1">
          {/* Auto-speak toggle */}
          <button
            onClick={() => {
              if (autoSpeak) synthRef.current?.cancel();
              setAutoSpeak((v) => !v);
            }}
            title={autoSpeak ? 'Auto-read on — click to mute' : 'Click to auto-read MIA responses'}
            className={`p-2 rounded-lg transition-all ${
              autoSpeak
                ? 'bg-performance-turquoise/30 text-performance-turquoise ring-1 ring-performance-turquoise/50'
                : 'hover:bg-performance-turquoise/20 text-gray-400 hover:text-performance-turquoise'
            }`}
          >
            {autoSpeak ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-performance-turquoise/20 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>
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
        {messages.map((message) =>
          message.isTyping && !message.content ? null : (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs rounded-lg ${
                  message.role === 'user'
                    ? 'bg-performance-turquoise text-performance-grey px-4 py-2'
                    : 'bg-performance-babyblue/20 text-gray-100 border border-performance-babyblue/30 px-4 py-2'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <div
                  className={`flex items-center gap-2 mt-1 ${
                    message.role === 'user' ? 'justify-end' : 'justify-between'
                  }`}
                >
                  <p
                    className={`text-xs ${
                      message.role === 'user' ? 'text-performance-grey/70' : 'text-gray-400'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  {/* Speak button on assistant messages */}
                  {message.role === 'assistant' && !message.isTyping && (
                    <button
                      onClick={() => speak(message.content, message.id)}
                      title={speakingId === message.id ? 'Stop reading' : 'Read aloud'}
                      className={`transition-all rounded p-0.5 ${
                        speakingId === message.id
                          ? 'text-performance-turquoise animate-pulse'
                          : 'text-gray-500 hover:text-performance-turquoise'
                      }`}
                    >
                      <Volume2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ),
        )}
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
