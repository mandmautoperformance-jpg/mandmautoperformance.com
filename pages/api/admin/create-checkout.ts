import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { verifyAdmin } from '@/lib/auth-middleware';
import { getSupabaseServer } from '@/lib/supabase-server';

/**
 * Admin-only: create a Stripe Checkout session to collect a deposit against a
 * reservation request, and return the hosted payment URL to send the customer.
 *
 * Lazy Stripe init + graceful 503 when STRIPE_SECRET_KEY is missing, so the
 * admin panel never hard-crashes on an unconfigured environment.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userId = await verifyAdmin(req as any, res);
  if (!userId) return;

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return res.status(503).json({ error: 'Stripe is not configured (missing STRIPE_SECRET_KEY).' });
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(503).json({ error: 'Supabase is not configured.' });
  }

  const { id, depositGbp } = (req.body || {}) as { id?: string; depositGbp?: number };
  const depositPence = Math.round(Number(depositGbp) * 100);

  if (!id) return res.status(400).json({ error: 'A reservation id is required.' });
  if (!Number.isFinite(depositPence) || depositPence < 100) {
    return res.status(400).json({ error: 'Deposit must be at least £1.' });
  }
  if (depositPence > 5_000_000) {
    return res.status(400).json({ error: 'Deposit exceeds the maximum allowed.' });
  }

  const supabase = getSupabaseServer();
  const { data: reservation, error: loadErr } = await supabase
    .from('booking_requests')
    .select('id, model, customer_email, customer_name, pickup_date, return_date')
    .eq('id', id)
    .single();

  if (loadErr || !reservation) {
    return res.status(404).json({ error: 'Reservation not found (has migration 003 been run?).' });
  }

  const stripe = new Stripe(secret);
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://mandmautoperformance.com';

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: reservation.customer_email || undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'gbp',
            unit_amount: depositPence,
            product_data: {
              name: `Deposit — ${reservation.model}`,
              description: `Reservation ${reservation.pickup_date} → ${reservation.return_date}`,
            },
          },
        },
      ],
      metadata: { kind: 'reservation_deposit', requestId: reservation.id },
      payment_intent_data: {
        metadata: { kind: 'reservation_deposit', requestId: reservation.id },
      },
      success_url: `${site}/payment-status?status=success`,
      cancel_url: `${site}/payment-status?status=cancelled`,
    });

    // Persist the pending deposit. If the payment columns aren't migrated yet
    // this will error — we still return the URL so a payment can be taken.
    const { error: updErr } = await supabase
      .from('booking_requests')
      .update({
        deposit_pence: depositPence,
        payment_status: 'pending',
        stripe_session_id: session.id,
      })
      .eq('id', reservation.id);
    if (updErr) console.error('Deposit persist failed (continuing):', updErr.message);

    return res.status(200).json({ url: session.url, sessionId: session.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create checkout session';
    console.error('create-checkout error:', message);
    return res.status(500).json({ error: message });
  }
}
