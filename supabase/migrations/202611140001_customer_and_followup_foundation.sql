-- AI Sales Workspace: P1 customer foundation + P2 follow-up workflow
-- Tenant isolation is enforced with Supabase RLS. No credentials or message bodies are stored by default.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  default_language text not null default 'en' check (default_language in ('en','zh','es','pt','ar')),
  timezone text not null default 'Asia/Shanghai',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner','admin','member','viewer')),
  created_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create or replace function public.is_workspace_member(target_workspace uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.workspace_members wm
    where wm.workspace_id = target_workspace and wm.user_id = auth.uid()
  );
$$;

create or replace function public.is_workspace_admin(target_workspace uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.workspace_members wm
    where wm.workspace_id = target_workspace
      and wm.user_id = auth.uid()
      and wm.role in ('owner','admin')
  );
$$;

create or replace function public.create_workspace(workspace_name text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare new_workspace_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;
  insert into public.workspaces(name, created_by)
  values (nullif(trim(workspace_name), ''), auth.uid())
  returning id into new_workspace_id;
  insert into public.workspace_members(workspace_id, user_id, role)
  values (new_workspace_id, auth.uid(), 'owner');
  return new_workspace_id;
end;
$$;

revoke all on function public.create_workspace(text) from public;
grant execute on function public.create_workspace(text) to authenticated;

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  legal_name text,
  display_name text not null,
  website_url text,
  country_code char(2),
  country_name text,
  city text,
  industry text,
  company_type text,
  employee_band text,
  business_summary text,
  verification_status text not null default 'unverified'
    check (verification_status in ('unverified','partially_verified','verified','rejected')),
  source_url text,
  source_name text,
  last_verified_at timestamptz,
  do_not_contact boolean not null default false,
  do_not_contact_reason text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, id)
);

create unique index if not exists companies_workspace_name_unique
  on public.companies (workspace_id, lower(display_name));
create index if not exists companies_workspace_country_idx
  on public.companies (workspace_id, country_code);
create index if not exists companies_workspace_updated_idx
  on public.companies (workspace_id, updated_at desc);

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  company_id uuid not null,
  full_name text not null,
  first_name text,
  last_name text,
  job_title text,
  department text,
  decision_role text check (decision_role in ('decision_maker','influencer','technical','procurement','user','unknown')),
  preferred_language text,
  verification_status text not null default 'unverified'
    check (verification_status in ('unverified','partially_verified','verified','rejected')),
  source_url text,
  source_name text,
  last_verified_at timestamptz,
  do_not_contact boolean not null default false,
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, id),
  constraint contacts_company_workspace_fk foreign key (workspace_id, company_id) references public.companies(workspace_id, id) on delete cascade
);
create index if not exists contacts_workspace_company_idx on public.contacts(workspace_id, company_id);
create index if not exists contacts_workspace_name_idx on public.contacts(workspace_id, lower(full_name));

create table if not exists public.contact_methods (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  contact_id uuid not null,
  channel text not null check (channel in ('email','phone','whatsapp','linkedin','instagram','facebook','website','other')),
  value text not null,
  normalized_value text not null,
  is_primary boolean not null default false,
  verification_status text not null default 'unverified'
    check (verification_status in ('unverified','syntax_valid','source_verified','owner_confirmed','invalid','hard_bounce','suppressed')),
  source_url text,
  source_name text,
  last_checked_at timestamptz,
  bounce_count integer not null default 0 check (bounce_count >= 0),
  suppressed_at timestamptz,
  suppression_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint contact_methods_contact_workspace_fk foreign key (workspace_id, contact_id) references public.contacts(workspace_id, id) on delete cascade
);
create unique index if not exists contact_methods_workspace_channel_value_unique
  on public.contact_methods(workspace_id, channel, normalized_value);
create index if not exists contact_methods_contact_idx on public.contact_methods(workspace_id, contact_id);
create index if not exists contact_methods_suppressed_idx on public.contact_methods(workspace_id, channel) where suppressed_at is not null;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  category text,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(workspace_id, name),
  unique (workspace_id, id)
);

