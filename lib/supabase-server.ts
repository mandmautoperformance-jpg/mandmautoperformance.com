import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client for API routes
export function getSupabaseServer() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseKey);
}

// Type definitions for database
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          phone: string | null;
          first_name: string | null;
          last_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          phone?: string | null;
          first_name?: string | null;
          last_name?: string | null;
        };
      };
      vehicles: {
        Row: {
          id: string;
          model: string;
          registration: string;
          category: 'luxury' | 'sports' | 'supercar' | 'exotic';
          daily_rate_pence: number;
          location: string;
          is_available: boolean;
          image_url: string | null;
          specs: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          user_id: string;
          vehicle_id: string;
          pickup_date: string;
          return_date: string;
          pickup_time: string;
          return_time: string;
          passengers: number;
          pickup_location: string;
          return_location: string | null;
          status:
            | 'pending_verification'
            | 'document_processing'
            | 'payment_pending'
            | 'confirmed'
            | 'active'
            | 'completed'
            | 'cancelled';
          total_cost_pence: number | null;
          notes: string | null;
          conversation_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          vehicle_id: string;
          pickup_date: string;
          return_date: string;
          pickup_time: string;
          return_time?: string;
          passengers?: number;
          pickup_location: string;
          return_location?: string | null;
          status?: string;
          notes?: string | null;
          conversation_id?: string | null;
        };
      };
      conversations: {
        Row: {
          id: string;
          user_id: string;
          booking_id: string | null;
          status: 'active' | 'closed';
          started_at: string;
          ended_at: string | null;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          role: 'user' | 'assistant';
          content: string;
          tokens_used: number | null;
          created_at: string;
        };
      };
    };
  };
}
