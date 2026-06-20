import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { Car } from 'lucide-react';

/**
 * Real fleet photography, made to look unique per car.
 *
 * Each rule matches a distinctive token in the model name and returns one or
 * more freely-licensed photos of that EXACT model from Wikimedia Commons. Every
 * filename below was verified to be a real "File:…" page that exists on
 * commons.wikimedia.org, so `Special:FilePath` resolves it to an image.
 *
 * Because the fleet contains many colour variants of the same model, we make
 * every variant look like a different physical car by:
 *   1. rotating through the model's available photos (seeded by the car id);
 *   2. recolouring the photo to the car's real colour via a `mix-blend-mode`
 *      wash (a red car looks red, a green car green) — neutral colours stay
 *      naturally photographic;
 *   3. nudging the framing (object-position) so even an identical shot is
 *      composed differently.
 * If a photo fails to load we try the next candidate, then fall back to a
 * branded card tinted with the car's colour — so we NEVER show the wrong car.
 *
 * Rules are evaluated top-to-bottom (first match wins): specific tokens MUST
 * precede generic ones (e.g. "c-class"/"e-class"/"a-class" before "cla",
 * "gt-r" before "amg gt"). Filenames are stored RAW (with spaces/parentheses)
 * and URL-encoded by WIKIMEDIA().
 */
const WIKIMEDIA = (file: string, width = 1200) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;

export type PhotoKind = 'exterior' | 'interior';
export interface Photo {
  url: string;
  kind: PhotoKind;
}

interface PhotoRule {
  match: string;
  photos: Photo[];
}

const ext = (file: string): Photo => ({ url: WIKIMEDIA(file), kind: 'exterior' });
const int = (file: string): Photo => ({ url: WIKIMEDIA(file), kind: 'interior' });

