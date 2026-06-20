import React from 'react';
import { ChevronRight, Zap } from 'lucide-react';
import Link from 'next/link';

interface HeroProps {
  title?: string;
  subtitle?: string;
  primaryCTA?: { text: string; href: string; };
  secondaryCTA?: { text: string; href: string; };
}

export const Hero: React.FC<HeroProps> = ({
  title = 'Elite Performance. Pure Speed.',
  subtitle = 'Experience high-performance automotive luxury across London & Hertfordshire. Real-time booking. AI-verified. Instant confirmation.',
  primaryCTA = { text: 'Book Your Experience', href: '/booking' },
  secondaryCTA = { text: 'Explore Fleet', href: '/fleet' },
}) => {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-performance-grey via-performance-grey to-performance-turquoise/10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-performance-turquoise/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-performance-babyblue/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      <div className="absolute inset-0 z-0 bg-glass-gradient" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-performance-turquoise/10 border border-performance-turquoise/30 rounded-full">
          <Zap size={16} className="text-performance-turquoise" />
          <span className="text-sm font-medium text-performance-turquoise">
            Powered by MIA — Motor Intelligence Assistant
          </span>
        </div>
        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
          <span className="bg-gradient-to-r from-performance-babyblue via-performance-turquoise to-performance-babyblue bg-clip-text text-transparent">
            {title}
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-300/90 mb-10 max-w-2xl mx-auto font-light">{subtitle}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href={primaryCTA.href} className="group relative px-8 py-4 bg-gradient-to-r from-performance-turquoise to-performance-babyblue text-performance-grey font-bold rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-performance-babyblue to-performance-turquoise opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative flex items-center justify-center gap-2">
              {primaryCTA.text}
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          <Link href={secondaryCTA.href} className="px-8 py-4 border-2 border-performance-turquoise text-performance-turquoise hover:bg-performance-turquoise/10 font-bold rounded-lg transition-all duration-300">
            {secondaryCTA.text}
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-6 mt-20 pt-12 border-t border-performance-turquoise/20">
          <div className="text-center">
            <div className="font-display text-3xl sm:text-4xl font-bold text-performance-turquoise">500+</div>
            <p className="text-gray-400 text-sm mt-2 tracking-wide">Elite Vehicles</p>
          </div>
          <div className="text-center">
            <div className="font-display text-3xl sm:text-4xl font-bold text-performance-babyblue">24/7</div>
            <p className="text-gray-400 text-sm mt-2 tracking-wide">AI Concierge</p>
          </div>
          <div className="text-center">
            <div className="font-display text-3xl sm:text-4xl font-bold text-performance-turquoise">8+</div>
            <p className="text-gray-400 text-sm mt-2 tracking-wide">UK Locations</p>
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-performance-turquoise rounded-full flex items-center justify-center">
          <div className="w-1 h-2 bg-performance-turquoise rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
