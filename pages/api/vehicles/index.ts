import type { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseServer } from '@/lib/supabase-server';

interface Vehicle {
  id: string;
  model: string;
  registration: string;
  category: string;
  daily_rate_pence: number;
  location: string;
  is_available: boolean;
  image_url: string | null;
  specs: Record<string, any>;
}

interface VehicleFilter {
  category?: string;
  location?: string;
  maxPrice?: number;
  minPrice?: number;
  pickupDate?: string;
  returnDate?: string;
}

async function getAvailableVehicles(filters: VehicleFilter): Promise<Vehicle[]> {
  const supabase = getSupabaseServer();

  let query = supabase.from('vehicles').select('*').eq('is_available', true);

  // Apply category filter
  if (filters.category) {
    query = query.eq('category', filters.category);
  }

  // Apply location filter
  if (filters.location) {
    query = query.ilike('location', `%${filters.location}%`);
  }

  // Apply price filters
  if (filters.minPrice !== undefined) {
    query = query.gte('daily_rate_pence', filters.minPrice);
  }

  if (filters.maxPrice !== undefined) {
    query = query.lte('daily_rate_pence', filters.maxPrice);
  }

  // TODO: Check booking dates for availability when filters.pickupDate and filters.returnDate exist
  // For now, just check is_available flag

  const { data, error } = await query;

  if (error) {
    console.error('Supabase error:', error);
    throw new Error(`Failed to fetch vehicles: ${error.message}`);
  }

  return data as Vehicle[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Enable CORS for chat requests
  res.setHeader('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_SITE_URL || 'https://mandmautoperformance.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const filters: VehicleFilter = {
      category: req.query.category as string,
      location: req.query.location as string,
      minPrice: req.query.minPrice ? parseInt(req.query.minPrice as string) : undefined,
      maxPrice: req.query.maxPrice ? parseInt(req.query.maxPrice as string) : undefined,
      pickupDate: req.query.pickupDate as string,
      returnDate: req.query.returnDate as string,
    };

    const vehicles = await getAvailableVehicles(filters);

    // Format response with readable prices
    const formattedVehicles = vehicles.map((v) => ({
      ...v,
      daily_rate_gbp: (v.daily_rate_pence / 100).toFixed(2),
    }));

    res.status(200).json({
      success: true,
      count: formattedVehicles.length,
      vehicles: formattedVehicles,
    });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
}
