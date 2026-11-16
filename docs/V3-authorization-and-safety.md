# V3 Authorization and Safety Policy

Status: Approved design baseline.

## Authorization tiers

### Tier 1 — Autonomous within an approved plan
- company discovery and deduplication
- company/contact research and evidence collection
- contact endpoint discovery and validation
- customer qualification and prioritization
- buyer-centric email drafting and quality checks
- initial email and follow-up 2–4 sending, but only when the plan authorization explicitly enables it
- engagement synchronization and internal reminders
- local-time follow-up recommendations
- reply analysis and internal response suggestions

### Tier 2 — Human approval required
- LinkedIn, WhatsApp, Instagram and Facebook outbound actions
- company/contact record merge
- transfer into or modification of the existing CRM
- material customer-stage changes
- do-not-contact/suppression overrides (legal suppression cannot be casually overridden)
- changing global send policies, account permissions or plan scope
- destructive or sensitive data operations

### Tier 3 — Non-bypassable system controls
- opt-out, complaint and suppression enforcement
- endpoint hard-bounce suppression
- recipient and account rate limits
- send authorization and cooldown checks
- idempotency and uncertain-outcome reconciliation
- evidence validation before task completion
- tenant isolation and credential protection
- audit event retention

## Plan-level one-time authorization

Users do not approve each routine email individually. They approve a bounded plan authorization before execution. The authorization must display:
- product, markets and buyer profile
- target count and search budget
- selected sending mailbox(es)
- automatic initial and follow-up email permission
- maximum sequence length (default initial + 3 follow-ups)
- daily/weekly send limits and permitted local-time windows
- excluded segments and suppression rules
- start/end time and revocation control
- what the system will pause and notify about

Authorization is tied to a plan version. Material changes invalidate the previous authorization and require re-approval.

## Stop conditions

Pause affected sends on replies, hard bounces, unsubscribe, complaint, endpoint suppression, manual takeover, plan revocation, provider disconnection, unusual bounce/complaint rates, account health degradation, budget exhaustion or unresolved send outcome.

## Transparency

Every dashboard metric is evidence-backed. Distinguish candidate, unique, verified, qualified, queued, provider-accepted, delivered, open-detected, replied and qualified-reply counts. Never represent AI-generated claims as external actions.

## Compliance

The workspace must support applicable jurisdiction-specific commercial email requirements, sender identification, opt-out handling and retention controls. Compliance rules should be configurable and reviewed for each target market; the system must not imply that automation itself guarantees compliance.
