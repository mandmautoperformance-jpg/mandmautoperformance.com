import type { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseServer } from '@/lib/supabase-server';
import { rateLimit } from '@/lib/rate-limit';
import {
  sendEmail,
  OWNER_EMAIL,
  reservationOwnerEmail,
  reservationCustomerEmail,
  type LeadEmailData,
} from '@/lib/email';

const requestRateLimit = rateLimit('booking-request', 10, 60_000); // 10/min per IP

interface ReservationRequest {
  vehicleId: string;
  model: string;
  dailyRate: number;
  pickupDate: string;
  returnDate: string;
  pickupTime?: string;
  passengers?: string | number;
  days?: number;
  estimateGbp?: number;
  name: string;
  email: string;
  phone: string;
  notes?: string;
}

function supabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

const EMAIL_RE = /^\S+@\S+\.\S+$/;

// A reservation REQUEST (not a confirmed, paid booking). Guests are welcome —
// no login required. We persist best-effort so a lead is never lost, but the
// request always succeeds for the customer even if the database is unavailable.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_SITE_URL || 'https://mandmautoperformance.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!requestRateLimit(req, res)) return;

  const body = req.body as ReservationRequest;
  const { vehicleId, model, pickupDate, returnDate, name, email, phone } = body;

  // Validation
  if (!name?.trim()) return res.status(400).json({ error: 'Name is required' });
  if (!email || !EMAIL_RE.test(email)) return res.status(400).json({ error: 'A valid email is required' });
  if (!phone?.trim()) return res.status(400).json({ error: 'Phone is required' });
  if (!vehicleId || !model) return res.status(400).json({ error: 'Please choose a vehicle' });
  if (!pickupDate || !returnDate) return res.status(400).json({ error: 'Pickup and return dates are required' });
  if (new Date(returnDate) <= new Date(pickupDate)) {
    return res.status(400).json({ error: 'Return date must be after pickup date' });
  }

  const summary =
    `Reservation request: ${model} (${vehicleId})\n` +
    `Dates: ${pickupDate} ${body.pickupTime || ''} → ${returnDate} (${body.days ?? '?'} days)\n` +
    `Passengers: ${body.passengers ?? 1}\n` +
    `Estimate: £${body.estimateGbp ?? body.dailyRate ?? '?'}\n` +
    `Customer: ${name} · ${email} · ${phone}\n` +
    `Notes: ${body.notes || '—'}`;

  // Best-effort persistence. Try a dedicated table first, then fall back to the
  // existing contact_messages table so the lead is captured either way.
  if (supabaseConfigured()) {
    try {
      const supabase = getSupabaseServer();
      const { error: reqErr } = await supabase.from('booking_requests').insert([
        {
          vehicle_id: vehicleId,
          model,
          pickup_date: pickupDate,
          return_date: returnDate,
          pickup_time: body.pickupTime || null,
          passengers: Number(body.passengers) || 1,
          estimate_pence: Math.round((Number(body.estimateGbp) || 0) * 100),
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
          notes: body.notes || null,
          status: 'new',
        },
      ]);

      if (reqErr) {
        // Fall back to contact_messages (known to exist from the contact form).
        await supabase.from('contact_messages').insert([
          {
            name,
            email,
            subject: `Reservation: ${model}`,
            message: summary,
          },
        ]);
      }
    } catch (err) {
      // Never fail the customer over a storage problem — just log it.
      console.error('Reservation request persistence failed (continuing):', err);
    }
  } else {
    console.warn('Reservation request received but Supabase not configured:\n' + summary);
  }

  // Notify the owner and confirm to the customer. Best-effort: email problems
  // must never fail the customer's request.
  const leadData: LeadEmailData = {
    model,
    vehicleId,
    pickupDate,
    returnDate,
    pickupTime: body.pickupTime,
    passengers: body.passengers,
    estimateGbp: Number(body.estimateGbp) || Number(body.dailyRate) || undefined,
    name,
    email,
    phone,
    notes: body.notes,
  };
  try {
    await Promise.allSettled([
      sendEmail({
        to: OWNER_EMAIL,
        subject: `New reservation request — ${model}`,
        replyTo: email,
        html: reservationOwnerEmail(leadData),
      }),
      sendEmail({
        to: email,
        subject: 'We’ve received your request — M&M Auto Performance',
        html: reservationCustomerEmail(leadData),
      }),
    ]);
  } catch (err) {
    console.error('Reservation email send failed (continuing):', err);
  }

  return res.status(200).json({ success: true });
}
