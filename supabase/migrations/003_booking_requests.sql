-- Structured store for guest reservation requests (lead capture).
--
-- The public site posts to /api/bookings/request using the Supabase service
-- key. Before this table existed those leads fell back into contact_messages;
-- this gives them a first-class home with a status workflow the admin panel
-- can manage (new → contacted → confirmed → completed / cancelled).

create table if not exists public.booking_requests (
  id              uuid primary key default gen_random_uuid(),
  vehicle_id      text not null,
  model           text not null,
  pickup_date     date not null,
  return_date     date not null,
  pickup_time     text,
  passengers      integer not null default 1,
  estimate_pence  integer not null default 0,
  customer_name   text not null,
  customer_email  text not null,
  customer_phone  text not null,
  notes           text,
  status          text not null default 'new'
                    check (status in ('new','contacted','confirmed','completed','cancelled')),
  -- Deposit / payment (Stripe Checkout)
  deposit_pence            integer,
  payment_status           text not null default 'unpaid'
                             check (payment_status in ('unpaid','pending','paid','refunded')),
  stripe_session_id        text,
  stripe_payment_intent_id text,
  paid_at                  timestamptz,
  -- Secret capability token for the customer document-upload link
  upload_token             uuid not null default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- If the table already exists from an earlier run, make sure the payment
-- columns are present too (safe to re-run).
alter table public.booking_requests add column if not exists deposit_pence            integer;
alter table public.booking_requests add column if not exists payment_status           text not null default 'unpaid';
alter table public.booking_requests add column if not exists stripe_session_id        text;
alter table public.booking_requests add column if not exists stripe_payment_intent_id text;
alter table public.booking_requests add column if not exists paid_at                  timestamptz;
alter table public.booking_requests add column if not exists upload_token             uuid not null default gen_random_uuid();

create index if not exists booking_requests_status_idx  on public.booking_requests (status);
create index if not exists booking_requests_created_idx on public.booking_requests (created_at desc);

alter table public.booking_requests enable row level security;

-- Service role only. Guests never read these; they are inserted by the server
-- API (service key) and read/updated by admins through service-role endpoints.
drop policy if exists "service role manages booking requests" on public.booking_requests;
create policy "service role manages booking requests"
  on public.booking_requests for all using (auth.role() = 'service_role');

-- Reuse the shared updated_at trigger function from the initial schema.
drop trigger if exists booking_requests_updated_at on public.booking_requests;
create trigger booking_requests_updated_at
  before update on public.booking_requests
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Customer-submitted documents for a reservation (licence / insurance / ID).
-- Files live in the existing private "booking-documents" storage bucket; this
-- table tracks them and the admin review status. Customers submit via a
-- tokenised link (no account); only the service role reads/updates here.
-- ---------------------------------------------------------------------------
create table if not exists public.reservation_documents (
  id            uuid primary key default gen_random_uuid(),
  request_id    uuid not null references public.booking_requests(id) on delete cascade,
  document_type text not null check (document_type in ('driving_licence','insurance','photo_id')),
  storage_path  text not null,
  status        text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at    timestamptz not null default now(),
  reviewed_at   timestamptz
);

create index if not exists reservation_documents_request_idx on public.reservation_documents (request_id);

alter table public.reservation_documents enable row level security;
drop policy if exists "service role manages reservation documents" on public.reservation_documents;
create policy "service role manages reservation documents"
  on public.reservation_documents for all using (auth.role() = 'service_role');