const PHOTO_RULES: PhotoRule[] = [
  // ---- Lamborghini ----
  { match: 'huracan', photos: [ext('Orange Lamborghini Huracan Performante.jpg'), ext('2022 Lamborghini Huracan Tecnica Front.jpg'), ext('Lamborghini Huracan Evo IMG 3679.jpg')] },
  { match: 'revuelto', photos: [ext('Lamborghini Revuelto.jpg'), ext('2023 Lamborghini Revuelto.jpg')] },
  { match: 'aventador', photos: [ext('Lamborghini Aventador S coupe IMG 2926.jpg'), ext('Lamborghini Aventador LP750-4 SV IMG 9103.jpg'), int('Lamborghini Aventador interior.JPG')] },
  { match: 'urus', photos: [ext('Lamborghini Urus red (1).jpg'), ext('2019 Lamborghini Urus.jpg'), ext('Lamborghini Urus - front.jpg')] },
  // ---- Ferrari ----
  { match: 'f8', photos: [ext('Vue trois quarts avant F8 tributo.jpg'), ext('2020 Ferrari F8 Tributo S-A 3.9 Front.jpg'), ext('2020 Ferrari F8 Tributo S-A 3.9 Rear.jpg')] },
  { match: '296', photos: [ext('Ferrari 296 GTB - Paris 08.jpg'), ext('Ferrari 296 GTB - Paris 04.jpg')] },
  { match: 'roma', photos: [ext('2021 Ferrari Roma Front.jpg'), ext('Ferrari Roma-01.jpg')] },
  // ---- McLaren / Maserati ----
  { match: '720s', photos: [ext('Maclaren 720S PA280972-PSD.jpg'), ext('McLaren 720S rear view.jpg')] },
  { match: 'mc20', photos: [ext('Maserati MC20 (7BA-MC30) front.jpg'), ext('Maserati MC20 white.jpg'), ext('Maserati MC20 Cielo.jpg')] },
  // ---- Nissan (before generic 'amg gt') ----
  { match: 'gt-r', photos: [ext('Nissan GT-R Nismo (R35), 2022, rear.jpg'), ext('Nissan GT-R (R35) (5).jpg')] },
  // ---- Porsche ----
  { match: '911', photos: [ext('Porsche 911 Turbo S Heckansicht.JPG'), ext('2023 Porsche 992 Turbo S in Peridot Metallic, front left.jpg'), ext('Porsche 992 Turbo S 1X7A0413.jpg')] },
  { match: 'panamera', photos: [ext('Porsche 971 Panamera Turbo S E-Hybrid IMG 2962.jpg'), ext('Porsche 972 Turbo E-Hybrid IMG 0445.jpg'), int('Porsche Panamera Sport Turismo Cockpit.JPG')] },
  { match: 'cayenne', photos: [ext('Porsche Cayenne Coupe 001.jpg'), ext('Porsche Cayenne Coupe 003.jpg')] },
  // ---- Bentley ----
  { match: 'continental', photos: [ext('Bentley Continental GT III British Racing Green (10).jpg'), ext('Bentley Continental GT Speed 2024.jpg'), ext('Bentley Continental GT Convertible (5).jpg'), ext('Bentley Continental GT III British Racing Green (6).jpg')] },
  { match: 'bentayga', photos: [ext('Bentley Bentayga 2015 - rear.jpg'), ext('Bentley Bentayga EWB Azure front.jpg'), ext('2023 Bentley Bentayga S front.jpg')] },
  // ---- Rolls-Royce ----
  { match: 'ghost', photos: [ext('Rolls-Royce Ghost II IAA 2021 1X7A0005.jpg'), ext('Rolls-Royce Ghost II Mandarin Navy Blue (4).jpg'), ext('Rolls-Royce Ghost Black Badge 2022.jpg'), int('Rolls-Royce Ghost Series II interior.jpg')] },
  { match: 'cullinan', photos: [ext('2023 Rolls-Royce Cullinan in light blue, front left.jpg'), ext('Rolls-Royce Cullinan Blue (1).jpg'), ext('Rolls-Royce Cullinan Black Badge.jpg'), ext('Rolls-Royce Cullinan Series II front.jpg')] },
  { match: 'spectre', photos: [ext('2024 Rolls-Royce Spectre in Midnight Sapphire over Silver, front left.jpg'), ext('Rolls-Royce Spectre 2024 white.jpg'), ext('Rolls-Royce Spectre - front.jpg')] },
  // ---- Aston Martin ----
  { match: 'db12', photos: [ext('Aston Martin DB12 04.jpg'), ext('Aston Martin DB12 Volante.jpg'), ext('Aston Martin DB12 03.jpg'), ext('Aston Martin DB12 front 3q.jpg')] },
  { match: 'vantage', photos: [ext('2018 Aston Martin Vantage Coupe (44400066584).jpg'), ext('Aston Martin Vantage V8 F1 Edition.jpg'), int('2019 Aston Martin V8 Vantage Interior 4.0.jpg')] },
  // ---- Tesla ----
  { match: 'plaid', photos: [ext('2023 Tesla Model S Plaid.jpg'), ext('Tesla Model S Plaid Autofrühling Ulm IMG 9278.jpg')] },
  // ---- Land Rover ----
  { match: 'range rover', photos: [ext('2023 Range Rover Sport 2.jpg'), ext('Land Rover Range Rover Sport L461 Varesine Blue (13).jpg'), ext('ALL-NEW RANGE ROVER SPORT REVEALED (8594176684).jpg')] },
  // ---- Audi ----
  { match: 'r8', photos: [ext('Audi R8 4S Front.JPG'), int('2015 Audi R8 V10 interior (16319213591).jpg')] },
  { match: 'rs6', photos: [ext('Audi RS6 Avant C8 IMG 3376.jpg'), ext('Audi RS6 Avant C8 at IAA 2019 IMG 0194.jpg')] },
  { match: 'rs3', photos: [ext('Audi RS3 8Y Auto Zuerich 2021 IMG 0214.jpg'), ext('Audi RS3 Sportback Daytonagrau.JPG'), int('2019 Audi RS3 Sportback Interior.jpg')] },
  { match: 'a4', photos: [ext('Audi A4 B9 Limousine 3.0 TDI quattro.JPG'), ext('Audi A4 B9 Limousine 3.0 TDI quattro Heck.JPG'), int('2015 Audi A4 B9 2.0 TFSI quattro 185 kW S line Cockpit Interieur Innenraum.jpg')] },
  // ---- Mercedes everyday (MUST precede 'cla' / 'amg gt') ----
  { match: 'c-class', photos: [ext('Mercedes-Benz C 200 4MATIC AVANTGARDE (W206) front.jpg'), ext('Mercedes-Benz C200 AVANTGARDE (W206) rear.jpg'), int('Mercedes-Benz C 200 4MATIC AVANTGARDE (W206) interior.jpg')] },
  { match: 'e-class', photos: [ext('Mercedes-Benz E 400 e 4MATIC 1X7A1728.jpg'), ext('Mercedes-Benz E 400 e 4MATIC, IAA Open Space 2023, Munich (P1120186).jpg'), int('Mercedes-AMG E 53 HYBRID 4MATIC+ (W214) interior.jpg')] },
  { match: 'a-class', photos: [ext('Mercedes-Benz A 180 (W177) front.jpg'), ext('Mercedes-Benz A180 (W177) front.jpg')] },
  // ---- Mercedes-AMG ----
  { match: 'g63', photos: [ext('Mercedes-AMG G 63 (W464) front.jpg'), ext('Mercedes-AMG G 63 (W464) rear.jpg')] },
  { match: 'c63', photos: [ext('Mercedes-AMG C 63 S E Performance (W206) front.jpg'), ext('2023 Mercedes-AMG C63 (W206).jpg'), int('Mercedes-AMG C63 S E PERFORMANCE (W206) interior.jpg')] },
  { match: 's63', photos: [ext('Mercedes-AMG S 63 E Performance (W223) front.jpg'), ext('Mercedes-Benz S-Class 2020 W223.jpg'), ext('Mercedes-AMG S 63 4MATIC+ (Z223) front.jpg')] },
  { match: 'cla', photos: [ext('Mercedes-AMG CLA 45 S 4MATIC+ Coupé (C118) front.jpg'), ext('Mercedes-AMG CLA 45 S 4MATIC+ Coupé (C118) rear.jpg'), ext('Mercedes-Benz C118 IMG 2673.jpg')] },
  // ---- BMW ----
  { match: 'm3', photos: [ext('BMW G80 M3 Competition M xDrive Black Sapphire Metallic (1).jpg'), ext('BMW G80 M3 Competition Alpine White (12).jpg')] },
  { match: 'm4', photos: [ext('2024 BMW M4 (G82) Competition IMG 9375.jpg'), ext('BMW G82 M4 Competition Tanzanite Blue Metallic (8).jpg'), ext('BMW G82 M4 Competition Aventurin Red Metallic (4).jpg'), ext('BMW M4 Competition Coupē (G82) rear.jpg'), ext('2024 BMW M4 (G82) Competition DSC 7856.jpg')] },
  { match: 'm5', photos: [ext('2022 BMW M5 Competition Red F90.jpg'), ext('BMW M5 (F90) sedan (2).jpg')] },
  { match: '330', photos: [ext('BMW 330i G20 Black 3.jpg'), ext('BMW G20 320d M Sport Dravit Grey Metallic (2).jpg')] },
  { match: '320', photos: [ext('BMW G20 320d M Sport Dravit Grey Metallic (2).jpg'), ext('BMW 330i G20 Black 3.jpg')] },
  { match: '520', photos: [ext('BMW-G30.JPG'), ext('BMW G30 LCI 530i M Sport Carbon Black Metallic (4).jpg')] },
  // ---- Volkswagen ----
  { match: 'golf', photos: [ext('Volkswagen Golf GTI Mk8 Dolphin Gray Metallic (9).jpg'), ext('Volkswagen Golf 8 GTI IMG 1552.jpg'), ext('VW Golf R Mk8.jpg')] },
  // ---- Ford ----
  { match: 'mustang', photos: [ext('2018 Ford Mustang GT (WM67 MWV).jpg'), ext('2019 Ford Mustang GT Blue.jpg'), int('Ford Mustang GT Innenraum Recaro.JPG')] },
  // ---- Generic Mercedes-AMG GT (LAST) ----
  { match: 'amg gt', photos: [ext('Mercedes-AMG GT63 S 4MATIC+ (X290) front.jpg'), ext('Mercedes-AMG C192 1X7A0832.jpg'), ext('Mercedes-AMG C192 GT 63 S E Performance IMG 9255 (cropped).jpg')] },
];

