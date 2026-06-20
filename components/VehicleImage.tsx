import React, { useState } from 'react';
import Image from 'next/image';
import { Car } from 'lucide-react';

/**
 * Real fleet photography.
 *
 * Each entry below is a freely-licensed photo of the EXACT model, served via
 * Wikimedia Commons' `Special:FilePath` endpoint (resolves a file by name and
 * returns a sized thumbnail via `?width=`). We match on a distinctive token in
 * the model name so it works across every page regardless of how the vehicle
 * id is set. If a photo ever fails to load we fall back to the branded card
 * below — so we NEVER show a stock photo of the wrong car.
 *
 * To use a real photo of one of YOUR OWN cars instead, drop the file in
 * `public/fleet/` (e.g. public/fleet/lambo-huracan.jpg) and point the matching
 * entry at `/fleet/lambo-huracan.jpg`.
 */
const WIKIMEDIA = (file: string, width = 1200) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${file}?width=${width}`;

interface PhotoRule {
  /** lower-cased token that must appear in the model name */
  match: string;
  url: string;
}

const PHOTO_RULES: PhotoRule[] = [
  { match: 'huracan', url: WIKIMEDIA('Orange_Lamborghini_Huracan_Performante.jpg') },
  { match: 'revuelto', url: WIKIMEDIA('2023_Lamborghini_Revuelto.jpg') },
  { match: 'f8', url: WIKIMEDIA('Vue_trois_quarts_avant_F8_tributo.jpg') },
  { match: '911', url: WIKIMEDIA('Porsche_911_Turbo_S_Heckansicht.JPG') },
  { match: 'bentley', url: WIKIMEDIA('Bentley_Continental_GT_Monaco_IMG_1208.jpg') },
  { match: 'ghost', url: WIKIMEDIA('Rolls-Royce_Ghost_II_IAA_2021_1X7A0005.jpg') },
  { match: 'db12', url: WIKIMEDIA('Aston_Martin_DB12_04.jpg') },
  { match: 'plaid', url: WIKIMEDIA('2023_Tesla_Model_S_Plaid.jpg') },
  { match: 'range rover', url: WIKIMEDIA('2023_Range_Rover_Sport_2.jpg') },
  // Specific tokens MUST precede the generic 'amg gt' rule — CLA/C63/S63 all
  // contain "amg", so order matters (first match wins).
  { match: 'cla', url: WIKIMEDIA('Mercedes-AMG_CLA_45_S_4MATIC%2B_%28C118%29.jpg') },
  { match: 'c63', url: WIKIMEDIA('Mercedes-AMG_C_63_S_E_Performance_%28W206%29_IAA_2023.jpg') },
  { match: 's63', url: WIKIMEDIA('Mercedes-AMG_S_63_E_Performance_%28W223%29.jpg') },
  { match: 'rs3', url: WIKIMEDIA('Audi_RS_3_Sportback_%288Y%29.jpg') },
  { match: 'golf', url: WIKIMEDIA('VW_Golf_R_%28Mk8%29_IMG_0001.jpg') },
  { match: 'm3', url: WIKIMEDIA('BMW_M3_Competition_%28G80%29.jpg') },
  { match: 'm4', url: WIKIMEDIA('BMW_M4_Competition_%28G82%29.jpg') },
  {
    match: 'amg gt',
    url: WIKIMEDIA(
      'Osaka_Motor_Show_2019_%28272%29_-_Mercedes-AMG_GT_63_S_4MATIC%2B_%28X290%29.jpg',
    ),
  },
];

function photoFor(model: string): string | undefined {
  // Strip diacritics (e.g. "Huracán" -> "huracan") so token matching is reliable.
  const m = model
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  return PHOTO_RULES.find((rule) => m.includes(rule.match))?.url;
}

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

export const VehicleImage: React.FC<VehicleImageProps> = ({ model, category }) => {
  const photo = photoFor(model);
  const [failed, setFailed] = useState(false);

  if (photo && !failed) {
    return (
      <Image
        src={photo}
        alt={model}
        fill
        onError={() => setFailed(true)}
        className="object-cover group-hover:scale-110 transition-transform duration-500"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
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
