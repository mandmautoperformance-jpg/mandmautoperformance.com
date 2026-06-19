-- M&M Auto Performance — Initial Schema
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New query → Paste → Run)

-- ============================================================
-- VEHICLES
-- ============================================================
create table if not exists public.vehicles (
  id            uuid primary key default gen_random_uuid(),
  model         text not null,
  registration  text not null unique,
  category      text not null check (category in ('supercar', 'luxury', 'suv', 'sports', 'electric')),
  daily_rate_pence integer not null check (daily_rate_pence > 0),
  location      text not null default 'St Albans, Hertfordshire',
  is_available  boolean not null default true,
  image_url     text,
  specs         jsonb not null default '{}',
  created_at    timestamptz not null default now()
);

alter table public.vehicles enable row level security;
-- Public read for fleet browsing
create policy "anyone can view available vehicles"
  on public.vehicles for select using (is_available = true);
-- Service role manages all
create policy "service role manages vehicles"
  on public.vehicles for all using (auth.role() = 'service_role');

-- ============================================================
-- BOOKINGS
-- ============================================================
create table if not exists public.bookings (
  id                       uuid primary key default gen_random_uuid(),
  user_id                  uuid not null references auth.users(id) on delete cascade,
  vehicle_id               uuid not null references public.vehicles(id),
  pickup_date              date not null,
  return_date              date not null,
  pickup_time              text not null default '09:00',
  return_time              text,
  pickup_location          text not null,
  return_location          text,
  passengers               integer default 1,
  conversation_id          uuid,
  total_cost_pence         integer,
  status                   text not null default 'pending_verification'
                             check (status in ('pending_verification','confirmed','active','completed','cancelled')),
  stripe_payment_intent_id text,
  notes                    text,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now(),
  check (return_date >= pickup_date)
);

alter table public.bookings enable row level security;
create policy "users manage own bookings"
  on public.bookings for all using (auth.uid() = user_id);
create policy "service role manages all bookings"
  on public.bookings for all using (auth.role() = 'service_role');

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger bookings_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();

-- ============================================================
-- CONVERSATIONS (MIA AI chat)
-- ============================================================
create table if not exists public.conversations (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  booking_id uuid references public.bookings(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.conversations enable row level security;
create policy "users manage own conversations"
  on public.conversations for all using (auth.uid() = user_id);
create policy "service role manages conversations"
  on public.conversations for all using (auth.role() = 'service_role');

-- ============================================================
-- MESSAGES (chat history)
-- ============================================================
create table if not exists public.messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  role            text not null check (role in ('user', 'assistant')),
  content         text not null,
  tokens_used     integer default 0,
  created_at      timestamptz not null default now()
);

alter table public.messages enable row level security;
create policy "users read own messages"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id and c.user_id = auth.uid()
    )
  );
create policy "service role manages messages"
  on public.messages for all using (auth.role() = 'service_role');

-- ============================================================
-- BOOKING DOCUMENTS
-- ============================================================
create table if not exists public.booking_documents (
  id             uuid primary key default gen_random_uuid(),
  booking_id     uuid not null references public.bookings(id) on delete cascade,
  user_id        uuid not null references auth.users(id) on delete cascade,
  document_type  text not null check (document_type in ('driving_licence', 'insurance', 'photo_id')),
  storage_path   text not null,
  extracted_text text,
  verified       boolean not null default false,
  verified_by    uuid references auth.users(id),
  verified_at    timestamptz,
  created_at     timestamptz not null default now()
);

alter table public.booking_documents enable row level security;
create policy "users manage own documents"
  on public.booking_documents for all using (auth.uid() = user_id);
create policy "service role manages documents"
  on public.booking_documents for all using (auth.role() = 'service_role');

-- ============================================================
-- CONTACT MESSAGES
-- ============================================================
create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  subject    text not null,
  message    text not null,
  status     text not null default 'unread' check (status in ('unread', 'read', 'replied')),
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;
-- Only service role reads contact messages (admin only)
create policy "service role manages contact messages"
  on public.contact_messages for all using (auth.role() = 'service_role');
-- Allow inserts from anon (public contact form)
create policy "anyone can submit contact form"
  on public.contact_messages for insert with check (true);

-- ============================================================
-- ADMIN CONFIG
-- ============================================================
create table if not exists public.admin_config (
  key        text primary key,
  value      jsonb not null default '{}',
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

alter table public.admin_config enable row level security;
create policy "service role manages admin config"
  on public.admin_config for all using (auth.role() = 'service_role');

-- ============================================================
-- STORAGE BUCKET: booking-documents
-- ============================================================
insert into storage.buckets (id, name, public)
values ('booking-documents', 'booking-documents', false)
on conflict (id) do nothing;

create policy "users upload own documents"
  on storage.objects for insert
  with check (bucket_id = 'booking-documents' and auth.uid() is not null);

create policy "users read own documents"
  on storage.objects for select
  using (bucket_id = 'booking-documents' and auth.uid() is not null);

create policy "service role manages document storage"
  on storage.objects for all
  using (bucket_id = 'booking-documents' and auth.role() = 'service_role');

-- ============================================================
-- SEED: Sample fleet vehicles
-- ============================================================
insert into public.vehicles (model, registration, category, daily_rate_pence, location, specs) values
  ('Lamborghini Huracán EVO', 'MM01 LAM', 'supercar', 150000, 'St Albans, Hertfordshire',
   '{"engine":"5.2L V10","power":"640hp","0_to_60":"2.9s","top_speed":"202mph","transmission":"7-speed DCT"}'),
  ('Ferrari 488 GTB', 'MM02 FER', 'supercar', 175000, 'St Albans, Hertfordshire',
   '{"engine":"3.9L Twin-Turbo V8","power":"660hp","0_to_60":"3.0s","top_speed":"205mph","transmission":"7-speed DCT"}'),
  ('McLaren 720S', 'MM03 MCL', 'supercar', 165000, 'St Albans, Hertfordshire',
   '{"engine":"4.0L Twin-Turbo V8","power":"720hp","0_to_60":"2.9s","top_speed":"212mph","transmission":"7-speed SSG"}'),
  ('Porsche 911 GT3', 'MM04 POR', 'sports', 85000, 'St Albans, Hertfordshire',
   '{"engine":"4.0L Flat-6","power":"510hp","0_to_60":"3.4s","top_speed":"198mph","transmission":"7-speed PDK"}'),
  ('Rolls-Royce Ghost', 'MM05 RR', 'luxury', 120000, 'St Albans, Hertfordshire',
   '{"engine":"6.75L Twin-Turbo V12","power":"563hp","0_to_60":"4.8s","top_speed":"155mph","transmission":"8-speed auto"}'),
  ('Bentley Continental GT', 'MM06 BEN', 'luxury', 95000, 'St Albans, Hertfordshire',
   '{"engine":"6.0L W12","power":"626hp","0_to_60":"3.6s","top_speed":"207mph","transmission":"8-speed DCT"}')
on conflict (registration) do nothing;
