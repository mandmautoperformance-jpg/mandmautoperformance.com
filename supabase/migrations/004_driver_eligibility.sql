-- Driver eligibility capture for reservation requests.
--
-- We age-gate the fleet (supercars/exotics require older drivers + longer
-- licence tenure), so each request records the eligibility evidence. For data
-- minimisation we deliberately DO NOT store the full driving-licence number —
-- only the date of birth, the test-pass date, the boolean check outcome and a
-- masked reference are kept. The licence number itself is verified in-flight
-- and discarded.

alter table public.booking_requests
  add column if not exists date_of_birth        date,
  add column if not exists licence_held_since   date,
  add column if not exists driver_age           integer,
  add column if not exists licence_years        integer,
  add column if not exists eligibility_passed   boolean,
  add column if not exists licence_verified     boolean default false,
  add column if not exists licence_check_ref    text,
  add column if not exists age_confirmed_at     timestamptz;

comment on column public.booking_requests.licence_check_ref is
  'Masked licence reference (surname block + last 2 chars). Never the full number.';