create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  company_id uuid not null,
  primary_contact_id uuid,
  title text not null,
  stage text not null default 'new'
    check (stage in ('new','research','verification','first_touch','engaged','needs_confirmed','quotation','negotiation','won','lost','paused')),
  estimated_amount numeric(14,2),
  currency char(3),
  base_amount numeric(14,2),
  base_currency char(3) default 'CNY',
  probability numeric(5,2) check (probability between 0 and 100),
  expected_close_date date,
  lost_reason text,
  next_step text,
  next_step_due_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, id),
  constraint opportunities_company_workspace_fk foreign key (workspace_id, company_id) references public.companies(workspace_id, id) on delete cascade,
  constraint opportunities_contact_workspace_fk foreign key (workspace_id, primary_contact_id) references public.contacts(workspace_id, id) on delete set null (primary_contact_id)
);
create index if not exists opportunities_workspace_stage_idx on public.opportunities(workspace_id, stage);
create index if not exists opportunities_company_idx on public.opportunities(workspace_id, company_id);

create table if not exists public.opportunity_products (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  opportunity_id uuid not null,
  product_id uuid not null,
  quantity numeric(14,2),
  unit text,
  notes text,
  primary key (opportunity_id, product_id),
  constraint opportunity_products_opportunity_workspace_fk foreign key (workspace_id, opportunity_id) references public.opportunities(workspace_id, id) on delete cascade,
  constraint opportunity_products_product_workspace_fk foreign key (workspace_id, product_id) references public.products(workspace_id, id) on delete restrict
);

-- External accounts are metadata only. OAuth tokens/API secrets belong in a secret manager, never in this table.
create table if not exists public.channel_accounts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  provider text not null check (provider in ('whatsapp','gmail','tencent_mail','instagram','facebook','linkedin','other')),
  display_name text not null,
  account_identifier text,
  connection_mode text not null default 'manual'
    check (connection_mode in ('manual','official_api','official_coexistence','oauth','other')),
  status text not null default 'not_connected'
    check (status in ('not_connected','pending_authorization','connected','degraded','disconnected','revoked')),
  secret_reference text,
  capabilities jsonb not null default '{}'::jsonb,
  last_synced_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, id)
);
create index if not exists channel_accounts_workspace_provider_idx on public.channel_accounts(workspace_id, provider);

create table if not exists public.interactions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  company_id uuid not null,
  contact_id uuid,
  opportunity_id uuid,
  channel_account_id uuid,
  channel text not null check (channel in ('email','whatsapp','linkedin','instagram','facebook','phone','meeting','website','other')),
  direction text not null check (direction in ('inbound','outbound','internal')),
  interaction_type text not null default 'message',
  subject text,
  summary text,
  content_excerpt text,
  external_message_id text,
  delivery_status text not null default 'not_applicable'
    check (delivery_status in ('not_applicable','draft','queued','sent','delivered','opened','replied','bounced','rejected','unknown')),
  occurred_at timestamptz not null default now(),
  source_url text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint interactions_company_workspace_fk foreign key (workspace_id, company_id) references public.companies(workspace_id, id) on delete cascade,
  constraint interactions_contact_workspace_fk foreign key (workspace_id, contact_id) references public.contacts(workspace_id, id) on delete set null (contact_id),
  constraint interactions_opportunity_workspace_fk foreign key (workspace_id, opportunity_id) references public.opportunities(workspace_id, id) on delete set null (opportunity_id),
  constraint interactions_channel_account_workspace_fk foreign key (workspace_id, channel_account_id) references public.channel_accounts(workspace_id, id) on delete set null (channel_account_id)
);
create unique index if not exists interactions_external_message_unique
  on public.interactions(workspace_id, channel_account_id, external_message_id)
  where external_message_id is not null;
create index if not exists interactions_company_time_idx on public.interactions(workspace_id, company_id, occurred_at desc);
create index if not exists interactions_contact_time_idx on public.interactions(workspace_id, contact_id, occurred_at desc);

create table if not exists public.development_plans (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  product_id uuid,
  target_markets jsonb not null default '[]'::jsonb,
  buyer_profile text,
  inclusion_rules jsonb not null default '{}'::jsonb,
  exclusion_rules jsonb not null default '{}'::jsonb,
  daily_target integer not null default 0 check (daily_target >= 0),
  status text not null default 'draft' check (status in ('draft','ready','running','paused','completed','archived')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, id),
  constraint development_plans_product_workspace_fk foreign key (workspace_id, product_id) references public.products(workspace_id, id) on delete set null (product_id)
);

