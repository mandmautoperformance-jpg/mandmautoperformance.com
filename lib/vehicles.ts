/**
 * Single source of truth for the M&M Auto Performance fleet.
 *
 * The fleet is generated from a curated set of BASE MODELS. Each model is
 * expanded into one listing per available photo, and every listing is pinned to
 * a DISTINCT image (deduped globally) so no two cars ever look the same. Every
 * surface (fleet listing, vehicle detail page, booking widget and the MIA
 * system prompt) still reads from this one list. Photos are resolved via
 * `lib/vehicle-photos` by a token match on the model name.
 *
 * The generator is fully deterministic (seeded), so the same fleet is produced
 * on every server render and static build — slugs never shift between requests.
 */

import { exteriorsFor } from '@/lib/vehicle-photos';

export type VehicleCategory = 'exotic' | 'supercar' | 'sports' | 'luxury' | 'executive';

export const CATEGORY_LABELS: Record<VehicleCategory, string> = {
  exotic: 'Exotic',
  supercar: 'Supercar',
  sports: 'Sports',
  luxury: 'Luxury',
  executive: 'Executive',
};

export interface VehicleColor {
  name: string;
  hex: string;
}

export interface Vehicle {
  /** URL slug, e.g. used at /booking/[id] */
  vehicleId: string;
  make: string;
  /** Display model name (no colour) */
  model: string;
  category: VehicleCategory;
  /** Colour name, e.g. "Rosso Corsa" */
  color: string;
  /** Colour swatch hex */
  colorHex: string;
  /** UK registration plate (cosmetic) */
  plate: string;
  /** The exact, unique photo pinned to this vehicle (no two cars share one). */
  photoUrl: string;
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

interface BaseModel {
  key: string;
  make: string;
  model: string;
  category: VehicleCategory;
  specs: Vehicle['specs'];
  daily: number;
  hourly: number;
  features: string[];
  description: string;
  /** How heavily this model is repeated across the fleet (higher = more cars). */
  weight: number;
}

// ---------------------------------------------------------------------------
// Base models. The first 17 have verified, licensed photography in
// components/VehicleImage and carry a higher weight so the bulk of the fleet
// always shows a real photo of the right car. The remainder add variety.
// ---------------------------------------------------------------------------

const BASE_MODELS: BaseModel[] = [
  // ---- Verified-photo core (weight 3) ----
  { key: 'lambo-huracan', make: 'Lamborghini', model: 'Lamborghini Huracán', category: 'supercar', specs: { horsepower: 657, acceleration: '2.9s', topSpeed: 217, transmission: 'Automatic' }, daily: 1500, hourly: 200, features: ['GPS Navigation', 'Premium Sound System', 'Full Leather Interior', 'Climate Control', 'Keyless Entry', 'Backup Camera'], description: 'Experience pure Italian performance. The Huracán is raw, visceral, and unforgettable.', weight: 3 },
  { key: 'ferrari-f8', make: 'Ferrari', model: 'Ferrari F8 Tributo', category: 'supercar', specs: { horsepower: 710, acceleration: '2.9s', topSpeed: 211, transmission: 'Automatic' }, daily: 1800, hourly: 250, features: ['Carbon Fiber Trim', 'Sport Package', 'Burmester Audio', 'Daytona Seats', 'F1-Style Shifter', 'Launch Control'], description: 'The pinnacle of Ferrari engineering. Every detail designed for performance.', weight: 3 },
  { key: 'porsche-911', make: 'Porsche', model: 'Porsche 911 Turbo S', category: 'sports', specs: { horsepower: 640, acceleration: '2.7s', topSpeed: 211, transmission: 'Automatic' }, daily: 800, hourly: 120, features: ['Night Vision', 'Adaptive Suspension', 'Premium Leather', 'Paddle Shifters', 'Heated Seats', 'Apple CarPlay'], description: 'Iconic performance. Precision engineering. The 911 Turbo S is pure Porsche.', weight: 3 },
  { key: 'bentley-continental', make: 'Bentley', model: 'Bentley Continental GT', category: 'luxury', specs: { horsepower: 626, acceleration: '3.6s', topSpeed: 198, transmission: 'Automatic' }, daily: 600, hourly: 100, features: ['Full Leather Interiors', 'Heated/Cooled Seats', 'WiFi Connectivity', 'Premium Bar', 'Panoramic Roof', 'Navigation Plus'], description: 'British luxury meets German engineering. Effortless power and elegance.', weight: 3 },
  { key: 'rolls-ghost', make: 'Rolls-Royce', model: 'Rolls-Royce Ghost', category: 'luxury', specs: { horsepower: 563, acceleration: '4.6s', topSpeed: 155, transmission: 'Automatic' }, daily: 1200, hourly: 180, features: ['Starlight Headliner', 'Bespoke Audio', 'Champagne Cooler', 'Massage Seats', 'Lambswool Rugs', 'Coach Doors'], description: 'The definition of effortless luxury. Silent, serene and utterly commanding.', weight: 3 },
  { key: 'aston-db12', make: 'Aston Martin', model: 'Aston Martin DB12', category: 'sports', specs: { horsepower: 671, acceleration: '3.6s', topSpeed: 202, transmission: 'Automatic' }, daily: 950, hourly: 140, features: ['Sport Plus', 'Bang & Olufsen Audio', 'Alcantara Interior', 'Launch Control', 'Carbon Brakes', 'Heated Seats'], description: 'The world’s first super tourer. Brutal performance wrapped in timeless British elegance.', weight: 3 },
  { key: 'lambo-revuelto', make: 'Lamborghini', model: 'Lamborghini Revuelto', category: 'exotic', specs: { horsepower: 1001, acceleration: '2.5s', topSpeed: 217, transmission: 'Automatic' }, daily: 2200, hourly: 350, features: ['Hybrid V12', 'Carbon Chassis', 'ALA Aero System', 'Track Mode', 'Telemetry', 'Forged Wheels'], description: 'The first V12 hybrid HPEV from Lamborghini. 1000+ horsepower of the future.', weight: 2 },
  { key: 'tesla-plaid', make: 'Tesla', model: 'Tesla Model S Plaid', category: 'luxury', specs: { horsepower: 1020, acceleration: '1.99s', topSpeed: 200, transmission: 'Automatic' }, daily: 350, hourly: 60, features: ['Autopilot', '17" Touchscreen', 'HEPA Filter', 'Gaming Mode', 'Premium Connectivity', 'Glass Roof'], description: 'The quickest production car ever made. Silent, savage acceleration.', weight: 3 },
  { key: 'range-rover-sport', make: 'Land Rover', model: 'Range Rover Sport', category: 'luxury', specs: { horsepower: 523, acceleration: '4.3s', topSpeed: 162, transmission: 'Automatic' }, daily: 400, hourly: 70, features: ['Terrain Response', 'Meridian Audio', 'Air Suspension', 'Panoramic Roof', 'Heated Seats', 'Apple CarPlay'], description: 'Commanding presence with first-class comfort. The luxury SUV benchmark.', weight: 3 },
  { key: 'mercedes-amg-gt', make: 'Mercedes-AMG', model: 'Mercedes-AMG GT 63S', category: 'sports', specs: { horsepower: 630, acceleration: '3.2s', topSpeed: 196, transmission: 'Automatic' }, daily: 700, hourly: 110, features: ['AMG Track Pace', 'Burmester Audio', 'Carbon Package', 'Performance Exhaust', 'Heated Seats', 'Night Package'], description: 'A four-door supercar. Brutal AMG power with everyday usability.', weight: 3 },
  { key: 'audi-rs3', make: 'Audi', model: 'Audi RS3', category: 'sports', specs: { horsepower: 401, acceleration: '3.8s', topSpeed: 180, transmission: 'Automatic' }, daily: 300, hourly: 50, features: ['Quattro AWD', 'RS Sport Exhaust', 'Virtual Cockpit', 'RS Torque Splitter', 'Drift Mode', 'Bang & Olufsen Audio'], description: 'The iconic five-cylinder warble. A 400hp pocket rocket with unreal grip.', weight: 3 },
  { key: 'vw-golf-r', make: 'Volkswagen', model: 'Volkswagen Golf R', category: 'sports', specs: { horsepower: 320, acceleration: '4.7s', topSpeed: 155, transmission: 'Automatic' }, daily: 250, hourly: 45, features: ['4MOTION AWD', 'R Performance Modes', 'Harman Kardon Audio', 'Digital Cockpit Pro', 'Nappa Leather', 'Adaptive Chassis'], description: 'The everyday hyper-hatch. 320hp, all-wheel drive and genuinely usable every day.', weight: 3 },
  { key: 'mercedes-amg-cla45s', make: 'Mercedes-AMG', model: 'Mercedes-AMG CLA 45 S', category: 'sports', specs: { horsepower: 416, acceleration: '4.0s', topSpeed: 168, transmission: 'Automatic' }, daily: 280, hourly: 48, features: ['AMG Performance 4MATIC+', 'Race Mode', 'AMG Drift Mode', 'Burmester Audio', 'AMG Ride Control', 'Track Pace'], description: 'The world’s most powerful four-cylinder. A four-door coupe with supercar pace.', weight: 3 },
  { key: 'bmw-m3', make: 'BMW', model: 'BMW M3 Competition', category: 'sports', specs: { horsepower: 503, acceleration: '3.8s', topSpeed: 180, transmission: 'Automatic' }, daily: 320, hourly: 55, features: ['M xDrive AWD', 'M Sport Exhaust', 'Carbon Bucket Seats', 'Harman Kardon Audio', 'M Drive Modes', 'Head-Up Display'], description: 'The benchmark sports saloon. 503hp, rear-biased AWD and razor-sharp handling.', weight: 3 },
  { key: 'bmw-m4', make: 'BMW', model: 'BMW M4 Competition', category: 'sports', specs: { horsepower: 503, acceleration: '3.4s', topSpeed: 180, transmission: 'Automatic' }, daily: 350, hourly: 58, features: ['M xDrive AWD', 'Carbon Roof', 'M Carbon Seats', 'Laser Headlights', 'M Drift Analyser', 'Harman Kardon Audio'], description: 'The M3’s sleeker coupe sibling. Brutal straight-six pace with everyday drama.', weight: 3 },
  { key: 'mercedes-amg-c63s', make: 'Mercedes-AMG', model: 'Mercedes-AMG C63 S E Performance', category: 'sports', specs: { horsepower: 671, acceleration: '3.3s', topSpeed: 174, transmission: 'Automatic' }, daily: 500, hourly: 80, features: ['AMG E Performance Hybrid', 'AMG 4MATIC+', 'Race Mode', 'Burmester Audio', 'AMG Ride Control', 'Drift Mode'], description: 'A 671hp plug-in hybrid AMG. F1-derived power in a four-door everyday weapon.', weight: 3 },
  { key: 'mercedes-amg-s63', make: 'Mercedes-AMG', model: 'Mercedes-AMG S63 E Performance', category: 'luxury', specs: { horsepower: 791, acceleration: '3.2s', topSpeed: 180, transmission: 'Automatic' }, daily: 900, hourly: 140, features: ['791hp V8 Hybrid', 'AMG 4MATIC+', 'Rear Executive Seats', 'Burmester 4D Audio', 'Active Ride Control', 'Massage Seats'], description: 'The ultimate luxury super-saloon. 791hp of hybrid V8 with first-class rear comfort.', weight: 2 },

  // ---- Extended variety (weight 1-2) ----
  { key: 'mclaren-720s', make: 'McLaren', model: 'McLaren 720S', category: 'supercar', specs: { horsepower: 710, acceleration: '2.8s', topSpeed: 212, transmission: 'Automatic' }, daily: 1600, hourly: 240, features: ['Carbon Monocage', 'Active Aero', 'Bowers & Wilkins Audio', 'Variable Drift Control', 'Launch Control', 'Dihedral Doors'], description: 'A lightweight British hypercar in all but name. Savage, surgical and otherworldly fast.', weight: 2 },
  { key: 'ferrari-roma', make: 'Ferrari', model: 'Ferrari Roma', category: 'sports', specs: { horsepower: 612, acceleration: '3.4s', topSpeed: 199, transmission: 'Automatic' }, daily: 1400, hourly: 210, features: ['La Nuova Dolce Vita Styling', 'Carbon Trim', 'JBL Audio', 'Launch Control', 'Heated Seats', '8-Speed DCT'], description: 'A grand tourer of timeless Italian elegance. Effortless 612hp with everyday usability.', weight: 1 },
  { key: 'lambo-urus', make: 'Lamborghini', model: 'Lamborghini Urus', category: 'exotic', specs: { horsepower: 657, acceleration: '3.5s', topSpeed: 190, transmission: 'Automatic' }, daily: 1300, hourly: 200, features: ['ANIMA Drive Modes', 'Carbon Ceramic Brakes', 'Bang & Olufsen Audio', 'Air Suspension', 'Panoramic Roof', 'Massage Seats'], description: 'The original super-SUV. Supercar pace and presence with five-seat practicality.', weight: 2 },
  { key: 'rolls-cullinan', make: 'Rolls-Royce', model: 'Rolls-Royce Cullinan', category: 'luxury', specs: { horsepower: 563, acceleration: '4.9s', topSpeed: 155, transmission: 'Automatic' }, daily: 1500, hourly: 230, features: ['Starlight Headliner', 'Bespoke Audio', 'Viewing Suite', 'Massage Seats', 'Lambswool Rugs', 'Coach Doors'], description: 'The most luxurious SUV on earth. A magic-carpet ride wrapped in handcrafted opulence.', weight: 1 },
  { key: 'bentley-bentayga', make: 'Bentley', model: 'Bentley Bentayga', category: 'luxury', specs: { horsepower: 542, acceleration: '4.4s', topSpeed: 180, transmission: 'Automatic' }, daily: 700, hourly: 120, features: ['Naim Audio', 'Air Suspension', 'Heated/Cooled Seats', 'Mood Lighting', 'Panoramic Roof', 'Diamond Quilting'], description: 'Britain’s handcrafted luxury SUV. Limousine comfort with genuine performance.', weight: 1 },
  { key: 'amg-g63', make: 'Mercedes-AMG', model: 'Mercedes-AMG G63', category: 'luxury', specs: { horsepower: 577, acceleration: '4.5s', topSpeed: 137, transmission: 'Automatic' }, daily: 800, hourly: 130, features: ['AMG 4MATIC', 'Burmester Audio', 'Nappa Leather', 'AMG Ride Control', 'Heated/Cooled Seats', 'Off-Road Pack'], description: 'The icon. Hand-built AMG V8 muscle in the most recognisable shape on the road.', weight: 2 },
  { key: 'audi-r8', make: 'Audi', model: 'Audi R8 V10', category: 'supercar', specs: { horsepower: 562, acceleration: '3.4s', topSpeed: 201, transmission: 'Automatic' }, daily: 900, hourly: 140, features: ['Quattro AWD', 'Naturally Aspirated V10', 'Virtual Cockpit', 'Bang & Olufsen Audio', 'Magnetic Ride', 'Carbon Trim'], description: 'The everyday supercar. A naturally aspirated V10 with all-weather Quattro confidence.', weight: 2 },
  { key: 'nissan-gtr', make: 'Nissan', model: 'Nissan GT-R Nismo', category: 'sports', specs: { horsepower: 600, acceleration: '2.7s', topSpeed: 196, transmission: 'Automatic' }, daily: 600, hourly: 100, features: ['ATTESA E-TS AWD', 'Twin-Turbo V6', 'Recaro Seats', 'Bose Audio', 'Launch Control', 'Carbon Bodywork'], description: 'Godzilla. Hand-assembled twin-turbo AWD muscle that humbles cars twice its price.', weight: 1 },
  { key: 'ford-mustang', make: 'Ford', model: 'Ford Mustang GT', category: 'sports', specs: { horsepower: 450, acceleration: '4.3s', topSpeed: 155, transmission: 'Automatic' }, daily: 250, hourly: 45, features: ['5.0 Coyote V8', 'Active Exhaust', 'Track Apps', 'B&O Audio', 'Line Lock', 'Digital Cluster'], description: 'American V8 muscle, reborn. Big noise, big character and proper rear-drive theatre.', weight: 1 },
  { key: 'aston-vantage', make: 'Aston Martin', model: 'Aston Martin Vantage', category: 'sports', specs: { horsepower: 656, acceleration: '3.4s', topSpeed: 202, transmission: 'Automatic' }, daily: 800, hourly: 120, features: ['Sport Plus', 'Bowers & Wilkins Audio', 'Alcantara Interior', 'Launch Control', 'Carbon Brakes', 'Heated Seats'], description: 'The hunter. Aston’s most athletic sports car — raw, rear-driven and beautifully aggressive.', weight: 1 },
  { key: 'porsche-panamera', make: 'Porsche', model: 'Porsche Panamera Turbo', category: 'luxury', specs: { horsepower: 620, acceleration: '3.2s', topSpeed: 196, transmission: 'Automatic' }, daily: 550, hourly: 90, features: ['Sport Chrono', 'Bose Audio', 'Air Suspension', 'Rear Comfort Seats', 'Panoramic Roof', 'Adaptive Cruise'], description: 'A four-door 911. Genuine supercar pace with limousine comfort for four.', weight: 1 },
  { key: 'porsche-cayenne', make: 'Porsche', model: 'Porsche Cayenne Turbo GT', category: 'luxury', specs: { horsepower: 631, acceleration: '3.3s', topSpeed: 186, transmission: 'Automatic' }, daily: 600, hourly: 100, features: ['Sport Chrono', 'Burmester Audio', 'Air Suspension', 'Carbon Package', 'Panoramic Roof', 'Sport Exhaust'], description: 'The fastest SUV Porsche has ever built. A track weapon that seats the whole family.', weight: 1 },
  { key: 'maserati-mc20', make: 'Maserati', model: 'Maserati MC20', category: 'supercar', specs: { horsepower: 621, acceleration: '2.9s', topSpeed: 202, transmission: 'Automatic' }, daily: 1200, hourly: 180, features: ['Nettuno V6', 'Carbon Monocoque', 'Butterfly Doors', 'Sonus Faber Audio', 'Launch Control', 'Corsa Mode'], description: 'Maserati’s reborn supercar. A Nettuno V6 howl wrapped in butterfly-door Italian drama.', weight: 1 },
  { key: 'ferrari-296', make: 'Ferrari', model: 'Ferrari 296 GTB', category: 'supercar', specs: { horsepower: 819, acceleration: '2.9s', topSpeed: 205, transmission: 'Automatic' }, daily: 1700, hourly: 250, features: ['Hybrid V6', 'eManettino', 'Carbon Wheels', 'JBL Audio', 'Launch Control', 'Daytona Seats'], description: 'The little Ferrari with giant-killing pace. An 819hp hybrid V6 that rewrites the rulebook.', weight: 1 },
  { key: 'lambo-aventador', make: 'Lamborghini', model: 'Lamborghini Aventador', category: 'exotic', specs: { horsepower: 769, acceleration: '2.8s', topSpeed: 220, transmission: 'Automatic' }, daily: 2000, hourly: 320, features: ['Naturally Aspirated V12', 'Scissor Doors', 'Carbon Monocoque', 'Sensonum Audio', 'Pushrod Suspension', 'Ego Drive Modes'], description: 'The last great naturally aspirated V12. Scissor doors, raw drama and an unforgettable scream.', weight: 1 },
  { key: 'rolls-spectre', make: 'Rolls-Royce', model: 'Rolls-Royce Spectre', category: 'exotic', specs: { horsepower: 577, acceleration: '4.4s', topSpeed: 155, transmission: 'Automatic' }, daily: 1600, hourly: 250, features: ['Silent Electric Drive', 'Starlight Doors', 'Bespoke Audio', 'Massage Seats', 'Coach Doors', 'Planar Suspension'], description: 'The first electric Rolls-Royce. Limitless silence and handcrafted opulence, reimagined.', weight: 1 },
  { key: 'bmw-m5', make: 'BMW', model: 'BMW M5 Competition', category: 'sports', specs: { horsepower: 617, acceleration: '3.2s', topSpeed: 190, transmission: 'Automatic' }, daily: 500, hourly: 85, features: ['M xDrive AWD', 'M Sport Exhaust', 'Merino Leather', 'Bowers & Wilkins Audio', 'M Drive Modes', 'Carbon Brakes'], description: 'The original super-saloon, perfected. 617hp of twin-turbo V8 with four-door practicality.', weight: 1 },
  { key: 'audi-rs6', make: 'Audi', model: 'Audi RS6 Avant', category: 'sports', specs: { horsepower: 591, acceleration: '3.6s', topSpeed: 190, transmission: 'Automatic' }, daily: 450, hourly: 75, features: ['Quattro AWD', 'Twin-Turbo V8', 'Bang & Olufsen Audio', 'Air Suspension', 'Virtual Cockpit', 'Sport Exhaust'], description: 'The ultimate Q-car. A 591hp V8 estate that swallows the family and embarrasses supercars.', weight: 1 },

  // ---- Ten everyday "normal" cars (executive) ----
  { key: 'vw-golf-gti', make: 'Volkswagen', model: 'Volkswagen Golf GTI', category: 'executive', specs: { horsepower: 245, acceleration: '6.2s', topSpeed: 155, transmission: 'Automatic' }, daily: 160, hourly: 30, features: ['DSG Gearbox', 'Digital Cockpit', 'Apple CarPlay', 'Tartan Seats', 'Adaptive Cruise', 'Sport Suspension'], description: 'The original hot hatch. Quick, comfortable and brilliantly easy to live with every day.', weight: 1 },
  { key: 'vw-golf', make: 'Volkswagen', model: 'Volkswagen Golf', category: 'executive', specs: { horsepower: 148, acceleration: '8.5s', topSpeed: 139, transmission: 'Automatic' }, daily: 120, hourly: 25, features: ['DSG Gearbox', 'Digital Cockpit', 'Apple CarPlay', 'Lane Assist', 'Adaptive Cruise', 'Climate Control'], description: 'The sensible all-rounder. Refined, efficient and the perfect everyday runaround.', weight: 1 },
  { key: 'bmw-320i', make: 'BMW', model: 'BMW 320i M Sport', category: 'executive', specs: { horsepower: 181, acceleration: '7.1s', topSpeed: 149, transmission: 'Automatic' }, daily: 150, hourly: 28, features: ['M Sport Pack', 'Live Cockpit Pro', 'Apple CarPlay', 'Sport Seats', 'Adaptive Cruise', 'Heated Seats'], description: 'The benchmark executive saloon. Rear-drive poise with everyday comfort and economy.', weight: 1 },
  { key: 'bmw-330i', make: 'BMW', model: 'BMW 330i M Sport', category: 'executive', specs: { horsepower: 254, acceleration: '5.8s', topSpeed: 155, transmission: 'Automatic' }, daily: 180, hourly: 32, features: ['M Sport Pack', 'Live Cockpit Pro', 'Harman Kardon Audio', 'Sport Seats', 'Adaptive Cruise', 'Heated Seats'], description: 'The sweet spot of the 3 Series. 254hp of smooth, rear-drive everyday performance.', weight: 1 },
  { key: 'bmw-520i', make: 'BMW', model: 'BMW 520i M Sport', category: 'executive', specs: { horsepower: 205, acceleration: '7.5s', topSpeed: 146, transmission: 'Automatic' }, daily: 190, hourly: 34, features: ['M Sport Pack', 'Live Cockpit Pro', 'Comfort Seats', 'Adaptive Cruise', 'Heated Seats', 'Ambient Lighting'], description: 'Executive comfort, elevated. A serene, spacious cruiser for business and beyond.', weight: 1 },
  { key: 'merc-c200', make: 'Mercedes-Benz', model: 'Mercedes-Benz C-Class C200 AMG Line', category: 'executive', specs: { horsepower: 201, acceleration: '7.3s', topSpeed: 152, transmission: 'Automatic' }, daily: 160, hourly: 30, features: ['AMG Line Styling', 'MBUX Display', 'Apple CarPlay', 'Artico Seats', 'Adaptive Cruise', 'Ambient Lighting'], description: 'Compact executive elegance. The C-Class blends S-Class style with everyday running costs.', weight: 1 },
  { key: 'merc-c300', make: 'Mercedes-Benz', model: 'Mercedes-Benz C-Class C300 AMG Line', category: 'executive', specs: { horsepower: 254, acceleration: '6.0s', topSpeed: 155, transmission: 'Automatic' }, daily: 190, hourly: 34, features: ['AMG Line Styling', 'MBUX Display', 'Burmester Audio', 'Sport Seats', 'Adaptive Cruise', 'Ambient Lighting'], description: 'The C-Class with extra punch. 254hp of refined, badge-worthy everyday luxury.', weight: 1 },
  { key: 'merc-e300', make: 'Mercedes-Benz', model: 'Mercedes-Benz E-Class E300 AMG Line', category: 'executive', specs: { horsepower: 254, acceleration: '6.2s', topSpeed: 155, transmission: 'Automatic' }, daily: 220, hourly: 38, features: ['AMG Line Styling', 'MBUX Superscreen', 'Burmester Audio', 'Comfort Seats', 'Adaptive Cruise', 'Massage Seats'], description: 'The executive standard-bearer. Limousine refinement in a discreet, do-everything package.', weight: 1 },
  { key: 'merc-a250', make: 'Mercedes-Benz', model: 'Mercedes-Benz A-Class A250 AMG Line', category: 'executive', specs: { horsepower: 221, acceleration: '6.2s', topSpeed: 155, transmission: 'Automatic' }, daily: 140, hourly: 26, features: ['AMG Line Styling', 'MBUX Display', 'Apple CarPlay', 'Sport Seats', 'Adaptive Cruise', 'Ambient Lighting'], description: 'The premium hatch. Big-car tech and style in an easy, city-friendly footprint.', weight: 1 },
  { key: 'audi-a4', make: 'Audi', model: 'Audi A4 S Line', category: 'executive', specs: { horsepower: 201, acceleration: '7.1s', topSpeed: 149, transmission: 'Automatic' }, daily: 150, hourly: 28, features: ['S Line Styling', 'Virtual Cockpit', 'Apple CarPlay', 'Sport Seats', 'Adaptive Cruise', 'Heated Seats'], description: 'Understated quality. The A4’s cabin and refinement still set the executive benchmark.', weight: 1 },
];

// ---------------------------------------------------------------------------
// Colour palette — realistic factory colours with swatch hex values.
// ---------------------------------------------------------------------------

const PALETTE: VehicleColor[] = [
  { name: 'Rosso Corsa', hex: '#C0392B' },
  { name: 'Nero Black', hex: '#0B0B0D' },
  { name: 'Bianco White', hex: '#F4F6F8' },
  { name: 'Grigio Silver', hex: '#C9CDD2' },
  { name: 'Nardo Grey', hex: '#6E7173' },
  { name: 'Verde Green', hex: '#1E7A46' },
  { name: 'British Racing Green', hex: '#14452F' },
  { name: 'Giallo Yellow', hex: '#E8B70C' },
  { name: 'Arancio Orange', hex: '#E8730C' },
  { name: 'Blu Notte', hex: '#1F3A6E' },
  { name: 'Azzurro Sky', hex: '#4F93C8' },
  { name: 'Viola Purple', hex: '#6C3483' },
  { name: 'Bronze', hex: '#8C6A3F' },
  { name: 'Gunmetal', hex: '#2C3338' },
  { name: 'Champagne Gold', hex: '#C5A572' },
  { name: 'Satin Pearl', hex: '#E6E2DA' },
];

const LOCATIONS = [
  'Mayfair, London',
  'Knightsbridge, London',
  'Chelsea, London',
  'St Albans, Herts',
  'Watford, Herts',
  'Hemel Hempstead, Herts',
  'Hatfield, Herts',
  'Borehamwood, Herts',
];

const PLATE_LETTERS = 'ABCDEFGHJKLMNOPRSTUVWXYZ';

// Deterministic PRNG (mulberry32) so the generated fleet is identical on every
// render and build — no hydration mismatches, no shifting slugs.
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function colorSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function makePlate(rng: () => number): string {
  const area = PLATE_LETTERS[Math.floor(rng() * PLATE_LETTERS.length)] +
    PLATE_LETTERS[Math.floor(rng() * PLATE_LETTERS.length)];
  const age = String(20 + Math.floor(rng() * 6)) + (rng() > 0.5 ? '' : '');
  const tail = PLATE_LETTERS[Math.floor(rng() * PLATE_LETTERS.length)] +
    PLATE_LETTERS[Math.floor(rng() * PLATE_LETTERS.length)] +
    PLATE_LETTERS[Math.floor(rng() * PLATE_LETTERS.length)];
  return `${area}${age} ${tail}`;
}

function generateFleet(): Vehicle[] {
  // Every vehicle is pinned to ONE distinct photo, so the showroom never
  // repeats a car. For each base model we create exactly as many listings as
  // that model has real photos, giving each a different factory colour.
  const fleet: Vehicle[] = [];
  const usedSlugs = new Set<string>();
  const usedPhotos = new Set<string>(); // guarantees globally-unique photography

  BASE_MODELS.forEach((base, modelIdx) => {
    // Only photos not already claimed by another model — never repeat an image.
    const photos = exteriorsFor(base.model).filter((p) => {
      if (usedPhotos.has(p.url)) return false;
      usedPhotos.add(p.url);
      return true;
    });
    if (!photos.length) return; // no unique photography → skip (never show a blank)

    photos.forEach((photo, i) => {
      // Offset the colour per model so the fleet as a whole stays varied.
      const color = PALETTE[(modelIdx * 3 + i) % PALETTE.length];
      const rng = mulberry32(
        (modelIdx + 1) * 2654435761 + (i + 1) * 40503 + base.key.length * 97,
      );

      let slug = `${base.key}-${colorSlug(color.name)}`;
      if (usedSlugs.has(slug)) slug = `${slug}-${i + 1}`;
      usedSlugs.add(slug);

      // Deterministic per-car variance.
      const rating = Math.round((4.5 + rng() * 0.5) * 10) / 10; // 4.5–5.0
      const reviews = 6 + Math.floor(rng() * 240);
      const availability = rng() > 0.22; // ~78% available
      const location = LOCATIONS[Math.floor(rng() * LOCATIONS.length)];
      const plate = makePlate(rng);

      fleet.push({
        vehicleId: slug,
        make: base.make,
        model: base.model,
        category: base.category,
        color: color.name,
        colorHex: color.hex,
        plate,
        photoUrl: photo.url,
        specs: base.specs,
        pricing: { daily: base.daily, hourly: base.hourly },
        availability,
        features: base.features,
        location,
        rating,
        reviews,
        description: base.description,
      });
    });
  });

  return fleet;
}

export const VEHICLES: Vehicle[] = generateFleet();

/** Real fleet size — every entry has its own unique photo. */
export const FLEET_SIZE: number = VEHICLES.length;

/** One representative listing per base model — used for compact pickers. */
export const MODEL_OPTIONS: { vehicleId: string; model: string; daily: number }[] =
  BASE_MODELS
    .map((base) => {
      // A model may have no listing if all its photos were claimed by another
      // model that shares the same photo rule — skip those rather than crash.
      const first = VEHICLES.find((v) => v.model === base.model);
      if (!first) return null;
      return { vehicleId: first.vehicleId, model: base.model, daily: base.daily };
    })
    .filter((o): o is { vehicleId: string; model: string; daily: number } => o !== null);

/** Distinct makes present in the fleet, alphabetical. */
export const MAKES: string[] = Array.from(new Set(VEHICLES.map((v) => v.make))).sort();

/** Tidy weekend (3-day) price with a small multi-day discount. */
export function weekendPrice(daily: number): number {
  return Math.round((daily * 2.7) / 10) * 10;
}

export function getVehicle(slug: string | undefined): Vehicle | undefined {
  if (!slug) return undefined;
  return VEHICLES.find((v) => v.vehicleId === slug);
}
