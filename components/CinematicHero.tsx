import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

// Rendered through next/image (same optimiser the fleet photos use), so it
// loads reliably — a raw CSS background pointed at Wikimedia does not.
// Swap for "/hero-bg.jpg" once the branded photo is dropped into public/.
const BG_URL =
  'https://commons.wikimedia.org/wiki/Special:FilePath/Rolls-Royce%20Ghost%20Black%20Badge%202022.jpg?width=1920';

export const CinematicHero: React.FC = () => {
  return (
    <>
      {/*
        Fixed, full-viewport background layer. It stays pinned while the page
        scrolls over it (the parallax effect), and the solid sections below
        slide up to cover it. z-0 sits above <main>'s base colour but below the
        z-10 content sections.
      */}
      <div className="fixed inset-0 z-0">
        <Image
          src={BG_URL}
          alt="Luxury car in London"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: 'center 42%' }}
        />
        {/* Cinematic dark overlays */}
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
      </div>

      {/* Hero content — transparent so the fixed layer shows through */}
      <section className="relative z-[1] h-screen flex flex-col items-center justify-end text-center pb-28 px-6">
        <p className="text-performance-turquoise text-[10px] font-bold tracking-[0.45em] uppercase mb-5">
          London &amp; Hertfordshire
        </p>

        <h1 className="font-display text-5xl sm:text-6xl lg:text-[5.5rem] font-bold text-white mb-6 leading-[1.05] tracking-tight drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)]">
          Rent luxury car<br className="hidden sm:block" /> in London
        </h1>

        <p className="text-white/70 text-base sm:text-lg max-w-xl mx-auto mb-12 leading-relaxed">
          Find your favourite model — M&amp;M Auto Performance specialises in luxury car hire across London &amp; Hertfordshire. Select your city to get more information.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/booking"
            className="min-w-[200px] px-10 py-4 rounded-full bg-performance-turquoise text-performance-grey font-bold tracking-[0.18em] uppercase text-sm hover:bg-performance-babyblue transition-all duration-300 shadow-lg shadow-performance-turquoise/20"
          >
            Request a Quote
          </Link>
          <Link
            href="/contact"
            className="min-w-[200px] px-10 py-4 rounded-full bg-[#25D366] text-white font-bold tracking-[0.18em] uppercase text-sm hover:bg-[#22c55e] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.098.541 4.07 1.488 5.788L.057 23.25l5.62-1.466A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.369l-.36-.214-3.733.974.999-3.64-.235-.374A9.818 9.818 0 1112 21.818z" />
            </svg>
            Contact Us
          </Link>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 animate-bounce">
          <ChevronDown size={26} />
        </div>
      </section>
    </>
  );
};

export default CinematicHero;
