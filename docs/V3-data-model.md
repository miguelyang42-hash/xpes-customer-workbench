# V3 Data Model

Status: Approved design baseline. No production database has been changed.

## Data ownership boundary

The AI development workspace has its own database. Existing CRM records remain in a different database/system. The only allowed cross-system operation by default is a minimal read-only identity-match request. A customer transfer is a human-approved export/import event, not shared-table access.

## Core entities

| Entity | Purpose | Key relationships |
|---|---|---|
| workspaces / workspace_members | Tenant and user access | Own all workspace data |
| companies | One prospect organization | Has many contacts, research records, opportunities and plans |
| contacts | Individual people | Belong to one company; have multiple contact methods |
| contact_methods | Email, phone, social endpoint | Belong to one contact; independent verification/suppression |
| products | XPES-independent product catalogue | Used by plans and opportunities |
| development_plans | Product/market/buyer profile and authorized scope | Owns runs and outreach sequences |
| development_runs | One launch instance with frozen plan snapshot | Has tasks, metrics and evidence |
| execution_tasks | Persisted unit of work | Belongs to run; has attempts and evidence |
| task_attempts | Each execution/retry attempt | Linked to task and worker/provider |
| evidence_records | Verifiable proof of a result | Linked to task, attempt, company or interaction |
| research_records | Source-backed company/contact facts | Has source URL, observed time, confidence and expiry |
| channel_accounts | Mail/social account metadata only | Credentials referenced from a secret manager |
| outreach_sequences | Contact + endpoint + plan-specific sequence | Initial outreach and follow-up touches |
| outreach_messages | Individual generated/sent message versions | Stores content version/hash and provider IDs |
| engagement_events | Send, accepted, delivered, open, click, reply, bounce, unsubscribe | Deduplicated by provider ID/fingerprint |
| interactions | Unified communication timeline | Company/contact/opportunity/channel |
| follow_up_tasks | Human tasks, exceptions and reminders | Can reference company/contact/plan/run |
| authorization_policies | Plan-specific scope and limits | Human-approved versioned authorization |
| suppression_records | Endpoint/company-level do-not-contact controls | Must be checked before every send |
| audit_events | Append-only record of material actions | Actor, action, entity, timestamp and evidence |
| crm_match_records | Minimal identity-match outcome | Stores match status and external reference only |

## Identity and deduplication

- Company identity should use normalized website domain, country/registration identifier where available, legal/display name and source evidence.
- Do not merge records based on name similarity alone.
- Contact identity uses company, normalized name, role and verified endpoint evidence.
- Email endpoints are normalized case-insensitively; plus-addressing and provider-specific normalization must not be assumed universally.
- Each contact method has its own verification, bounce and suppression status.
- Hard bounce invalidates/suppresses that endpoint, not the company or all contacts.
- A company may have multiple contacts and each contact may have multiple endpoints.

## Source and verification model

Each material fact should include:
- source URL or provider/source identifier
- source type/name
- observed_at
- last_verified_at
- confidence / verification status
- evidence reference
- valid_until or next_review_at where appropriate

AI inference must be stored as an inference, never as a verified fact.

## Sequence model

An outreach sequence is unique to:
- workspace
- company
- contact
- endpoint
- development plan/campaign
- sending account

Default cold sequence: initial email + follow-up 2 + follow-up 3 + follow-up 4. Long-term nurture is a separate bounded plan.

A reply pauses the replying contact's sequence immediately. It does not automatically message other employees at the same company. A human can decide whether another contact is appropriate after reviewing company-level context.

## Event ledger and metrics

Events are append-only. Corrections are represented as new events with references to the original event.

Metrics must distinguish:
- draft generated
- approved plan authorization
- send requested
- provider accepted
- delivered (only with provider evidence)
- open detected (unverified unless explicit read receipt)
- clicked (scanner-aware)
- replied
- qualified reply
- hard/soft bounce
- unsubscribe/complaint
- opportunity created

No metric is derived from an AI completion claim.

## Secret handling

- Database stores connection metadata and a secret reference only.
- API keys, OAuth refresh tokens, SMTP passwords and MCP credentials are stored in a server-side secret manager/encrypted vault.
- Never put secrets in localStorage, sessionStorage, browser bundles, analytics, task payloads, AI prompts or audit details.
- UI must mask credentials and reveal only status, last four characters when safe, expiry/last refresh and reconnect action.

## CRM transfer

Transfer requires human confirmation and an audit event. Transfer payload is explicit and minimal. After transfer, store external CRM ID and sync status; do not silently sync all fields or overwrite the CRM.
