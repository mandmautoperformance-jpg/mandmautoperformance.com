import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, FileCheck } from 'lucide-react';

interface BookingWidgetProps {
  mode?: 'quick' | 'detailed';
  onBooking?: (bookingData: any) => void;
}

export const BookingWidget: React.FC<BookingWidgetProps> = ({
  mode = 'quick',
  onBooking,
}) => {
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [pickupTime, setPickupTime] = useState('10:00');
  const [vehicleType, setVehicleType] = useState('');
  const [passengers, setPassengers] = useState('1');
  const [documentsVerified, setDocumentsVerified] = useState(false);
  const [step, setStep] = useState(1);

  const vehicleTypes = [
    { id: 'luxury', label: 'Luxury Sedan', price: 150 },
    { id: 'sports', label: 'Sports Car', price: 250 },
    { id: 'supercar', label: 'Supercar', price: 500 },
    { id: 'exotic', label: 'Exotic', price: 750 },
  ];

  const handleBooking = () => {
    if (pickupDate && returnDate && vehicleType) {
      onBooking?.({
        pickupDate,
        returnDate,
        pickupTime,
        vehicleType,
        passengers,
        documentsVerified,
      });
      setStep(3); // Success state
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-performance-grey border border-performance-turquoise/30 rounded-2xl overflow-hidden shadow-2xl shadow-performance-turquoise/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-performance-turquoise/20 to-performance-babyblue/20 border-b border-performance-turquoise/30 px-6 py-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          AI Sky Concierge Booking
        </h2>
        <p className="text-gray-300 text-sm">
          Seamless 24/7 booking with real-time document verification
        </p>
      </div>

      {/* Steps Indicator */}
      <div className="px-6 pt-6">
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 text-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 transition-all ${
                  s <= step
                    ? 'bg-performance-turquoise text-performance-grey'
                    : 'bg-performance-turquoise/20 text-gray-400'
                }`}
              >
                {s === 1 ? '📅' : s === 2 ? '✓' : '🎉'}
              </div>
              <p
                className={`text-xs font-medium ${
                  s <= step ? 'text-performance-turquoise' : 'text-gray-500'
                }`}
              >
                {s === 1 ? 'Details' : s === 2 ? 'Documents' : 'Confirm'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-6">
        {step === 1 && (
          <div className="space-y-6">
            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <Calendar className="inline mr-2" size={16} />
                  Pickup Date
                </label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full px-4 py-3 bg-performance-turquoise/10 border border-performance-turquoise/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-performance-turquoise focus:ring-2 focus:ring-performance-turquoise/20"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <Calendar className="inline mr-2" size={16} />
                  Return Date
                </label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full px-4 py-3 bg-performance-turquoise/10 border border-performance-turquoise/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-performance-turquoise focus:ring-2 focus:ring-performance-turquoise/20"
                />
              </div>
            </div>

            {/* Time & Passengers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <Clock className="inline mr-2" size={16} />
                  Pickup Time
                </label>
                <input
                  type="time"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full px-4 py-3 bg-performance-turquoise/10 border border-performance-turquoise/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-performance-turquoise focus:ring-2 focus:ring-performance-turquoise/20"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <Users className="inline mr-2" size={16} />
                  Passengers
                </label>
                <select
                  value={passengers}
                  onChange={(e) => setPassengers(e.target.value)}
                  className="w-full px-4 py-3 bg-performance-turquoise/10 border border-performance-turquoise/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-performance-turquoise focus:ring-2 focus:ring-performance-turquoise/20"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n} className="bg-performance-grey">
                      {n} {n === 1 ? 'Passenger' : 'Passengers'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Vehicle Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Vehicle Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {vehicleTypes.map((vtype) => (
                  <button
                    key={vtype.id}
                    onClick={() => setVehicleType(vtype.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      vehicleType === vtype.id
                        ? 'border-performance-turquoise bg-performance-turquoise/10'
                        : 'border-performance-turquoise/20 hover:border-performance-turquoise/50'
                    }`}
                  >
                    <p className="font-semibold text-white text-sm">
                      {vtype.label}
                    </p>
                    <p className="text-performance-turquoise text-xs mt-1">
                      from £{vtype.price}/day
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={() => setStep(2)}
              disabled={!pickupDate || !returnDate || !vehicleType}
              className="w-full py-3 bg-gradient-to-r from-performance-turquoise to-performance-babyblue text-performance-grey font-bold rounded-lg hover:shadow-lg hover:shadow-performance-turquoise/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Verification
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white">
              Document Verification
            </h3>
            <p className="text-gray-300 text-sm">
              Upload your documents for AI-powered verification. Processing is instant.
            </p>

            {/* Document Upload Areas */}
            <div className="space-y-4">
              {['License', 'Insurance', 'ID Verification'].map((doc, idx) => (
                <div key={idx}>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    <FileCheck className="inline mr-2" size={16} />
                    {doc}
                  </label>
                  <div className="border-2 border-dashed border-performance-turquoise/30 hover:border-performance-turquoise/50 rounded-lg p-6 text-center cursor-pointer transition-all">
                    <p className="text-gray-400 text-sm">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PDF, PNG, JPG (max 10MB)
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Verification Status */}
            <div className="bg-performance-babyblue/10 border border-performance-babyblue/30 rounded-lg p-4">
              <p className="text-sm text-performance-babyblue font-semibold mb-2">
                ✓ AI Verification Status
              </p>
              <p className="text-xs text-gray-300">
                Your documents will be automatically verified by our AI system.
                Typical processing time: &lt; 2 minutes.
              </p>
            </div>

            {/* Confirmation Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={documentsVerified}
                onChange={(e) => setDocumentsVerified(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-performance-turquoise/30 text-performance-turquoise focus:ring-performance-turquoise"
              />
              <span className="text-sm text-gray-300">
                I certify that all documents are accurate and valid
              </span>
            </label>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 border-2 border-performance-turquoise text-performance-turquoise rounded-lg font-bold hover:bg-performance-turquoise/10 transition-all"
              >
                Back
              </button>
              <button
                onClick={() => handleBooking()}
                disabled={!documentsVerified}
                className="flex-1 py-3 bg-gradient-to-r from-performance-turquoise to-performance-babyblue text-performance-grey font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Booking Confirmed!
            </h3>
            <p className="text-gray-300 mb-6">
              Your vehicle is reserved. Check your email for booking details.
            </p>
            <button className="px-8 py-3 bg-performance-turquoise text-performance-grey font-bold rounded-lg hover:bg-performance-turquoise/90 transition-all">
              View Booking Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingWidget;
