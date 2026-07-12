import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, ExternalLink, RefreshCw, Clock, User } from 'lucide-react';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

interface IDUpload {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  doc_type: 'driving_licence' | 'photo_id';
  storage_path: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  uploaded_at: string;
  reviewed_at: string | null;
  reviewer_notes: string | null;
  signed_url: string | null;
}

const DOC_LABEL: Record<string, string> = {
  driving_licence: 'Driving Licence',
  photo_id: 'Photo ID',
};

export default function AdminIDDocuments() {
  const [uploads, setUploads] = useState<IDUpload[]>([]);
  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const fetchUploads = useCallback(async () => {
    setLoading(true);
    setError(null);
    const supabase = getSupabaseBrowser();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setError('Not signed in.'); setLoading(false); return; }

    const res = await fetch(`/api/admin/id-documents?status=${statusFilter}`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error || 'Failed to load documents.');
      setLoading(false);
      return;
    }
    const { uploads: data } = await res.json();
    setUploads(data || []);
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => { fetchUploads(); }, [fetchUploads]);

  const decide = async (id: string, status: 'approved' | 'rejected') => {
    setActionLoading(id + status);
    const supabase = getSupabaseBrowser();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    await fetch('/api/admin/id-documents', {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, status, notes: notes[id] }),
    });

    setActionLoading(null);
    fetchUploads();
  };

  // Group by user so each customer shows as one card with both docs
  const byUser: Record<string, IDUpload[]> = {};
  for (const u of uploads) {
    if (!byUser[u.user_id]) byUser[u.user_id] = [];
    byUser[u.user_id].push(u);
  }

  return (
    <div className="space-y-6">
      {/* Filter tabs */}
      <div className="flex items-center gap-3">
        {(['pending', 'approved', 'rejected'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
              statusFilter === s
                ? 'bg-electric-turquoise text-gunmetal'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            {s}
          </button>
        ))}
        <button
          onClick={fetchUploads}
          disabled={loading}
          className="ml-auto p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white transition-all disabled:opacity-40"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm">
          {error}
        </div>
      )}

      {!loading && Object.keys(byUser).length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <CheckCircle size={40} className="mx-auto mb-3 opacity-30" />
          <p>No {statusFilter} documents.</p>
        </div>
      )}

      {Object.entries(byUser).map(([userId, docs]) => {
        const first = docs[0];
        return (
          <div
            key={userId}
            className="rounded-xl bg-white/5 border border-white/10 overflow-hidden"
          >
            {/* Customer header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-electric-turquoise/20 flex items-center justify-center">
                <User size={16} className="text-electric-turquoise" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{first.user_name}</p>
                <p className="text-gray-400 text-xs">{first.user_email}</p>
              </div>
              <div className="ml-auto flex items-center gap-1 text-xs text-gray-500">
                <Clock size={12} />
                {new Date(first.uploaded_at).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                })}
              </div>
            </div>

            {/* Document rows */}
            <div className="divide-y divide-white/5">
              {docs.map((doc) => (
                <div key={doc.id} className="px-6 py-4 flex items-center gap-4 flex-wrap">
                  <span className="text-sm text-gray-300 w-36 shrink-0">
                    {DOC_LABEL[doc.doc_type] ?? doc.doc_type}
                  </span>

                  {doc.signed_url ? (
                    <a
                      href={doc.signed_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-electric-turquoise/10 border border-electric-turquoise/30 text-electric-turquoise text-xs font-semibold hover:bg-electric-turquoise/20 transition-all"
                    >
                      View document <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span className="text-xs text-gray-500 italic">URL expired — refresh</span>
                  )}

                  {statusFilter === 'pending' && (
                    <div className="flex items-center gap-2 ml-auto flex-wrap">
                      <input
                        type="text"
                        placeholder="Notes (optional)"
                        value={notes[doc.id] || ''}
                        onChange={(e) => setNotes((n) => ({ ...n, [doc.id]: e.target.value }))}
                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-electric-turquoise w-48"
                      />
                      <button
                        onClick={() => decide(doc.id, 'approved')}
                        disabled={actionLoading === doc.id + 'approved'}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/20 border border-green-500/40 text-green-400 text-xs font-semibold hover:bg-green-500/30 transition-all disabled:opacity-40"
                      >
                        <CheckCircle size={13} />
                        Approve
                      </button>
                      <button
                        onClick={() => decide(doc.id, 'rejected')}
                        disabled={actionLoading === doc.id + 'rejected'}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-semibold hover:bg-red-500/30 transition-all disabled:opacity-40"
                      >
                        <XCircle size={13} />
                        Reject
                      </button>
                    </div>
                  )}

                  {statusFilter !== 'pending' && (
                    <div className="ml-auto flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-semibold ${
                          doc.verification_status === 'approved'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {doc.verification_status}
                      </span>
                      {doc.reviewer_notes && (
                        <span className="text-xs text-gray-500 italic">"{doc.reviewer_notes}"</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
