'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ComplianceStep {
  id: string;
  title: string;
  description: string;
  requirement: string;
  verified: boolean;
  documents: string[];
}

interface VehicleInspection {
  id: string;
  carId: string;
  carModel: string;
  preHirePhotos: string[];
  postHirePhotos: string[];
  mileageIn: number;
  mileageOut: number;
  damageReported: boolean;
  damageDetails: string;
}

const LegalComplianceSetup: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'compliance' | 'documents' | 'vehicle'>('compliance');
  const [complianceSteps, setComplianceSteps] = useState<ComplianceStep[]>([
    {
      id: 'dvla',
      title: 'DVLA License Verification',
      description: 'Verify UK driving license via DVLA API',
      requirement: 'UK Resident, valid license holder, minimum 1 year experience',
      verified: false,
      documents: [
        'Photocard driving license (front & back)',
        'Proof of address (utility bill, bank statement - <3 months old)',
      ],
    },
    {
      id: 'identity',
      title: 'Identity Verification',
      description: 'Confirm user identity and age',
      requirement: 'Must be 21+ years old (25+ for luxury cars)',
      verified: false,
      documents: [
        'Passport OR UK Driving License',
        'Recent photo (selfie with ID)',
        'Proof of current address',
      ],
    },
    {
      id: 'payment',
      title: 'Payment Method Verification',
      description: 'Verify debit card matches identity',
      requirement: 'UK debit card in cardholder\'s name',
      verified: false,
      documents: [
        'Debit card (Visa Debit, Mastercard, etc.)',
        'Security verification (3D Secure)',
        'Pre-authorization hold: £500-£2,000 depending on car',
      ],
    },
    {
      id: 'insurance',
      title: 'Insurance Coverage',
      description: 'Confirm insurance requirements',
      requirement: 'Must have valid motor insurance OR purchase M&M cover',
      verified: false,
      documents: [
        'Proof of insurance (policy document)',
        'Insurance certificate',
        'OR M&M Insurance premium (£15-£40 per rental)',
      ],
    },
    {
      id: 'terms',
      title: 'Legal Agreement',
      description: 'Accept terms & conditions',
      requirement: 'Must agree to rental terms (GDPR compliant)',
      verified: false,
      documents: [
        'M&M Standard Rental Agreement (PDF)',
        'Privacy Policy (GDPR compliant)',
        'Insurance T&Cs',
        'Driver Conduct Guidelines',
      ],
    },
    {
      id: 'liability',
      title: 'Liability & Damage Waiver',
      description: 'Confirm financial responsibility',
      requirement: 'Accept liability or purchase damage waiver',
      verified: false,
      documents: [
        'Standard waiver: Driver liable for all damage (excess: £250-£1,000)',
        'Premium waiver: £20-£50 per rental (excess: £0-£100)',
        'Super waiver: £50-£80 per rental (full coverage)',
      ],
    },
  ]);

  const [vehicleInspections, setVehicleInspections] = useState<VehicleInspection[]>([
    {
      id: '1',
      carId: 'CAR_001',
      carModel: 'Tesla Model 3 (Silver)',
      preHirePhotos: ['windscreen.jpg', 'left-side.jpg', 'right-side.jpg', 'rear.jpg', 'interior-1.jpg', 'interior-2.jpg'],
      postHirePhotos: [],
      mileageIn: 45230,
      mileageOut: 0,
      damageReported: false,
      damageDetails: '',
    },
  ]);

  const [selectedCompliance, setSelectedCompliance] = useState<ComplianceStep | null>(null);
  const [editMode, setEditMode] = useState(false);

  const verifyComplianceStep = (stepId: string) => {
    setComplianceSteps((prev) =>
      prev.map((step) =>
        step.id === stepId ? { ...step, verified: true } : step
      )
    );
  };

  const ukLegalChecklist = [
    {
      category: '📋 Legal Requirements',
      items: [
        'DVLA license verification via API',
        'Minimum age: 21 years (25 for luxury vehicles)',
        'GDPR compliant data collection & storage',
        'Data protection agreement with Stripe (payment processor)',
        'Written rental agreement for each booking',
        'Proof of identity & address before rental',
      ],
    },
    {
      category: '🚗 Vehicle Documentation',
      items: [
        'Pre-hire inspection with photos (6 angles: windscreen, sides, rear, interior x2)',
        'Post-hire inspection with photos (same 6 angles)',
        'Mileage recording (in & out)',
        'Damage assessment & documentation',
        'Vehicle condition report (PDF) to user',
        'MOT certificate on file for all vehicles',
        'Insurance certificate visible in vehicle',
      ],
    },
    {
      category: '💳 Payment & Financial',
      items: [
        'Debit card verification (Stripe 3D Secure)',
        'Pre-authorization hold (£500-£2,000 depending on vehicle)',
        'Final charge within 48 hours of return',
        'Damage charges deducted from authorization if needed',
        'Refund of unused authorization within 7 days',
        'PCI-DSS compliant payment processing',
      ],
    },
    {
      category: '🛡️ Insurance & Liability',
      items: [
        'M&M standard policy: Driver liable for all damage (excess: £250-£1,000)',
        'Premium damage waiver: £20-£50 per rental (excess: £0-£100)',
        'Super damage waiver: £50-£80 per rental (full coverage)',
        'Public liability insurance: £5M minimum',
        'Uninsured losses recovery clause',
        'Damage excess payable immediately by driver',
      ],
    },
    {
      category: '📸 Photo Requirements',
      items: [
        'User ID photo (selfie with license)',
        'Driving license (front & back photo)',
        'Car pre-hire (6 angle inspection photos)',
        'Car post-hire (6 angle inspection photos)',
        'Damage photos (if applicable)',
        'All photos timestamped & geotagged',
      ],
    },
    {
      category: '⚖️ Data Protection (GDPR)',
      items: [
        'Data retention: License data deleted after 48 hours post-return',
        'Sensitive data encrypted at rest & in transit',
        'User consent for photo storage (14-day deletion)',
        'No third-party data sharing without explicit consent',
        'User right to access/delete their data',
        'Compliant with GDPR Article 32 (security measures)',
      ],
    },
  ];

  const verifiedCount = complianceSteps.filter((s) => s.verified).length;

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-4 border-b border-gray-500/20">
        <button
          onClick={() => setActiveTab('compliance')}
          className={`px-6 py-3 font-semibold transition ${
            activeTab === 'compliance'
              ? 'border-b-2 border-electric-turquoise text-electric-turquoise'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          ⚖️ Legal Compliance
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`px-6 py-3 font-semibold transition ${
            activeTab === 'documents'
              ? 'border-b-2 border-electric-turquoise text-electric-turquoise'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          📋 Documents & Checklists
        </button>
        <button
          onClick={() => setActiveTab('vehicle')}
          className={`px-6 py-3 font-semibold transition ${
            activeTab === 'vehicle'
              ? 'border-b-2 border-electric-turquoise text-electric-turquoise'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          🚗 Vehicle Inspections
        </button>
      </div>

      {/* Compliance Tab */}
      {activeTab === 'compliance' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Progress */}
          <div className="rounded-lg bg-electric-turquoise/10 border border-electric-turquoise/30 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-electric-turquoise">Compliance Progress</h3>
              <span className="text-2xl font-bold text-electric-turquoise">
                {verifiedCount}/{complianceSteps.length}
              </span>
            </div>
            <div className="w-full bg-dark-gunmetal/50 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-electric-turquoise to-baby-blue"
                animate={{ width: `${(verifiedCount / complianceSteps.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Compliance Steps */}
          <div className="grid md:grid-cols-2 gap-4">
            {complianceSteps.map((step) => (
              <motion.div
                key={step.id}
                onClick={() => {
                  setSelectedCompliance(step);
                  setEditMode(false);
                }}
                className={`cursor-pointer rounded-lg border p-4 transition ${
                  step.verified
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-gunmetal/50 border-gray-500/20 hover:border-gray-500/40'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-white">{step.title}</h4>
                  {step.verified && <span className="text-green-400">✓</span>}
                </div>
                <p className="text-sm text-gray-400 mb-3">{step.description}</p>
                <p className="text-xs text-gray-500">
                  <span className="font-semibold">Requirement:</span> {step.requirement}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Detail Panel */}
          {selectedCompliance && (
            <motion.div
              layoutId={selectedCompliance.id}
              className="rounded-xl bg-gradient-to-br from-gunmetal to-dark-gunmetal border border-electric-turquoise/30 p-6"
            >
              <h3 className="text-2xl font-bold text-white mb-4">{selectedCompliance.title}</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-electric-turquoise mb-2">Required Documents:</h4>
                  <ul className="space-y-2">
                    {selectedCompliance.documents.map((doc, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-400">
                        <span className="text-electric-turquoise mt-0.5">•</span>
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-dark-gunmetal/50 rounded-lg p-4 border border-gray-500/20">
                  <p className="text-sm text-gray-400 mb-4">{selectedCompliance.description}</p>
                  {!selectedCompliance.verified ? (
                    <button
                      onClick={() => {
                        verifyComplianceStep(selectedCompliance.id);
                        setSelectedCompliance({
                          ...selectedCompliance,
                          verified: true,
                        });
                      }}
                      className="w-full px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
                    >
                      ✓ Mark as Verified
                    </button>
                  ) : (
                    <div className="px-4 py-2 bg-green-500/20 text-green-400 font-semibold rounded-lg text-center">
                      ✓ Verified
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {ukLegalChecklist.map((section, idx) => (
            <div key={idx} className="rounded-lg bg-gunmetal/50 border border-gray-500/20 p-6">
              <h3 className="text-lg font-bold text-white mb-4">{section.category}</h3>
              <ul className="space-y-3">
                {section.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-3 text-gray-400">
                    <input
                      type="checkbox"
                      className="mt-1 cursor-pointer accent-electric-turquoise"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>
      )}

      {/* Vehicle Inspections Tab */}
      {activeTab === 'vehicle' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <h3 className="text-xl font-bold text-white">Vehicle Pre/Post-Hire Inspections</h3>

          {vehicleInspections.map((inspection) => (
            <div
              key={inspection.id}
              className="rounded-lg bg-gradient-to-br from-gunmetal to-dark-gunmetal border border-electric-turquoise/30 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-lg font-bold text-white">{inspection.carModel}</h4>
                  <p className="text-sm text-gray-400">ID: {inspection.carId}</p>
                </div>
                <span className="px-3 py-1 rounded-lg bg-electric-turquoise/20 text-electric-turquoise text-sm font-semibold">
                  Ready for Rental
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h5 className="font-semibold text-electric-turquoise mb-3">📸 Pre-Hire Photos</h5>
                  <div className="grid grid-cols-3 gap-2">
                    {['Windscreen', 'Left Side', 'Right Side', 'Rear', 'Interior 1', 'Interior 2'].map((angle) => (
                      <div key={angle} className="aspect-square bg-dark-gunmetal/50 rounded-lg border border-gray-500/20 flex items-center justify-center">
                        <span className="text-xs text-gray-500 text-center px-2">{angle}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">✓ All 6 angles captured</p>
                </div>

                <div>
                  <h5 className="font-semibold text-baby-blue mb-3">📸 Post-Hire Photos</h5>
                  <div className="grid grid-cols-3 gap-2 opacity-50">
                    {['Windscreen', 'Left Side', 'Right Side', 'Rear', 'Interior 1', 'Interior 2'].map((angle) => (
                      <div key={angle} className="aspect-square bg-dark-gunmetal/50 rounded-lg border border-gray-500/20 flex items-center justify-center">
                        <span className="text-xs text-gray-500 text-center px-2">{angle}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Captured on return</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-dark-gunmetal/50 rounded-lg p-3 border border-gray-500/20">
                  <p className="text-xs text-gray-400 mb-1">Mileage In</p>
                  <p className="text-lg font-bold text-white">{inspection.mileageIn} km</p>
                </div>
                <div className="bg-dark-gunmetal/50 rounded-lg p-3 border border-gray-500/20">
                  <p className="text-xs text-gray-400 mb-1">Mileage Out</p>
                  <p className="text-lg font-bold text-white">{inspection.mileageOut || 'TBD'}</p>
                </div>
                <div className={`rounded-lg p-3 border ${inspection.damageReported ? 'bg-red-500/10 border-red-500/30' : 'bg-green-500/10 border-green-500/30'}`}>
                  <p className="text-xs text-gray-400 mb-1">Damage Reported</p>
                  <p className={`text-lg font-bold ${inspection.damageReported ? 'text-red-400' : 'text-green-400'}`}>
                    {inspection.damageReported ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>

              <button className="w-full px-4 py-2 bg-electric-turquoise/20 border border-electric-turquoise/40 text-electric-turquoise font-semibold rounded-lg hover:bg-electric-turquoise/30 transition">
                📋 View Full Inspection Report
              </button>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default LegalComplianceSetup;
