import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AlertCircle, CheckCircle, CreditCard, FileText, ShieldCheck } from 'lucide-react';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

type DocType = 'driving_licence' | 'photo_id';

interface SlotState {
  uploading: boolean;
  done: boolean;
  error: string | null;
}

const INIT: SlotState = { uploading: false, done: false, error: null };

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function VerifyIdPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [licence, setLicence] = useState<SlotState>(INIT);
  const [photoId, setPhotoId] = useState<SlotState>(INIT);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const licenceRef = useRef<HTMLInputElement>(null);
  const photoIdRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.replace('/login'); return; }
      if (session.user.user_metadata?.id_uploaded) { router.replace('/dashboard'); return; }
      setUserEmail(session.user.email || '');
      setLoading(false);
    });
  }, [router]);

  const uploadDoc = async (docType: DocType, file: File, set: React.Dispatch<React.SetStateAction<SlotState>>) => {
    set({ uploading: true, done: false, error: null });
    try {
      const raw = await fileToBase64(file);
      const base64 = raw.split(',')[1];
      const supabase = getSupabaseBrowser();
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || '';

      const res = await fetch('/api/account/upload-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ docType, fileBase64: base64, mimeType: file.type }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Upload failed');
      set({ uploading: false, done: true, error: null });
    } catch (err: any) {
      set({ uploading: false, done: false, error: err.message || 'Upload failed. Please try again.' });
    }
  };

  const handleFile = (docType: DocType, file: File | undefined | null, set: React.Dispatch<React.SetStateAction<SlotState>>) => {
    if (!file) return;
    uploadDoc(docType, file, set);
  };

  const handleSubmit = async () => {
    if (!licence.done || !photoId.done) return;
    setSubmitting(true);
    const supabase = getSupabaseBrowser();
    await supabase.auth.updateUser({ data: { id_uploaded: true } });
    setSubmitting(false);
    setSubmitted(true);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-performance-grey flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-performance-turquoise/30 border-t-performance-turquoise rounded-full animate-spin" />
      </main>
    );
  }

  if (submitted) {
    return (
      <>
        <Head>
          <title>Documents Submitted | M&amp;M Auto Performance</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <main className="min-h-screen bg-performance-grey flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <ShieldCheck size={64} className="text-performance-turquoise mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-white mb-3">All done!</h1>
            <p className="text-gray-400 mb-2">Your documents are with our team. We verify IDs within 24 hours.</p>
            {userEmail && (
              <p className="text-gray-400 mb-8 text-sm">
                You'll hear from us at <span className="text-performance-turquoise">{userEmail}</span>.
              </p>
            )}
            <Link
              href="/dashboard"
              className="inline-block px-8 py-3.5 bg-performance-turquoise text-performance-grey font-bold rounded-lg hover:bg-performance-turquoise/90 transition-all"
            >
              Go to Dashboard
            </Link>
          </div>
        </main>
      </>
    );
  }

  const bothDone = licence.done && photoId.done;

  return (
    <>
      <Head>
        <title>Verify Your ID | M&amp;M Auto Performance</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <main className="min-h-screen bg-performance-grey px-4 py-14">
        <div className="max-w-lg mx-auto">

          <div className="text-center mb-10">
            <p className="text-performance-turquoise text-[10px] font-bold tracking-[0.4em] uppercase mb-4">
              Identity Verification
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Upload your documents</h1>
            <p className="text-gray-400 text-sm max-w-sm mx-auto leading-relaxed">
              We need a copy of your driving licence and a photo ID before you can make a booking.
              Our team reviews these within 24 hours.
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <UploadSlot
              icon={<CreditCard size={22} className="text-performance-turquoise" />}
              title="Driving Licence"
              subtitle="Front of your full UK or EU driving licence"
              state={licence}
              inputRef={licenceRef}
              onChange={(f) => handleFile('driving_licence', f, setLicence)}
            />
            <UploadSlot
              icon={<FileText size={22} className="text-performance-turquoise" />}
              title="Photo ID"
              subtitle="Passport or any government-issued photo ID"
              state={photoId}
              inputRef={photoIdRef}
              onChange={(f) => handleFile('photo_id', f, setPhotoId)}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!bothDone || submitting}
            className="w-full py-4 bg-gradient-to-r from-performance-turquoise to-performance-babyblue text-performance-grey font-bold rounded-lg disabled:opacity-40 transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <span className="w-5 h-5 border-2 border-performance-grey/30 border-t-performance-grey rounded-full animate-spin" />
            ) : (
              'Submit Documents'
            )}
          </button>

          <p className="text-center mt-5">
            <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
              Skip for now — I'll do this later
            </Link>
          </p>

          <p className="text-center text-xs text-gray-600 mt-6 leading-relaxed">
            Documents are stored securely and used only for identity verification.
            They are never shared with third parties.
          </p>
        </div>
      </main>
    </>
  );
}

interface SlotProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  state: SlotState;
  inputRef: React.RefObject<HTMLInputElement>;
  onChange: (file: File | undefined | null) => void;
}

function UploadSlot({ icon, title, subtitle, state, inputRef, onChange }: SlotProps) {
  const clickable = !state.done && !state.uploading;
  return (
    <div
      onClick={() => clickable && inputRef.current?.click()}
      className={`border rounded-xl p-5 transition-all ${
        state.done
          ? 'border-green-500/40 bg-green-500/5 cursor-default'
          : state.error
          ? 'border-red-500/40 bg-red-500/5 cursor-pointer'
          : 'border-performance-turquoise/30 bg-performance-turquoise/5 cursor-pointer hover:border-performance-turquoise/60 hover:bg-performance-turquoise/8'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0])}
      />
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-performance-turquoise/10 flex items-center justify-center">
          {state.done ? <CheckCircle size={22} className="text-green-400" /> : icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white text-sm mb-0.5">{title}</p>
          <p className="text-xs text-gray-500">{subtitle}</p>
          {state.uploading && (
            <p className="text-xs text-performance-turquoise mt-1.5">Uploading…</p>
          )}
          {state.done && (
            <p className="text-xs text-green-400 mt-1.5">Uploaded successfully</p>
          )}
          {state.error && (
            <div className="flex items-center gap-1 mt-1.5">
              <AlertCircle size={11} className="text-red-400 flex-shrink-0" />
              <p className="text-xs text-red-400">{state.error}</p>
            </div>
          )}
          {!state.done && !state.uploading && !state.error && (
            <p className="text-xs text-performance-turquoise mt-1.5">
              Click to upload · JPG, PNG, WebP or PDF · max 10 MB
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
