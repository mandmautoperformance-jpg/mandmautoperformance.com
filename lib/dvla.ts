/**
 * DVLA driving-licence verification — server-side only.
 *
 * Today this performs a structural + encoded-DOB check (no external call), which
 * is a real first-line defence against typos and obviously-invalid numbers.
 *
 * When the business is enrolled with DVLA, swap the body of `liveDvlaCheck` for
 * a call to one of:
 *   • "Check a driving licence" / Share Driving Licence (customer-consented code), or
 *   • Access to Driver Data (ADD) for direct B2B lookups.
 * Both require a signed agreement + credentials; set DVLA_API_KEY to enable. The
 * surrounding eligibility logic and UI need no changes — they already consume
 * the LicenceCheckResult shape below.
 */

import { licenceMatchesDob, isPlausibleUkLicence } from './driver-eligibility';

export interface LicenceCheckResult {
  /** Overall pass/fail for the check that ran. */
  ok: boolean;
  /** Which check actually ran. */
  method: 'offline' | 'dvla-live';
  /** Number was structurally valid. */
  formatValid: boolean;
  /** Encoded DOB matched the supplied DOB (offline) or DVLA confirmed identity (live). */
  dobMatch: boolean;
  /** Stable reference for audit trails (never the raw licence number). */
  reference: string;
  /** Non-sensitive machine reason, for logs. */
  detail?: string;
}

function maskedRef(licence: string): string {
  const s = licence.replace(/\s+/g, '').toUpperCase();
  // Surname block + last two chars only — enough to correlate, not to reconstruct.
  return `${s.slice(0, 5)}••••••••${s.slice(-2)}`;
}

/** Placeholder for the real DVLA call. Returns null when not configured. */
async function liveDvlaCheck(): Promise<LicenceCheckResult | null> {
  if (!process.env.DVLA_API_KEY) return null;
  // TODO: integrate DVLA ADD / Share Driving Licence here. Until then we fall
  // through to the offline check even if a key is present, so behaviour is safe.
  return null;
}

/**
 * Verify a UK driving licence against a date of birth. Always resolves — callers
 * decide how to treat a soft failure.
 */
export async function checkDrivingLicence(
  licenceNumber: string,
  dob: string,
): Promise<LicenceCheckResult> {
  const live = await liveDvlaCheck();
  if (live) return live;

  const formatValid = isPlausibleUkLicence(licenceNumber);
  const reference = formatValid ? maskedRef(licenceNumber) : 'invalid-format';
  if (!formatValid) {
    return { ok: false, method: 'offline', formatValid: false, dobMatch: false, reference, detail: 'format' };
  }
  const dobCheck = licenceMatchesDob(licenceNumber, dob);
  return {
    ok: dobCheck.matches,
    method: 'offline',
    formatValid: true,
    dobMatch: dobCheck.matches,
    reference,
    detail: dobCheck.detail,
  };
}
