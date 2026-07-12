import type { NextApiRequest, NextApiResponse } from 'next';
import { rateLimit } from '@/lib/rate-limit';
import { checkDrivingLicence } from '@/lib/dvla';
import { checkEligibility } from '@/lib/driver-eligibility';
import type { VehicleCategory } from '@/lib/vehicles';

const limiter = rateLimit('verify-licence', 20, 60_000); // 20/min per IP

const CATEGORIES: VehicleCategory[] = ['exotic', 'supercar', 'sports', 'luxury', 'suv', 'executive'];

/**
 * Driver eligibility + licence check. Stateless: takes DOB, licence number,
 * test-pass date and a vehicle category, returns whether the driver may hire it.
 * The raw licence number is never logged or stored here — only a masked
 * reference and the boolean outcome travel onward.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!limiter(req, res)) return;

  const { category, dob, licenceHeldSince, licenceNumber } = (req.body || {}) as {
    category?: string;
    dob?: string;
    licenceHeldSince?: string;
    licenceNumber?: string;
  };

  if (!category || !CATEGORIES.includes(category as VehicleCategory)) {
    return res.status(400).json({ error: 'A valid vehicle category is required.' });
  }

  const eligibility = checkEligibility({
    category: category as VehicleCategory,
    dob,
    licenceHeldSince,
    licenceNumber,
  });

  // Run the (offline/DVLA) licence check only when we have both inputs.
  let licence: { ok: boolean; reference: string; method: string } | null = null;
  if (licenceNumber && dob) {
    const result = await checkDrivingLicence(licenceNumber, dob);
    licence = { ok: result.ok, reference: result.reference, method: result.method };
  }

  return res.status(200).json({
    eligible: eligibility.eligible,
    reasons: eligibility.reasons,
    age: eligibility.age,
    licenceYears: eligibility.licenceYears,
    requirement: eligibility.requirement,
    licenceVerified: eligibility.licenceVerified,
    licence,
  });
}
