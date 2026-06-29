import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { sendEmail, OWNER_EMAIL, contactOwnerEmail } from '@/lib/email';

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

  const clean = {
    name: name.trim(),
    email: email.trim(),
    subject,
    message: message.trim(),
  };

  // The message reaches us through two independent channels: an email to the
  // business inbox (the part the customer cares about) and a row in Supabase
  // (so it also shows in the admin dashboard). We attempt BOTH and only fail
  // the request if neither got through — a missing table or an email hiccup
  // on its own must never lose a customer's enquiry.
  let saved = false;
  let emailed = false;

  // 1. Persist for the admin dashboard — best effort, never blocks delivery.
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
    const { error } = await supabase.from('contact_messages').insert({
      name: clean.name,
      email: clean.email.toLowerCase(),
      subject: clean.subject,
      message: clean.message,
      created_at: new Date().toISOString(),
      status: 'unread',
    });
    if (error) {
      console.error('Contact insert error:', error.message);
    } else {
      saved = true;
    }
  } catch (err) {
    console.error('Contact insert threw (continuing):', err);
  }

  // 2. Email the business — this is the channel the customer is relying on.
  try {
    const result = await sendEmail({
      to: OWNER_EMAIL,
      subject: `New contact message — ${clean.subject}`,
      replyTo: clean.email,
      html: contactOwnerEmail(clean),
    });
    emailed = result.sent;
    if (!result.sent) {
      console.error(`Contact notification email not sent (${result.reason ?? 'unknown'})`);
    }
  } catch (err) {
    console.error('Contact notification email failed:', err);
  }

  // Succeeded as long as the enquiry reached us by at least one channel.
  if (saved || emailed) {
    return res.status(200).json({ success: true });
  }

  return res.status(500).json({ error: 'Failed to send message' });
}
