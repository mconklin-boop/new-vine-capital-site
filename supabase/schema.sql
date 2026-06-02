-- New Vine Capital Investor Portal schema
-- Run this once in the Supabase SQL Editor before using the production portal.

create extension if not exists "pgcrypto";

create table if not exists public.portal_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text,
  phone text,
  role text not null default 'Pending Investor' check (role in ('Admin', 'Approved Investor', 'Pending Investor', 'Advisor / Referral Partner')),
  status text not null default 'Pending Investor',
  entity_name text,
  accredited_status text default 'Under review',
  investor_type text default 'Not specified',
  estimated_range text default 'Not specified',
  relationship_source text default 'Not specified',
  onboarding_status text default 'In review',
  documents_completed text default 'Pending',
  compliance_review_status text default 'Pending review',
  deactivated boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.investor_deals (
  id text primary key,
  name text not null,
  location text,
  investment_type text not null default 'Private Credit',
  categories jsonb not null default '["Private Credit"]'::jsonb,
  target_return text default 'Subject to offering documents',
  minimum_investment numeric not null default 0,
  total_raise numeric not null default 0,
  amount_funded numeric not null default 0,
  status text not null default 'Pending Review',
  term text default 'Subject to offering documents',
  distribution_frequency text default 'Subject to offering documents',
  preferred_return text default 'N/A',
  ltv text default 'N/A',
  equity_multiple text default 'N/A',
  summary text,
  strategy_description text,
  business_plan text,
  sponsor_notes text,
  timeline jsonb not null default '[]'::jsonb,
  capital_stack jsonb not null default '[]'::jsonb,
  sources_uses jsonb not null default '[]'::jsonb,
  sensitivity text,
  why_investors_like_this jsonb not null default '[]'::jsonb,
  review_process jsonb not null default '[]'::jsonb,
  risk_notes jsonb not null default '[]'::jsonb,
  exclusivity_notes jsonb not null default '[]'::jsonb,
  visual_type text default 'capital-stack',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.investor_deal_assignments (
  id uuid primary key default gen_random_uuid(),
  deal_id text not null references public.investor_deals(id) on delete cascade,
  profile_id uuid references public.portal_profiles(id) on delete cascade,
  role text check (role in ('Admin', 'Approved Investor', 'Pending Investor', 'Advisor / Referral Partner')),
  created_at timestamptz not null default now(),
  constraint investor_deal_assignment_target check (profile_id is not null or role is not null)
);

create table if not exists public.investor_deal_documents (
  id uuid primary key default gen_random_uuid(),
  deal_id text references public.investor_deals(id) on delete cascade,
  name text not null,
  type text not null,
  status text not null default 'Pending Upload',
  display_date text default 'Pending',
  storage_path text,
  created_at timestamptz not null default now()
);

create table if not exists public.investor_deal_updates (
  id uuid primary key default gen_random_uuid(),
  deal_id text references public.investor_deals(id) on delete cascade,
  title text not null,
  update_date text not null default 'Pending',
  summary text,
  created_at timestamptz not null default now()
);

create table if not exists public.investor_distributions (
  id uuid primary key default gen_random_uuid(),
  deal_id text references public.investor_deals(id) on delete set null,
  investment text not null,
  distribution_date text not null,
  amount numeric not null default 0,
  type text,
  status text,
  created_at timestamptz not null default now()
);

create table if not exists public.portal_documents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('Company Overview', 'Fund Materials', 'Risk Disclosures', 'Subscription Documents', 'Tax Documents', 'Monthly Reports', 'Investor Notices')),
  storage_path text not null,
  upload_date date not null default current_date,
  is_restricted boolean not null default true,
  uploaded_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.portal_document_assignments (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.portal_documents(id) on delete cascade,
  profile_id uuid references public.portal_profiles(id) on delete cascade,
  role text check (role in ('Admin', 'Approved Investor', 'Pending Investor', 'Advisor / Referral Partner')),
  created_at timestamptz not null default now(),
  constraint document_assignment_target check (profile_id is not null or role is not null)
);

create table if not exists public.portal_monthly_updates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  update_date date not null default current_date,
  summary text not null,
  content text not null,
  pdf_storage_path text,
  created_at timestamptz not null default now()
);

