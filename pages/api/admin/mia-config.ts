import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyAuth } from '@/lib/auth-middleware';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userId = await verifyAuth(req as any, res, true);
  if (!userId) return;

  const { personality, aggressiveness, responseTime, autoApproveDocuments, enableCrypto } = req.body;

  const VALID_PERSONALITIES = ['Sales', 'Support', 'Balanced'];
  if (!VALID_PERSONALITIES.includes(personality)) {
    return res.status(400).json({ error: 'Invalid personality' });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { error } = await supabase.from('admin_config').upsert({
    key: 'mia_config',
    value: { personality, aggressiveness, responseTime, autoApproveDocuments, enableCrypto },
    updated_at: new Date().toISOString(),
    updated_by: userId,
  });

  if (error) {
    console.error('MIA config save error:', error.message);
    return res.status(500).json({ error: 'Failed to save config' });
  }

  return res.status(200).json({ success: true });
}
