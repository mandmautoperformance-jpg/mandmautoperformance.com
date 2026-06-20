import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { Car } from 'lucide-react';
import { galleryFor, type Photo } from '@/lib/vehicle-photos';

interface VehicleGalleryProps {
  model: string;
  category: 'luxury' | 'sports' | 'supercar' | 'exotic' | 'executive';
  color?: string;
  colorHex?: string;
  /** The exact photo pinned to this vehicle — shown first in the gallery. */
  primaryPhoto?: string;
}

const CATEGORY_GRADIENT: Record<string, string> = {
  luxury: 'from-blue-600/30 via-performance-grey to-performance-grey',
  sports: 'from-red-600/25 via-performance-grey to-performance-grey',
  supercar: 'from-purple-600/30 via-performance-grey to-performance-grey',
  exotic: 'from-performance-turquoise/30 via-performance-grey to-performance-grey',
  executive: 'from-slate-500/25 via-performance-grey to-performance-grey',
};

/**
 * Detail-page gallery: a large hero photo plus thumbnails for any extra
 * exterior/interior shots. Photos that fail to load are removed automatically,
 * so a broken thumbnail never appears. If no photo loads at all we show the
 * branded, colour-tinted fallback.
 */
export const VehicleGallery: React.FC<VehicleGalleryProps> = ({ model, category, color, colorHex, primaryPhoto }) => {
  const photos = useMemo<Photo[]>(() => {
    const all = galleryFor(model);
    if (!primaryPhoto) return all;
    // Put this car's pinned photo first, without duplicating it.
    const rest = all.filter((p) => p.url !== primaryPhoto);
    return [{ url: primaryPhoto, kind: 'exterior' as const }, ...rest];
  }, [model, primaryPhoto]);
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState<Record<number, boolean>>({});

  const livePhotos = photos.filter((_, i) => !failed[i]);
  const activePhoto = !failed[active] ? photos[active] : livePhotos[0];

  const fallback = (
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
      <Car size={72} strokeWidth={1} className="relative text-performance-turquoise/70 mb-3" />
      <span className="relative text-white/90 font-bold text-xl tracking-wide text-center px-6">{model}</span>
      {color && (
        <span className="relative mt-2 text-sm text-gray-300">{color}</span>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Hero */}
      <div className="group relative rounded-xl overflow-hidden h-96 bg-gradient-to-br from-performance-grey to-performance-turquoise/10">
        {activePhoto ? (
          <Image
            key={activePhoto.url}
            src={activePhoto.url}
            alt={`${model}${color ? ` — ${color}` : ''}`}
            fill
            onError={() => setFailed((f) => ({ ...f, [photos.indexOf(activePhoto)]: true }))}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 66vw"
            priority
          />
        ) : (
          fallback
        )}
        {activePhoto && (
          <span className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-performance-grey/80 backdrop-blur-sm text-xs font-semibold text-performance-babyblue capitalize">
            {activePhoto.kind}
          </span>
        )}
      </div>

      {/* Thumbnails (only when more than one photo survives) */}
      {livePhotos.length > 1 && (
        <div className="flex gap-3">
          {photos.map((photo, i) =>
            failed[i] ? null : (
              <button
                key={photo.url}
                onClick={() => setActive(i)}
                className={`relative h-20 w-28 rounded-lg overflow-hidden border-2 transition-all ${
                  active === i ? 'border-performance-turquoise' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={photo.url}
                  alt={`${model} ${photo.kind}`}
                  fill
                  onError={() => setFailed((f) => ({ ...f, [i]: true }))}
                  className="object-cover"
                  sizes="112px"
                />
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
};

export default VehicleGallery;