create table if not exists public.follow_up_tasks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  company_id uuid,
  contact_id uuid,
  opportunity_id uuid,
  development_plan_id uuid,
  title text not null,
  description text,
  task_type text not null default 'follow_up'
    check (task_type in ('research','verify_contact','first_touch','follow_up','prepare_quote','technical_review','sample','after_sales','internal')),
  priority text not null default 'normal' check (priority in ('low','normal','high','urgent')),
  status text not null default 'open' check (status in ('open','in_progress','waiting','completed','cancelled')),
  due_at timestamptz,
  assigned_to uuid references auth.users(id) on delete set null,
  completed_at timestamptz,
  completion_note text,
  completion_evidence jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tasks_company_workspace_fk foreign key (workspace_id, company_id) references public.companies(workspace_id, id) on delete set null (company_id),
  constraint tasks_contact_workspace_fk foreign key (workspace_id, contact_id) references public.contacts(workspace_id, id) on delete set null (contact_id),
  constraint tasks_opportunity_workspace_fk foreign key (workspace_id, opportunity_id) references public.opportunities(workspace_id, id) on delete set null (opportunity_id),
  constraint tasks_plan_workspace_fk foreign key (workspace_id, development_plan_id) references public.development_plans(workspace_id, id) on delete set null (development_plan_id)
);
create index if not exists tasks_workspace_due_idx on public.follow_up_tasks(workspace_id, status, due_at);
create index if not exists tasks_workspace_assignee_idx on public.follow_up_tasks(workspace_id, assigned_to, status);

create table if not exists public.task_events (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  task_id uuid not null,
  event_type text not null check (event_type in ('created','assigned','started','rescheduled','completed','reopened','cancelled','note_added','evidence_added')),
  details jsonb not null default '{}'::jsonb,
  actor_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint task_events_task_workspace_fk foreign key (workspace_id, task_id) references public.follow_up_tasks(workspace_id, id) on delete cascade
);
create index if not exists task_events_task_time_idx on public.task_events(workspace_id, task_id, created_at desc);

create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  entity_type text not null,
  entity_id uuid,
  action text not null,
  actor_id uuid references auth.users(id) on delete set null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists audit_events_workspace_time_idx on public.audit_events(workspace_id, created_at desc);

-- Updated-at triggers
do $$
declare tbl text;
begin
  foreach tbl in array array['workspaces','companies','contacts','contact_methods','products','opportunities','channel_accounts','development_plans','follow_up_tasks'] loop
    execute format('drop trigger if exists set_updated_at on public.%I', tbl);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', tbl);
  end loop;
end;
$$;

-- Row-level security: every business record is isolated by workspace membership.
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
create policy workspaces_select_member on public.workspaces for select to authenticated using (public.is_workspace_member(id));
create policy workspace_members_select_self_or_admin on public.workspace_members for select to authenticated
  using (user_id = auth.uid() or public.is_workspace_admin(workspace_id));

do $
declare tbl text;
begin
  foreach tbl in array array[
    'companies','contacts','contact_methods','products','opportunities','opportunity_products',
    'channel_accounts','interactions','development_plans','follow_up_tasks'
  ] loop
    execute format('alter table public.%I enable row level security', tbl);
    execute format('drop policy if exists workspace_member_all on public.%I', tbl);
    execute format(
      'create policy workspace_member_all on public.%I for all to authenticated using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id))',
      tbl
    );
  end loop;

  -- Event ledgers are append-only: members can read and add events, but cannot rewrite history.
  foreach tbl in array array['task_events','audit_events'] loop
    execute format('alter table public.%I enable row level security', tbl);
    execute format('drop policy if exists workspace_member_select on public.%I', tbl);
    execute format('drop policy if exists workspace_member_insert on public.%I', tbl);
    execute format('create policy workspace_member_select on public.%I for select to authenticated using (public.is_workspace_member(workspace_id))', tbl);
    execute format('create policy workspace_member_insert on public.%I for insert to authenticated with check (public.is_workspace_member(workspace_id))', tbl);
  end loop;
end;
$;

revoke all on function public.is_workspace_member(uuid) from public;
revoke all on function public.is_workspace_admin(uuid) from public;
grant execute on function public.is_workspace_member(uuid) to authenticated;
grant execute on function public.is_workspace_admin(uuid) to authenticated;

comment on table public.companies is 'Company/account records. Contacts and opportunities are stored separately.';
comment on table public.contacts is 'People associated with companies; one company may have multiple contacts.';
comment on table public.contact_methods is 'Verifiable contact endpoints with source, validity and suppression status.';
comment on table public.interactions is 'Channel-neutral communication history; external IDs prevent duplicate imports.';
comment on table public.channel_accounts is 'Connected channel account metadata only; secrets are stored outside Postgres.';
comment on table public.follow_up_tasks is 'Human and system follow-up work. Completion requires an explicit event/evidence.';
comment on table public.task_events is 'Append-only task activity history.';
