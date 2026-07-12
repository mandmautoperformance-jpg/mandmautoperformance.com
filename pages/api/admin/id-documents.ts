import type { NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { verifyAdmin, type AuthenticatedRequest } from '@/lib/auth-middleware';

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const adminId = await verifyAdmin(req, res);
  if (!adminId) return;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // GET — list all uploads, grouped by user, with signed download URLs
  if (req.method === 'GET') {
    const statusFilter = (req.query.status as string) || 'pending';

    const { data, error } = await supabase
      .from('user_id_uploads')
      .select('id, user_id, doc_type, storage_path, verification_status, uploaded_at, reviewed_at, reviewer_notes')
      .eq('verification_status', statusFilter)
      .order('uploaded_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    if (!data?.length) return res.status(200).json({ uploads: [] });

    // Fetch user emails in one go using the admin API
    const userIds = [...new Set(data.map((r) => r.user_id))];
    const userMap: Record<string, { email: string; name: string }> = {};
    await Promise.all(
      userIds.map(async (uid) => {
        const { data: u } = await supabase.auth.admin.getUserById(uid);
        if (u?.user) {
          const meta = u.user.user_metadata as { first_name?: string; last_name?: string } | undefined;
          const name = [meta?.first_name, meta?.last_name].filter(Boolean).join(' ') || u.user.email || uid;
          userMap[uid] = { email: u.user.email || '', name };
        }
      }),
    );

    // Generate short-lived signed URLs (15 minutes)
    const uploads = await Promise.all(
      data.map(async (row) => {
        const { data: signed } = await supabase.storage
          .from('booking-documents')
          .createSignedUrl(row.storage_path, 900);
        return {
          ...row,
          signed_url: signed?.signedUrl || null,
          user_email: userMap[row.user_id]?.email || '',
          user_name: userMap[row.user_id]?.name || row.user_id,
        };
      }),
    );

    return res.status(200).json({ uploads });
  }

  // PATCH — approve or reject a single document
  if (req.method === 'PATCH') {
    const { id, status, notes } = req.body as {
      id?: string;
      status?: 'approved' | 'rejected';
      notes?: string;
    };

    if (!id || !['approved', 'rejected'].includes(status || '')) {
      return res.status(400).json({ error: 'id and status (approved|rejected) are required.' });
    }

    const { error } = await supabase
      .from('user_id_uploads')
      .update({
        verification_status: status,
        reviewed_at: new Date().toISOString(),
        reviewer_notes: notes?.trim() || null,
      })
      .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
