-- Plaid connected bank account storage for the New Vine Capital investor portal.
-- Run this in Supabase SQL Editor after supabase/schema.sql, or merge it into your main schema run.
-- Plaid access tokens are encrypted by the Vercel server before they are stored here.

create extension if not exists "pgcrypto";

create table if not exists public.plaid_connected_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plaid_item_id text not null,
  plaid_access_token text not null,
  institution_id text,
  institution_name text,
  institution_logo text,
  account_id text not null,
  account_name text,
  account_mask text,
  account_type text,
  account_subtype text,
  connection_status text not null default 'connected' check (connection_status in ('connected', 'disconnected', 'needs_update', 'error')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, account_id)
);

create index if not exists plaid_connected_accounts_user_idx on public.plaid_connected_accounts(user_id, created_at desc);
create index if not exists plaid_connected_accounts_item_idx on public.plaid_connected_accounts(plaid_item_id);
create index if not exists plaid_connected_accounts_status_idx on public.plaid_connected_accounts(connection_status, updated_at desc);

alter table public.plaid_connected_accounts enable row level security;

drop policy if exists "Users can read their own Plaid accounts" on public.plaid_connected_accounts;
create policy "Users can read their own Plaid accounts"
  on public.plaid_connected_accounts
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can update their own Plaid account status" on public.plaid_connected_accounts;
create policy "Users can update their own Plaid account status"
  on public.plaid_connected_accounts
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- The website should use authenticated Vercel API routes for all Plaid operations.
-- Do not expose plaid_access_token to browser code or public Supabase queries.
