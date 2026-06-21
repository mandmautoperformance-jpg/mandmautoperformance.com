import React, { useCallback, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

interface ReservationRequest {
  id: string;
  vehicle_id: string;
  model: string;
  pickup_date: string;
  return_date: string;
  pickup_time: string | null;
  passengers: number;
  estimate_gbp: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  notes: string | null;
  status: string;
  created_at: string;
}

const STATUSES = ['new', 'contacted', 'confirmed', 'completed', 'cancelled'] as const;

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-baby-blue/20 text-baby-blue border-baby-blue/40',
  contacted: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/40',
  confirmed: 'bg-electric-turquoise/15 text-electric-turquoise border-electric-turquoise/40',
  completed: 'bg-green-500/15 text-green-400 border-green-500/40',
  cancelled: 'bg-red-500/15 text-red-400 border-red-500/40',
};

function fmtDate(d: string): string {
  try {
    return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return d;
  }
}

const AdminReservations: React.FC = () => {
  const [requests, setRequests] = useState<ReservationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableReady, setTableReady] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const getToken = useCallback(async (): Promise<string | null> => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ?? null;
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) {
        setError('Your session has expired. Please sign in again.');
        setLoading(false);
        return;
      }
      const res = await fetch('/api/admin/bookings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to load reservations.');
      } else {
        setRequests(data.requests || []);
        setTableReady(data.tableReady !== false);
      }
    } catch {
      setError('Network error loading reservations.');
    }
    setLoading(false);
  }, [getToken]);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (id: string, status: string) => {
    setSavingId(id);
    const previous = requests;
    // Optimistic update
    setRequests((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
    try {
      const token = await getToken();
      const res = await fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) {
        setRequests(previous); // revert
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Failed to update status.');
      }
    } catch {
      setRequests(previous);
      setError('Network error updating status.');
    }
    setSavingId(null);
  };

  const visible = filter === 'all' ? requests : requests.filter((r) => r.status === filter);
  const counts = STATUSES.reduce<Record<string, number>>((acc, s) => {
    acc[s] = requests.filter((r) => r.status === s).length;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">Reservation Requests</h2>
          <p className="text-gray-400 text-sm">Leads from the booking widget — work them through to confirmed.</p>
        </div>
        <button
          onClick={load}
          className="px-4 py-2 rounded-lg bg-electric-turquoise/10 border border-electric-turquoise/30 text-electric-turquoise hover:bg-electric-turquoise/20 transition text-sm font-semibold"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {(['all', ...STATUSES] as string[]).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition border ${
              filter === s
                ? 'bg-electric-turquoise text-gunmetal border-electric-turquoise'
                : 'border-gray-600 text-gray-400 hover:text-gray-200'
            }`}
          >
            {s === 'all' ? `All (${requests.length})` : `${s} (${counts[s] ?? 0})`}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 text-red-300 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {!tableReady && !loading && (
        <div className="rounded-lg border border-yellow-500/40 bg-yellow-500/10 text-yellow-200 px-4 py-3 text-sm">
          The <code className="font-mono">booking_requests</code> table isn&apos;t set up yet. Run
          the migration <code className="font-mono">supabase/migrations/003_booking_requests.sql</code> in
          your Supabase SQL editor, then refresh. Until then new leads are saved to contact messages.
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin w-8 h-8 border-4 border-electric-turquoise border-t-transparent rounded-full" />
        </div>
      ) : visible.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg mb-1">No reservations {filter !== 'all' ? `with status “${filter}”` : 'yet'}.</p>
          <p className="text-sm">When customers request a vehicle from the site, they&apos;ll appear here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-electric-turquoise/20">
          <table className="w-full text-sm">
            <thead className="bg-gunmetal/60 text-gray-400 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Vehicle</th>
                <th className="px-4 py-3 font-semibold">Dates</th>
                <th className="px-4 py-3 font-semibold">Est.</th>
                <th className="px-4 py-3 font-semibold">Received</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {visible.map((r) => (
                <tr key={r.id} className="hover:bg-gunmetal/40 align-top">
                  <td className="px-4 py-3">
                    <div className="text-white font-semibold">{r.customer_name}</div>
                    <a href={`mailto:${r.customer_email}`} className="text-electric-turquoise hover:underline block text-xs">{r.customer_email}</a>
                    <a href={`tel:${r.customer_phone}`} className="text-gray-400 hover:text-gray-200 block text-xs">{r.customer_phone}</a>
                    {r.notes && <p className="text-gray-500 text-xs mt-1 max-w-[14rem]">“{r.notes}”</p>}
                  </td>
                  <td className="px-4 py-3 text-gray-200">
                    {r.model}
                    <div className="text-gray-500 text-xs">{r.passengers} passenger{r.passengers === 1 ? '' : 's'}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-300 whitespace-nowrap">
                    {fmtDate(r.pickup_date)}
                    <div className="text-gray-500 text-xs">→ {fmtDate(r.return_date)}{r.pickup_time ? ` · ${r.pickup_time}` : ''}</div>
                  </td>
                  <td className="px-4 py-3 text-white font-semibold whitespace-nowrap">£{r.estimate_gbp.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap text-xs">{fmtDate(r.created_at)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={r.status}
                      disabled={savingId === r.id}
                      onChange={(e) => updateStatus(r.id, e.target.value)}
                      className={`px-2 py-1 rounded-md text-xs font-bold capitalize border bg-gunmetal focus:outline-none ${STATUS_STYLES[r.status] ?? 'text-gray-300 border-gray-600'}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s} className="bg-gunmetal text-white">{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminReservations;
