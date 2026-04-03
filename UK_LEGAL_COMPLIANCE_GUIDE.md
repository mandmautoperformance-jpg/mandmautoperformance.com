# UK Legal & Compliance Guide - M&M Auto Performance

## Overview

M&M Auto Performance must comply with **multiple UK legal frameworks**. This guide covers everything from DVLA verification to insurance to GDPR.

---

## 🚗 Driver & Vehicle Verification

### DVLA License Verification

**Requirement:** All drivers must have valid UK driving license
**Age:** Minimum 21 years (25+ for luxury vehicles)
**Experience:** Minimum 1 year since license issued

**What to verify:**
- License number & validity dates
- Driving license photocard (front & back)
- Check for driving bans/disqualifications
- Points on license (reject if 6+ points)

**Implementation:**
- Use DVLA API integration (connected to Supabase)
- User submits photocard images
- Google Vision OCR extracts license data
- DVLA API checks validity in real-time

**Your Component:**
```
LegalComplianceSetup.tsx → License Verification step
```

### Identity Verification

**What we collect:**
1. **Photo ID:** Passport OR UK Driving License
2. **User Photo:** Selfie with ID (liveness check)
3. **Proof of Address:** Utility bill, bank statement (<3 months old)

**Storage:**
- Encrypted in Supabase with AES-256
- Auto-deleted after 48 hours post-rental
- User can request deletion anytime (GDPR Article 17)

**Why it matters:**
- Prevents fraud & false identities
- Establishes legal chain of liability
- Required by insurance company
- Helps with dispute resolution

---

## 💳 Payment & Financial Verification

### Debit Card Verification

**Requirement:** Valid UK debit card in cardholder's name
**Accepted:** Visa Debit, Mastercard, Electron, Maestro

**Verification Steps:**
1. Card holder name matches identity
2. 3D Secure authentication (Stripe handles)
3. Pre-authorization hold: £500-£2,000 (based on vehicle)
4. Hold remains until 48 hours post-return
5. Final charge released within 7 days

**Pre-authorization Amounts:**
- Standard cars (Tesla 3, VW Golf): £500
- Premium cars (Range Rover, BMW X5): £1,000
- Luxury cars (Mercedes S-Class, Porsche): £2,000

**Why Pre-Authorization?**
- Ensures customer has available funds
- Covers potential damage/fuel costs
- Protects M&M from chargeback fraud
- Automatically refunds unused amount

**Your Implementation:**
- Stripe integration (already in place)
- 3D Secure automatically handled
- Pre-auth holds released via API

---

## 🛡️ Insurance & Liability

### M&M Standard Insurance (Included)

**Driver is liable for:**
- All accidental damage
- Intentional damage
- Windscreen/tire damage
- Interior damage (seats, dashboard)
- Undercarriage damage

**Excess:** £250-£1,000 (depending on vehicle)
**Deductible:** Charged immediately upon damage report

### Optional Damage Waivers

**Premium Waiver:** £20-£50 per rental
- Reduces excess to £0-£100
- Covers accidental damage
- Windscreen damage covered
- Tire damage covered

**Super Waiver:** £50-£80 per rental
- Full coverage (zero excess)
- All damage covered including intentional
- Comprehensive roadside assistance
- No deductibles

### Insurance Certificate

**Must have on file:**
- Company: M&M Auto Performance (with broker)
- Type: Commercial vehicle hire insurance
- Coverage: £5M public liability minimum
- Requirement: All vehicles must have valid insurance certificate
- Check: Must be displayed on vehicle dashboard

---

## 📸 Photo Documentation Requirements

### Pre-Hire Inspection (6 Angles)

1. **Windscreen** - Full view, no obstructions
2. **Left Side** - Entire side visible
3. **Right Side** - Entire side visible
4. **Rear** - Back bumper & lights
5. **Interior 1** - Steering wheel, dashboard, seats
6. **Interior 2** - Rear seats, floor, trunk

