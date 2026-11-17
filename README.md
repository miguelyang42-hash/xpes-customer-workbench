# AI Sales Workspace

A neutral, model-agnostic workspace for customer development and follow-up operations.

## Product principles
- No company-specific branding; language can be changed independently.
- Customer-first data model: companies, contacts, contact methods, opportunities and interactions are separate records.
- Evidence-first execution: a task is not complete because an AI model says it is complete.
- Plan-authorized email automation: initial outreach and follow-ups 2–4 may send automatically within a user-approved, bounded plan; social-platform outreach remains human-operated.
- Multi-account, multi-channel architecture: channel accounts are separate from customer identity; secrets are stored outside the database.
- Privacy by default: personal chat accounts are not silently imported; every channel requires explicit authorization.

## P1 — Customer foundation
- Company/account records, multiple contacts per company, multiple contact methods per person.
- Contact source, verification status, hard-bounce and suppression tracking.
- Separate opportunities and product associations.
- Channel-neutral interaction history with external message IDs for deduplication.
- Workspace-level tenant isolation and Row Level Security.
- Migration: `supabase/migrations/202611140001_customer_and_followup_foundation.sql`.

## P2 — Daily action and follow-up
- Today's Action Center with due and overdue reminders.
- Create customer records and follow-up tasks.
- Link tasks to a customer; set due date and priority.
- Explicit manual completion; completion never implies an email or message was sent.
- Task list filters and completion history.

## P3 — Customer nurturing and multi-touch follow-up (approved design)
- Dedicated Customer Nurturing Center with due-for-review, engagement, active-sequence, paused/nurture and analytics views.
- Initial outreach plus follow-ups 2–4, with a separate bounded long-term nurture path.
- Every follow-up requires human review and explicit approval; AI only recommends timing and drafts content.
- AI timing uses recipient-local working hours, verified timezone confidence, engagement-event quality and contact history, subject to cooldown, frequency and suppression rules.
- Open tracking is an unverified signal unless a reliable explicit read receipt exists; opens never prove human reading or purchase intent.
- Replies, hard bounces, opt-outs, complaints and manual takeover pause/stop the relevant sequence.
- Full specification: `docs/customer-nurturing-follow-up-engine.md`.

## V3 approved build baseline
- Existing CRM and AI prospecting database remain separate; optional read-only identity matching only.
- One default AI model through a unified gateway; optional backup is disabled by default.
- Unified Email Gateway with provider-specific MCP/API/OAuth/SMTP/IMAP adapters and per-account capability checks.
- Initial and follow-up email sends are autonomous only inside a versioned plan authorization; social outreach remains manual.
- Customer merges, CRM transfers, sensitive status changes and suppression overrides require human approval.
- Architecture documents: `docs/V3-overall-architecture.md`, `docs/V3-data-model.md`, `docs/V3-execution-engine.md`, `docs/V3-email-gateway.md`, `docs/V3-authorization-and-safety.md`.

## Current preview limitations
- New customer and task entries are currently saved only in this browser's local storage.
- Demo customer rows are illustrative and are not real leads.
- Cloud database, authentication, team permissions, AI providers, mailboxes and messaging channels are not connected yet. V3 allows local draft configuration only and cannot execute external tasks.
- Do not use browser-local preview data as the sole business record.
- No real outreach is sent from this preview.

## Planned architecture
- Next.js frontend
- Independent PostgreSQL database on the user's Tencent Cloud environment, with authenticated workspace membership and row-level authorization enforced at the API/DB layers
- Persistent task queue and independent workers
- Provider-neutral AI adapter
- Gmail and Tencent Enterprise Mail via capability-tested MCP/API/OAuth/SMTP/IMAP adapters
- Official WhatsApp Business API / eligible coexistence accounts; personal WhatsApp remains manual-assist unless an official supported path becomes available
- Evidence ledger, idempotency, suppression list and retry/reconciliation rules

## V3 implemented in the development preview

- `app/v3-workspace.tsx`: multi-plan UI, local plan configuration, plan-level authorization-intent preview, honest blocked-run records, mail account metadata drafts, single AI provider metadata drafts, and nurturing sequence overview.
- `lib/v3-send-policy.ts`: pure fail-closed send authorization checks, independent task evidence helpers and engagement-event taxonomy. **Not wired to a production worker or email provider.**
- `db/v3_tencent_postgres_schema.sql`: isolated PostgreSQL design artifact for Tencent Cloud deployment. **Not executed on any database.**
- V3 front-end preview cannot send messages, initiate web research, contact clients or mutate the existing CRM.
- Local browser records are not backed up or shared across devices.

## Local development
- npm install
- npm run dev
- npm run build

Never commit API keys, OAuth tokens, mailbox passwords, private chat exports or production customer data.
