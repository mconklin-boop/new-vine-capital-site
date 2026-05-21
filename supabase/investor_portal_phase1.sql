-- New Vine Capital Investor Portal Phase 1 admin schema
-- Run this in Supabase SQL Editor after the original supabase/schema.sql file.

create extension if not exists "pgcrypto";

create table if not exists public.investor_deals (
  id text primary key,
  name text not null,
  location text not null,
  investment_type text not null,
  target_return text not null,
  minimum_investment numeric not null default 0,
  total_raise numeric not null default 0,
  amount_funded numeric not null default 0,
  status text not null default 'Open' check (status in ('Open', 'Closing Soon', 'Fully Subscribed')),
  term text,
  preferred_return text,
  ltv text,
  equity_multiple text,
  summary text,
  business_plan text,
  sponsor_notes text,
  timeline jsonb not null default '[]'::jsonb,
  capital_stack jsonb not null default '[]'::jsonb,
  sources_uses jsonb not null default '[]'::jsonb,
  sensitivity text,
  hero_image_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.investor_deal_documents (
  id uuid primary key default gen_random_uuid(),
  deal_id text references public.investor_deals(id) on delete cascade,
  name text not null,
  type text not null,
  storage_path text,
  display_date text,
  created_at timestamptz not null default now()
);

create table if not exists public.investor_deal_updates (
  id uuid primary key default gen_random_uuid(),
  deal_id text references public.investor_deals(id) on delete cascade,
  title text not null,
  update_date text not null,
  summary text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.investor_commitments (
  id uuid primary key default gen_random_uuid(),
  investor_id uuid references public.portal_profiles(id) on delete set null,
  deal_id text references public.investor_deals(id) on delete set null,
  amount numeric not null,
  funding_method text not null,
  accreditation_confirmed boolean not null default false,
  status text not null default 'Received' check (status in ('Received', 'Approved', 'Pending Funding', 'Funded', 'Cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.investor_distributions (
  id uuid primary key default gen_random_uuid(),
  investor_id uuid references public.portal_profiles(id) on delete set null,
  deal_id text references public.investor_deals(id) on delete set null,
  investment text not null,
  distribution_date text not null,
  amount numeric not null default 0,
  type text not null,
  status text not null default 'Projected' check (status in ('Projected', 'Paid', 'Held', 'Cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.investor_portal_notifications (
  id uuid primary key default gen_random_uuid(),
  investor_id uuid references public.portal_profiles(id) on delete cascade,
  type text not null,
  message text not null,
  display_date text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists investor_deals_status_idx on public.investor_deals(status);
create index if not exists investor_documents_deal_idx on public.investor_deal_documents(deal_id);
create index if not exists investor_updates_deal_idx on public.investor_deal_updates(deal_id);
create index if not exists investor_commitments_investor_idx on public.investor_commitments(investor_id, created_at desc);
create index if not exists investor_distributions_investor_idx on public.investor_distributions(investor_id, created_at desc);

alter table public.investor_deals enable row level security;
alter table public.investor_deal_documents enable row level security;
alter table public.investor_deal_updates enable row level security;
alter table public.investor_commitments enable row level security;
alter table public.investor_distributions enable row level security;
alter table public.investor_portal_notifications enable row level security;

-- The Vercel server uses SUPABASE_SERVICE_ROLE_KEY for controlled admin and investor reads/writes.
-- Keep uploaded investor documents in the existing private portal-documents storage bucket.
