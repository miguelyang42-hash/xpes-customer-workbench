-- AI Sales Workspace V3: portable PostgreSQL schema for a dedicated Tencent Cloud database.
-- DESIGN ARTIFACT ONLY. NOT APPLIED TO PRODUCTION.
-- Authentication, RBAC and tenant checks must be enforced by the server before each query.
-- A separate dedicated database is mandatory; do not attach this to the existing CRM.

create extension if not exists pgcrypto;

create table if not exists v3_workspaces(
 id uuid primary key default gen_random_uuid(),
 display_name text not null,
 created_at timestamptz not null default now()
);
create table if not exists v3_users(
 id uuid primary key default gen_random_uuid(),
 workspace_id uuid not null references v3_workspaces(id),
 external_auth_subject text not null,
 role text not null check(role in ('admin','member','viewer')),
 created_at timestamptz not null default now(),
 unique(workspace_id,id),unique(workspace_id,external_auth_subject)
);
create table if not exists v3_companies(
 id uuid primary key default gen_random_uuid(),
 workspace_id uuid not null references v3_workspaces(id),
 display_name text not null,
 legal_name text,
 website_domain text,
 country_code text,
 summary text,
 verification_status text not null default 'unverified' check(verification_status in ('unverified','verified','rejected')),
 source_url text,
 last_verified_at timestamptz,
 do_not_contact boolean not null default false,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique(workspace_id,id)
);
create unique index if not exists v3_company_domain_unique
 on v3_companies(workspace_id, lower(website_domain))
 where website_domain is not null;

create table if not exists v3_contacts(
 id uuid primary key default gen_random_uuid(),
 workspace_id uuid not null references v3_workspaces(id),
 company_id uuid not null,
 full_name text not null,
 title text,
 decision_role text,
 verified_at timestamptz,
 created_at timestamptz not null default now(),
 unique(workspace_id,id),
 foreign key(workspace_id,company_id) references v3_companies(workspace_id,id)
);
create table if not exists v3_contact_methods(
 id uuid primary key default gen_random_uuid(),
 workspace_id uuid not null references v3_workspaces(id),
 contact_id uuid not null,
 channel text not null check(channel in ('email','whatsapp','linkedin','instagram','facebook','phone','other')),
 value text not null,
 normalized_value text not null,
 verification_status text not null default 'unverified'
   check(verification_status in ('unverified','source_verified','owner_confirmed','invalid','hard_bounce','suppressed')),
 source_url text,
 suppressed_at timestamptz,
 last_verified_at timestamptz,
 created_at timestamptz not null default now(),
 unique(workspace_id,id),
 foreign key(workspace_id,contact_id) references v3_contacts(workspace_id,id)
);
create unique index if not exists v3_contact_endpoint_unique
 on v3_contact_methods(workspace_id,channel,normalized_value);

create table if not exists v3_channel_accounts(
 id uuid primary key default gen_random_uuid(),
 workspace_id uuid not null references v3_workspaces(id),
 provider text not null,
 display_name text not null,
 address text,
 connection_method text not null,
 connection_status text not null default 'not_connected',
 credential_secret_ref text,
 capabilities jsonb not null default '{}'::jsonb,
 last_synced_at timestamptz,
 created_at timestamptz not null default now(),
 unique(workspace_id,id)
);
comment on column v3_channel_accounts.credential_secret_ref is 'Opaque external secret manager reference only; never store plaintext credentials';

create table if not exists v3_development_plans(
 id uuid primary key default gen_random_uuid(),
 workspace_id uuid not null references v3_workspaces(id),
 name text not null,
 plan_version integer not null default 1,
 scope_snapshot jsonb not null,
 status text not null default 'draft' check(status in ('draft','authorized','paused','archived')),
 created_by uuid,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique(workspace_id,id),
 foreign key(workspace_id,created_by) references v3_users(workspace_id,id)
);
create table if not exists v3_plan_authorizations(
 id uuid primary key default gen_random_uuid(),
 workspace_id uuid not null references v3_workspaces(id),
 plan_id uuid not null,
 plan_version integer not null,
 approved_scope jsonb not null,
 approved_by uuid not null,
 expires_at timestamptz not null,
 revoked_at timestamptz,
 created_at timestamptz not null default now(),
 unique(workspace_id,id),
 foreign key(workspace_id,plan_id) references v3_development_plans(workspace_id,id),
 foreign key(workspace_id,approved_by) references v3_users(workspace_id,id)
);
create table if not exists v3_development_runs(
 id uuid primary key default gen_random_uuid(),
 workspace_id uuid not null references v3_workspaces(id),
 plan_id uuid not null,
 authorization_id uuid not null,
 frozen_scope jsonb not null,
 state text not null default 'queued' check(state in ('queued','running','paused','blocked','completed','failed')),
 created_at timestamptz not null default now(),
 unique(workspace_id,id),
 foreign key(workspace_id,plan_id) references v3_development_plans(workspace_id,id),
 foreign key(workspace_id,authorization_id) references v3_plan_authorizations(workspace_id,id)
);
create table if not exists v3_execution_tasks(
 id uuid primary key default gen_random_uuid(),
 workspace_id uuid not null references v3_workspaces(id),
 run_id uuid not null,
 task_type text not null,
 state text not null default 'queued' check(state in ('queued','running','awaiting_provider','awaiting_verification','completed_verified','failed_retryable','failed_terminal','outcome_unknown','blocked_by_policy','cancelled')),
 idempotency_key text not null,
 attempt_count integer not null default 0,
 lease_expires_at timestamptz,
 next_retry_at timestamptz,
 last_error text,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique(workspace_id,id),unique(workspace_id,idempotency_key),
 foreign key(workspace_id,run_id) references v3_development_runs(workspace_id,id)
);
create table if not exists v3_task_attempts(
 id uuid primary key default gen_random_uuid(),
 workspace_id uuid not null references v3_workspaces(id),
 task_id uuid not null,
 attempt_number integer not null,
 worker_id text,
 started_at timestamptz not null default now(),
 finished_at timestamptz,
 provider_request_id text,
 provider_response_id text,
 result_state text not null default 'running',
 error_code text,
 unique(workspace_id,id),
 unique(workspace_id,task_id,attempt_number),
 foreign key(workspace_id,task_id) references v3_execution_tasks(workspace_id,id)
);
create table if not exists v3_evidence_records(
 id uuid primary key default gen_random_uuid(),
 workspace_id uuid not null references v3_workspaces(id),
 task_id uuid not null,
 attempt_id uuid,
 evidence_type text not null,
 source_ref text not null,
 observed_at timestamptz not null default now(),
 verified_by text not null,
 verified_at timestamptz,
 accepted boolean not null default false,
 unique(workspace_id,id),
 foreign key(workspace_id,task_id) references v3_execution_tasks(workspace_id,id),
 foreign key(workspace_id,attempt_id) references v3_task_attempts(workspace_id,id)
);

