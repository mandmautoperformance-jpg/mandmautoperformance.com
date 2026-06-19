import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const ALLOWED_SUBJECTS = ['booking', 'fleet', 'pricing', 'support', 'other'];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body as {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  };

  if (!name?.trim() || !email?.trim() || !subject || !message?.trim()) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  if (!ALLOWED_SUBJECTS.includes(subject)) {
    return res.status(400).json({ error: 'Invalid subject' });
  }

  if (message.length > 2000) {
    return res.status(400).json({ error: 'Message too long (max 2000 characters)' });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { error } = await supabase.from('contact_messages').insert({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    subject,
    message: message.trim(),
    created_at: new Date().toISOString(),
    status: 'unread',
  });

  if (error) {
    console.error('Contact insert error:', error.message);
    return res.status(500).json({ error: 'Failed to save message' });
  }

  return res.status(200).json({ success: true });
}
