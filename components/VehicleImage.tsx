import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { Car } from 'lucide-react';
import { exteriorsFor, hashId, type Photo } from '@/lib/vehicle-photos';

// Re-export so existing imports from this module keep working.
export { galleryFor, exteriorsFor, hashId } from '@/lib/vehicle-photos';
export type { Photo, PhotoKind } from '@/lib/vehicle-photos';

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
  /** The car's real colour — tints the branded fallback. */
  colorHex?: string;
  /**
   * The exact photo pinned to this vehicle. When supplied, this is the ONLY
   * photo shown (so no two cars ever share an image); if it fails to load we
   * fall straight to the branded card rather than borrowing another car's shot.
   */
  photoUrl?: string;
}

export const VehicleImage: React.FC<VehicleImageProps> = ({
  vehicleId,
  model,
  category,
  colorHex,
  photoUrl,
}) => {
  const seed = useMemo(() => hashId(vehicleId), [vehicleId]);

  // When a photo is pinned, use only that one. Otherwise rotate the model's
  // pool (seeded by id) and advance through it as candidates fail to load.
  const pool = useMemo<Photo[]>(() => {
    if (photoUrl) return [{ url: photoUrl, kind: 'exterior' }];
    const photos = exteriorsFor(model);
    if (!photos.length) return [];
    const start = seed % photos.length;
    return photos.map((_, i) => photos[(start + i) % photos.length]);
  }, [photoUrl, model, seed]);

  const [attempt, setAttempt] = useState(0);
  const current = pool[attempt];

  if (current) {
    // Wide crop variation so cards never feel like the same framing.
    const objX = 30 + ((seed >> 3) % 41); // 30%..70%
    const objY = 35 + ((seed >> 8) % 31); // 35%..65%
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
