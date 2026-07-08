import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export const CONSENT_KEY = 'mm_cookie_consent';
export type ConsentChoice = 'accepted' | 'rejected';

/** Read the stored choice (client-only). Returns null if not yet decided. */
export function getStoredConsent(): ConsentChoice | null {
  if (typeof window === 'undefined') return null;
  const v = window.localStorage.getItem(CONSENT_KEY);
  return v === 'accepted' || v === 'rejected' ? v : null;
}

/**
 * UK PECR / GDPR cookie consent banner.
 *
 * Non-essential cookies (Google Analytics) are NOT set until the visitor
 * actively accepts — the ICO-compliant "prior consent" model. Rejecting keeps
 * analytics off entirely. The choice is remembered so the banner shows once.
 */
const CookieConsent: React.FC<{ onChange: (c: ConsentChoice) => void }> = ({ onChange }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only prompt when no decision has been recorded yet.
    if (getStoredConsent() === null) setVisible(true);
  }, []);

  const decide = (choice: ConsentChoice) => {
    try {
      window.localStorage.setItem(CONSENT_KEY, choice);
    } catch {
      /* storage blocked — still honour the choice for this session */
    }
    setVisible(false);
    onChange(choice);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed bottom-0 inset-x-0 z-[100] p-4 sm:p-5"
    >
      <div className="max-w-4xl mx-auto bg-performance-panel border border-performance-turquoise/30 rounded-2xl shadow-2xl shadow-black/40 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm mb-1">We value your privacy 🍪</p>
          <p className="text-gray-400 text-xs leading-relaxed">
            We use essential cookies to run the site. With your consent we also use analytics cookies to
            understand how the site is used. You can accept or reject analytics — essential cookies always stay on.
            See our{' '}
            <Link href="/cookie-policy" className="text-performance-turquoise hover:underline">
              Cookie Policy
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-performance-turquoise hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={() => decide('rejected')}
            className="px-4 py-2.5 rounded-lg border border-performance-turquoise/30 text-gray-300 text-sm font-semibold hover:text-white hover:border-performance-turquoise/60 transition-all"
          >
            Reject analytics
          </button>
          <button
            onClick={() => decide('accepted')}
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-performance-turquoise to-performance-babyblue text-performance-grey text-sm font-bold hover:shadow-lg hover:shadow-performance-turquoise/30 transition-all"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