create table if not exists public.portal_activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text,
  event_type text not null,
  resource_type text,
  resource_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.investor_commitments (
  id uuid primary key default gen_random_uuid(),
  investor_id uuid references auth.users(id) on delete set null,
  deal_id text not null,
  amount numeric not null,
  funding_method text not null,
  accreditation_confirmed boolean not null default false,
  status text not null default 'Received',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.investor_call_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  entity_name text,
  notes text,
  requested_slot text not null,
  requested_start text not null,
  requested_end text not null,
  timezone text not null default 'America/Denver',
  status text not null default 'Requested',
  google_event_id text,
  hubspot_contact_id text,
  hubspot_meeting_id text,
  integration_errors jsonb not null default '[]'::jsonb,
  email_sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.investor_deals add column if not exists name text;
alter table public.investor_deals add column if not exists location text;
alter table public.investor_deals add column if not exists investment_type text not null default 'Private Credit';
alter table public.investor_deals add column if not exists categories jsonb not null default '["Private Credit"]'::jsonb;
alter table public.investor_deals add column if not exists target_return text default 'Subject to offering documents';
alter table public.investor_deals add column if not exists minimum_investment numeric not null default 0;
alter table public.investor_deals add column if not exists total_raise numeric not null default 0;
alter table public.investor_deals add column if not exists amount_funded numeric not null default 0;
alter table public.investor_deals add column if not exists status text not null default 'Pending Review';
alter table public.investor_deals add column if not exists term text default 'Subject to offering documents';
alter table public.investor_deals add column if not exists distribution_frequency text default 'Subject to offering documents';
alter table public.investor_deals add column if not exists preferred_return text default 'N/A';
alter table public.investor_deals add column if not exists ltv text default 'N/A';
alter table public.investor_deals add column if not exists equity_multiple text default 'N/A';
alter table public.investor_deals add column if not exists summary text;
alter table public.investor_deals add column if not exists strategy_description text;
alter table public.investor_deals add column if not exists business_plan text;
alter table public.investor_deals add column if not exists sponsor_notes text;
alter table public.investor_deals add column if not exists timeline jsonb not null default '[]'::jsonb;
alter table public.investor_deals add column if not exists capital_stack jsonb not null default '[]'::jsonb;
alter table public.investor_deals add column if not exists sources_uses jsonb not null default '[]'::jsonb;
alter table public.investor_deals add column if not exists sensitivity text;
alter table public.investor_deals add column if not exists why_investors_like_this jsonb not null default '[]'::jsonb;
alter table public.investor_deals add column if not exists review_process jsonb not null default '[]'::jsonb;
alter table public.investor_deals add column if not exists risk_notes jsonb not null default '[]'::jsonb;
alter table public.investor_deals add column if not exists exclusivity_notes jsonb not null default '[]'::jsonb;
alter table public.investor_deals add column if not exists visual_type text default 'capital-stack';
alter table public.investor_deals add column if not exists created_at timestamptz not null default now();
alter table public.investor_deals add column if not exists updated_at timestamptz not null default now();
alter table public.investor_commitments add column if not exists updated_at timestamptz not null default now();
alter table public.investor_call_requests add column if not exists integration_errors jsonb not null default '[]'::jsonb;
alter table public.investor_call_requests add column if not exists email_sent_at timestamptz;

create index if not exists investor_deals_status_idx on public.investor_deals(status, created_at desc);
create index if not exists investor_deal_assignments_deal_idx on public.investor_deal_assignments(deal_id);
create index if not exists investor_deal_assignments_profile_idx on public.investor_deal_assignments(profile_id);
create index if not exists investor_deal_assignments_role_idx on public.investor_deal_assignments(role);
create index if not exists investor_deal_documents_deal_idx on public.investor_deal_documents(deal_id, created_at desc);
create index if not exists investor_deal_updates_deal_idx on public.investor_deal_updates(deal_id, created_at desc);
create index if not exists investor_distributions_deal_idx on public.investor_distributions(deal_id, created_at desc);
create index if not exists portal_documents_category_idx on public.portal_documents(category);
create index if not exists portal_assignments_profile_idx on public.portal_document_assignments(profile_id);
create index if not exists portal_assignments_role_idx on public.portal_document_assignments(role);
create index if not exists portal_activity_user_idx on public.portal_activity_logs(user_id, created_at desc);
create index if not exists investor_commitments_investor_idx on public.investor_commitments(investor_id, created_at desc);
create index if not exists investor_commitments_deal_idx on public.investor_commitments(deal_id, created_at desc);
create index if not exists investor_call_requests_email_idx on public.investor_call_requests(email, created_at desc);
create index if not exists investor_call_requests_status_idx on public.investor_call_requests(status, created_at desc);

alter table public.portal_profiles enable row level security;
alter table public.investor_deals enable row level security;
alter table public.investor_deal_assignments enable row level security;
alter table public.investor_deal_documents enable row level security;
alter table public.investor_deal_updates enable row level security;
alter table public.investor_distributions enable row level security;
alter table public.portal_documents enable row level security;
alter table public.portal_document_assignments enable row level security;
alter table public.portal_monthly_updates enable row level security;
alter table public.portal_activity_logs enable row level security;
alter table public.investor_commitments enable row level security;
alter table public.investor_call_requests enable row level security;

-- This app uses the Vercel server with SUPABASE_SERVICE_ROLE_KEY for protected reads/writes.
-- Keep portal documents in a private Supabase Storage bucket named: portal-documents.
-- Do not make that bucket public. The app should issue signed URLs only after auth checks.
-- ACH and wire instructions should be provided only after investor approval, suitability review, and document completion.
