'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, X, Loader, AlertCircle, Volume2, VolumeX, Mic, MicOff } from 'lucide-react';
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

// Browser SpeechRecognition type shim
interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((ev: Event) => void) | null;
  onaudiostart: ((ev: Event) => void) | null;
  onspeechstart: ((ev: Event) => void) | null;
  onend: ((ev: Event) => void) | null;
  onerror: ((ev: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((ev: SpeechRecognitionEvent) => void) | null;
}
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}
declare global {
  interface Window {
    SpeechRecognition?: new () => ISpeechRecognition;
    webkitSpeechRecognition?: new () => ISpeechRecognition;
  }
}

export const AIConcierge: React.FC<AIConciergeProps> = ({ isOpen, onClose, userId }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Welcome to M&M Auto Performance. I'm MIA — your personal concierge for the world's finest hire fleet. Whether you're looking to book, check availability, or find out more about our cars, I'm here. Tap the mic or type below.",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const transcriptRef = useRef('');
  const recogErrorRef = useRef(false);

  const { conversationId, setConversationId } = useBookingStore();

  // ── Voice selection ────────────────────────────────────────────────────────
  const pickVoice = useCallback((voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
    if (!voices.length) return null;
    const ranked: ((v: SpeechSynthesisVoice) => boolean)[] = [
      (v) => /sonia/i.test(v.name) && /Natural|Online/i.test(v.name),
      (v) => /libby/i.test(v.name) && /Natural|Online/i.test(v.name),
      (v) => /(maisie|olivia|ada)/i.test(v.name) && /Natural|Online/i.test(v.name),
      (v) => /google uk english female/i.test(v.name),
      (v) => v.lang === 'en-GB' && /Natural|Online/i.test(v.name),
      (v) => v.lang === 'en-GB' && /(kate|serena|stephanie|martha|fiona|moira)/i.test(v.name),
      (v) => v.lang === 'en-GB' && /female/i.test(v.name),
      (v) => v.lang === 'en-GB',
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

  // ── Scroll ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Speak ──────────────────────────────────────────────────────────────────
  const speak = useCallback(
    (text: string, messageId: string) => {
      const synth = synthRef.current;
      if (!synth) return;
      if (speakingId === messageId) {
        synth.cancel();
        setSpeakingId(null);
        return;
      }
      synth.cancel();
      const clean = text
        .replace(/[*_`#]/g, '')
        .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}]/gu, '')
        .replace(/\s+/g, ' ')
        .replace(/([,;])\s/g, '$1  ')
        .replace(/([.!?])\s/g, '$1   ')
        .trim();
      const utter = new SpeechSynthesisUtterance(clean);
      utter.rate = 0.88;
      utter.pitch = 0.95;
      utter.volume = 1;
      const voice = voiceRef.current ?? pickVoice(synth.getVoices());
      if (voice) { utter.voice = voice; utter.lang = voice.lang; }
      else utter.lang = 'en-GB';
      setSpeakingId(messageId);
      utter.onend = () => setSpeakingId(null);
      utter.onerror = () => setSpeakingId(null);
      synth.speak(utter);
    },
    [speakingId, pickVoice],
  );

  // ── Send message (accepts explicit text from voice input) ──────────────────
  const handleSendMessage = useCallback(
    async (explicitText?: string) => {
      const userInputValue = (explicitText ?? inputValue).trim();
      if (!userInputValue) return;

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
          headers: { 'Content-Type': 'application/json', 'x-user-id': userId ?? '' },
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
                if (data.type === 'chunk') { fullResponse += data.content; updateAssistant(fullResponse, true); }
                else if (data.type === 'complete') { if (data.fullResponse) fullResponse = data.fullResponse; isReading = false; }
                else if (data.type === 'error') { streamError = data.error || 'Failed to get AI response'; isReading = false; }
              } catch { /* partial frame */ }
            }
          }
        }

        if (streamError) throw new Error(streamError);
        const final = fullResponse || "I couldn't generate a response. Please try again.";
        updateAssistant(final, false);
        if (autoSpeak && final) speak(final, assistantId);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to get response from AI';
        setError(errorMessage);
        updateAssistant(errorMessage, false);
      } finally {
        setIsLoading(false);
      }
    },
    [inputValue, messages, conversationId, setConversationId, userId, autoSpeak, speak],
  );

  // ── Voice input ────────────────────────────────────────────────────────────
  const beginRecognition = useCallback(() => {
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SR) {
      setError('Voice input is not supported in this browser. Try Chrome, Edge, or Safari.');
      return;
    }

    // Don't let MIA talk over the customer while she's listening.
    synthRef.current?.cancel();
    setSpeakingId(null);

    transcriptRef.current = '';
    recogErrorRef.current = false;

    const recognition = new SR();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.lang = 'en-GB';

    recognition.onstart = () => {
      recogErrorRef.current = false;
      setError(null);
      setIsListening(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let final = '';
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) final += result[0].transcript;
        else interim += result[0].transcript;
      }
      transcriptRef.current = (final || interim).trim();
      setInputValue(transcriptRef.current);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      recogErrorRef.current = true;
      setIsListening(false);
      switch (event.error) {
        case 'no-speech':
          setError("I didn't catch that — tap the mic and speak after the prompt.");
          break;
        case 'not-allowed':
        case 'service-not-allowed':
          setError('Microphone access is blocked. Tap the 🔒 in your address bar, allow the microphone, then try again.');
          break;
        case 'audio-capture':
          setError('No microphone was found. Please check your device and try again.');
          break;
        case 'network':
          setError('Voice needs an internet connection. Please check your signal and try again.');
          break;
        case 'aborted':
          setError(null); // user cancelled — no scary message
          break;
        default:
          setError('Voice input hit a snag. Please try again, or type your message.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      if (recogErrorRef.current) return;
      const text = transcriptRef.current.trim();
      if (text) {
        setInputValue('');
        handleSendMessage(text);
      }
    };

    try {
      recognition.start();
    } catch {
      // start() throws InvalidStateError if called while already active — ignore.
    }
  }, [handleSendMessage]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SR) {
      setError('Voice input is not supported in this browser. Try Chrome, Edge, or Safari.');
      return;
    }

    setError(null);

    // Pre-flight the mic permission so the prompt is clean and any denial is
    // reported clearly — rather than surfacing later as a vague recognition error.
    if (navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          // We only needed the permission grant; release the stream so the
          // recognizer can claim the mic itself.
          stream.getTracks().forEach((t) => t.stop());
          beginRecognition();
        })
        .catch(() => {
          setError('Microphone access is blocked. Tap the 🔒 in your address bar, allow the microphone, then try again.');
        });
    } else {
      beginRecognition();
    }
  }, [isListening, beginRecognition]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-performance-grey border border-performance-turquoise/30 rounded-2xl shadow-2xl shadow-performance-turquoise/30 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-performance-babyblue/20 to-performance-turquoise/20 border-b border-performance-turquoise/30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          <div>
            <h3 className="font-bold text-white">MIA</h3>
            <p className="text-xs text-gray-400">Personal Concierge · M&M Auto Performance</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => { if (autoSpeak) synthRef.current?.cancel(); setAutoSpeak((v) => !v); }}
            title={autoSpeak ? 'Auto-read on — click to mute' : 'Auto-read MIA responses'}
            className={`p-2 rounded-lg transition-all ${
              autoSpeak
                ? 'bg-performance-turquoise/30 text-performance-turquoise ring-1 ring-performance-turquoise/50'
                : 'hover:bg-performance-turquoise/20 text-gray-400 hover:text-performance-turquoise'
            }`}
          >
            {autoSpeak ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <button onClick={onClose} className="p-2 hover:bg-performance-turquoise/20 rounded-lg transition-colors">
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

      {/* Listening indicator */}
      {isListening && (
        <div className="bg-performance-turquoise/10 border-b border-performance-turquoise/30 px-4 py-2 flex items-center gap-3">
          <span className="flex gap-0.5 items-end h-4">
            <span className="w-0.5 bg-performance-turquoise rounded-full animate-bounce h-2" style={{ animationDelay: '0ms' }} />
            <span className="w-0.5 bg-performance-turquoise rounded-full animate-bounce h-4" style={{ animationDelay: '100ms' }} />
            <span className="w-0.5 bg-performance-turquoise rounded-full animate-bounce h-3" style={{ animationDelay: '200ms' }} />
            <span className="w-0.5 bg-performance-turquoise rounded-full animate-bounce h-4" style={{ animationDelay: '300ms' }} />
            <span className="w-0.5 bg-performance-turquoise rounded-full animate-bounce h-2" style={{ animationDelay: '400ms' }} />
          </span>
          <p className="text-sm text-performance-turquoise font-medium">
            {inputValue ? `"${inputValue}"` : 'Listening…'}
          </p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-performance-grey/50">
        {messages.map((message) =>
          message.isTyping && !message.content ? null : (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs rounded-lg ${
                message.role === 'user'
                  ? 'bg-performance-turquoise text-performance-grey px-4 py-2'
                  : 'bg-performance-babyblue/20 text-gray-100 border border-performance-babyblue/30 px-4 py-2'
              }`}>
                <p className="text-sm">{message.content}</p>
                <div className={`flex items-center gap-2 mt-1 ${message.role === 'user' ? 'justify-end' : 'justify-between'}`}>
                  <p className={`text-xs ${message.role === 'user' ? 'text-performance-grey/70' : 'text-gray-400'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
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
              <p className="text-sm">MIA is thinking…</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 border-t border-performance-turquoise/20">
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { label: '📅 Book', text: 'I want to make a booking' },
            { label: '🚗 Fleet', text: 'Show me the fleet' },
            { label: '💰 Pricing', text: 'What are your prices?' },
            { label: '📋 Docs', text: 'What documents do I need?' },
          ].map(({ label, text }) => (
            <button
              key={label}
              onClick={() => handleSendMessage(text)}
              className="text-xs px-2 py-2 bg-performance-turquoise/10 hover:bg-performance-turquoise/20 text-performance-turquoise rounded border border-performance-turquoise/20 transition-all"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-performance-turquoise/20 px-4 py-3 flex gap-2 items-center">
        {/* Mic button */}
        <button
          onClick={toggleListening}
          disabled={isLoading}
          title={isListening ? 'Stop listening' : 'Speak to MIA'}
          className={`p-2 rounded-lg transition-all flex-shrink-0 ${
            isListening
              ? 'bg-performance-turquoise text-performance-grey ring-2 ring-performance-turquoise/50 animate-pulse'
              : 'bg-performance-turquoise/10 border border-performance-turquoise/30 text-performance-turquoise hover:bg-performance-turquoise/20'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
          placeholder={isListening ? 'Listening…' : 'Ask MIA anything…'}
          disabled={isListening}
          className="flex-1 px-4 py-2 bg-performance-turquoise/10 border border-performance-turquoise/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-performance-turquoise focus:ring-2 focus:ring-performance-turquoise/20 disabled:opacity-60"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={isLoading || !inputValue.trim() || isListening}
          className="p-2 bg-performance-turquoise hover:bg-performance-turquoise/90 text-performance-grey rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default AIConcierge;
