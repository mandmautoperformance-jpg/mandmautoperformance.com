import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';

type DocType = 'driving_licence' | 'insurance' | 'photo_id';

const SLOTS: { type: DocType; label: string; hint: string }[] = [
  { type: 'driving_licence', label: 'Driving Licence', hint: 'Front of your full UK/EU licence' },
  { type: 'insurance', label: 'Insurance', hint: 'Your insurance certificate or cover note' },
  { type: 'photo_id', label: 'Photo ID (optional)', hint: 'Passport or national ID' },
];

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPT = 'image/jpeg,image/png,image/webp,application/pdf';

function readAsBase64(file: File): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result);
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve({ base64, mimeType: file.type || 'image/jpeg' });
    };
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}

export default function VerifyPage() {
  const router = useRouter();
  const token = router.query.token as string | undefined;
  const [state, setState] = useState<Record<DocType, 'idle' | 'uploading' | 'done' | 'error'>>({
    driving_licence: 'idle',
    insurance: 'idle',
    photo_id: 'idle',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onPick = async (type: DocType, file: File | undefined) => {
    if (!file || !token) return;
    setErrors((e) => ({ ...e, [type]: '' }));
    if (file.size > MAX_BYTES) {
      setErrors((e) => ({ ...e, [type]: 'File too large (max 10 MB).' }));
      return;
    }
    setState((s) => ({ ...s, [type]: 'uploading' }));
    try {
      const { base64, mimeType } = await readAsBase64(file);
      const res = await fetch('/api/reservations/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, documentType: type, fileBase64: base64, mimeType }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrors((e) => ({ ...e, [type]: data.error || 'Upload failed.' }));
        setState((s) => ({ ...s, [type]: 'error' }));
      } else {
        setState((s) => ({ ...s, [type]: 'done' }));
      }
    } catch {
      setErrors((e) => ({ ...e, [type]: 'Upload failed. Please try again.' }));
      setState((s) => ({ ...s, [type]: 'error' }));
    }
  };

  return (
    <>
      <Head>
        <title>Document Verification | M&M Auto Performance</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <main className="min-h-screen bg-performance-grey text-white">
        <Navbar isLoggedIn={false} userRole="guest" currentPage="" />

        <section className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-performance-turquoise text-[11px] font-bold tracking-[0.45em] uppercase mb-3">
                Secure Verification
              </p>
              <h1 className="font-display text-4xl font-bold text-white mb-3">Upload your documents</h1>
              <p className="text-gray-400">
                To finalise your reservation we need a couple of documents. Your files are stored
                securely and only seen by our team.
              </p>
            </div>

            {!token ? (
              <div className="rounded-lg border border-red-500/40 bg-red-500/10 text-red-300 px-4 py-3 text-sm text-center">
                This verification link is invalid. Please use the link we sent you.
              </div>
            ) : (
              <div className="space-y-4">
                {SLOTS.map((slot) => {
                  const st = state[slot.type];
                  return (
                    <div
                      key={slot.type}
                      className="rounded-xl border border-performance-turquoise/20 bg-performance-grey/60 p-5"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h3 className="text-white font-bold">{slot.label}</h3>
                          <p className="text-gray-500 text-xs mt-0.5">{slot.hint}</p>
                        </div>
                        {st === 'done' ? (
                          <span className="text-green-400 font-bold text-sm whitespace-nowrap">✓ Uploaded</span>
                        ) : (
                          <label
                            className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition ${
                              st === 'uploading'
                                ? 'bg-performance-turquoise/40 text-performance-grey'
                                : 'bg-performance-turquoise hover:bg-performance-turquoise/90 text-performance-grey'
                            }`}
                          >
                            {st === 'uploading' ? 'Uploading…' : 'Choose file'}
                            <input
                              type="file"
                              accept={ACCEPT}
                              className="hidden"
                              disabled={st === 'uploading'}
                              onChange={(e) => onPick(slot.type, e.target.files?.[0])}
                            />
                          </label>
                        )}
                      </div>
                      {errors[slot.type] && (
                        <p className="text-red-400 text-xs mt-2">{errors[slot.type]}</p>
                      )}
                    </div>
                  );
                })}

                <p className="text-gray-500 text-xs text-center pt-2">
                  Accepted formats: JPG, PNG, WebP or PDF · up to 10 MB each. You can close this page
                  once your licence and insurance show “Uploaded”.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
