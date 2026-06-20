/**
 * Single source of truth for the M&M Auto Performance fleet.
 *
 * Every surface (fleet listing, vehicle detail page, booking widget and the
 * MIA system prompt) reads from this list so prices, specs and locations can
 * never drift apart. Photos are resolved separately by `components/VehicleImage`
 * via a token match on the model name.
 */

export type VehicleCategory = 'luxury' | 'sports' | 'supercar' | 'exotic';

export interface Vehicle {
  /** URL slug, e.g. used at /booking/[id] */
  vehicleId: string;
  model: string;
  category: VehicleCategory;
  specs: {
    horsepower: number;
    acceleration: string; // 0-60 time, e.g. "2.9s"
    topSpeed: number; // mph
    transmission: string;
  };
  pricing: {
    daily: number; // GBP/day
    hourly: number; // GBP/hour
  };
  availability: boolean;
  features: string[];
  location: string;
  rating: number;
  reviews: number;
  description: string;
}

export const VEHICLES: Vehicle[] = [
  {
    vehicleId: 'lambo-huracan',
    model: 'Lamborghini Huracán',
    category: 'supercar',
    specs: { horsepower: 657, acceleration: '2.9s', topSpeed: 217, transmission: 'Automatic' },
    pricing: { daily: 1500, hourly: 200 },
    availability: true,
    features: ['GPS Navigation', 'Premium Sound System', 'Full Leather Interior', 'Climate Control', 'Keyless Entry', 'Backup Camera'],
    location: 'Mayfair, London',
    rating: 4.9,
    reviews: 127,
    description: 'Experience pure Italian performance. The Huracán is raw, visceral, and unforgettable.',
  },
  {
    vehicleId: 'ferrari-f8',
    model: 'Ferrari F8 Tributo',
    category: 'supercar',
    specs: { horsepower: 710, acceleration: '2.9s', topSpeed: 211, transmission: 'Automatic' },
    pricing: { daily: 1800, hourly: 250 },
    availability: true,
    features: ['Carbon Fiber Trim', 'Sport Package', 'Burmester Audio', 'Daytona Seats', 'F1-Style Shifter', 'Launch Control'],
    location: 'St Albans, Herts',
    rating: 5.0,
    reviews: 89,
    description: 'The pinnacle of Ferrari engineering. Every detail designed for performance.',
  },
  {
    vehicleId: 'porsche-911',
    model: 'Porsche 911 Turbo S',
    category: 'sports',
    specs: { horsepower: 640, acceleration: '2.7s', topSpeed: 211, transmission: 'Automatic' },
    pricing: { daily: 800, hourly: 120 },
    availability: true,
    features: ['Night Vision', 'Adaptive Suspension', 'Premium Leather', 'Paddle Shifters', 'Heated Seats', 'Apple CarPlay'],
    location: 'Watford, Herts',
    rating: 4.8,
    reviews: 234,
    description: 'Iconic performance. Precision engineering. The 911 Turbo S is pure Porsche.',
  },
  {
    vehicleId: 'bentley-continental',
    model: 'Bentley Continental GT',
    category: 'luxury',
    specs: { horsepower: 626, acceleration: '3.6s', topSpeed: 198, transmission: 'Automatic' },
    pricing: { daily: 600, hourly: 100 },
    availability: true,
    features: ['Full Leather Interiors', 'Heated/Cooled Seats', 'WiFi Connectivity', 'Premium Bar', 'Panoramic Roof', 'Navigation Plus'],
    location: 'Mayfair, London',
    rating: 4.7,
    reviews: 156,
    description: 'British luxury meets German engineering. Effortless power and elegance.',
  },
  {
    vehicleId: 'rolls-ghost',
    model: 'Rolls-Royce Ghost',
    category: 'luxury',
    specs: { horsepower: 563, acceleration: '4.6s', topSpeed: 155, transmission: 'Automatic' },
    pricing: { daily: 1200, hourly: 180 },
    availability: true,
    features: ['Starlight Headliner', 'Bespoke Audio', 'Champagne Cooler', 'Massage Seats', 'Lambswool Rugs', 'Coach Doors'],
    location: 'Mayfair, London',
    rating: 5.0,
    reviews: 64,
    description: 'The definition of effortless luxury. Silent, serene and utterly commanding.',
  },
  {
    vehicleId: 'aston-db12',
    model: 'Aston Martin DB12',
    category: 'sports',
    specs: { horsepower: 671, acceleration: '3.6s', topSpeed: 202, transmission: 'Automatic' },
    pricing: { daily: 950, hourly: 140 },
    availability: true,
    features: ['Sport Plus', 'Bang & Olufsen Audio', 'Alcantara Interior', 'Launch Control', 'Carbon Brakes', 'Heated Seats'],
    location: 'St Albans, Herts',
    rating: 4.9,
    reviews: 72,
    description: 'The world’s first super tourer. Brutal performance wrapped in timeless British elegance.',
  },
  {
    vehicleId: 'lambo-revuelto',
    model: 'Lamborghini Revuelto',
    category: 'exotic',
    specs: { horsepower: 1001, acceleration: '2.5s', topSpeed: 217, transmission: 'Automatic' },
    pricing: { daily: 2200, hourly: 350 },
    availability: true,
    features: ['Hybrid V12', 'Carbon Chassis', 'ALA Aero System', 'Track Mode', 'Telemetry', 'Forged Wheels'],
    location: 'Mayfair, London',
    rating: 5.0,
    reviews: 21,
    description: 'The first V12 hybrid HPEV from Lamborghini. 1000+ horsepower of the future.',
  },
  {
    vehicleId: 'tesla-plaid',
    model: 'Tesla Model S Plaid',
    category: 'luxury',
    specs: { horsepower: 1020, acceleration: '1.99s', topSpeed: 200, transmission: 'Automatic' },
    pricing: { daily: 350, hourly: 60 },
    availability: true,
    features: ['Autopilot', '17" Touchscreen', 'HEPA Filter', 'Gaming Mode', 'Premium Connectivity', 'Glass Roof'],
    location: 'Watford, Herts',
    rating: 4.6,
    reviews: 198,
    description: 'The quickest production car ever made. Silent, savage acceleration.',
  },
  {
    vehicleId: 'range-rover-sport',
    model: 'Range Rover Sport',
    category: 'luxury',
    specs: { horsepower: 523, acceleration: '4.3s', topSpeed: 162, transmission: 'Automatic' },
    pricing: { daily: 400, hourly: 70 },
    availability: true,
    features: ['Terrain Response', 'Meridian Audio', 'Air Suspension', 'Panoramic Roof', 'Heated Seats', 'Apple CarPlay'],
    location: 'Hemel Hempstead',
    rating: 4.7,
    reviews: 143,
    description: 'Commanding presence with first-class comfort. The luxury SUV benchmark.',
  },
  {
    vehicleId: 'mercedes-amg-gt',
    model: 'Mercedes-AMG GT 63S',
    category: 'sports',
    specs: { horsepower: 630, acceleration: '3.2s', topSpeed: 196, transmission: 'Automatic' },
    pricing: { daily: 700, hourly: 110 },
    availability: true,
    features: ['AMG Track Pace', 'Burmester Audio', 'Carbon Package', 'Performance Exhaust', 'Heated Seats', 'Night Package'],
    location: 'St Albans, Herts',
    rating: 4.8,
    reviews: 88,
    description: 'A four-door supercar. Brutal AMG power with everyday usability.',
  },
  {
    vehicleId: 'audi-rs3',
    model: 'Audi RS3',
    category: 'sports',
    specs: { horsepower: 401, acceleration: '3.8s', topSpeed: 180, transmission: 'Automatic' },
    pricing: { daily: 300, hourly: 50 },
    availability: true,
    features: ['Quattro AWD', 'RS Sport Exhaust', 'Virtual Cockpit', 'RS Torque Splitter', 'Drift Mode', 'Bang & Olufsen Audio'],
    location: 'Watford, Herts',
    rating: 4.8,
    reviews: 61,
    description: 'The iconic five-cylinder warble. A 400hp pocket rocket with unreal grip.',
  },
  {
    vehicleId: 'vw-golf-r',
    model: 'Volkswagen Golf R',
    category: 'sports',
    specs: { horsepower: 320, acceleration: '4.7s', topSpeed: 155, transmission: 'Automatic' },
    pricing: { daily: 250, hourly: 45 },
    availability: true,
    features: ['4MOTION AWD', 'R Performance Modes', 'Harman Kardon Audio', 'Digital Cockpit Pro', 'Nappa Leather', 'Adaptive Chassis'],
    location: 'Hemel Hempstead',
    rating: 4.7,
    reviews: 54,
    description: 'The everyday hyper-hatch. 320hp, all-wheel drive and genuinely usable every day.',
  },
  {
    vehicleId: 'mercedes-amg-cla45s',
    model: 'Mercedes-AMG CLA 45 S',
    category: 'sports',
    specs: { horsepower: 416, acceleration: '4.0s', topSpeed: 168, transmission: 'Automatic' },
    pricing: { daily: 280, hourly: 48 },
    availability: true,
    features: ['AMG Performance 4MATIC+', 'Race Mode', 'AMG Drift Mode', 'Burmester Audio', 'AMG Ride Control', 'Track Pace'],
    location: 'St Albans, Herts',
    rating: 4.8,
    reviews: 37,
    description: 'The world’s most powerful four-cylinder. A four-door coupe with supercar pace.',
  },
  {
    vehicleId: 'bmw-m3',
    model: 'BMW M3 Competition',
    category: 'sports',
    specs: { horsepower: 503, acceleration: '3.8s', topSpeed: 180, transmission: 'Automatic' },
    pricing: { daily: 320, hourly: 55 },
    availability: true,
    features: ['M xDrive AWD', 'M Sport Exhaust', 'Carbon Bucket Seats', 'Harman Kardon Audio', 'M Drive Modes', 'Head-Up Display'],
    location: 'Watford, Herts',
    rating: 4.8,
    reviews: 76,
    description: 'The benchmark sports saloon. 503hp, rear-biased AWD and razor-sharp handling.',
  },
  {
    vehicleId: 'bmw-m4',
    model: 'BMW M4 Competition',
    category: 'sports',
    specs: { horsepower: 503, acceleration: '3.4s', topSpeed: 180, transmission: 'Automatic' },
    pricing: { daily: 350, hourly: 58 },
    availability: true,
    features: ['M xDrive AWD', 'Carbon Roof', 'M Carbon Seats', 'Laser Headlights', 'M Drift Analyser', 'Harman Kardon Audio'],
    location: 'St Albans, Herts',
    rating: 4.9,
    reviews: 58,
    description: 'The M3’s sleeker coupe sibling. Brutal straight-six pace with everyday drama.',
  },
  {
    vehicleId: 'mercedes-amg-c63s',
    model: 'Mercedes-AMG C63 S E Performance',
    category: 'sports',
    specs: { horsepower: 671, acceleration: '3.3s', topSpeed: 174, transmission: 'Automatic' },
    pricing: { daily: 500, hourly: 80 },
    availability: true,
    features: ['AMG E Performance Hybrid', 'AMG 4MATIC+', 'Race Mode', 'Burmester Audio', 'AMG Ride Control', 'Drift Mode'],
    location: 'St Albans, Herts',
    rating: 4.8,
    reviews: 42,
    description: 'A 671hp plug-in hybrid AMG. F1-derived power in a four-door everyday weapon.',
  },
  {
    vehicleId: 'mercedes-amg-s63',
    model: 'Mercedes-AMG S63 E Performance',
    category: 'luxury',
    specs: { horsepower: 791, acceleration: '3.2s', topSpeed: 180, transmission: 'Automatic' },
    pricing: { daily: 900, hourly: 140 },
    availability: true,
    features: ['791hp V8 Hybrid', 'AMG 4MATIC+', 'Rear Executive Seats', 'Burmester 4D Audio', 'Active Ride Control', 'Massage Seats'],
    location: 'Mayfair, London',
    rating: 4.9,
    reviews: 29,
    description: 'The ultimate luxury super-saloon. 791hp of hybrid V8 with first-class rear comfort.',
  },
];

/** Tidy weekend (3-day) price with a small multi-day discount. */
export function weekendPrice(daily: number): number {
  return Math.round((daily * 2.7) / 10) * 10;
}

export function getVehicle(slug: string | undefined): Vehicle | undefined {
  if (!slug) return undefined;
  return VEHICLES.find((v) => v.vehicleId === slug);
}
