# V3 Unified Email Gateway

Status: Approved design baseline.

## Goal

Connect multiple mailboxes through one gateway so development plans select a sending account without reconfiguring the AI workflow. Keep AI prospecting traffic organized separately from ordinary business correspondence.

## Connection adapters

The gateway supports adapters where the provider and account actually expose the required capability:
- MCP connector
- Provider-native API
- OAuth authorization
- SMTP for sending
- IMAP for receiving/synchronization

These are not interchangeable. A capability matrix must be recorded per connected account: send, receive, search, thread lookup, labels/folders, webhooks/push events, delivery events and unsubscribe support.

Do not claim an MCP or API-key connection removes all authorization. OAuth tokens, API keys, app passwords and MCP credentials can expire or be revoked. Connection health must be monitored.

## Mailbox configuration

Each account has:
- provider (Gmail, Tencent Enterprise Mail, other)
- display name and email address
- connection mode
- supported capabilities
- credential secret reference
- status and last successful sync
- selected development purposes/allowed plans
- daily/weekly limits
- bounce/complaint health and sending reputation status

Credentials are server-side only. No key or password is written to Postgres in plaintext or browser storage.

## Mail classification

Use a dedicated development identity/label/folder where supported. Suggested logical folders:
- AI Development / Sent
- AI Development / Received
- AI Development / Bounced
- AI Development / Rejected & Complaints
- AI Development / Engagement
- AI Development / Archived

Do not move or relabel ordinary business email based only on an AI guess. Classify using known sender account, plan ID, provider message/thread IDs, dedicated alias/identity and verified headers. Preserve the provider's original mailbox state unless the user has approved the organization rules.

## Thread and event matching

Prefer provider message ID, RFC Message-ID, In-Reply-To, References, thread ID and normalized sender/recipient endpoints. Use company/contact match only as secondary evidence. Ambiguous inbound mail goes to an unmatched review queue, not a guessed contact.

## Send and receive evidence

- Send request is not sent.
- Provider acceptance with message ID is accepted, not delivered.
- Delivery is recorded only with provider evidence.
- Open tracking is labelled as an unverified tracking event unless a reliable explicit read receipt is available.
- Bounce and complaint events update endpoint suppression state.
- Inbound replies are synced and pause the endpoint's cold outreach sequence.
- Reconcile uncertain outcomes before retrying.

## Provider adapters

### Gmail
Use a supported Gmail connector/API or MCP integration, with explicit scopes and account-level authorization. Verify send, history/thread read, labels and push/watch capabilities individually.

### Tencent Enterprise Mail
Prefer a supported provider API/MCP connector if available for the tenant. Otherwise use SMTP/IMAP or another officially supported access mode configured by the mailbox administrator. Test sending, receiving, folder management and authentication renewal separately.

### Other providers
Support provider-neutral adapter contracts; do not hard-code provider-specific behavior into the development plan or AI agent.

## Operational safety
- Dedicated sending accounts and domains where possible.
- SPF, DKIM and DMARC checks before production sending.
- Configurable low-volume warm-up and conservative per-account caps.
- Suppression list and unsubscribe enforcement.
- Provider health monitoring and automatic pause on elevated bounces/complaints.
- No automated mailbox cleanup outside the dedicated development labels/folders.
