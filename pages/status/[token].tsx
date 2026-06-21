import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface DocStatus {
  type: string;
  status: string;
}

interface ReservationStatus {
  model: string;
  pickupDate: string;
  returnDate: string;
  passengers: number;
  status: string;
  paymentStatus: string;
  depositGbp: number | null;
  createdAt: string;
  documents: DocStatus[];
}

interface Props {
  reservation: ReservationStatus | null;
  token: string;
}

const STATUS_LABELS: Record<string, string> = {
  new: 'Received',
  contacted: 'In Review',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const STATUS_COLORS: Record<string, string> = {
  new: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  contacted: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  confirmed: 'text-green-400 bg-green-400/10 border-green-400/30',
  completed: 'text-gray-400 bg-gray-400/10 border-gray-400/30',
  cancelled: 'text-red-400 bg-red-400/10 border-red-400/30',
};

const PAYMENT_LABELS: Record<string, string> = {
  unpaid: 'Deposit pending',
  pending: 'Payment processing',
  paid: 'Deposit paid',
  refunded: 'Refunded',
};

const PAYMENT_COLORS: Record<string, string> = {
  unpaid: 'text-yellow-400',
  pending: 'text-blue-400',
  paid: 'text-green-400',
  refunded: 'text-gray-400',
};

const DOC_TYPE_LABELS: Record<string, string> = {
  driving_licence: 'Driving Licence',
  insurance: 'Insurance Certificate',
  photo_id: 'Photo ID',
};

const DOC_STATUS_STYLES: Record<string, string> = {
  pending: 'text-yellow-400',
  approved: 'text-green-400',
  rejected: 'text-red-400',
};

function getNextStep(r: ReservationStatus): string {
  if (r.status === 'cancelled') return 'This reservation has been cancelled. Contact us to rebook.';
  if (r.status === 'completed') return 'Your hire is complete. Thank you for choosing M&M Auto Performance!';
  if (r.paymentStatus !== 'paid') return 'Our team will send you a secure payment link to confirm your deposit.';
  const docsNeeded = ['driving_licence', 'insurance'];
  const uploaded = r.documents.map((d) => d.type);
  const missing = docsNeeded.filter((t) => !uploaded.includes(t));
  if (missing.length > 0) {
    return `Please upload your ${missing.map((t) => DOC_TYPE_LABELS[t] || t).join(' and ')} using your secure link.`;
  }
  const pending = r.documents.filter((d) => d.status === 'pending');
  if (pending.length > 0) return 'Your documents are under review. We'll be in touch shortly.';
  return 'All done — our team will contact you to arrange handover details.';
}

export default function StatusPage({ reservation, token }: Props) {
  if (!reservation) {
    return (
      <>
        <Head>
          <title>Reservation Not Found — M&M Auto Performance</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <div className="min-h-screen bg-[#121316] flex flex-col items-center justify-center px-4 text-center">
          <p className="text-[#C5A572] text-xs tracking-widest uppercase mb-3">M&M Auto Performance</p>
          <h1 className="text-3xl font-bold text-white mb-4">Reservation not found</h1>
          <p className="text-gray-400 mb-8">
            This link may have expired or is invalid. Please contact us for assistance.
          </p>
          <Link
            href="/contact"
            className="px-6 py-3 bg-[#C5A572] text-[#121316] font-bold rounded-lg hover:bg-[#E3CFA1] transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </>
    );
  }

  const statusLabel = STATUS_LABELS[reservation.status] || reservation.status;
  const statusColor = STATUS_COLORS[reservation.status] || 'text-gray-400 bg-gray-400/10 border-gray-400/30';
  const paymentLabel = PAYMENT_LABELS[reservation.paymentStatus] || reservation.paymentStatus;
  const paymentColor = PAYMENT_COLORS[reservation.paymentStatus] || 'text-gray-400';
  const nextStep = getNextStep(reservation);

  const requiredDocs = ['driving_licence', 'insurance'];
  const optionalDocs = ['photo_id'];
  const allDocTypes = [...requiredDocs, ...optionalDocs];

  return (
    <>
      <Head>
        <title>Reservation Status — M&M Auto Performance</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="min-h-screen bg-[#121316] flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          {/* Brand header */}
          <p className="text-[#C5A572] text-xs tracking-widest uppercase font-bold mb-2 text-center">
            M&M Auto Performance
          </p>
          <h1 className="text-2xl font-bold text-white mb-8 text-center">Your Reservation</h1>

          {/* Vehicle + dates */}
          <div className="bg-[#1b1d21] border border-[rgba(197,165,114,0.25)] rounded-2xl p-6 mb-4">
            <h2 className="text-[#C5A572] font-bold text-lg mb-4">{reservation.model}</h2>
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td className="text-gray-500 pb-2 w-36">Pickup</td>
                  <td className="text-white pb-2">{reservation.pickupDate}</td>
                </tr>
                <tr>
                  <td className="text-gray-500 pb-2">Return</td>
                  <td className="text-white pb-2">{reservation.returnDate}</td>
                </tr>
                <tr>
                  <td className="text-gray-500 pb-2">Passengers</td>
                  <td className="text-white pb-2">{reservation.passengers}</td>
                </tr>
                {reservation.depositGbp != null && (
                  <tr>
                    <td className="text-gray-500 pb-2">Deposit</td>
                    <td className={`pb-2 font-semibold ${paymentColor}`}>
                      £{reservation.depositGbp.toLocaleString()} — {paymentLabel}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Status */}
          <div className="bg-[#1b1d21] border border-[rgba(197,165,114,0.25)] rounded-2xl p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Status</h3>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusColor}`}>
                {statusLabel}
              </span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">{nextStep}</p>
          </div>

          {/* Documents */}
          {reservation.paymentStatus === 'paid' && (
            <div className="bg-[#1b1d21] border border-[rgba(197,165,114,0.25)] rounded-2xl p-6 mb-4">
              <h3 className="text-white font-semibold mb-4">Documents</h3>
              <div className="space-y-3">
                {allDocTypes.map((type) => {
                  const doc = reservation.documents.find((d) => d.type === type);
                  const isOptional = optionalDocs.includes(type);
                  return (
                    <div key={type} className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">
                        {DOC_TYPE_LABELS[type] || type}
                        {isOptional && (
                          <span className="ml-1 text-xs text-gray-600">(optional)</span>
                        )}
                      </span>
                      {doc ? (
                        <span className={`font-semibold ${DOC_STATUS_STYLES[doc.status] || 'text-gray-400'}`}>
                          {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                        </span>
                      ) : (
                        <span className="text-gray-600">Not uploaded</span>
                      )}
                    </div>
                  );
                })}
              </div>
              {/* Link back to upload page */}
              {reservation.documents.length < requiredDocs.length && (
                <div className="mt-4 pt-4 border-t border-[rgba(197,165,114,0.15)]">
                  <Link
                    href={`/verify/${token}`}
                    className="block text-center px-6 py-3 bg-[#C5A572] text-[#121316] font-bold rounded-lg hover:bg-[#E3CFA1] transition-colors text-sm"
                  >
                    Upload Documents
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <p className="text-center text-xs text-gray-600 mt-4">
            Questions?{' '}
            <Link href="/contact" className="text-[#C5A572] hover:underline">
              Contact us
            </Link>{' '}
            · Reservation received{' '}
            {new Date(reservation.createdAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
  const token = params?.token as string;

  if (!token || !UUID_RE.test(token)) {
    return { props: { reservation: null, token: token || '' } };
  }

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return { props: { reservation: null, token } };
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
    );

    const { data: res, error } = await supabase
      .from('booking_requests')
      .select(
        'id, model, pickup_date, return_date, passengers, status, payment_status, deposit_pence, created_at',
      )
      .eq('upload_token', token)
      .single();

    if (error || !res) {
      return { props: { reservation: null, token } };
    }

    const { data: docs } = await supabase
      .from('reservation_documents')
      .select('document_type, status')
      .eq('request_id', res.id as string);

    const reservation: ReservationStatus = {
      model: res.model as string,
      pickupDate: res.pickup_date as string,
      returnDate: res.return_date as string,
      passengers: res.passengers as number,
      status: res.status as string,
      paymentStatus: res.payment_status as string,
      depositGbp:
        res.deposit_pence != null ? Math.round((res.deposit_pence as number) / 100) : null,
      createdAt: res.created_at as string,
      documents: (docs || []).map((d) => ({
        type: d.document_type as string,
        status: d.status as string,
      })),
    };

    return { props: { reservation, token } };
  } catch {
    return { props: { reservation: null, token } };
  }
};
