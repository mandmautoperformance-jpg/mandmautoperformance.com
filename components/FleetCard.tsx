import React, { useState } from 'react';
import { Heart, MapPin, Zap, Gauge } from 'lucide-react';
import Link from 'next/link';
import VehicleImage from '@/components/VehicleImage';

interface FleetCardProps {
  vehicleId: string;
  model: string;
  category: 'luxury' | 'sports' | 'supercar' | 'exotic';
  image: string;
  specs: {
    horsepower: number;
    acceleration: string; // 0-60 time
    topSpeed: number;
    transmission: string;
  };
  pricing: {
    daily: number;
    hourly: number;
  };
  availability: boolean;
  features: string[];
  location?: string;
  rating?: number;
}

export const FleetCard: React.FC<FleetCardProps> = ({
  vehicleId,
  model,
  category,
  specs,
  pricing,
  availability,
  features,
  location = 'London, UK',
  rating = 4.9,
}) => {
  const [isFavorited, setIsFavorited] = useState(false);

  const categoryColors = {
    luxury: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    sports: 'bg-red-500/20 text-red-400 border-red-500/30',
    supercar: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    exotic: 'bg-performance-turquoise/20 text-performance-turquoise border-performance-turquoise/30',
  };

  return (
    <div className="group relative h-full bg-performance-grey border border-performance-turquoise/20 rounded-xl overflow-hidden hover:border-performance-turquoise/50 transition-all duration-300 hover:shadow-2xl hover:shadow-performance-turquoise/20">
      {/* Image Container */}
      <div className="relative h-64 sm:h-72 overflow-hidden bg-gradient-to-br from-performance-grey to-performance-turquoise/10">
        <VehicleImage vehicleId={vehicleId} model={model} category={category} />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-performance-grey via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category Badge */}
        <div
          className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold border ${categoryColors[category]}`}
        >
          {category.toUpperCase()}
        </div>

        {/* Availability Badge */}
        <div
          className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${
            availability
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}
        >
          {availability ? 'Available' : 'Booked'}
        </div>

        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorited(!isFavorited)}
          className="absolute bottom-4 right-4 p-2 bg-performance-grey/80 backdrop-blur-sm hover:bg-performance-turquoise rounded-full transition-colors duration-200"
        >
          <Heart
            size={20}
            className={isFavorited ? 'fill-red-400 text-red-400' : 'text-gray-300'}
          />
        </button>

        {/* Rating */}
        <div className="absolute bottom-4 left-4 bg-performance-grey/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-performance-babyblue">
          ⭐ {rating}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title & Location */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white mb-2">{model}</h3>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <MapPin size={16} className="text-performance-turquoise" />
            {location}
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6 py-4 border-t border-b border-performance-turquoise/20">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-performance-turquoise font-bold text-sm">
              <Zap size={16} />
              <span>{specs.horsepower}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">HP</p>
          </div>
          <div className="text-center">
            <div className="text-performance-babyblue font-bold text-sm">
              {specs.acceleration}
            </div>
            <p className="text-xs text-gray-400 mt-1">0-60</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-performance-turquoise font-bold text-sm">
              <Gauge size={16} />
              <span>{specs.topSpeed}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">mph</p>
          </div>
        </div>

        {/* Features */}
        <div className="mb-6">
          <p className="text-xs text-gray-400 font-semibold mb-2">Features</p>
          <div className="flex flex-wrap gap-2">
            {features.slice(0, 4).map((feature, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-performance-turquoise/10 text-performance-turquoise text-xs rounded border border-performance-turquoise/20"
              >
                {feature}
              </span>
            ))}
            {features.length > 4 && (
              <span className="px-2 py-1 text-gray-400 text-xs">
                +{features.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-4 border-t border-performance-turquoise/20">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Starting from</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-performance-turquoise">
                  £{pricing.daily}
                </span>
                <span className="text-sm text-gray-400">/day</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                or £{pricing.hourly}/hour
              </p>
            </div>
          </div>

          <Link
            href={`/booking/${vehicleId}`}
            className={`w-full py-3 rounded-lg font-bold transition-all duration-200 text-center block ${
              availability
                ? 'bg-performance-turquoise hover:bg-performance-turquoise/90 text-performance-grey transform hover:scale-105'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            {availability ? 'Book Now' : 'View Details'}
          </Link>
        </div>
      </div>

      {/* Hover Highlight */}
      <div className="absolute inset-0 border border-performance-turquoise/0 group-hover:border-performance-turquoise/50 rounded-xl pointer-events-none transition-all duration-300" />
    </div>
  );
};

export default FleetCard;
