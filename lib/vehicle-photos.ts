/**
 * Central catalogue of freely-licensed car photography (Wikimedia Commons).
 *
 * Each rule matches a distinctive token in the model name and returns one or
 * more real photos of that EXACT model. The fleet generator (lib/vehicles.ts)
 * pins ONE distinct photo to every vehicle, so no two cars ever share an image.
 *
 * Rules are evaluated top-to-bottom (first match wins): specific tokens MUST
 * precede generic ones (e.g. "c-class"/"e-class" before "cla", "gt-r" before
 * "amg gt", "golf r"/"golf gti" before "golf"). Filenames are stored RAW and
 * URL-encoded by WIKIMEDIA().
 */
const WIKIMEDIA = (file: string, width = 1200) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;

export type PhotoKind = 'exterior' | 'interior';
export interface Photo {
  url: string;
  kind: PhotoKind;
}

interface PhotoRule {
  match: string;
  photos: Photo[];
}

const ext = (file: string): Photo => ({ url: WIKIMEDIA(file), kind: 'exterior' });
export const int = (file: string): Photo => ({ url: WIKIMEDIA(file), kind: 'interior' });

export const PHOTO_RULES: PhotoRule[] = [
  // ---- Bugatti ----
  { match: 'chiron', photos: [
    ext('Bugatti Chiron (1).jpg'),
    ext('Bugatti Chiron Super Sport.jpg'),
    ext('Bugatti Chiron Pur Sport.jpg'),
    ext('Bugatti Chiron (53257968845).jpg'),
    ext('2021 Bugatti Chiron Super Sport 8.0 Front.jpg'),
    ext('Bugatti Chiron Sport (51405376237).jpg'),
  ] },
  { match: 'veyron', photos: [
    ext('Silver Bugatti Veyron front left corner.jpg'),
    ext('Blue Bugatti Veyron front.JPG'),
    ext('Bugatti Veyron 16.4 2.JPG'),
    ext('Bugatti Veyron in Berlin.jpg'),
    ext('Bugatti Veyron Super Sport side view.jpg'),
    ext('White Bugatti Veyron Grand Sport with Red Interior (11975814436).jpg'),
    int('Bugatti Veyron 2008 - 008.JPG'),
  ] },
  // ---- Lamborghini ----
  { match: 'huracan', photos: [
    ext('Orange Lamborghini Huracan Performante.jpg'),
    ext('2022 Lamborghini Huracan Tecnica Front.jpg'),
    ext('Lamborghini Huracan Evo IMG 3679.jpg'),
    ext('Lamborghini Huracan LP 610-4 in Bianco Isis.jpg'),
    ext('Lamborghini Huracan EVO RWD 2020 front.jpg'),
    ext('Lamborghini Huracan Performante (27473584488).jpg'),
  ] },
  { match: 'revuelto', photos: [
    ext('Lamborghini Revuelto.jpg'),
    ext('2023 Lamborghini Revuelto.jpg'),
    ext('Lamborghini Revuelto front.jpg'),
  ] },
  { match: 'aventador', photos: [
    ext('Lamborghini Aventador S coupe IMG 2926.jpg'),
    ext('Lamborghini Aventador LP750-4 SV IMG 9103.jpg'),
    ext('Lamborghini Aventador LP 700-4 (8395891139).jpg'),
    ext('Lamborghini Aventador SVJ front.jpg'),
    int('Lamborghini Aventador interior.JPG'),
  ] },
  { match: 'urus', photos: [
    ext('Lamborghini Urus red (1).jpg'),
    ext('2019 Lamborghini Urus.jpg'),
    ext('Lamborghini Urus - front.jpg'),
    ext('Lamborghini Urus Performante front.jpg'),
  ] },
  // ---- Ferrari ----
  { match: 'f8', photos: [
    ext('Vue trois quarts avant F8 tributo.jpg'),
    ext('2020 Ferrari F8 Tributo S-A 3.9 Front.jpg'),
    ext('2020 Ferrari F8 Tributo S-A 3.9 Rear.jpg'),
    ext('Ferrari F8 Spider front.jpg'),
    ext('Ferrari F8 Tributo - Flickr - Alexandre Prévot (2).jpg'),
  ] },
  { match: '296', photos: [
    ext('Ferrari 296 GTB - Paris 08.jpg'),
    ext('Ferrari 296 GTB - Paris 04.jpg'),
    ext('Ferrari 296 GTB Assetto Fiorano front.png'),
    ext('2022 Ferrari 296 GTB 1.jpg'),
  ] },
  { match: 'roma', photos: [
    ext('2021 Ferrari Roma Front.jpg'),
    ext('Ferrari Roma-01.jpg'),
    ext('Ferrari Roma 2020 rear.jpg'),
  ] },
  // ---- McLaren / Maserati ----
  { match: '720s', photos: [
    ext('Maclaren 720S PA280972-PSD.jpg'),
    ext('McLaren 720S rear view.jpg'),
    ext('McLaren 720S Spider front.jpg'),
    ext('McLaren 720S (43604399365).jpg'),
    ext('McLaren 720S-doors open.jpg'),
  ] },
  { match: 'mc20', photos: [
    ext('Maserati MC20 (7BA-MC30) front.jpg'),
    ext('Maserati MC20 white.jpg'),
    ext('Maserati MC20 Cielo.jpg'),
  ] },
  // ---- Nissan (before generic 'amg gt') ----
  { match: 'gt-r', photos: [
    ext('Nissan GT-R Nismo (R35), 2022, rear.jpg'),
    ext('Nissan GT-R (R35) (5).jpg'),
    ext('2017 Nissan GT-R Nismo front.jpg'),
    int('The interior of Nissan GT-R (DBA-R35) MY2014.JPG'),
  ] },
  // ---- Porsche ----
  { match: '911', photos: [
    ext('Porsche 911 Turbo S Heckansicht.JPG'),
    ext('2023 Porsche 992 Turbo S in Peridot Metallic, front left.jpg'),
    ext('Porsche 992 Turbo S 1X7A0413.jpg'),
    ext('Porsche 992 GT3 Touring Package (5).jpg'),
    ext('Porsche 911 Carrera 4 GTS (992) front.jpg'),
    ext('Porsche 992 Turbo S Cabriolet (3).jpg'),
  ] },
  { match: 'panamera', photos: [
    ext('Porsche 971 Panamera Turbo S E-Hybrid IMG 2962.jpg'),
    ext('Porsche 972 Turbo E-Hybrid IMG 0445.jpg'),
    ext('2021 Porsche Panamera 4S front.jpg'),
    int('Porsche Panamera Sport Turismo Cockpit.JPG'),
  ] },
  { match: 'cayenne', photos: [
    ext('Porsche Cayenne Coupe 001.jpg'),
    ext('Porsche Cayenne Coupe 003.jpg'),
    ext('2023 Porsche Cayenne Turbo GT (4).jpg'),
    int('2018 Porsche Cayenne S Interior.jpg'),
  ] },
  // ---- Bentley ----
  { match: 'continental', photos: [
    ext('Bentley Continental GT III British Racing Green (10).jpg'),
    ext('Bentley Continental GT Speed 2024.jpg'),
    ext('Bentley Continental GT Convertible (5).jpg'),
    ext('Bentley Continental GT III British Racing Green (6).jpg'),
    ext('Bentley Continental GT W12 Mulliner (4).jpg'),
  ] },
  { match: 'bentayga', photos: [
    ext('Bentley Bentayga 2015 - rear.jpg'),
    ext('Bentley Bentayga EWB Azure front.jpg'),
    ext('2023 Bentley Bentayga S front.jpg'),
    ext('Bentley Bentayga S Black Edition front.jpg'),
  ] },
  // ---- Rolls-Royce ----
  { match: 'ghost', photos: [
    ext('Rolls-Royce Ghost II IAA 2021 1X7A0005.jpg'),
    ext('Rolls-Royce Ghost II Mandarin Navy Blue (4).jpg'),
    ext('Rolls-Royce Ghost Black Badge 2022.jpg'),
    ext('2021 Rolls-Royce Ghost LWB rear.jpg'),
  ] },
  { match: 'cullinan', photos: [
    ext('2023 Rolls-Royce Cullinan in light blue, front left.jpg'),
    ext('Rolls-Royce Cullinan Blue (1).jpg'),
    ext('Rolls-Royce Cullinan Black Badge.jpg'),
    ext('Rolls-Royce Cullinan Series II front.jpg'),
    int('Rolls Royce Cullinan Center Console.jpg'),
  ] },
  { match: 'spectre', photos: [
    ext('2024 Rolls-Royce Spectre in Midnight Sapphire over Silver, front left.jpg'),
    ext('Rolls-Royce Spectre 2024 white.jpg'),
    ext('Rolls-Royce Spectre - front.jpg'),
  ] },
  // ---- Aston Martin ----
  { match: 'db12', photos: [
    ext('Aston Martin DB12 03.jpg'),
    ext('Aston Martin DB12 Volante.jpg'),
    ext('Aston Martin DB12 front 3q.jpg'),
    ext('Aston Martin DB12 in Bright Yellow (53520054049).jpg'),
  ] },
  { match: 'vantage', photos: [
    ext('2018 Aston Martin Vantage Coupe (44400066584).jpg'),
    ext('Aston Martin Vantage V8 F1 Edition.jpg'),
    ext('Aston Martin Vantage 2024 front.jpg'),
    ext('2023 Aston Martin Vantage Roadster front.jpg'),
  ] },
  // ---- Tesla ----
  { match: 'plaid', photos: [
    ext('2023 Tesla Model S Plaid.jpg'),
    ext('Tesla Model S Plaid Autofrühling Ulm IMG 9278.jpg'),
    ext('2021 Tesla Model S Plaid front.jpg'),
    ext('Tesla Model S Plaid (2022) red front.jpg'),
  ] },
  // ---- Land Rover ----
  { match: 'range rover', photos: [
    ext('2023 Range Rover Sport 2.jpg'),
    ext('Land Rover Range Rover Sport L461 Varesine Blue (13).jpg'),
    ext('ALL-NEW RANGE ROVER SPORT REVEALED (8594176684).jpg'),
    ext('2022 Range Rover L460 front.jpg'),
    ext('Land Rover Range Rover P530 First Edition (L460) front.jpg'),
    ext('Range Rover Sport L461 (2022) front.jpg'),
  ] },
  // ---- Audi ----
  { match: 'r8', photos: [
    ext('Audi R8 4S Front.JPG'),
    ext('Audi R8 V10 Plus (4S) front.jpg'),
    ext('Audi R8 Spyder IMG 0723.jpg'),
    ext('2022 Audi R8 V10 Performance RWD front.jpg'),
    int('Audi R8 V10 interior.jpg'),
  ] },
  { match: 'rs6', photos: [
    ext('Audi RS6 Avant C8 IMG 3376.jpg'),
    ext('Audi RS6 Avant C8 at IAA 2019 IMG 0194.jpg'),
    ext('2020 Audi RS6 Avant C8 front.jpg'),
    ext('Audi RS6 Avant C8 Nogaro blue.jpg'),
    int('2019 Audi RS6 Avant 4.0 Interior.jpg'),
  ] },
  { match: 'rs3', photos: [
    ext('Audi RS3 8Y Auto Zuerich 2021 IMG 0214.jpg'),
    ext('Audi RS3 Sportback Daytonagrau.JPG'),
    ext('Audi RS3 Sedan 8Y front.jpg'),
    ext('2022 Audi RS3 Sportback front.jpg'),
  ] },
  { match: 'a4', photos: [
    ext('Audi A4 B9 Limousine 3.0 TDI quattro.JPG'),
    ext('Audi A4 B9 Limousine 3.0 TDI quattro Heck.JPG'),
    ext('2020 Audi A4 S line front.jpg'),
    int('2015 Audi A4 B9 2.0 TFSI quattro 185 kW S line Cockpit Interieur Innenraum.jpg'),
  ] },
  // ---- Mercedes everyday (MUST precede 'cla' / 'amg gt') ----
  { match: 'c-class', photos: [
    ext('Mercedes-Benz C 200 4MATIC AVANTGARDE (W206) front.jpg'),
    ext('Mercedes-Benz C200 AVANTGARDE (W206) rear.jpg'),
    ext('Mercedes-Benz C 300 AMG Line (W206) front.jpg'),
    ext('2022 Mercedes-Benz C300 AMG (W206) front.jpg'),
    int('Mercedes-Benz C 200 4MATIC AVANTGARDE (W206) interior.jpg'),
  ] },
  { match: 'e-class', photos: [
    ext('Mercedes-Benz E 400 e 4MATIC 1X7A1728.jpg'),
    ext('Mercedes-Benz E 400 e 4MATIC, IAA Open Space 2023, Munich (P1120186).jpg'),
    ext('Mercedes-Benz E-Class (W214) front.jpg'),
    ext('2024 Mercedes-Benz E300 AMG Line (W214) front.jpg'),
    int('Mercedes-AMG E 53 HYBRID 4MATIC+ (W214) interior.jpg'),
  ] },
  { match: 'a-class', photos: [
    ext('Mercedes-Benz A 180 (W177) front.jpg'),
    ext('Mercedes-Benz A180 (W177) front.jpg'),
    ext('Mercedes-Benz A 250 AMG Line (W177) front.jpg'),
    ext('2022 Mercedes-Benz A250 AMG Line front.jpg'),
  ] },
  // ---- Mercedes-AMG ----
  { match: 'g63', photos: [
    ext('Mercedes-AMG G 63 (W464) front.jpg'),
    ext('Mercedes-AMG G 63 (W464) rear.jpg'),
    ext('Mercedes-AMG G 63 Stronger Than Time Edition front.jpg'),
    ext('2022 Mercedes-AMG G63 W464 Night Package front.jpg'),
    int('Mercedes-Benz G350d (W464) interior.jpg'),
  ] },
  { match: 'c63', photos: [
    ext('Mercedes-AMG C 63 S E Performance (W206) front.jpg'),
    ext('2023 Mercedes-AMG C63 (W206).jpg'),
    ext('Mercedes-AMG C 63 S E Performance (W206) rear.jpg'),
    ext('2024 Mercedes-AMG C63 S E Performance front.jpg'),
    int('Mercedes-AMG C63 S E PERFORMANCE (W206) interior.jpg'),
  ] },
  { match: 's63', photos: [
    ext('Mercedes-AMG S 63 E Performance (W223) front.jpg'),
    ext('Mercedes-Benz S-Class 2020 W223.jpg'),
    ext('Mercedes-AMG S 63 4MATIC+ (Z223) front.jpg'),
    int('Mercedes-AMG S 63 E Performance (W223) interior.jpg'),
  ] },
  { match: 'cla', photos: [
    ext('Mercedes-AMG CLA 45 S 4MATIC+ Coupé (C118) front.jpg'),
    ext('Mercedes-AMG CLA 45 S 4MATIC+ Coupé (C118) rear.jpg'),
    ext('Mercedes-Benz C118 IMG 2673.jpg'),
    ext('Mercedes-AMG CLA 45 S (C118) white front.jpg'),
  ] },
  // ---- BMW ----
  { match: 'm3', photos: [
    ext('BMW G80 M3 Competition M xDrive Black Sapphire Metallic (1).jpg'),
    ext('BMW G80 M3 Competition Alpine White (12).jpg'),
    ext('BMW G80 M3 Competition Frozen Portimao Blue Metallic (1).jpg'),
    ext('BMW G80 M3 Competition Sao Paulo Yellow (4).jpg'),
    ext('BMW G80 M3 Competition Motegi Red (2).jpg'),
  ] },
  { match: 'm4', photos: [
    ext('2024 BMW M4 (G82) Competition IMG 9375.jpg'),
    ext('BMW G82 M4 Competition Tanzanite Blue Metallic (8).jpg'),
    ext('BMW G82 M4 Competition Aventurin Red Metallic (4).jpg'),
    ext('BMW M4 Competition Coupē (G82) rear.jpg'),
    ext('2024 BMW M4 (G82) Competition DSC 7856.jpg'),
    ext('BMW G82 M4 Competition M xDrive Convertible front.jpg'),
  ] },
  { match: 'm5', photos: [
    ext('2022 BMW M5 Competition Red F90.jpg'),
    ext('BMW M5 (F90) sedan (2).jpg'),
    ext('BMW M5 Competition F90 Carbon Black (3).jpg'),
    ext('BMW G90 M5 front.jpg'),
  ] },
  { match: '330', photos: [
    ext('BMW 330i G20 Black 3.jpg'),
    ext('2020 BMW 330i M Sport (G20) front.jpg'),
  ] },
  { match: '320', photos: [
    ext('BMW G20 320d M Sport Dravit Grey Metallic (2).jpg'),
    ext('2019 BMW 320d M Sport (G20) front.jpg'),
  ] },
  { match: '520', photos: [
    ext('BMW-G30.JPG'),
    ext('BMW G30 LCI 530i M Sport Carbon Black Metallic (4).jpg'),
    ext('2023 BMW 520i M Sport (G60) front.jpg'),
    ext('BMW G60 520i M Sport front.jpg'),
  ] },
  // ---- Volkswagen (specific Golf trims MUST precede generic 'golf') ----
  { match: 'golf r', photos: [
    ext('Volkswagen Golf VIII R IMG 4081.jpg'),
    ext('Volkswagen Golf VIII R 333 Limited Edition IMG 9486.jpg'),
    ext('VW Golf 8 R (8Y) front.jpg'),
    ext('Volkswagen Golf R Mk8 Lapiz Blue (2).jpg'),
  ] },
  { match: 'golf gti', photos: [
    ext('Volkswagen Golf GTI Mk8 Dolphin Gray Metallic (9).jpg'),
    ext('Volkswagen Golf 8 GTI IMG 1552.jpg'),
    ext('VW Golf GTI (VIII) – f 03012021.jpg'),
    ext('2022 VW Golf GTI Mk8 Tornado Red front.jpg'),
  ] },
  { match: 'golf', photos: [
    ext('Volkswagen Golf VIII Variant Facelift IMG 8874.jpg'),
    ext('Volkswagen Golf VIII GTE Facelift IMG 0059.jpg'),
    ext('2021 Volkswagen Golf 8 Style front.jpg'),
  ] },
  // ---- Ford ----
  { match: 'mustang', photos: [
    ext('2018 Ford Mustang GT (WM67 MWV).jpg'),
    ext('2019 Ford Mustang GT Blue.jpg'),
    ext('2020 Ford Mustang GT500 Shelby front.jpg'),
    ext('Ford Mustang GT (S550) Rapid Red (2).jpg'),
  ] },
  // ---- Super-SUVs ----
  { match: 'dbx', photos: [
    ext('Aston Martin DBX707 1X7A0203.jpg'),
    ext('Aston Martin DBX707 AMR23 Edition IMG 0007.jpg'),
    ext('ASTON MARTIN DBX707 China (2).jpg'),
  ] },
  { match: 'purosangue', photos: [
    ext('Ferrari Purosangue IMG 9554.jpg'),
    ext('Ferrari Purosangue IMG 2488.jpg'),
    ext('Ferrari Purosangue DSC 7783.jpg'),
    ext('2023 Ferrari Purosangue.jpg'),
  ] },
  { match: 'rs q8', photos: [
    ext('2020 Audi RS Q8 Front.jpg'),
    ext('2020 Audi RS Q8 Front End.jpg'),
    int('2020 Audi RS Q8 Interior.jpg'),
  ] },
  { match: 'bmw xm', photos: [
    ext('BMW G09 XM Cape York Green Metallic (20).jpg'),
    ext('BMW G09 XM Cape York Green Metallic (90).jpg'),
    ext('BMW G09 XM Cape York Green Metallic (62).jpg'),
  ] },
  { match: 'macan', photos: [
    ext('Porsche Macan GTS (Facelift) – f 10052021.jpg'),
    ext('Porsche Macan GTS (Facelift) – h 10052021.jpg'),
  ] },
  { match: 'gle', photos: [
    ext('Mercedes-AMG GLE 63 S 4MATIC IMG 3427.jpg'),
    ext('Mercedes-AMG GLE 63 S 4MATIC IMG 3430.jpg'),
  ] },
  // ---- Generic Mercedes-AMG GT (LAST) ----
  { match: 'amg gt', photos: [
    ext('Mercedes-AMG GT63 S 4MATIC+ (X290) front.jpg'),
    ext('Mercedes-AMG C192 1X7A0832.jpg'),
    ext('Mercedes-AMG C192 GT 63 S E Performance IMG 9255 (cropped).jpg'),
    ext('Mercedes-AMG GT 53 4MATIC+ (X290) front.jpg'),
    int('Mercedes-AMG GT63 S 4MATIC+ (X290) interior.jpg'),
  ] },
];

