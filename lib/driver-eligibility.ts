/**
 * Driver eligibility engine for M&M Auto Performance.
 *
 * Two jobs:
 *  1. Define the age / licence-tenure rules that gate each vehicle category
 *     (premium metal is age-restricted, as any real supercar-hire operator does).
 *  2. Provide an OFFLINE, no-dependency UK driving-licence sanity check: the
 *     16-character DVLA driver number encodes the holder's date of birth, so we
 *     can confirm the number is internally consistent with the DOB the customer
 *     gives us. This is a genuine first-line check and a stepping stone to a
 *     full DVLA "Access to Driver Data" lookup (see lib/dvla.ts) once live
 *     credentials are in place.
 *
 * Pure functions only — safe to import on both the client and the server.
 */

import type { VehicleCategory } from './vehicles';

export interface CategoryRequirement {
  /** Minimum driver age in whole years. */
  minAge: number;
  /** Minimum time a full licence must have been held, in whole years. */
  minLicenceYears: number;
}

/**
 * Age / experience matrix by category. These mirror standard UK luxury and
 * supercar hire underwriting bands. Adjust here and the whole site (fleet
 * cards, vehicle pages, booking gate, terms) follows automatically.
 */
export const CATEGORY_REQUIREMENTS: Record<VehicleCategory, CategoryRequirement> = {
  executive: { minAge: 21, minLicenceYears: 1 },
  suv: { minAge: 25, minLicenceYears: 2 },
  sports: { minAge: 25, minLicenceYears: 2 },
  luxury: { minAge: 25, minLicenceYears: 2 },
  supercar: { minAge: 30, minLicenceYears: 3 },
  exotic: { minAge: 30, minLicenceYears: 5 },
};

/** Absolute upper age limit applied across the fleet (insurer ceiling). */
export const MAX_DRIVER_AGE = 75;

export function getCategoryRequirement(category: VehicleCategory): CategoryRequirement {
  return CATEGORY_REQUIREMENTS[category];
}

/** Short human label, e.g. "Drivers 30+ · licence 3+ yrs". */
export function requirementLabel(req: CategoryRequirement): string {
  return `Drivers ${req.minAge}+ · licence ${req.minLicenceYears}+ ${req.minLicenceYears === 1 ? 'yr' : 'yrs'}`;
}

// ---------------------------------------------------------------------------
// Date helpers — all calendar-accurate (account for the month/day, not just
// the year), because a single day either side of a birthday changes eligibility.
// ---------------------------------------------------------------------------

/** Whole years between an ISO date (YYYY-MM-DD) and now. Returns null if unparseable. */
export function wholeYearsSince(iso: string | undefined | null, asOf: Date = new Date()): number | null {
  if (!iso) return null;
  const d = new Date(iso + 'T00:00:00Z');
  if (Number.isNaN(d.getTime())) return null;
  let years = asOf.getUTCFullYear() - d.getUTCFullYear();
  const m = asOf.getUTCMonth() - d.getUTCMonth();
  if (m < 0 || (m === 0 && asOf.getUTCDate() < d.getUTCDate())) years--;
  return years;
}

export function ageFromDob(dob: string | undefined | null, asOf: Date = new Date()): number | null {
  return wholeYearsSince(dob, asOf);
}

export function licenceYearsHeld(heldSince: string | undefined | null, asOf: Date = new Date()): number | null {
  return wholeYearsSince(heldSince, asOf);
}

// ---------------------------------------------------------------------------
// UK driving licence number — format + encoded DOB cross-check.
//
// Driver-number layout (16 chars), positions are 1-indexed below:
//   1–5   surname (first five letters, 9-padded)
//   6     decade digit of birth year
//   7–8   month of birth (+50 added for female holders → 51–62)
//   9–10  day of birth
//   11    final digit of birth year
//   12–13 first two forename initials (9-padded)
//   14–16 issue/check digits
// ---------------------------------------------------------------------------

const UK_LICENCE_RE = /^[A-Z9]{5}\d{6}[A-Z9]{2}\d[A-Z]{2}$|^[A-Z9]{5}\d{6}[A-Z9]{2}\d{2}[A-Z]{2}$/;

/** Loose structural check: 16 chars, broadly the DVLA shape. */
export function isPlausibleUkLicence(raw: string): boolean {
  const s = raw.replace(/\s+/g, '').toUpperCase();
  if (s.length !== 16) return false;
  // chars 1-5 letters/9, 6-11 digits, 12-13 letters/9, 14-16 alphanumeric.
  return /^[A-Z9]{5}\d{6}[A-Z9]{2}[A-Z0-9]{3}$/.test(s);
}

