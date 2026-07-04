import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyOwner } from '@/lib/auth-middleware';
import { getSupabaseServer } from '@/lib/supabase-server';

/**
 * Owner-only feed of Car Auto-Scout finds (table: war_room_finds).
 *   GET    → list finds, newest first (dismissed ones excluded)
 *   PATCH  → update a find's status (new | dismissed | promoted)
 *   DELETE → remove a find (?id=...)
 */
const STATUSES = ['new', 'dismissed', 'promoted'];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = await verifyOwner(req as any, res);
  if (!userId) return;

  let supabase;
  try {
    supabase = getSupabaseServer();
  } catch {
    return res.status(500).json({ error: 'Database not configured' });
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('war_room_finds')
      .select('*')
      .neq('status', 'dismissed')
      .order('found_at', { ascending: false })
      .limit(60);
    if (error) {
      console.error('finds list error:', error.message);
      return res.status(500).json({ error: 'Failed to load finds' });
    }
    return res.status(200).json({ finds: data || [] });
  }

  if (req.method === 'PATCH') {
    const { id, status } = req.body as { id?: string; status?: string };
    if (!id) return res.status(400).json({ error: 'id is required' });
    if (!status || !STATUSES.includes(status)) {
      return res.status(400).json({ error: 'invalid status' });
    }
    const { data, error } = await supabase
      .from('war_room_finds')
      .update({ status })
      .eq('id', id)
      .select('*')
      .single();
    if (error) {
      console.error('find update error:', error.message);
      return res.status(500).json({ error: 'Failed to update find' });
    }
    return res.status(200).json({ find: data });
  }

  if (req.method === 'DELETE') {
    const id = (req.query.id as string) || '';
    if (!id) return res.status(400).json({ error: 'id is required' });
    const { error } = await supabase.from('war_room_finds').delete().eq('id', id);
    if (error) {
      console.error('find delete error:', error.message);
      return res.status(500).json({ error: 'Failed to delete find' });
    }
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
