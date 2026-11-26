-- Portal CRM: contacts, activity timeline and follow-ups (replaces HubSpot).
-- Run AFTER deal_submissions.sql, in the Supabase SQL editor. Safe to run more than once.

create table if not exists public.crm_contacts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  email text not null unique,
  name text not null,
  phone text,
  company text,
  contact_type text not null default 'Borrower', -- Borrower, Broker, Wholesaler, Business, Investor, Partner, Other
  stage text not null default 'Lead',            -- Lead, Contacted, Active, Client, Nurture, Inactive
  source text,
  next_follow_up date,
  follow_up_note text,
  notes text,
  last_activity_at timestamptz default now()
);

create table if not exists public.crm_activities (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  contact_id uuid not null references public.crm_contacts(id) on delete cascade,
  activity_type text not null,  -- note, call, email, meeting, deal_submitted, call_requested, status_change, stage_change
  summary text not null,
  body text,
  metadata jsonb not null default '{}'::jsonb,
  created_by text
);

alter table public.deal_submissions add column if not exists contact_id uuid references public.crm_contacts(id) on delete set null;
alter table public.investor_call_requests add column if not exists contact_id uuid references public.crm_contacts(id) on delete set null;

create index if not exists crm_contacts_stage_idx on public.crm_contacts(stage, last_activity_at desc);
create index if not exists crm_contacts_follow_up_idx on public.crm_contacts(next_follow_up);
create index if not exists crm_activities_contact_idx on public.crm_activities(contact_id, created_at desc);
create index if not exists deal_submissions_contact_idx on public.deal_submissions(contact_id);
create index if not exists investor_call_requests_contact_idx on public.investor_call_requests(contact_id);

alter table public.crm_contacts enable row level security;
alter table public.crm_activities enable row level security;
-- No RLS policies on purpose: only the server (service role key) reads and writes these tables.

-- Backfill contacts from any deals and call requests already saved.
insert into public.crm_contacts (email, name, phone, company, contact_type, source, created_at, last_activity_at)
select distinct on (lower(contact_email)) lower(contact_email), contact_name, contact_phone, company_name,
  case submitter_role when 'broker' then 'Broker' when 'wholesaler' then 'Wholesaler' else
    case when product in ('equipment','loc','fuel','credit-stacking') then 'Business' else 'Borrower' end end,
  'Deal submission', created_at, created_at
from public.deal_submissions order by lower(contact_email), created_at
on conflict (email) do nothing;

insert into public.crm_contacts (email, name, phone, company, contact_type, source, created_at, last_activity_at)
select distinct on (lower(email)) lower(email), name, phone, entity_name, 'Investor', 'Investor call request', created_at, created_at
from public.investor_call_requests order by lower(email), created_at
on conflict (email) do nothing;

update public.deal_submissions d set contact_id = c.id from public.crm_contacts c
where d.contact_id is null and c.email = lower(d.contact_email);
update public.investor_call_requests r set contact_id = c.id from public.crm_contacts c
where r.contact_id is null and c.email = lower(r.email);
