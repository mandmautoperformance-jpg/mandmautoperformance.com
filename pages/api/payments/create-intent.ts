import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { verifyAuth, AuthenticatedRequest } from '@/lib/auth-middleware';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface PaymentRequest extends AuthenticatedRequest {
  body: {
    bookingId: string;
    amount: number;
    currency?: string;
  };
}

export default async function handler(req: PaymentRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userId = await verifyAuth(req, res, true);
  if (!userId) return;

  const { bookingId, amount } = req.body;

  if (!bookingId || !amount || amount < 100) {
    return res.status(400).json({ error: 'Invalid booking or amount' });
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .eq('user_id', userId)
      .single();

    if (bookingError || !booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'gbp',
      metadata: { bookingId, userId },
    });

    const { error: updateError } = await supabase
      .from('bookings')
      .update({ stripe_payment_intent_id: paymentIntent.id })
      .eq('id', bookingId);

    if (updateError) {
      console.error('Failed to store payment intent id:', updateError.message);
    }

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create payment intent';
    console.error('Payment intent error:', message);
    return res.status(500).json({ error: message });
  }
}