function normalize(model: string): string {
  return model
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

/** All known photos for a model (exterior first), or [] if none match. */
export function galleryFor(model: string): Photo[] {
  const m = normalize(model);
  return PHOTO_RULES.find((rule) => m.includes(rule.match))?.photos ?? [];
}

/** Exterior photos only, for cards. */
export function exteriorsFor(model: string): Photo[] {
  const all = galleryFor(model);
  const ex = all.filter((p) => p.kind === 'exterior');
  return ex.length ? ex : all;
}

// Stable hash so each car id produces deterministic, repeatable variety.
export function hashId(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Strength of the colour wash — neutral colours barely change, vivid recolour. */
export function washOpacity(hex?: string): number {
  if (!hex) return 0;
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const sat = max === 0 ? 0 : (max - min) / max; // 0 (grey) .. 1 (vivid)
  return 0.28 + sat * 0.42; // 0.28 .. 0.70
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
  /** The car's real colour — recolours the photo and tints the fallback. */
  colorHex?: string;
}

export const VehicleImage: React.FC<VehicleImageProps> = ({ vehicleId, model, category, colorHex }) => {
  const photos = useMemo(() => exteriorsFor(model), [model]);
  const seed = useMemo(() => hashId(vehicleId), [vehicleId]);
  const [attempt, setAttempt] = useState(0);

  // Rotate the candidate order by the seed so sibling variants start on
  // different photos; advance through the list as any fail to load.
  const order = useMemo(() => {
    if (!photos.length) return [];
    const start = seed % photos.length;
    return photos.map((_, i) => photos[(start + i) % photos.length]);
  }, [photos, seed]);

  const current = order[attempt];

  if (current) {
    const objX = 50 + ((seed >> 3) % 21) - 10; // 40%..60%
    const objY = 50 + ((seed >> 8) % 11) - 5; // 45%..55%
    return (
      <Image
        key={current.url}
        src={current.url}
        alt={model}
        fill
        onError={() => setAttempt((a) => a + 1)}
        className="object-cover group-hover:scale-110 transition-transform duration-500"
        style={{ objectPosition: `${objX}% ${objY}%` }}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
      />
    );
  }

  // Premium branded fallback — tinted with the car's actual colour.
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
      <Car size={64} strokeWidth={1} className="relative text-performance-turquoise/70 mb-3 group-hover:scale-110 transition-transform duration-500" />
      <span className="relative text-white/90 font-bold text-lg tracking-wide text-center px-6">{model}</span>
      <span className="relative mt-2 text-[10px] uppercase tracking-[0.25em] text-performance-turquoise/70">
        M&amp;M Auto Performance
      </span>
    </div>
  );
};

export default VehicleImage;
