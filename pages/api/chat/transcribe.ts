import type { NextApiRequest, NextApiResponse } from 'next';
import { transcribeAudio } from '@/lib/gemini-client';
import { rateLimit } from '@/lib/rate-limit';

const transcribeRateLimit = rateLimit('transcribe', 20, 60_000); // 20/min per IP

// Audio formats Gemini accepts. The client re-encodes to WAV, but we accept a
// few common containers in case a browser sends its native format.
const ALLOWED_MIME = new Set([
  'audio/wav',
  'audio/x-wav',
  'audio/mpeg',
  'audio/mp3',
  'audio/aac',
  'audio/ogg',
  'audio/flac',
  'audio/webm',
  'audio/mp4',
]);

const MAX_BYTES = 8 * 1024 * 1024; // ~8MB of decoded audio

export const config = {
  api: {
    bodyParser: { sizeLimit: '12mb' },
  },
};

/**
 * Server-side speech-to-text for MIA's mic. Accepts a short base64 audio clip
 * and returns the transcribed text via Gemini. Public + rate-limited.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!transcribeRateLimit(req, res)) return;

  const { audioBase64, mimeType } = (req.body || {}) as {
    audioBase64?: string;
    mimeType?: string;
  };

  if (!audioBase64 || typeof audioBase64 !== 'string') {
    return res.status(400).json({ error: 'Audio data is required.' });
  }
  if (!mimeType || !ALLOWED_MIME.has(mimeType)) {
    return res.status(400).json({ error: 'Unsupported audio format.' });
  }

  // base64 is ~33% larger than the raw bytes it encodes.
  const approxBytes = Math.floor((audioBase64.length * 3) / 4);
  if (approxBytes > MAX_BYTES) {
    return res.status(413).json({ error: 'Audio clip is too long. Keep it under ~30 seconds.' });
  }

  try {
    const text = await transcribeAudio(audioBase64, mimeType);
    return res.status(200).json({ text });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Transcription failed';
    console.error('Transcription endpoint error:', message);
    return res.status(500).json({ error: 'Could not transcribe audio. Please try again.' });
  }
}
