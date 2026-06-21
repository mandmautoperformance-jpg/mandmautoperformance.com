'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, X, Loader, AlertCircle, Volume2, VolumeX, Mic, Square } from 'lucide-react';
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

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

// ── Audio helpers (module scope) ──────────────────────────────────────────────

/** Downsample a Float32 PCM buffer to a lower sample rate (linear average). */
function downsample(buffer: Float32Array, inRate: number, outRate: number): Float32Array {
  if (outRate >= inRate) return buffer;
  const ratio = inRate / outRate;
  const newLen = Math.round(buffer.length / ratio);
  const result = new Float32Array(newLen);
  let offsetResult = 0;
  let offsetBuffer = 0;
  while (offsetResult < newLen) {
    const nextOffset = Math.round((offsetResult + 1) * ratio);
    let accum = 0;
    let count = 0;
    for (let i = offsetBuffer; i < nextOffset && i < buffer.length; i++) {
      accum += buffer[i];
      count++;
    }
    result[offsetResult] = count ? accum / count : 0;
    offsetResult++;
    offsetBuffer = nextOffset;
  }
  return result;
}

/** Encode mono Float32 PCM as a 16-bit WAV Blob (a format Gemini accepts). */
function encodeWav(samples: Float32Array, sampleRate: number): Blob {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const writeStr = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };
  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, 'data');
  view.setUint32(40, samples.length * 2, true);
  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    offset += 2;
  }
  return new Blob([view], { type: 'audio/wav' });
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1] ?? ''); // strip "data:...;base64,"
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export const AIConcierge: React.FC<AIConciergeProps> = ({ isOpen, onClose, userId }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Welcome to M&M Auto Performance. I'm MIA — your personal concierge for the world's finest hire fleet. Whether you're looking to book, check availability, or find out more about our cars, I'm here. Tap the mic and just talk to me, or type below.",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  // Recording refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const maxTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recordingActiveRef = useRef(false);

  const { conversationId, setConversationId } = useBookingStore();

  // ── Voice (TTS) selection ──────────────────────────────────────────────────
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Clean up any in-flight recording resources on unmount.
  useEffect(() => {
    return () => {
      recordingActiveRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (maxTimerRef.current) clearTimeout(maxTimerRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      audioCtxRef.current?.close().catch(() => {});
    };
  }, []);

  // ── Speak (TTS) ─────────────────────────────────────────────────────────────
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
    },
    [speakingId, pickVoice],
  );

  // ── Send a message (optionally with explicit text from the mic) ─────────────
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
                /* partial frame */
              }
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

  // ── Mic: record → encode WAV → transcribe via Gemini ────────────────────────
  const finishRecording = useCallback(async () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;

    const recordedType = recorder.mimeType || 'audio/webm';
    const blob = new Blob(chunksRef.current, { type: recordedType });
    chunksRef.current = [];

    // Too small to contain speech.
    if (blob.size < 1600) {
      setIsTranscribing(false);
      setError("I didn't catch that — tap the mic and speak clearly.");
      return;
    }

    setIsTranscribing(true);
    try {
      // Decode the recorded audio and re-encode to 16kHz mono WAV so Gemini
      // always receives a format it accepts, regardless of the browser.
      const arrayBuffer = await blob.arrayBuffer();
      const Ctx = window.AudioContext || window.webkitAudioContext;
      let sendBlob = blob;
      let sendType = recordedType;
      if (Ctx) {
        try {
          const decodeCtx = new Ctx();
          const audioBuffer = await decodeCtx.decodeAudioData(arrayBuffer.slice(0));
          const channel = audioBuffer.getChannelData(0);
          const down = downsample(channel, audioBuffer.sampleRate, 16000);
          sendBlob = encodeWav(down, 16000);
          sendType = 'audio/wav';
          await decodeCtx.close().catch(() => {});
        } catch {
          // Decoding failed — fall back to sending the raw recording.
          sendBlob = blob;
          sendType = recordedType;
        }
      }

      const base64 = await blobToBase64(sendBlob);
      const res = await fetch('/api/chat/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioBase64: base64, mimeType: sendType }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not transcribe audio. Please try again.');
        return;
      }
      const text = (data.text || '').trim();
      if (!text) {
        setError("I didn't catch that — tap the mic and speak clearly.");
        return;
      }
      // Got the words — send straight to MIA.
      handleSendMessage(text);
    } catch {
      setError('Voice input failed. Please try again, or type your message.');
    } finally {
      setIsTranscribing(false);
    }
  }, [handleSendMessage]);

  const stopRecording = useCallback(() => {
    recordingActiveRef.current = false;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (maxTimerRef.current) {
      clearTimeout(maxTimerRef.current);
      maxTimerRef.current = null;
    }
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') recorder.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setIsRecording(false);
  }, []);

  const startRecording = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setError('Voice input is not supported in this browser. Please type your message.');
      return;
    }

    // Don't let MIA talk over the customer.
    synthRef.current?.cancel();
    setSpeakingId(null);
    setError(null);

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setError('Microphone access is blocked. Tap the 🔒 in your address bar, allow the microphone, then try again.');
      return;
    }

    streamRef.current = stream;
    chunksRef.current = [];

    // Pick a MIME type the browser can actually record.
    const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'];
    const mimeType = candidates.find((t) => MediaRecorder.isTypeSupported(t)) || '';
    const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      finishRecording();
    };

    recorder.start();
    recordingActiveRef.current = true;
    setIsRecording(true);

    // Hard cap so a forgotten session can't record forever.
    maxTimerRef.current = setTimeout(() => {
      if (recordingActiveRef.current) stopRecording();
    }, 20000);

    // Silence auto-stop: watch the mic level and stop ~1.6s after speech ends.
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) {
        const audioCtx = new Ctx();
        audioCtxRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;
        source.connect(analyser);
        const data = new Uint8Array(analyser.frequencyBinCount);
        let spoke = false;
        let lastLoud = Date.now();

        const tick = () => {
          if (!recordingActiveRef.current) return;
          analyser.getByteTimeDomainData(data);
          let sum = 0;
          for (let i = 0; i < data.length; i++) {
            const d = data[i] - 128;
            sum += d * d;
          }
          const rms = Math.sqrt(sum / data.length);
          const now = Date.now();
          if (rms > 6) {
            spoke = true;
            lastLoud = now;
          }
          // Only auto-stop once they've actually said something.
          if (spoke && now - lastLoud > 1600) {
            stopRecording();
            return;
          }
          rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
      }
    } catch {
      // Silence detection is a nice-to-have; manual stop / max timer still work.
    }
  }, [finishRecording, stopRecording]);

  const toggleMic = useCallback(() => {
    if (isTranscribing) return;
    if (isRecording) stopRecording();
    else startRecording();
  }, [isRecording, isTranscribing, startRecording, stopRecording]);

  if (!isOpen) return null;

  const micBusy = isTranscribing || isLoading;

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
            onClick={() => {
              if (autoSpeak) synthRef.current?.cancel();
              setAutoSpeak((v) => !v);
            }}
            title={autoSpeak ? 'Auto-read on — click to mute' : 'Auto-read MIA responses'}
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

      {/* Recording / transcribing indicator */}
      {(isRecording || isTranscribing) && (
        <div className="bg-performance-turquoise/10 border-b border-performance-turquoise/30 px-4 py-2 flex items-center gap-3">
          {isRecording ? (
            <>
              <span className="flex gap-0.5 items-end h-4">
                <span className="w-0.5 bg-performance-turquoise rounded-full animate-bounce h-2" style={{ animationDelay: '0ms' }} />
                <span className="w-0.5 bg-performance-turquoise rounded-full animate-bounce h-4" style={{ animationDelay: '100ms' }} />
                <span className="w-0.5 bg-performance-turquoise rounded-full animate-bounce h-3" style={{ animationDelay: '200ms' }} />
                <span className="w-0.5 bg-performance-turquoise rounded-full animate-bounce h-4" style={{ animationDelay: '300ms' }} />
                <span className="w-0.5 bg-performance-turquoise rounded-full animate-bounce h-2" style={{ animationDelay: '400ms' }} />
              </span>
              <p className="text-sm text-performance-turquoise font-medium">Listening… tap the mic when you&apos;re done</p>
            </>
          ) : (
            <>
              <Loader size={15} className="animate-spin text-performance-turquoise" />
              <p className="text-sm text-performance-turquoise font-medium">Transcribing…</p>
            </>
          )}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-performance-grey/50">
        {messages.map((message) =>
          message.isTyping && !message.content ? null : (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs rounded-lg ${
                  message.role === 'user'
                    ? 'bg-performance-turquoise text-performance-grey px-4 py-2'
                    : 'bg-performance-babyblue/20 text-gray-100 border border-performance-babyblue/30 px-4 py-2'
                }`}
              >
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
          onClick={toggleMic}
          disabled={micBusy}
          title={isRecording ? 'Stop and send' : 'Speak to MIA'}
          className={`p-2 rounded-lg transition-all flex-shrink-0 ${
            isRecording
              ? 'bg-red-500 text-white ring-2 ring-red-400/50 animate-pulse'
              : 'bg-performance-turquoise/10 border border-performance-turquoise/30 text-performance-turquoise hover:bg-performance-turquoise/20'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isTranscribing ? <Loader size={18} className="animate-spin" /> : isRecording ? <Square size={18} /> : <Mic size={18} />}
        </button>

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
          placeholder={isRecording ? 'Listening…' : isTranscribing ? 'Transcribing…' : 'Ask MIA anything…'}
          disabled={isRecording || isTranscribing}
          className="flex-1 px-4 py-2 bg-performance-turquoise/10 border border-performance-turquoise/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-performance-turquoise focus:ring-2 focus:ring-performance-turquoise/20 disabled:opacity-60"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={isLoading || !inputValue.trim() || isRecording || isTranscribing}
          className="p-2 bg-performance-turquoise hover:bg-performance-turquoise/90 text-performance-grey rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default AIConcierge;
