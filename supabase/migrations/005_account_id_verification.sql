-- User account-level identity verification uploads
-- Separate from booking_documents — these are pre-booking account docs
-- Run in Supabase SQL Editor: Dashboard → SQL Editor → New query → Paste → Run

create table if not exists public.user_id_uploads (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  doc_type            text not null check (doc_type in ('driving_licence', 'photo_id')),
  storage_path        text not null,
  verification_status text not null default 'pending'
                        check (verification_status in ('pending', 'approved', 'rejected')),
  uploaded_at         timestamptz not null default now(),
  reviewed_at         timestamptz,
  reviewer_notes      text,
  unique (user_id, doc_type)
);

alter table public.user_id_uploads enable row level security;

-- Users can see and insert their own documents
create policy "users view own id uploads"
  on public.user_id_uploads for select
  using (auth.uid() = user_id);

create policy "users insert own id uploads"
  on public.user_id_uploads for insert
  with check (auth.uid() = user_id);

-- Service role (used by API routes) can do everything
create policy "service role manages all id uploads"
  on public.user_id_uploads for all
  using (auth.role() = 'service_role');

-- Also ensure the booking-documents storage bucket exists (run if it doesn't):
-- insert into storage.buckets (id, name, public) values ('booking-documents', 'booking-documents', false)
-- on conflict (id) do nothing;