**Meta Requirements:**
- Timestamp embedded in image EXIF
- Geolocation tagged
- Lighting adequate (clear details)
- No filters or editing
- Driver AND vehicle visible in at least one angle

### Post-Hire Inspection (Same 6 Angles)

**Same angles as pre-hire**
- Must match pre-hire angles for comparison
- Timestamp required
- Geolocation required
- If damage detected:
  - Additional close-up photos required
  - Damage description recorded
  - Driver notified immediately

### Additional Photos If Damage Reported

- Close-ups of damage (4+ angles)
- Full vehicle context shots
- Odometer reading before/after
- Driver statement photo (typed or handwritten)

**Your Component:**
```
LegalComplianceSetup.tsx → Vehicle Inspections tab
```

---

## ⚖️ Data Protection (GDPR Compliance)

### What Data We Collect

| Data Type | Retention | Legal Basis |
|-----------|-----------|-------------|
| License photocard | 48 hours post-rental | Contract performance |
| Identity photo | 14 days | Fraud prevention |
| Proof of address | 48 hours post-rental | KYC/AML compliance |
| Payment card info | During transaction only | Contract performance |
| Pre-hire photos | 12 months | Liability protection |
| Post-hire photos | 12 months | Liability protection |
| Behavioral data | 24 months | Legitimate interest (analytics) |

### User Rights (GDPR)

Users have the right to:
- **Access:** Download all their data (Article 15)
- **Rectification:** Correct inaccurate data (Article 16)
- **Erasure:** Delete data after 48 hours post-rental (Article 17)
- **Restriction:** Limit how we use their data (Article 18)
- **Portability:** Get data in machine-readable format (Article 20)
- **Object:** Opt-out of marketing (Article 21)

**Your Implementation:**
- Easy "Delete My Data" button in Driver's Passport
- Auto-deletion cronjob after retention period
- Encryption at rest (AES-256)
- Encryption in transit (TLS 1.3)

---

## 📋 Legal Documents Required

### 1. Rental Agreement

**Must include:**
- Renter identity & license number
- Vehicle details (VIN, registration, mileage in)
- Rental dates & duration
- Rental price & payment terms
- Fuel policy (full-to-full or not)
- Mileage limits (if any)
- Damage/excess policy
- Driver conduct rules
- Cancellation policy

**Must be:**
- Signed electronically or physically
- Provided in PDF to customer
- Archived for 7 years (tax purposes)

### 2. Privacy Policy

**Must cover:**
- What data we collect
- Why we collect it (legal basis)
- How long we keep it
- Who has access (Stripe, Google Cloud, etc.)
- User rights (access, deletion, etc.)
- Data breach notification procedure
- Right to lodge complaint with ICO

**Must be:**
- Clear & in plain language
- Linked from all signup pages
- Versioned with change log

### 3. Insurance T&Cs

**Must clearly state:**
- Coverage limits (£5M liability)
- Excess amounts (£250-£1,000)
- What's covered/excluded
- Waiver options & pricing
- Claim procedure
- Notifiable incidents (police report needed)

### 4. Driver Conduct Rules

**Must prohibit:**
- Smoking (unless designated area)
- Eating/drinking (non-water)
- Excessive noise/music
- Driving under influence
- Speeding/dangerous driving
- Unapproved passengers
- Off-road/track driving
- Commercial use (e.g., Uber)

**Violations result in:**
- Booking immediately terminated
- Damage charges + repair costs
- Lifetime ban from service
- Potential legal action

---

## 🚨 Incident & Damage Reporting

### When Damage is Reported

1. **Immediate Actions:**
   - Request post-hire photos from all 6 angles
   - Get driver statement (typed or voice recorded)
   - Calculate repair estimate
   - Check insurance coverage

2. **Driver Notification:**
   - Email within 24 hours
   - Include damage photos
   - Include repair estimate
   - Reference relevant waiver/excess

