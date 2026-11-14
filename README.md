# XPES AI Sales Engine

Independent V1.0 workspace for XPES customer development.

## Product principles
- Model-agnostic: providers are adapters, not workflow dependencies.
- Evidence-first: a task is not complete because an AI model says it is complete.
- Customer-first: company identity, contacts, opportunities and channel events are separate records.
- Human-controlled social outreach: prepare verified links and drafts; do not automate prohibited platform actions.
- Safe email operations: explicit account authorization, send evidence, bounce classification, suppression and audit history.
- Buyer-perspective review: critique outbound messages from the recipient's role and business incentives.

## Current build status
The first deployment is a front-end preview with clearly labeled demonstration records. It does not connect to live customer data, AI providers, Gmail, Tencent Enterprise Mail or social platforms. No real outreach is sent.

## Planned architecture
- Next.js frontend
- PostgreSQL/Supabase backend (new isolated project to be provisioned after billing/region confirmation)
- Persistent task queue and independent workers
- Provider-neutral AI adapter
- Gmail API and Tencent Enterprise Mail IMAP/SMTP connectors
- Evidence ledger, idempotency, suppression list and retry/reconciliation rules

## Local development
- npm install
- npm run dev
- npm run build

Never commit API keys, OAuth tokens, mailbox passwords or production customer data.
