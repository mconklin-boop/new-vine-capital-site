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

create index if not exists portal_documents_category_idx on public.portal_documents(category);
create index if not exists portal_assignments_profile_idx on public.portal_document_assignments(profile_id);
create index if not exists portal_assignments_role_idx on public.portal_document_assignments(role);
create index if not exists portal_activity_user_idx on public.portal_activity_logs(user_id, created_at desc);

alter table public.portal_profiles enable row level security;
alter table public.portal_documents enable row level security;
alter table public.portal_document_assignments enable row level security;
alter table public.portal_monthly_updates enable row level security;
alter table public.portal_activity_logs enable row level security;

-- This app uses the Vercel server with SUPABASE_SERVICE_ROLE_KEY for protected reads/writes.
-- Keep portal documents in a private Supabase Storage bucket named: portal-documents.
-- Do not make that bucket public. The app should issue signed URLs only after auth checks.