export interface LicenceDobCheck {
  /** Did the licence parse into a usable shape? */
  parsed: boolean;
  /** Does the DOB encoded in the licence match the supplied DOB? */
  matches: boolean;
  /** Reason when not matching / not parsed (for logs, never shown raw to user). */
  detail?: string;
}

/**
 * Confirm a supplied DOB (YYYY-MM-DD) is consistent with the DOB encoded in a
 * UK driver number. Century is inferred from the supplied DOB, since the
 * licence only stores a single decade digit.
 */
export function licenceMatchesDob(rawLicence: string, dob: string): LicenceDobCheck {
  const s = rawLicence.replace(/\s+/g, '').toUpperCase();
  if (!isPlausibleUkLicence(s)) {
    return { parsed: false, matches: false, detail: 'licence-format' };
  }
  const d = new Date(dob + 'T00:00:00Z');
  if (Number.isNaN(d.getTime())) {
    return { parsed: true, matches: false, detail: 'dob-unparseable' };
  }

  const yy = d.getUTCFullYear() % 100; // two-digit year within century
  const decadeDigit = Math.floor(yy / 10);
  const yearLastDigit = yy % 10;
  const month = d.getUTCMonth() + 1; // 1–12
  const day = d.getUTCDate();

  const licDecade = Number(s[5]);
  const licMonth = Number(s.slice(6, 8)); // may be +50 for female
  const licDay = Number(s.slice(8, 10));
  const licYearLast = Number(s[10]);

  const decadeOk = licDecade === decadeDigit;
  const yearOk = licYearLast === yearLastDigit;
  const dayOk = licDay === day;
  const monthOk = licMonth === month || licMonth === month + 50;

  const matches = decadeOk && yearOk && dayOk && monthOk;
  return {
    parsed: true,
    matches,
    detail: matches
      ? undefined
      : `mismatch:${decadeOk ? '' : 'decade '}${yearOk ? '' : 'year '}${monthOk ? '' : 'month '}${dayOk ? '' : 'day'}`.trim(),
  };
}

// ---------------------------------------------------------------------------
// Top-level eligibility decision.
// ---------------------------------------------------------------------------

export interface EligibilityInput {
  category: VehicleCategory;
  dob?: string | null; // YYYY-MM-DD
  licenceHeldSince?: string | null; // YYYY-MM-DD
  licenceNumber?: string | null;
}

export interface EligibilityResult {
  eligible: boolean;
  age: number | null;
  licenceYears: number | null;
  requirement: CategoryRequirement;
  /** Customer-facing reasons the booking can't proceed. Empty when eligible. */
  reasons: string[];
  /** True when a licence number was supplied AND matched the DOB. */
  licenceVerified: boolean;
}

export function checkEligibility(input: EligibilityInput, asOf: Date = new Date()): EligibilityResult {
  const requirement = getCategoryRequirement(input.category);
  const age = ageFromDob(input.dob, asOf);
  const licenceYears = licenceYearsHeld(input.licenceHeldSince, asOf);
  const reasons: string[] = [];

  if (age === null) {
    reasons.push('Please enter your date of birth.');
  } else {
    if (age < requirement.minAge) {
      reasons.push(`Drivers must be at least ${requirement.minAge} for this vehicle (you are ${age}).`);
    }
    if (age > MAX_DRIVER_AGE) {
      reasons.push(`Our cover has an upper age limit of ${MAX_DRIVER_AGE}. Please contact us to arrange bespoke cover.`);
    }
  }

  if (licenceYears === null) {
    reasons.push('Please tell us when you passed your test.');
  } else if (licenceYears < requirement.minLicenceYears) {
    reasons.push(
      `A full licence held ${requirement.minLicenceYears}+ years is required for this vehicle (you have ${Math.max(0, licenceYears)}).`,
    );
  }

  let licenceVerified = false;
  if (input.licenceNumber) {
    if (!input.dob) {
      reasons.push('Enter your date of birth so we can verify your licence.');
    } else {
      const check = licenceMatchesDob(input.licenceNumber, input.dob);
      if (!check.parsed) {
        reasons.push('That doesn’t look like a valid UK driving licence number.');
      } else if (!check.matches) {
        reasons.push('Your licence number doesn’t match your date of birth. Please double-check both.');
      } else {
        licenceVerified = true;
      }
    }
  }

  return {
    eligible: reasons.length === 0,
    age,
    licenceYears,
    requirement,
    reasons,
    licenceVerified,
  };
}

export { UK_LICENCE_RE };
