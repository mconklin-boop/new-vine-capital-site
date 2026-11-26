-- Deal intake, lead capture and automatic preliminary underwriting.
-- Run once in the Supabase SQL editor (Project -> SQL Editor -> New query -> Run).

create table if not exists public.deal_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Lead / contact
  contact_name text not null,
  contact_email text not null,
  contact_phone text not null,
  company_name text,
  submitter_role text,
  referral_source text,

  -- Deal summary
  product text not null,
  transaction_type text,
  property_address text,
  property_city text,
  property_state text,
  property_zip text,
  property_type text,
  occupancy text,
  loan_amount numeric,
  purchase_price numeric,
  as_is_value numeric,
  closing_date date,

  -- Full submitted form (every field) and automatic screen result
  form_data jsonb not null default '{}'::jsonb,
  screen_result jsonb not null default '{}'::jsonb,
  screen_decision text,
  screen_score integer,

  -- Pipeline
  status text not null default 'New',
  admin_notes text,

  -- Integrations
  contact_id uuid,
  notification_sent_at timestamptz,
  confirmation_sent_at timestamptz,
  integration_errors jsonb not null default '[]'::jsonb,
  user_agent text
);

create index if not exists deal_submissions_created_idx on public.deal_submissions(created_at desc);
create index if not exists deal_submissions_status_idx on public.deal_submissions(status, created_at desc);
create index if not exists deal_submissions_decision_idx on public.deal_submissions(screen_decision, created_at desc);
create index if not exists deal_submissions_email_idx on public.deal_submissions(contact_email, created_at desc);

alter table public.deal_submissions enable row level security;
-- No RLS policies on purpose: only the server (service role key) reads and writes this table.
