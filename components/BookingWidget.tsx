import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Users, User, Mail, Phone, ShieldCheck, CalendarClock, CreditCard, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { VEHICLES, MODEL_OPTIONS, weekendPrice, type Vehicle } from '@/lib/vehicles';
import { checkEligibility, getCategoryRequirement, requirementLabel } from '@/lib/driver-eligibility';

interface BookingWidgetProps {
  mode?: 'quick' | 'detailed';
  /** When provided, the widget is locked to this vehicle (detail pages). */
  vehicle?: Vehicle;
}

function daysBetween(pickup: string, ret: string): number {
  if (!pickup || !ret) return 0;
  const ms = new Date(ret).getTime() - new Date(pickup).getTime();
  if (Number.isNaN(ms)) return 0;
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

export const BookingWidget: React.FC<BookingWidgetProps> = ({ vehicle }) => {
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [pickupTime, setPickupTime] = useState('10:00');
  const [vehicleId, setVehicleId] = useState(vehicle?.vehicleId ?? '');
  const [passengers, setPassengers] = useState('1');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [consent, setConsent] = useState(false);

  // Driver eligibility (age-gating + DVLA-style licence check)
  const [dob, setDob] = useState('');
  const [licenceHeldSince, setLicenceHeldSince] = useState('');
  const [licenceNumber, setLicenceNumber] = useState('');
  const [ageConfirmed, setAgeConfirmed] = useState(false);

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];

  const selected = useMemo(
    () => vehicle ?? VEHICLES.find((v) => v.vehicleId === vehicleId),
    [vehicle, vehicleId],
  );

  const requirement = selected ? getCategoryRequirement(selected.category) : null;

  // Live eligibility against the selected vehicle's category rules.
  const eligibility = useMemo(() => {
    if (!selected) return null;
    return checkEligibility({
      category: selected.category,
      dob: dob || null,
      licenceHeldSince: licenceHeldSince || null,
      licenceNumber: licenceNumber || null,
    });
  }, [selected, dob, licenceHeldSince, licenceNumber]);

  // Only surface eligibility errors once the driver has entered the basics.
  const driverDetailsStarted = Boolean(dob || licenceHeldSince || licenceNumber);

  const days = daysBetween(pickupDate, returnDate);
  const estimate = selected && days ? selected.pricing.daily * days : 0;

  const step1Valid = pickupDate && returnDate && days > 0 && !!selected;
  const step2Valid =
    name.trim() &&
    /\S+@\S+\.\S+/.test(email) &&
    phone.trim() &&
    consent &&
    ageConfirmed &&
    !!dob &&
    !!licenceHeldSince &&
    !!eligibility?.eligible;

  const handleSubmit = async () => {
    if (!step2Valid || !selected) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/bookings/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId: selected.vehicleId,
          model: selected.model,
          dailyRate: selected.pricing.daily,
          pickupDate,
          returnDate,
          pickupTime,
          passengers,
          days,
          estimateGbp: estimate,
          name,
          email,
          phone,
          notes,
          dateOfBirth: dob,
          licenceHeldSince,
          licenceNumber: licenceNumber || undefined,
          ageConfirmed,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Could not submit your reservation. Please try again.');
      }
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 bg-performance-turquoise/10 border border-performance-turquoise/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-performance-turquoise focus:ring-2 focus:ring-performance-turquoise/20';

  return (
    <div className="w-full max-w-2xl mx-auto bg-performance-grey border border-performance-turquoise/30 rounded-2xl overflow-hidden shadow-2xl shadow-performance-turquoise/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-performance-turquoise/20 to-performance-babyblue/20 border-b border-performance-turquoise/30 px-6 py-6">
        <h2 className="text-2xl font-bold text-white mb-1">Reserve Your Vehicle</h2>
        <p className="text-gray-300 text-sm">
          {selected ? `${selected.model} · from £${selected.pricing.daily}/day` : 'Tell us your dates and we’ll confirm availability fast.'}
        </p>
      </div>

      {/* Steps Indicator */}
      <div className="px-6 pt-6">
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 text-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 transition-all ${
                  s <= step ? 'bg-performance-turquoise text-performance-grey' : 'bg-performance-turquoise/20 text-gray-400'
                }`}
              >
                {s === 1 ? '📅' : s === 2 ? '👤' : '✓'}
              </div>
              <p className={`text-xs font-medium ${s <= step ? 'text-performance-turquoise' : 'text-gray-500'}`}>
                {s === 1 ? 'Dates' : s === 2 ? 'Your details' : 'Done'}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 pb-6">
        {step === 1 && (
          <div className="space-y-6">
            {/* Vehicle picker (only when not locked to a vehicle) */}
            {!vehicle && (
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Vehicle</label>
                <select value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} className={inputClass}>
                  <option value="" className="bg-performance-grey">Choose a vehicle…</option>
                  {MODEL_OPTIONS.map((v) => (
                    <option key={v.vehicleId} value={v.vehicleId} className="bg-performance-grey">
                      {v.model} — from £{v.daily}/day
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <Calendar className="inline mr-2" size={16} />
                  Pickup Date
                </label>
                <input type="date" min={today} value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <Calendar className="inline mr-2" size={16} />
                  Return Date
                </label>
                <input type="date" min={pickupDate || today} value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className={inputClass} />
              </div>
            </div>

            {/* Time & Passengers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <Clock className="inline mr-2" size={16} />
                  Pickup Time
                </label>
                <input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <Users className="inline mr-2" size={16} />
                  Passengers
                </label>
                <select value={passengers} onChange={(e) => setPassengers(e.target.value)} className={inputClass}>
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n} className="bg-performance-grey">
                      {n} {n === 1 ? 'Passenger' : 'Passengers'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Live estimate */}
            {estimate > 0 && selected && (
              <div className="bg-performance-turquoise/10 border border-performance-turquoise/30 rounded-lg p-4 flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-400">Estimated total · {days} {days === 1 ? 'day' : 'days'}</p>
                  <p className="text-xs text-gray-500">£{selected.pricing.daily}/day · weekend 3 days £{weekendPrice(selected.pricing.daily)}</p>
                </div>
                <p className="text-2xl font-bold text-performance-turquoise">£{estimate.toLocaleString()}</p>
              </div>
            )}

            <button
              onClick={() => setStep(2)}
              disabled={!step1Valid}
              className="w-full py-3 bg-gradient-to-r from-performance-turquoise to-performance-babyblue text-performance-grey font-bold rounded-lg hover:shadow-lg hover:shadow-performance-turquoise/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-white">Your details</h3>
            <p className="text-gray-400 text-sm">
              We’ll confirm availability and send a secure payment link — no charge until you confirm.
            </p>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-300">{error}</div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2"><User className="inline mr-2" size={16} />Full name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={inputClass} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2"><Mail className="inline mr-2" size={16} />Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2"><Phone className="inline mr-2" size={16} />Phone</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="07…" className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Anything else? (optional)</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Occasion, delivery address, questions…" className={`${inputClass} resize-none`} />
            </div>

            {/* Driver eligibility */}
            <div className="pt-2 border-t border-performance-turquoise/15">
              <div className="flex items-center justify-between mb-1 mt-4">
                <h4 className="text-sm font-bold text-white">Driver eligibility</h4>
                {requirement && (
                  <span className="text-[11px] font-semibold text-performance-turquoise bg-performance-turquoise/10 border border-performance-turquoise/30 rounded-full px-2.5 py-0.5">
                    {requirementLabel(requirement)}
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-xs mb-4">
                This vehicle is age-restricted. We run an instant licence check — your number is verified, never stored.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2"><Calendar className="inline mr-2" size={16} />Date of birth</label>
                  <input type="date" max={today} value={dob} onChange={(e) => setDob(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2"><CalendarClock className="inline mr-2" size={16} />Test passed</label>
                  <input type="date" max={today} value={licenceHeldSince} onChange={(e) => setLicenceHeldSince(e.target.value)} className={inputClass} />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-300 mb-2"><CreditCard className="inline mr-2" size={16} />Driving licence number <span className="text-gray-500 font-normal">(optional, speeds up verification)</span></label>
                <input
                  type="text"
                  value={licenceNumber}
                  onChange={(e) => setLicenceNumber(e.target.value.toUpperCase())}
                  placeholder="MORGA657054SM9IJ"
                  maxLength={18}
                  autoComplete="off"
                  spellCheck={false}
                  className={`${inputClass} tracking-wider font-mono`}
                />
              </div>

              {/* Live eligibility feedback */}
              {driverDetailsStarted && eligibility && !eligibility.eligible && eligibility.reasons.length > 0 && (
                <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex gap-3">
                  <AlertTriangle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <ul className="text-xs text-red-300 space-y-1">
                    {eligibility.reasons.map((r, i) => (<li key={i}>{r}</li>))}
                  </ul>
                </div>
              )}
              {eligibility?.eligible && dob && licenceHeldSince && (
                <div className="mt-4 bg-green-500/10 border border-green-500/30 rounded-lg p-3 flex gap-3 items-center">
                  <CheckCircle2 size={18} className="text-green-400 flex-shrink-0" />
                  <p className="text-xs text-green-300">
                    You meet the requirements for the {selected?.model}.
                    {eligibility.licenceVerified ? ' Licence number verified ✓' : ''}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-performance-babyblue/10 border border-performance-babyblue/30 rounded-lg p-4 flex gap-3">
              <ShieldCheck size={18} className="text-performance-babyblue flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-300">
                Bring your licence &amp; insurance to collection, or upload them securely once we confirm. A refundable deposit applies.
                We verify your licence with DVLA-grade checks before handover.
              </p>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={ageConfirmed} onChange={(e) => setAgeConfirmed(e.target.checked)} className="mt-1 w-5 h-5 rounded border-performance-turquoise/30 text-performance-turquoise focus:ring-performance-turquoise" />
              <span className="text-sm text-gray-300">
                I confirm the details above are accurate and that I hold a valid full driving licence.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 w-5 h-5 rounded border-performance-turquoise/30 text-performance-turquoise focus:ring-performance-turquoise" />
              <span className="text-sm text-gray-300">
                I agree to the{' '}
                <Link href="/terms" className="text-performance-turquoise hover:underline">terms</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-performance-turquoise hover:underline">privacy policy</Link>,
                including a DVLA licence check.
              </span>
            </label>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-3 border-2 border-performance-turquoise text-performance-turquoise rounded-lg font-bold hover:bg-performance-turquoise/10 transition-all">
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!step2Valid || submitting}
                className="flex-1 py-3 bg-gradient-to-r from-performance-turquoise to-performance-babyblue text-performance-grey font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? <span className="w-5 h-5 border-2 border-performance-grey/30 border-t-performance-grey rounded-full animate-spin" /> : 'Request Reservation'}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🏁</div>
            <h3 className="text-2xl font-bold text-white mb-2">Reservation requested!</h3>
            <p className="text-gray-300 mb-2">
              Thanks {name.split(' ')[0]} — we’ve received your request for the <span className="text-performance-turquoise font-semibold">{selected?.model}</span>.
            </p>
            <p className="text-gray-400 text-sm mb-6">
              Our team will confirm availability and email a secure payment link to <span className="text-white">{email}</span>, usually within the hour. Need it sooner? Chat with MIA anytime.
            </p>
            <Link href="/fleet" className="inline-block px-8 py-3 bg-performance-turquoise text-performance-grey font-bold rounded-lg hover:bg-performance-turquoise/90 transition-all">
              Browse more vehicles
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingWidget;