3. **Charge Processing:**
   - Deduct from pre-authorization hold
   - Issue invoice to driver
   - Send receipt with damage photos
   - Proceed with repair booking

4. **Dispute Resolution:**
   - Driver has 14 days to dispute
   - M&M provides evidence (photos, report)
   - Independent arbitration if needed

### If Police Report Needed

- Hit & run: Report to police within 24 hours
- Major collision: Police report required
- Theft: Report immediately
- Incident report shared with insurance

---

## 🏁 Liability Chain

### Who is Liable for What

| Scenario | Liable | Waiver? | Excess |
|----------|--------|---------|--------|
| Accidental scratch | Driver | Yes (Premium) | £250-£1,000 |
| Hit & run damage | Driver | Yes (Premium) | £250-£1,000 |
| Windscreen damage | Driver | Yes (Premium) | £250-£500 |
| Mechanical failure | M&M | No | £0 |
| Theft | Insurance | No | £0 |
| Intentional damage | Driver | No (exceeds waiver) | Full cost |

**M&M is NOT liable for:**
- Driver negligence or recklessness
- Violation of rental terms
- Use for illegal purposes
- Driving under influence
- Damage from mechanical failure before rental

---

## ✅ Pre-Launch Compliance Checklist

### Before Going Live

- [ ] DVLA API integration tested & verified
- [ ] Stripe 3D Secure implementation live
- [ ] Photo verification (Google Vision) working
- [ ] Data encryption (AES-256) implemented
- [ ] Auto-deletion cronjob scheduled (48 hours)
- [ ] Privacy Policy reviewed by solicitor
- [ ] Insurance policy obtained & reviewed
- [ ] Rental Agreement template finalized
- [ ] Driver Conduct Rules drafted
- [ ] Damage waiver options configured
- [ ] ICO registration confirmed
- [ ] Breach notification procedure documented
- [ ] User rights implementation tested
  - [ ] Data access/download working
  - [ ] Data deletion working
  - [ ] Unsubscribe from marketing working
- [ ] Incident report system live
- [ ] Damage claim workflow tested

---

## 📞 Regulatory Contacts

### If You Get Stuck

| Issue | Contact | Link |
|-------|---------|------|
| Data protection questions | Information Commissioner's Office (ICO) | https://ico.org.uk |
| Insurance issues | Financial Conduct Authority (FCA) | https://www.fca.org.uk |
| Employment law | ACAS | https://www.acas.org.uk |
| Business registration | Companies House | https://www.gov.uk/companieshouse |
| Tax questions | HMRC | https://www.gov.uk/hmrc |
| Driving license queries | DVLA | https://www.gov.uk/dvla |

---

## 💡 Best Practices

### Photo Management
- Store photos in Supabase with 256-bit encryption
- Generate PDF report with pre/post photos automatically
- Never email original photos (use links with expiration)
- Implement photo watermarking (date + time + vehicle ID)

### Payment Security
- Never store full card numbers (PCI-DSS violation)
- Use Stripe's tokenization (store tokens only)
- Implement 3D Secure for all transactions
- Log all transactions (encrypted) for dispute handling

### Data Handling
- Principle of "data minimization" - collect only what you need
- Use pseudonymization where possible
- Regular security audits (quarterly minimum)
- Staff training on data handling (annual)

### Legal Documentation
- Review contracts annually
- Update privacy policy if practices change
- Keep audit trail of all agreements signed
- Version all documents with change dates

---

## 🚀 You're Ready!

Once this checklist is complete, you're **fully compliant** with:
- ✅ DVLA driver verification standards
- ✅ GDPR data protection requirements
- ✅ FCA payment security rules
- ✅ Insurance liability standards
- ✅ UK vehicle hire industry best practices

Questions? Check `LegalComplianceSetup.tsx` component or consult a solicitor familiar with car rental businesses.

**Good luck! 🚗⚡**
