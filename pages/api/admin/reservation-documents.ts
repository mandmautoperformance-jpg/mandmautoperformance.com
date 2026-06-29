import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyAdmin } from '@/lib/auth-middleware';
import { getSupabaseServer } from '@/lib/supabase-server';

const REVIEW_STATUSES = ['pending', 'approved', 'rejected'] as const;
type ReviewStatus = (typeof REVIEW_STATUSES)[number];

function supabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * Admin review of a reservation's uploaded documents.
 *   GET ?id=<request_id>  → list documents with short-lived signed view URLs
 *   PATCH { docId, status } → approve / reject / reset a document
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = await verifyAdmin(req as any, res);
  if (!userId) return;

  if (!supabaseConfigured()) {
    if (req.method === 'GET') return res.status(200).json({ documents: [], tableReady: false });
    return res.status(503).json({ error: 'Supabase is not configured.' });
  }

  const supabase = getSupabaseServer();

  if (req.method === 'GET') {
    const id = req.query.id as string | undefined;
    if (!id) return res.status(400).json({ error: 'A reservation id is required.' });

    const { data, error } = await supabase
      .from('reservation_documents')
      .select('id, document_type, storage_path, status, created_at, reviewed_at')
      .eq('request_id', id)
      .order('created_at', { ascending: true });

    if (error) {
      return res.status(200).json({ documents: [], tableReady: false, reason: error.message });
    }

    // Attach short-lived signed URLs so the admin can view each file.
    const documents = await Promise.all(
      (data || []).map(async (d) => {
        let viewUrl: string | null = null;
        const signed = await supabase.storage
          .from('booking-documents')
          .createSignedUrl(d.storage_path, 60 * 30); // 30 min
        if (!signed.error) viewUrl = signed.data?.signedUrl ?? null;
        return { ...d, viewUrl };
      }),
    );

    return res.status(200).json({ documents, tableReady: true });
  }

  if (req.method === 'PATCH') {
    const { docId, status } = (req.body || {}) as { docId?: string; status?: ReviewStatus };
    if (!docId || !status || !REVIEW_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'A document id and a valid status are required.' });
    }
    const { error } = await supabase
      .from('reservation_documents')
      .update({ status, reviewed_at: new Date().toISOString() })
      .eq('id', docId);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  res.setHeader('Allow', 'GET, PATCH');
  return res.status(405).json({ error: 'Method not allowed' });
}
