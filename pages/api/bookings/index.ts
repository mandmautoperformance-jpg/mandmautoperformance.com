import type { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseServer } from '@/lib/supabase-server';
import { verifyAuth } from '@/lib/auth-middleware';
import { rateLimit } from '@/lib/rate-limit';

const bookingRateLimit = rateLimit('booking', 10, 60_000); // 10 bookings/min per IP

interface CreateBookingRequest {
  vehicle_id: string;
  pickup_date: string;
  return_date: string;
  pickup_time: string;
  return_time?: string;
  pickup_location: string;
  return_location?: string;
  passengers?: number;
  conversation_id?: string;
}

interface Booking {
  id: string;
  user_id: string;
  vehicle_id: string;
  pickup_date: string;
  return_date: string;
  status: string;
  total_cost_pence: number | null;
}

// Calculate booking cost
function calculateBookingCost(
  dailyRatePence: number,
  pickupDate: string,
  returnDate: string,
): number {
  const pickup = new Date(pickupDate);
  const returnDt = new Date(returnDate);
  const days = Math.ceil(
    (returnDt.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24),
  );
  return dailyRatePence * Math.max(1, days);
}

async function createBooking(
  userId: string,
  req: CreateBookingRequest,
): Promise<Booking> {
  const supabase = getSupabaseServer();

  // Validate dates
  const pickup = new Date(req.pickup_date);
  const returnDt = new Date(req.return_date);

  if (returnDt <= pickup) {
    throw new Error('Return date must be after pickup date');
  }

  if (pickup < new Date()) {
    throw new Error('Cannot book in the past');
  }

  // Get vehicle details to calculate cost
  const { data: vehicle, error: vehicleError } = await supabase
    .from('vehicles')
    .select('daily_rate_pence')
    .eq('id', req.vehicle_id)
    .single();

  if (vehicleError || !vehicle) {
    throw new Error('Vehicle not found');
  }

  const totalCost = calculateBookingCost(
    vehicle.daily_rate_pence,
    req.pickup_date,
    req.return_date,
  );

  // Create booking
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert([
      {
        user_id: userId,
        vehicle_id: req.vehicle_id,
        pickup_date: req.pickup_date,
        return_date: req.return_date,
        pickup_time: req.pickup_time,
        return_time: req.return_time || '11:00:00',
        pickup_location: req.pickup_location,
        return_location: req.return_location || req.pickup_location,
        passengers: req.passengers || 1,
        status: 'pending_verification',
        total_cost_pence: totalCost,
        conversation_id: req.conversation_id,
      },
    ])
    .select()
    .single();

  if (bookingError || !booking) {
    throw new Error(`Failed to create booking: ${bookingError?.message}`);
  }

  return booking;
}

async function getUserBookings(userId: string): Promise<Booking[]> {
  const supabase = getSupabaseServer();

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch bookings: ${error.message}`);
  }

  return bookings as Booking[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_SITE_URL || 'https://mandmautoperformance.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST' && !bookingRateLimit(req, res)) return;

  const userId = await verifyAuth(req as any, res, true);
  if (!userId) return;

  if (req.method === 'POST') {
    try {
      const booking = await createBooking(userId, req.body);

      res.status(201).json({
        success: true,
        booking: {
          ...booking,
          total_cost_gbp: ((booking.total_cost_pence ?? 0) / 100).toFixed(2),
        },
      });
    } catch (error) {
      console.error('Booking creation error:', error);
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Failed to create booking',
      });
    }
  } else if (req.method === 'GET') {
    try {
      const bookings = await getUserBookings(userId);

      res.status(200).json({
        success: true,
        bookings: bookings.map((b) => ({
          ...b,
          total_cost_gbp: b.total_cost_pence
            ? (b.total_cost_pence / 100).toFixed(2)
            : null,
        })),
      });
    } catch (error) {
      console.error('Fetch bookings error:', error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Failed to fetch bookings',
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
