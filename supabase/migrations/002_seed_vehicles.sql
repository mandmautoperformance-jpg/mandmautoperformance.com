-- M&M Auto Performance - Seed Data
-- Initial vehicle inventory for premium AI rental platform

INSERT INTO vehicles (model, registration, category, daily_rate_pence, location, is_available, image_url, specs) VALUES
  (
    'Porsche 911 Turbo',
    'M24 POR',
    'supercar',
    50000,
    'London, SW1A 1AA',
    TRUE,
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
    '{
      "engine": "3.8L Twin-Turbo Flat-6",
      "power": "580 hp",
      "0_60": "2.9s",
      "top_speed": "195 mph",
      "year": 2024,
      "seats": 4
    }'::jsonb
  ),
  (
    'Mercedes-AMG GT 63S',
    'M24 MER',
    'supercar',
    45000,
    'London, E1 6AN',
    TRUE,
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800',
    '{
      "engine": "4.0L Twin-Turbo V8",
      "power": "630 hp",
      "0_60": "3.2s",
      "top_speed": "198 mph",
      "year": 2024,
      "seats": 4
    }'::jsonb
  ),
  (
    'Aston Martin DB12',
    'M24 AST',
    'luxury',
    25000,
    'London, W1K 1AA',
    TRUE,
    'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=800',
    '{
      "engine": "5.2L Twin-Turbo V12",
      "power": "680 hp",
      "0_60": "3.2s",
      "top_speed": "187 mph",
      "year": 2024,
      "seats": 4
    }'::jsonb
  ),
  (
    'BMW M440i xDrive',
    'M24 BMW',
    'sports',
    15000,
    'London, EC1A 1BB',
    TRUE,
    'https://images.unsplash.com/photo-1611339555312-e607c04352fd?w=800',
    '{
      "engine": "3.0L Twin-Turbo Inline-6",
      "power": "382 hp",
      "0_60": "4.5s",
      "top_speed": "155 mph",
      "year": 2024,
      "seats": 5
    }'::jsonb
  ),
  (
    'Lamborghini Revuelto',
    'M24 LAM',
    'exotic',
    55000,
    'Hertfordshire, WD1 1AA',
    TRUE,
    'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800',
    '{
      "engine": "6.2L V12 + Electric Motor",
      "power": "1001 hp",
      "0_60": "2.5s",
      "top_speed": "217 mph",
      "year": 2024,
      "seats": 2
    }'::jsonb
  ),
  (
    'Range Rover Sport Dynamic',
    'M24 RNR',
    'luxury',
    12000,
    'London, N1 1AA',
    TRUE,
    'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800',
    '{
      "engine": "3.0L Twin-Turbo V6",
      "power": "395 hp",
      "0_60": "5.0s",
      "top_speed": "152 mph",
      "year": 2024,
      "seats": 5
    }'::jsonb
  ),
  (
    'Tesla Model S Plaid',
    'M24 TSL',
    'sports',
    18000,
    'London, SW1 1AA',
    TRUE,
    'https://images.unsplash.com/photo-1560958089-b8a46dd52d12?w=800',
    '{
      "engine": "Tri-Motor Electric",
      "power": "1020 hp",
      "0_60": "1.99s",
      "top_speed": "200 mph",
      "year": 2024,
      "seats": 5,
      "features": ["Autopilot", "Supercharging", "Glass Roof"]
    }'::jsonb
  ),
  (
    'Rolls-Royce Ghost',
    'M24 RRS',
    'luxury',
    35000,
    'London, W1 1AA',
    TRUE,
    'https://images.unsplash.com/photo-1476720869186-8f7e4a1c8c64?w=800',
    '{
      "engine": "6.75L Twin-Turbo V12",
      "power": "563 hp",
      "0_60": "4.8s",
      "top_speed": "155 mph",
      "year": 2024,
      "seats": 5,
      "features": ["Bespoke Interior", "Night Vision", "Touchless Control"]
    }'::jsonb
  );
