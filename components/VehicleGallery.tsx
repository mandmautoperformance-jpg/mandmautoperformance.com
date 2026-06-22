import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { Car, Armchair } from 'lucide-react';
import { galleryFor, type Photo } from '@/lib/vehicle-photos';

interface VehicleGalleryProps {
  model: string;
  category: 'luxury' | 'sports' | 'supercar' | 'exotic' | 'suv' | 'executive';
  color?: string;
  colorHex?: string;
  heroPhoto?: string;
}

const CATEGORY_GRADIENT: Record<string, string> = {
  luxury: 'from-blue-600/30 via-performance-grey to-performance-grey',
  sports: 'from-red-600/25 via-performance-grey to-performance-grey',
  supercar: 'from-purple-600/30 via-performance-grey to-performance-grey',
  exotic: 'from-performance-turquoise/30 via-performance-grey to-performance-grey',
  suv: 'from-emerald-700/25 via-performance-grey to-performance-grey',
  executive: 'from-slate-500/25 via-performance-grey to-performance-grey',
};

export const VehicleGallery: React.FC<VehicleGalleryProps> = ({ model, category, color, colorHex, heroPhoto }) => {
  const { exteriors, interiors } = useMemo<{ exteriors: Photo[]; interiors: Photo[] }>(() => {
    const all = galleryFor(model);
    const ext = all.filter((p) => p.kind === 'exterior');
    const int = all.filter((p) => p.kind === 'interior');
    if (heroPhoto) {
      const hero = ext.find((p) => p.url === heroPhoto);
      if (hero) return { exteriors: [hero, ...ext.filter((p) => p.url !== heroPhoto)], interiors: int };
    }
    return { exteriors: ext, interiors: int };
  }, [model, heroPhoto]);

  const [activeExt, setActiveExt] = useState(0);
  const [extFailed, setExtFailed] = useState<Record<number, boolean>>({});
  const [activeInt, setActiveInt] = useState(0);
  const [intFailed, setIntFailed] = useState<Record<number, boolean>>({});

  const liveExt = exteriors.filter((_, i) => !extFailed[i]);
  const activeExtPhoto = !extFailed[activeExt] ? exteriors[activeExt] : liveExt[0];
  const liveInt = interiors.filter((_, i) => !intFailed[i]);
  const activeIntPhoto = !intFailed[activeInt] ? interiors[activeInt] : liveInt[0];

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
      {color && <span className="relative mt-2 text-sm text-gray-300">{color}</span>}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* ── Exterior Gallery ── */}
      <div className="space-y-3">
        <div className="group relative rounded-xl overflow-hidden h-96 bg-gradient-to-br from-performance-grey to-performance-turquoise/10">
          {activeExtPhoto ? (
            <Image
              key={activeExtPhoto.url}
              src={activeExtPhoto.url}
              alt={`${model}${color ? ` — ${color}` : ''}`}
              fill
              onError={() => setExtFailed((f) => ({ ...f, [exteriors.indexOf(activeExtPhoto)]: true }))}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 66vw"
              priority
            />
          ) : (
            fallback
          )}
          <span className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-performance-grey/80 backdrop-blur-sm text-xs font-semibold text-performance-babyblue">
            Exterior
          </span>
        </div>

        {liveExt.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {exteriors.map((photo, i) =>
              extFailed[i] ? null : (
                <button
                  key={photo.url}
                  onClick={() => setActiveExt(i)}
                  className={`relative flex-shrink-0 h-20 w-28 rounded-lg overflow-hidden border-2 transition-all ${
                    activeExt === i ? 'border-performance-turquoise' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={photo.url}
                    alt={`${model} exterior ${i + 1}`}
                    fill
                    onError={() => setExtFailed((f) => ({ ...f, [i]: true }))}
                    className="object-cover"
                    sizes="112px"
                  />
                </button>
              ),
            )}
          </div>
        )}
      </div>

      {/* ── Interior Gallery (shown only when at least one photo loads) ── */}
      {interiors.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Armchair size={16} className="text-performance-turquoise" />
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest">Interior</h3>
          </div>

          {activeIntPhoto ? (
            <div className="group relative rounded-xl overflow-hidden h-64 bg-gradient-to-br from-performance-grey to-performance-turquoise/10">
              <Image
                key={activeIntPhoto.url}
                src={activeIntPhoto.url}
                alt={`${model} interior`}
                fill
                onError={() => setIntFailed((f) => ({ ...f, [interiors.indexOf(activeIntPhoto)]: true }))}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
              <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-full bg-performance-grey/80 backdrop-blur-sm text-xs font-semibold text-performance-babyblue">
                Interior
              </span>
            </div>
          ) : (
            /* All interior photos failed — render nothing so the section disappears */
            <div className="hidden" aria-hidden />
          )}

          {liveInt.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {interiors.map((photo, i) =>
                intFailed[i] ? null : (
                  <button
                    key={photo.url}
                    onClick={() => setActiveInt(i)}
                    className={`relative flex-shrink-0 h-20 w-28 rounded-lg overflow-hidden border-2 transition-all ${
                      activeInt === i ? 'border-performance-turquoise' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={photo.url}
                      alt={`${model} interior ${i + 1}`}
                      fill
                      onError={() => setIntFailed((f) => ({ ...f, [i]: true }))}
                      className="object-cover"
                      sizes="112px"
                    />
                  </button>
                ),
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VehicleGallery;
