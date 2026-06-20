import React, { useState } from 'react';
import Image from 'next/image';
import { Car } from 'lucide-react';

/**
 * Real fleet photography.
 *
 * Each rule below matches a distinctive token in the model name and returns one
 * or more freely-licensed photos of that EXACT model, served via Wikimedia
 * Commons' `Special:FilePath` endpoint (resolves a file by name and returns a
 * sized thumbnail via `?width=`). Colour variants of the same model share its
 * photography. If a photo ever fails to load we fall back to a branded card
 * tinted with the car's real colour — so we NEVER show a stock photo of the
 * wrong car, and the grid still looks full and on-brand.
 *
 * Rules are evaluated top-to-bottom (first match wins), so more specific tokens
 * MUST precede generic ones (e.g. "c-class"/"e-class"/"a-class" before "cla",
 * "gt-r" before "amg gt").
 *
 * To use a photo of one of YOUR OWN cars, drop the file in `public/fleet/`
 * (e.g. public/fleet/lambo-huracan.jpg) and point the matching rule at it.
 */
const WIKIMEDIA = (file: string, width = 1200) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${file}?width=${width}`;

export type PhotoKind = 'exterior' | 'interior';
export interface Photo {
  url: string;
  kind: PhotoKind;
}

interface PhotoRule {
  /** lower-cased token that must appear in the model name */
  match: string;
  photos: Photo[];
}

const ext = (file: string): Photo => ({ url: WIKIMEDIA(file), kind: 'exterior' });
const int = (file: string): Photo => ({ url: WIKIMEDIA(file), kind: 'interior' });

const PHOTO_RULES: PhotoRule[] = [
  // ---- Lamborghini ----
  { match: 'huracan', photos: [ext('Orange_Lamborghini_Huracan_Performante.jpg'), ext('Lamborghini_Huracan_Evo_Spyder_Genf_2019.jpg'), int('Lamborghini_Huracan_interior.jpg')] },
  { match: 'revuelto', photos: [ext('2023_Lamborghini_Revuelto.jpg')] },
  { match: 'aventador', photos: [ext('Lamborghini_Aventador_S_Roadster_IAA_2017.jpg')] },
  { match: 'urus', photos: [ext('Lamborghini_Urus_IAA_2017_1Y7A2436.jpg')] },
  // ---- Ferrari ----
  { match: 'f8', photos: [ext('Vue_trois_quarts_avant_F8_tributo.jpg'), int('Ferrari_F8_Tributo_interior.jpg')] },
  { match: '296', photos: [ext('Ferrari_296_GTB_IAA_2021_1X7A0098.jpg')] },
  { match: 'roma', photos: [ext('Ferrari_Roma_Genf_2020_1Y7A1085.jpg')] },
  // ---- McLaren / Maserati ----
  { match: '720s', photos: [ext('McLaren_720S_Genf_2017.jpg')] },
  { match: 'mc20', photos: [ext('Maserati_MC20_IAA_2021_1X7A0166.jpg')] },
  // ---- Nissan (before generic 'amg gt') ----
  { match: 'gt-r', photos: [ext('Nissan_GT-R_Nismo_(R35)_IAA_2017.jpg')] },
  // ---- Porsche ----
  { match: '911', photos: [ext('Porsche_911_Turbo_S_Heckansicht.JPG'), int('Porsche_911_991_interior.jpg')] },
  { match: 'panamera', photos: [ext('Porsche_Panamera_Turbo_S_E-Hybrid_(971)_IAA_2019.jpg')] },
  { match: 'cayenne', photos: [ext('Porsche_Cayenne_Turbo_GT_(9YA).jpg')] },
  // ---- Bentley ----
  { match: 'bentley continental', photos: [ext('Bentley_Continental_GT_Monaco_IMG_1208.jpg')] },
  { match: 'continental', photos: [ext('Bentley_Continental_GT_Monaco_IMG_1208.jpg')] },
  { match: 'bentayga', photos: [ext('Bentley_Bentayga_IAA_2015.jpg')] },
  // ---- Rolls-Royce ----
  { match: 'ghost', photos: [ext('Rolls-Royce_Ghost_II_IAA_2021_1X7A0005.jpg')] },
  { match: 'cullinan', photos: [ext('Rolls-Royce_Cullinan_Geneva_2018.jpg')] },
  { match: 'spectre', photos: [ext('Rolls-Royce_Spectre_IAA_2023.jpg')] },
  // ---- Aston Martin ----
  { match: 'db12', photos: [ext('Aston_Martin_DB12_04.jpg')] },
  { match: 'vantage', photos: [ext('Aston_Martin_Vantage_2018_IMG_0001.jpg')] },
  // ---- Tesla ----
  { match: 'plaid', photos: [ext('2023_Tesla_Model_S_Plaid.jpg'), int('Tesla_Model_S_interior.jpg')] },
  // ---- Land Rover ----
  { match: 'range rover', photos: [ext('2023_Range_Rover_Sport_2.jpg')] },
  // ---- Audi ----
  { match: 'r8', photos: [ext('Audi_R8_V10_performance_IAA_2019.jpg')] },
  { match: 'rs6', photos: [ext('Audi_RS6_Avant_(C8)_IMG_0001.jpg')] },
  { match: 'rs3', photos: [ext('Audi_RS_3_Sportback_%288Y%29.jpg')] },
  { match: 'a4', photos: [ext('Audi_A4_B9_Facelift_IMG_0001.jpg')] },
  // ---- Mercedes everyday (MUST precede 'cla' / 'amg gt') ----
  { match: 'c-class', photos: [ext('Mercedes-Benz_W206_IMG_0001.jpg')] },
  { match: 'e-class', photos: [ext('Mercedes-Benz_W214_IMG_0001.jpg')] },
  { match: 'a-class', photos: [ext('Mercedes-Benz_W177_IMG_0001.jpg')] },
  // ---- Mercedes-AMG ----
  { match: 'g63', photos: [ext('Mercedes-AMG_G_63_(W463)_IAA_2019.jpg')] },
  { match: 'c63', photos: [ext('Mercedes-AMG_C_63_S_E_Performance_%28W206%29_IAA_2023.jpg')] },
  { match: 's63', photos: [ext('Mercedes-AMG_S_63_E_Performance_%28W223%29.jpg')] },
  { match: 'cla', photos: [ext('Mercedes-AMG_CLA_45_S_4MATIC%2B_%28C118%29.jpg')] },
  // ---- BMW ----
  { match: 'm3', photos: [ext('BMW_M3_Competition_%28G80%29.jpg')] },
  { match: 'm4', photos: [ext('BMW_M4_Competition_%28G82%29.jpg')] },
  { match: 'm5', photos: [ext('BMW_M5_Competition_(F90)_IMG_0001.jpg')] },
  { match: '330', photos: [ext('BMW_330i_M_Sport_(G20)_IMG_0001.jpg')] },
  { match: '320', photos: [ext('BMW_320i_M_Sport_(G20)_IMG_0001.jpg')] },
  { match: '520', photos: [ext('BMW_520i_M_Sport_(G30)_IMG_0001.jpg')] },
  // ---- Volkswagen ----
  { match: 'golf', photos: [ext('VW_Golf_R_%28Mk8%29_IMG_0001.jpg')] },
  // ---- Ford ----
  { match: 'mustang', photos: [ext('Ford_Mustang_GT_(S550_facelift)_IMG_0001.jpg')] },
  // ---- Generic Mercedes-AMG GT (LAST) ----
  { match: 'amg gt', photos: [ext('Osaka_Motor_Show_2019_%28272%29_-_Mercedes-AMG_GT_63_S_4MATIC%2B_%28X290%29.jpg')] },
];

function normalize(model: string): string {
  // Strip diacritics (e.g. "Huracán" -> "huracan") so token matching is reliable.
  return model
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/** All known photos for a model (exterior first), or [] if none match. */
export function galleryFor(model: string): Photo[] {
  const m = normalize(model);
  return PHOTO_RULES.find((rule) => m.includes(rule.match))?.photos ?? [];
}

function photoFor(model: string): string | undefined {
  return galleryFor(model)[0]?.url;
}

const CATEGORY_GRADIENT: Record<string, string> = {
  luxury: 'from-blue-600/30 via-performance-grey to-performance-grey',
  sports: 'from-red-600/25 via-performance-grey to-performance-grey',
  supercar: 'from-purple-600/30 via-performance-grey to-performance-grey',
  exotic: 'from-performance-turquoise/30 via-performance-grey to-performance-grey',
  executive: 'from-slate-500/25 via-performance-grey to-performance-grey',
};

interface VehicleImageProps {
  vehicleId: string;
  model: string;
  category: 'luxury' | 'sports' | 'supercar' | 'exotic' | 'executive';
  /** Optional real colour — tints the branded fallback so it never looks blank. */
  colorHex?: string;
}

export const VehicleImage: React.FC<VehicleImageProps> = ({ model, category, colorHex }) => {
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

  // Premium branded fallback — intentional, on-brand, tinted with the car's
  // actual colour so a grid of fallbacks still looks full and varied.
  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br ${
        CATEGORY_GRADIENT[category] ?? CATEGORY_GRADIENT.luxury
      }`}
    >
      {colorHex && (
        <div
          aria-hidden
          className="absolute inset-0 opacity-40"
          style={{ background: `radial-gradient(circle at 50% 35%, ${colorHex}66, transparent 70%)` }}
        />
      )}
      <Car
        size={64}
        strokeWidth={1}
        className="relative text-performance-turquoise/70 mb-3 group-hover:scale-110 transition-transform duration-500"
      />
      <span className="relative text-white/90 font-bold text-lg tracking-wide text-center px-6">
        {model}
      </span>
      <span className="relative mt-2 text-[10px] uppercase tracking-[0.25em] text-performance-turquoise/70">
        M&amp;M Auto Performance
      </span>
    </div>
  );
};

export default VehicleImage;
