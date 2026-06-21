import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { Car } from 'lucide-react';
import { exteriorsFor, interiorsFor, hashId, detectColor, type Photo } from '@/lib/vehicle-photos';

// Re-export so existing imports from this module keep working.
export { galleryFor, exteriorsFor, interiorsFor, hashId } from '@/lib/vehicle-photos';
export type { Photo, PhotoKind } from '@/lib/vehicle-photos';

const CATEGORY_GRADIENT: Record<string, string> = {
  luxury: 'from-blue-600/30 via-performance-grey to-performance-grey',
  sports: 'from-red-600/25 via-performance-grey to-performance-grey',
  supercar: 'from-purple-600/30 via-performance-grey to-performance-grey',
  exotic: 'from-performance-turquoise/30 via-performance-grey to-performance-grey',
  suv: 'from-emerald-700/25 via-performance-grey to-performance-grey',
  executive: 'from-slate-500/25 via-performance-grey to-performance-grey',
};

interface VehicleImageProps {
  vehicleId: string;
  model: string;
  category: 'luxury' | 'sports' | 'supercar' | 'exotic' | 'suv' | 'executive';
  colorHex?: string;
  /** The advertised colour label, used to keep fallbacks colour-consistent. */
  color?: string;
  /** Fleet-unique pinned hero photo; shown first so no two cards match. */
  heroPhoto?: string;
}

export const VehicleImage: React.FC<VehicleImageProps> = ({
  vehicleId,
  model,
  category,
  colorHex,
  color,
  heroPhoto,
}) => {
  const seed = useMemo(() => hashId(vehicleId), [vehicleId]);

  // Lead with the fleet-unique hero photo pinned at generation time, then keep
  // the rest of the model's pool as load-failure fallbacks. This guarantees the
  // grid never shows the same image twice and the colour label always matches.
  //
  // Colour safety: when the car advertises a specific colour, fallbacks are
  // restricted to photos of that SAME colour — so a failed image can never
  // reveal a different-coloured car (e.g. a "white" listing must never show the
  // orange photo). If nothing of that colour loads, we drop to the branded,
  // colour-tinted placeholder instead.
  const pool = useMemo<Photo[]>(() => {
    const photos = exteriorsFor(model);
    if (!photos.length) return [];

    let ordered: Photo[];
    if (heroPhoto && photos.some((p) => p.url === heroPhoto)) {
      const hero = photos.find((p) => p.url === heroPhoto)!;
      ordered = [hero, ...photos.filter((p) => p.url !== heroPhoto)];
    } else {
      const start = seed % photos.length;
      ordered = photos.map((_, i) => photos[(start + i) % photos.length]);
    }

    if (color && color !== 'As pictured') {
      const sameColour = ordered.filter((p) => detectColor(p.url)?.name === color);
      if (sameColour.length) return sameColour;
      // Hero defines the colour; keep just it even if its filename is colourless.
      return heroPhoto ? ordered.filter((p) => p.url === heroPhoto) : [];
    }
    return ordered;
  }, [model, seed, heroPhoto, color]);

  // Interior shot (if licensed photography exists) — revealed on card hover.
  const interior = useMemo<Photo | undefined>(() => interiorsFor(model)[0], [model]);

  const [attempt, setAttempt] = useState(0);
  const [interiorFailed, setInteriorFailed] = useState(false);
  const current = pool[attempt];

  if (current) {
    // Wide crop variation so cards never feel like the same framing.
    const objX = 30 + ((seed >> 3) % 41); // 30%..70%
    const objY = 35 + ((seed >> 8) % 31); // 35%..65%
    const showInterior = interior && !interiorFailed;
    return (
      <>
        <Image
          key={current.url}
          src={current.url}
          alt={model}
          fill
          onError={() => setAttempt((a) => a + 1)}
          className={`object-cover transition-all duration-500 ${
            showInterior ? 'group-hover:opacity-0' : 'group-hover:scale-110'
          }`}
          style={{ objectPosition: `${objX}% ${objY}%` }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        {showInterior && (
          <>
            {/* Interior crossfade layer */}
            <Image
              key={interior!.url}
              src={interior!.url}
              alt={`${model} interior`}
              fill
              onError={() => setInteriorFailed(true)}
              className="object-cover opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
            {/* "Interior" hint pill, appears on hover */}
            <span className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-2.5 py-0.5 rounded-full bg-performance-grey/85 backdrop-blur-sm border border-performance-turquoise/40 text-performance-turquoise text-[9px] font-bold tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              Interior
            </span>
          </>
        )}
      </>
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
