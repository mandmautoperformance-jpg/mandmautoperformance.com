import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { CATEGORY_REQUIREMENTS, MAX_DRIVER_AGE } from '@/lib/driver-eligibility';
import { CATEGORY_LABELS, type VehicleCategory } from '@/lib/vehicles';

const REQ_ROWS = (Object.keys(CATEGORY_REQUIREMENTS) as VehicleCategory[])
  .map((cat) => ({
    label: CATEGORY_LABELS[cat],
    minAge: CATEGORY_REQUIREMENTS[cat].minAge,
    minLicenceYears: CATEGORY_REQUIREMENTS[cat].minLicenceYears,
  }))
  .sort((a, b) => a.minAge - b.minAge || a.minLicenceYears - b.minLicenceYears);

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms &amp; Conditions | M&M Auto Performance</title>
        <meta name="description" content="Terms and conditions for M&M Auto Performance vehicle hire — driver eligibility, age requirements, DVLA licence checks, booking and liability." />
      </Head>
      <main className="min-h-screen bg-performance-grey text-white">
        <Navbar />
        <div className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <p className="text-performance-turquoise text-[11px] font-bold tracking-[0.45em] uppercase mb-3">
              The Fine Print
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold mb-3">Terms &amp; Conditions</h1>
            <p className="text-gray-400 mb-10">Last updated: June 2026</p>

            <section className="space-y-8 text-gray-300 leading-relaxed">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">1. Agreement to Terms</h2>
                <p>
                  By accessing and using mandmautoperformance.com and hiring a vehicle from us, you accept and agree to be
                  bound by these terms. If you do not agree, please do not use this service.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-4">2. Driver Eligibility &amp; Age Requirements</h2>
                <p className="mb-4">
                  Our fleet is age- and experience-restricted in line with our insurers&apos; underwriting. To hire, you must
                  hold a valid full driving licence and meet the minimum age and licence-tenure for the vehicle&apos;s class:
                </p>
                <div className="overflow-hidden rounded-xl border border-performance-turquoise/20">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-performance-turquoise/10 text-white">
                        <th className="text-left font-bold px-4 py-3">Vehicle class</th>
                        <th className="text-left font-bold px-4 py-3">Minimum age</th>
                        <th className="text-left font-bold px-4 py-3">Licence held</th>
                      </tr>
                    </thead>
                    <tbody>
                      {REQ_ROWS.map((row) => (
                        <tr key={row.label} className="border-t border-performance-turquoise/10">
                          <td className="px-4 py-3 text-white">{row.label}</td>
                          <td className="px-4 py-3 text-performance-turquoise font-semibold">{row.minAge}+</td>
                          <td className="px-4 py-3">{row.minLicenceYears}+ {row.minLicenceYears === 1 ? 'year' : 'years'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4">
                  An upper age limit of {MAX_DRIVER_AGE} applies under our standard cover; drivers above this may still hire
                  by arranging bespoke insurance with us in advance. You must also provide a valid payment method and a
                  refundable security deposit.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-4">3. Licence Verification &amp; DVLA Checks</h2>
                <p className="mb-4">
                  At the point of booking and again before handover we verify your driving entitlement. By proceeding you
                  consent to the following:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>We confirm your date of birth and test-pass date against the vehicle&apos;s eligibility rules.</li>
                  <li>Where you provide a driving licence number, we validate it against your date of birth and, where enabled, verify it directly with the DVLA.</li>
                  <li>We may ask you to upload your licence, insurance and photo ID via a secure link before collection.</li>
                  <li>For data minimisation we do not store your full licence number — only a masked reference and the check outcome are retained. See our <Link href="/privacy" className="text-performance-turquoise hover:underline">Privacy Policy</Link>.</li>
                </ul>
                <p className="mt-4">
                  We reserve the right to refuse or cancel a hire, without liability, where eligibility cannot be verified
                  or where a licence carries disqualifying endorsements.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-4">4. Booking &amp; Cancellation</h2>
                <p className="mb-4">
                  A reservation request is not a confirmed booking until we confirm availability and you pay the deposit.
                  Once confirmed, our cancellation policy applies:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Cancel 7+ days before pickup: full refund of deposit</li>
                  <li>Cancel 3–7 days before: 50% of deposit refunded</li>
                  <li>Cancel within 3 days: deposit non-refundable (vehicle held for you)</li>
                  <li>No-show: full charge applies</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-4">5. Damage &amp; Liability</h2>
                <p className="mb-4">During the hire period, the renter is responsible for:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Any damage to the vehicle</li>
                  <li>Loss or theft (up to the vehicle value, subject to your cover)</li>
                  <li>Traffic violations, congestion charges and parking fines</li>
                  <li>Refuelling/recharging if not returned as collected</li>
                  <li>Excess mileage charges, where applicable</li>
                </ul>
                <p className="mt-4">
                  <strong className="text-white">Our insurance options cover:</strong> collision damage, theft,
                  windscreen/tyre damage and third-party liability, subject to the stated excess.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-4">6. Payment Terms</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>A deposit is required to confirm a booking</li>
                  <li>A valid credit/debit card in the lead driver&apos;s name is required</li>
                  <li>A refundable security deposit is released after the return inspection</li>
                  <li>Final charges are calculated after inspection; all prices are in GBP</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-4">7. Vehicle Condition &amp; Use</h2>
                <p className="mb-4">All vehicles are supplied in excellent condition. You must:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Inspect the vehicle before departure and report any issues immediately</li>
                  <li>Return the vehicle clean and refuelled/recharged</li>
                  <li>Drive within posted speed limits and the law at all times</li>
                  <li>Not permit any unlisted driver to drive the vehicle</li>
                  <li>Not use the vehicle for racing, track use, hire/reward or any illegal purpose</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-4">8. Limitation of Liability</h2>
                <p>
                  M&amp;M Auto Performance shall not be liable for any indirect, incidental, special or consequential
                  damages arising from your use of our services or vehicles. Nothing in these terms limits liability for
                  death or personal injury caused by negligence, or any liability that cannot be excluded under UK law.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-4">9. Dispute Resolution</h2>
                <p className="mb-4">Disputes are resolved, in order, through:</p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Good-faith negotiation (14 days)</li>
                  <li>Mediation</li>
                  <li>Legal proceedings under the law of England &amp; Wales</li>
                </ol>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-4">10. Contact</h2>
                <p>
                  Questions about these terms? Email{' '}
                  <span className="text-performance-turquoise font-semibold">support@mandmautoperformance.com</span>{' '}
                  or reach us via the <Link href="/contact" className="text-performance-turquoise hover:underline">contact page</Link>.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
