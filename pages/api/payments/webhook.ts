import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import type { IncomingMessage } from 'http';
import { sendEmail, reservationVerifyEmail } from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(req: IncomingMessage): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as string));
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured');
    return res.status(500).json({ error: 'Webhook not configured' });
  }

  try {
    const buf = await getRawBody(req);
    const sig = req.headers['stripe-signature'] as string;

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('Webhook signature verification failed:', message);
      return res.status(400).send(`Webhook Error: ${message}`);
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    // Reservation deposit paid via Stripe Checkout → mark the lead paid/confirmed.
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const requestId = session.metadata?.requestId;
      if (requestId && session.metadata?.kind === 'reservation_deposit') {
        const paymentIntentId =
          typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.payment_intent?.id ?? null;
        const { data: updated, error } = await supabase
          .from('booking_requests')
          .update({
            payment_status: 'paid',
            status: 'confirmed',
            stripe_payment_intent_id: paymentIntentId,
            paid_at: new Date().toISOString(),
          })
          .eq('id', requestId)
          .select('upload_token, customer_email, customer_name, model')
          .single();
        if (error) {
          console.error('Failed to mark reservation paid:', error.message);
        } else if (updated?.upload_token && updated.customer_email) {
          // Email the customer their secure document-upload link.
          const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://mandmautoperformance.com';
          try {
            await sendEmail({
              to: updated.customer_email,
              subject: 'Confirmed — please verify your documents',
              html: reservationVerifyEmail({
                name: updated.customer_name,
                model: updated.model,
                verifyUrl: `${site}/verify/${updated.upload_token}`,
              }),
            });
          } catch (e) {
            console.error('Verify email failed (continuing):', e);
          }
        }
      }
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const bookingId = paymentIntent.metadata?.bookingId;

      if (bookingId) {
        const { error } = await supabase
          .from('bookings')
          .update({
            status: 'confirmed',
            stripe_payment_intent_id: paymentIntent.id,
          })
          .eq('id', bookingId);
        if (error) console.error('Failed to update booking status:', error.message);
      }
    }

    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const bookingId = paymentIntent.metadata?.bookingId;

      if (bookingId) {
        const { error } = await supabase
          .from('bookings')
          .update({ status: 'payment_failed' })
          .eq('id', bookingId);
        if (error) console.error('Failed to update booking status:', error.message);
      }
    }

    return res.status(200).json({ received: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Webhook handler error:', message);
    return res.status(500).json({ error: message });
  }
}
