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
  ] },
  { match: 'cayenne', photos: [
    ext('Porsche Cayenne Coupe 001.jpg'),
    ext('Porsche Cayenne Coupe 003.jpg'),
    ext('2023 Porsche Cayenne Turbo GT (4).jpg'),
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
  ] },
  { match: 'spectre', photos: [
    ext('2024 Rolls-Royce Spectre in Midnight Sapphire over Silver, front left.jpg'),
    ext('Rolls-Royce Spectre 2024 white.jpg'),
    ext('Rolls-Royce Spectre - front.jpg'),
  ] },
  // ---- Aston Martin ----
  { match: 'db12', photos: [
    ext('Aston Martin DB12 04.jpg'),
    ext('Aston Martin DB12 Volante.jpg'),
    ext('Aston Martin DB12 03.jpg'),
    ext('Aston Martin DB12 front 3q.jpg'),
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
  ] },
  { match: 'rs6', photos: [
    ext('Audi RS6 Avant C8 IMG 3376.jpg'),
    ext('Audi RS6 Avant C8 at IAA 2019 IMG 0194.jpg'),
    ext('2020 Audi RS6 Avant C8 front.jpg'),
    ext('Audi RS6 Avant C8 Nogaro blue.jpg'),
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
  ] },
  // ---- Mercedes everyday (MUST precede 'cla' / 'amg gt') ----
  { match: 'c-class', photos: [
    ext('Mercedes-Benz C 200 4MATIC AVANTGARDE (W206) front.jpg'),
    ext('Mercedes-Benz C200 AVANTGARDE (W206) rear.jpg'),
    ext('Mercedes-Benz C 300 AMG Line (W206) front.jpg'),
    ext('2022 Mercedes-Benz C300 AMG (W206) front.jpg'),
  ] },
  { match: 'e-class', photos: [
    ext('Mercedes-Benz E 400 e 4MATIC 1X7A1728.jpg'),
    ext('Mercedes-Benz E 400 e 4MATIC, IAA Open Space 2023, Munich (P1120186).jpg'),
    ext('Mercedes-Benz E-Class (W214) front.jpg'),
    ext('2024 Mercedes-Benz E300 AMG Line (W214) front.jpg'),
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
  ] },
  { match: 'c63', photos: [
    ext('Mercedes-AMG C 63 S E Performance (W206) front.jpg'),
    ext('2023 Mercedes-AMG C63 (W206).jpg'),
    ext('Mercedes-AMG C 63 S E Performance (W206) rear.jpg'),
    ext('2024 Mercedes-AMG C63 S E Performance front.jpg'),
  ] },
  { match: 's63', photos: [
    ext('Mercedes-AMG S 63 E Performance (W223) front.jpg'),
    ext('Mercedes-Benz S-Class 2020 W223.jpg'),
    ext('Mercedes-AMG S 63 4MATIC+ (Z223) front.jpg'),
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
    ext('BMW G20 320d M Sport Dravit Grey Metallic (2).jpg'),
    ext('2020 BMW 330i M Sport (G20) front.jpg'),
  ] },
  { match: '320', photos: [
    ext('BMW G20 320d M Sport Dravit Grey Metallic (2).jpg'),
    ext('BMW 330i G20 Black 3.jpg'),
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
  // ---- Generic Mercedes-AMG GT (LAST) ----
  { match: 'amg gt', photos: [
    ext('Mercedes-AMG GT63 S 4MATIC+ (X290) front.jpg'),
    ext('Mercedes-AMG C192 1X7A0832.jpg'),
    ext('Mercedes-AMG C192 GT 63 S E Performance IMG 9255 (cropped).jpg'),
    ext('Mercedes-AMG GT 53 4MATIC+ (X290) front.jpg'),
  ] },
];

export function normalize(model: string): string {
  return model
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
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

// Stable hash so each car id produces deterministic, repeatable variety.
export function hashId(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
