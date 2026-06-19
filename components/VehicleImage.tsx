import React, { useState } from 'react';
import Image from 'next/image';
import { Car } from 'lucide-react';

/**
 * Real fleet photos.
 *
 * To show a real photo of one of YOUR cars:
 *   1. Drop the image file in `public/fleet/` (e.g. public/fleet/lambo-huracan.jpg)
 *   2. Add a line below mapping the vehicleId to that path.
 *
 * Any vehicle not listed here renders the premium branded card below —
 * so we NEVER show a stock photo of the wrong car.
 */
const FLEET_PHOTOS: Record<string, string> = {
  // 'lambo-huracan': '/fleet/lambo-huracan.jpg',
};

const CATEGORY_GRADIENT: Record<string, string> = {
  luxury: 'from-blue-600/30 via-performance-grey to-performance-grey',
  sports: 'from-red-600/25 via-performance-grey to-performance-grey',
  supercar: 'from-purple-600/30 via-performance-grey to-performance-grey',
  exotic: 'from-performance-turquoise/30 via-performance-grey to-performance-grey',
};

interface VehicleImageProps {
  vehicleId: string;
  model: string;
  category: 'luxury' | 'sports' | 'supercar' | 'exotic';
}

export const VehicleImage: React.FC<VehicleImageProps> = ({ vehicleId, model, category }) => {
  const photo = FLEET_PHOTOS[vehicleId];
  const [failed, setFailed] = useState(false);

  if (photo && !failed) {
    return (
      <Image
        src={photo}
        alt={model}
        fill
        onError={() => setFailed(true)}
        className="object-cover group-hover:scale-110 transition-transform duration-500"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    );
  }

  // Premium branded fallback — intentional, on-brand, and never mismatched.
  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br ${
        CATEGORY_GRADIENT[category] ?? CATEGORY_GRADIENT.luxury
      }`}
    >
      <Car
        size={64}
        strokeWidth={1}
        className="text-performance-turquoise/70 mb-3 group-hover:scale-110 transition-transform duration-500"
      />
      <span className="text-white/90 font-bold text-lg tracking-wide text-center px-6">
        {model}
      </span>
      <span className="mt-2 text-[10px] uppercase tracking-[0.25em] text-performance-turquoise/70">
        M&amp;M Auto Performance
      </span>
    </div>
  );
};

export default VehicleImage;
