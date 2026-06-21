import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { VEHICLES, FLEET_SIZE, type VehicleCategory } from '@/lib/vehicles';

const WIKIMEDIA = (file: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=1200`;

interface CategoryItem {
  id: VehicleCategory;
  label: string;
  tagline: string;
  photo: string;
}

const CATEGORY_DATA: CategoryItem[] = [
  {
    id: 'exotic',
    label: 'Exotic',
    tagline: 'Beyond every boundary',
    photo: WIKIMEDIA('Lamborghini Revuelto.jpg'),
  },
  {
    id: 'supercar',
    label: 'Supercar',
    tagline: 'Pure velocity',
    photo: WIKIMEDIA('Maclaren 720S PA280972-PSD.jpg'),
  },
  {
    id: 'sports',
    label: 'Sports',
    tagline: 'Precision engineered',
    photo: WIKIMEDIA('Porsche 992 Turbo S 1X7A0413.jpg'),
  },
  {
    id: 'luxury',
    label: 'Luxury',
    tagline: 'Effortless refinement',
    photo: WIKIMEDIA('Rolls-Royce Ghost II IAA 2021 1X7A0005.jpg'),
  },
  {
    id: 'suv',
    label: 'SUV',
    tagline: 'Command the road',
    photo: WIKIMEDIA('Lamborghini Urus red (1).jpg'),
  },
  {
    id: 'executive',
    label: 'Executive',
    tagline: 'Business class, elevated',
    photo: WIKIMEDIA('Mercedes-Benz C 200 4MATIC AVANTGARDE (W206) front.jpg'),
  },
];

interface TileProps extends CategoryItem {
  count: number;
}

function CategoryTile({ id, label, tagline, photo, count }: TileProps) {
  const [hovered, setHovered] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  // Fallback gradient colours per category
  const fallbackGradient: Record<string, string> = {
    exotic: 'from-purple-900/60 to-performance-grey',
    supercar: 'from-red-900/50 to-performance-grey',
    sports: 'from-blue-900/50 to-performance-grey',
    luxury: 'from-amber-900/40 to-performance-grey',
    suv: 'from-emerald-900/50 to-performance-grey',
    executive: 'from-slate-700/50 to-performance-grey',
  };

  return (
    <Link
      href={`/fleet?cat=${id}`}
      className="relative flex-shrink-0 w-64 md:flex-1 md:w-auto overflow-hidden rounded-xl cursor-pointer"
      style={{ height: '400px' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Ken Burns image layer */}
      <div className="absolute inset-0 overflow-hidden rounded-xl">
        {!imgFailed ? (
          <div
            className="absolute inset-0"
            style={{
              animation: hovered
                ? 'kenburns-fast 5s ease-in-out infinite alternate'
                : 'kenburns 14s ease-in-out infinite',
            }}
          >
            <Image
              src={photo}
              alt={label}
              fill
              className="object-cover"
              onError={() => setImgFailed(true)}
              sizes="(max-width: 768px) 256px, 20vw"
              priority={false}
            />
          </div>
        ) : (
          <div
            className={`absolute inset-0 bg-gradient-to-b ${fallbackGradient[id] ?? fallbackGradient.luxury}`}
          />
        )}
      </div>

      {/* Gradient scrim */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10 transition-opacity duration-500 ${
          hovered ? 'opacity-90' : 'opacity-70'
        }`}
      />

      {/* Gold bottom accent line */}
      <div
        className={`absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-performance-turquoise to-transparent transition-opacity duration-500 ${
          hovered ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        {/* Vehicle count badge */}
        <div
          className={`mb-3 self-start px-2 py-0.5 rounded bg-performance-turquoise/15 border border-performance-turquoise/30 transition-all duration-400 ${
            hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <span className="text-performance-turquoise text-[9px] font-bold tracking-[0.3em] uppercase">
            {count} vehicles
          </span>
        </div>

        {/* Tagline */}
        <p
          className={`text-performance-turquoise text-[10px] font-semibold tracking-[0.28em] uppercase mb-2 transition-all duration-300 ${
            hovered ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-1'
          }`}
        >
          {tagline}
        </p>

        {/* Category name */}
        <h3 className="font-display text-white text-3xl font-bold mb-4 leading-none">
          {label}
        </h3>

        {/* CTA arrow */}
        <div
          className={`flex items-center gap-2 transition-all duration-300 ${
            hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          <span className="text-performance-turquoise text-sm font-semibold tracking-wide">
            Browse Collection
          </span>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
            <path
              d="M3.5 9h11M10 5l4.5 4-4.5 4"
              stroke="#C5A572"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Hover border glow */}
      <div
        className={`absolute inset-0 rounded-xl border transition-all duration-300 ${
          hovered
            ? 'border-performance-turquoise/60 shadow-[0_0_32px_-4px_rgba(197,165,114,0.35)]'
            : 'border-performance-turquoise/12'
        }`}
      />
    </Link>
  );
}

export const CategoryShowcase: React.FC = () => {
  const counts = React.useMemo(() => {
    const map: Record<string, number> = {};
    for (const v of VEHICLES) {
      map[v.category] = (map[v.category] ?? 0) + 1;
    }
    return map;
  }, []);

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-20 bg-performance-grey/50 border-t border-performance-turquoise/10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-performance-turquoise text-[10px] font-bold tracking-[0.45em] uppercase mb-3">
            Browse by Category
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
            Find Your Drive
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto text-sm">
            {FLEET_SIZE} individually-photographed vehicles across five curated categories — available across London &amp; Hertfordshire.
          </p>
        </div>

        {/* Tiles — horizontal scroll on mobile, equal columns on desktop */}
        <div className="flex gap-4 overflow-x-auto scrollbar-hide md:grid md:grid-cols-3 lg:grid-cols-6">
          {CATEGORY_DATA.map((cat) => (
            <CategoryTile key={cat.id} {...cat} count={counts[cat.id] ?? 0} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;