create table if not exists v3_outreach_sequences(
 id uuid primary key default gen_random_uuid(),
 workspace_id uuid not null references v3_workspaces(id),
 plan_id uuid not null,
 company_id uuid not null,
 contact_id uuid not null,
 contact_method_id uuid not null,
 channel_account_id uuid not null,
 state text not null default 'active' check(state in ('active','paused','completed','suppressed','human_takeover')),
 touch_number integer not null default 0 check(touch_number between 0 and 4),
 next_touch_at timestamptz,
 stop_reason text,
 created_at timestamptz not null default now(),
 unique(workspace_id,id),
 unique(workspace_id,plan_id,contact_method_id),
 foreign key(workspace_id,plan_id) references v3_development_plans(workspace_id,id),
 foreign key(workspace_id,company_id) references v3_companies(workspace_id,id),
 foreign key(workspace_id,contact_id) references v3_contacts(workspace_id,id),
 foreign key(workspace_id,contact_method_id) references v3_contact_methods(workspace_id,id),
 foreign key(workspace_id,channel_account_id) references v3_channel_accounts(workspace_id,id)
);
create table if not exists v3_outreach_messages(
 id uuid primary key default gen_random_uuid(),
 workspace_id uuid not null references v3_workspaces(id),
 sequence_id uuid not null,
 touch_number integer not null check(touch_number between 1 and 4),
 subject text,
 body_ciphertext bytea,
 content_sha256 text not null,
 send_state text not null default 'draft' check(send_state in ('draft','queued','provider_accepted','delivered','replied','bounced','unknown','cancelled')),
 provider_message_id text,
 idempotency_key text not null,
 requested_at timestamptz,
 provider_accepted_at timestamptz,
 unique(workspace_id,id),
 unique(workspace_id,idempotency_key),
 foreign key(workspace_id,sequence_id) references v3_outreach_sequences(workspace_id,id)
);
create unique index if not exists v3_external_message_unique
 on v3_outreach_messages(workspace_id,provider_message_id) where provider_message_id is not null;
create table if not exists v3_engagement_events(
 id uuid primary key default gen_random_uuid(),
 workspace_id uuid not null references v3_workspaces(id),
 message_id uuid not null,
 provider_event_id text,
 event_fingerprint text not null,
 event_type text not null check(event_type in ('send_requested','provider_accepted','delivered','open_detected','explicit_read_receipt','clicked','replied','hard_bounce','soft_bounce','unsubscribed','complaint')),
 evidence_ref text,
 confidence text not null default 'unverified',
 occurred_at timestamptz not null,
 recorded_at timestamptz not null default now(),
 unique(workspace_id,id),
 unique(workspace_id,event_fingerprint),
 foreign key(workspace_id,message_id) references v3_outreach_messages(workspace_id,id)
);
create table if not exists v3_suppression_records(
 id uuid primary key default gen_random_uuid(),
 workspace_id uuid not null references v3_workspaces(id),
 endpoint_id uuid not null,
 reason text not null,
 scope text not null default 'endpoint',
 created_at timestamptz not null default now(),
 lifted_at timestamptz,
 unique(workspace_id,id),
 foreign key(workspace_id,endpoint_id) references v3_contact_methods(workspace_id,id)
);
create unique index if not exists v3_active_suppression_unique
 on v3_suppression_records(workspace_id,endpoint_id,scope) where lifted_at is null;
create table if not exists v3_audit_events(
 id uuid primary key default gen_random_uuid(),
 workspace_id uuid not null references v3_workspaces(id),
 actor_type text not null,
 actor_ref text,
 entity_type text not null,
 entity_id uuid,
 action text not null,
 event_payload jsonb not null default '{}'::jsonb,
 created_at timestamptz not null default now()
);
create index if not exists v3_task_run_idx on v3_execution_tasks(workspace_id,run_id,state);
create index if not exists v3_sequence_due_idx on v3_outreach_sequences(workspace_id,next_touch_at) where state='active';
create index if not exists v3_engagement_message_idx on v3_engagement_events(workspace_id,message_id,occurred_at);

-- Application service authorization (role, workspace and plan limits) is mandatory.
-- This script intentionally does not grant PUBLIC table access, create outbound network functions,
-- store API keys or run automatic email jobs.
-- Implement and test authenticated server-level RBAC before enabling customer data.