export function normalize(model: string): string {
  return model
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

// ---------------------------------------------------------------------------
// Colour detection.
//
// The displayed photo is a real, licensed image of a specific car in a specific
// colour — so the colour we ADVERTISE must come from the photo, not from a
// random palette. Wikimedia filenames almost always name the paint (e.g.
// "Blue Bugatti Veyron", "Alpine White", "Motegi Red"), so we read it straight
// from the filename. Keywords are ordered specific → generic; first match wins.
// ---------------------------------------------------------------------------

export interface DetectedColor {
  name: string;
  hex: string;
}

const COLOR_HEX: Record<string, string> = {
  White: '#EDEDEA',
  Black: '#0B0B0D',
  Silver: '#C9CDD2',
  Grey: '#6E7173',
  Red: '#B92B27',
  Blue: '#27508A',
  'Navy Blue': '#1F3A6E',
  'Light Blue': '#6FA8DC',
  Green: '#1E7A46',
  'British Racing Green': '#14452F',
  Yellow: '#E8B70C',
  Orange: '#E8730C',
  Gold: '#C5A572',
  Bronze: '#8C6A3F',
  Purple: '#6C3483',
};

// [keyword, colour name]. Specific finishes precede the plain colour words so
// e.g. "Black Sapphire" reads as Black, "Midnight Sapphire" as Blue.
const COLOR_KEYWORDS: [string, string][] = [
  ['british racing green', 'British Racing Green'],
  ['black sapphire', 'Black'],
  ['midnight sapphire', 'Blue'],
  ['carbon black', 'Black'],
  ['alpine white', 'White'],
  ['mandarin navy', 'Navy Blue'],
  ['cape york green', 'Green'],
  ['sao paulo yellow', 'Yellow'],
  ['bright yellow', 'Yellow'],
  ['dolphin gray', 'Grey'],
  ['rapid red', 'Red'],
  ['motegi red', 'Red'],
  ['tornado red', 'Red'],
  ['navy', 'Navy Blue'],
  ['light blue', 'Light Blue'],
  ['lapiz', 'Blue'],
  ['nogaro', 'Blue'],
  ['tanzanite', 'Blue'],
  ['portimao', 'Blue'],
  ['varesine', 'Blue'],
  ['sapphire', 'Blue'],
  ['peridot', 'Green'],
  ['aventurin', 'Red'],
  ['bianco', 'White'],
  ['daytonagrau', 'Grey'],
  ['dravit', 'Grey'],
  // Plain colour words (generic, lowest priority)
  ['silver', 'Silver'],
  ['white', 'White'],
  ['black', 'Black'],
  ['grey', 'Grey'],
  ['gray', 'Grey'],
  ['grau', 'Grey'],
  ['green', 'Green'],
  ['yellow', 'Yellow'],
  ['orange', 'Orange'],
  ['bronze', 'Bronze'],
  ['gold', 'Gold'],
  ['purple', 'Purple'],
  ['viola', 'Purple'],
  ['red', 'Red'],
  ['blue', 'Blue'],
  ['blau', 'Blue'],
];

/** Read the paint colour from a photo URL/filename, or null if undetectable. */
export function detectColor(url: string): DetectedColor | null {
  let name = '';
  try {
    name = decodeURIComponent(url);
  } catch {
    name = url;
  }
  const hay = name.toLowerCase();
  for (const [kw, colour] of COLOR_KEYWORDS) {
    if (hay.includes(kw)) {
      return { name: colour, hex: COLOR_HEX[colour] ?? '' };
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Body-style / edition detection.
//
// When a filename names no paint colour we still want the two cars of a model
// to read differently. Wikimedia filenames often name the body style or special
// edition (Spider, Roadster, Coupé, Pur Sport, AMR23 …) — an HONEST descriptor
// read straight from the actual photo. Ordered specific → generic; first wins.
// ---------------------------------------------------------------------------
const VARIANT_KEYWORDS: [string, string][] = [
  ['pur sport', 'Pur Sport'],
  ['super sport', 'Super Sport'],
  ['grand sport', 'Grand Sport'],
  ['black badge', 'Black Badge'],
  ['amr23', 'AMR23 Edition'],
  ['mulliner', 'Mulliner'],
  ['performante', 'Performante'],
  ['svj', 'SVJ'],
  ['lp750-4 sv', 'SV'],
  ['ultimae', 'Ultimae'],
  ['spyder', 'Spyder'],
  ['spider', 'Spider'],
  ['roadster', 'Roadster'],
  ['volante', 'Volante'],
  ['convertible', 'Convertible'],
  ['cabriolet', 'Cabriolet'],
  ['cielo', 'Cielo'],
  ['gte', 'GTE'],
  ['variant', 'Estate'],
  ['avant', 'Avant'],
  ['sportback', 'Sportback'],
  ['shelby', 'Shelby'],
  ['gt500', 'GT500'],
  ['coupe', 'Coupé'],
  ['e-hybrid', 'E-Hybrid'],
  ['4s', '4S'],
];

/**
 * Read a body-style / edition descriptor from a photo, skipping any token that
 * already appears in the model name (so we never label a car with what its name
 * already says). Returns null when nothing distinctive is found.
 */
export function detectVariant(url: string, model: string): string | null {
  let name = '';
  try {
    name = decodeURIComponent(url);
  } catch {
    name = url;
  }
  const hay = name.toLowerCase();
  const modelLc = model.toLowerCase();
  for (const [kw, label] of VARIANT_KEYWORDS) {
    if (hay.includes(kw) && !modelLc.includes(label.toLowerCase())) {
      return label;
    }
  }
  return null;
}

/**
 * The exterior photo a card/gallery shows FIRST for a given vehicle. Mirrors the
 * deterministic seeding in VehicleImage so the advertised colour always matches
 * the picture actually on screen.
 */
export function primaryExteriorFor(vehicleId: string, model: string): Photo | undefined {
  const ex = exteriorsFor(model);
  if (!ex.length) return undefined;
  return ex[hashId(vehicleId) % ex.length];
}

/** Detected colour for a specific vehicle, derived from its primary photo. */
export function detectColorForVehicle(vehicleId: string, model: string): DetectedColor | null {
  const p = primaryExteriorFor(vehicleId, model);
  return p ? detectColor(p.url) : null;
}

/** All known photos for a model (exterior first), or [] if none match. */
export function galleryFor(model: string): Photo[] {
  const m = normalize(model);
  return PHOTO_RULES.find((rule) => m.includes(rule.match))?.photos ?? [];
}

/** Exterior photos only, for cards. */
export function exteriorsFor(model: string): Photo[] {
  const all = galleryFor(model);
  const ex = all.filter((p) => p.kind === 'exterior');
  return ex.length ? ex : all;
}

/** Interior photos only, for the hover reveal on cards. */
export function interiorsFor(model: string): Photo[] {
  return galleryFor(model).filter((p) => p.kind === 'interior');
}

// Stable hash so each car id produces deterministic, repeatable variety.
export function hashId(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
