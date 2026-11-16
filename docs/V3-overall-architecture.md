# V3 Overall Architecture

Status: Approved build baseline, design and implementation in progress.
Branch: `v3-autonomous-customer-development`.

## Product goal

Build an independent AI customer-development workspace that autonomously performs authorized research and email outreach, independently verifies execution evidence, and hands human users only decisions that require judgment or carry material business risk.

The workspace is not the existing CRM. It is a separate prospecting and nurturing system.

## System boundaries

### System A — Existing business CRM
- Remains the authoritative system for existing customers, quotations, orders, transaction history and active account management.
- Must not be modified by AI prospecting workers.
- Is queried only through a controlled read-only identity-matching adapter, if the owner enables it.
- Customer transfer from the prospecting workspace requires explicit human approval.

### System B — AI Customer Development Workspace
- Owns discovered prospects, research evidence, contacts, endpoints, development plans, outreach sequences, email events, tasks and prospecting audit history.
- Has its own database, workspace membership, authentication and RLS.
- Does not share tables or database credentials with the existing CRM.
- May hold an external CRM reference after a human-approved transfer, but not silently mirror the CRM.

### Shared integration layer
- Read-only CRM identity check (optional; otherwise scheduled/manual identity-list import).
- One AI Gateway with one default model configuration.
- One Email Gateway supporting provider adapters.
- Human-operated social-channel launch links and message preparation.
- Persistent task queue, evidence ledger, suppression service and audit log.

## Architecture layers

1. **Experience layer** — command center, development plans, prospect database, execution monitor, email operations, customer conversations, nurturing center and settings.
2. **Business domain layer** — companies, contacts, endpoints, products, plans, opportunities, sequences and interactions.
3. **AI Gateway** — one configured default model and endpoint; provider-neutral adapter; optional backup disabled by default.
4. **Execution layer** — persisted jobs, task attempts, idempotency keys, leases, retry policy, dead-letter handling and reconciliation.
5. **Connector layer** — search/research providers, email connectors (MCP/API/OAuth/SMTP/IMAP), and manual social channel links.
6. **Evidence and policy layer** — immutable provider events, source records, authorization scopes, suppression rules and independent verification.
7. **Infrastructure layer** — isolated PostgreSQL/Supabase project, server-side secret storage, authenticated API, workers, backups and monitoring.

## Key architecture decisions

- Separate database for AI prospects. Never write to the old CRM database.
- Email is automatically sent only inside a user-authorized development plan and configured sending policy. Individual emails do not require pre-send review.
- Social-channel outreach remains manual: AI prepares context and text; the user opens the relevant platform and decides whether to send.
- Customer merges, CRM transfers, material customer-state changes, do-not-contact overrides and global policy changes require human approval.
- AI configuration is intentionally simple: one default model, one API base URL, one API key and one model identifier. No mandatory multi-model routing.
- Email accounts are independent connections behind one gateway. Supported connection types are discovered per provider: MCP, direct API, OAuth, SMTP/IMAP. A connection method is not assumed to be available for every provider.
- Credentials never enter browser local storage, source control, logs, prompts or ordinary database columns.
- A task is complete only after independent evidence validation. AI narrative is never execution proof.
- Email open tracking is a weak, potentially automated signal; it never proves a human read.

## Deployment and environment strategy

- Keep the current preview and existing CRM untouched.
- Use a dedicated development branch and an isolated AI-workspace database.
- Do not apply schema changes to the inactive existing Supabase project until the owner explicitly confirms which isolated project should be activated or provisioned and any associated cost.
- Use separate development, staging and production environments with separate credentials.
- Deploy a preview from this V3 branch first. Production promotion requires acceptance tests and owner approval.

## External integrations and limitations

- Email gateways may support MCP, provider API, OAuth or SMTP/IMAP. Actual read, send, label/folder, event and webhook capabilities must be tested per account.
- Gmail and Tencent Enterprise Mail must be treated as separate adapters.
- A provider accepting an SMTP/API request is not proof of delivery.
- Personal WhatsApp is manual-assist unless an official supported integration is available. Do not scrape private chat history or risk account sessions.
- LinkedIn, Instagram and Facebook remain user-operated touchpoints unless a compliant official integration supports the exact action.

## Release gates

1. Data model and tenant isolation reviewed.
2. Authenticated access and RLS verified.
3. AI Gateway connection tested without exposing secrets.
4. Email account connection tested for send, receive, event sync and folder/label capabilities.
5. Authorization and suppression rules tested.
6. End-to-end simulated run reconciled against provider evidence.
7. Human-approved staging test completed.
8. Production launch explicitly approved.
