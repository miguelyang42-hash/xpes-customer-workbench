# V3 AI Execution Engine

Status: Approved design baseline.

## Operating model

A development plan is created by a user. The user authorizes a bounded execution policy once. The engine may then autonomously execute internal research and authorized email outreach inside that scope. It may not expand the scope or permissions itself.

## Development plan authorization

A plan authorization is versioned and records:
- plan ID and immutable plan version
- approved products, markets, buyer profiles and exclusions
- target number of verified unique companies
- maximum candidate searches and maximum spend
- permitted research sources/provider accounts
- selected AI Gateway configuration
- permitted sending account(s)
- daily/weekly send caps and quiet hours
- permitted recipient categories and jurisdictional restrictions
- sequence cap (initial + follow-ups 2–4)
- follow-up timing policy and cooldowns
- automatic email send permission
- start/end/expiry time and revocation state
- approving user and timestamp

Any material change to scope, sending account, target markets, recipient categories, send limits or policy invalidates the prior authorization and requires renewed approval.

## Autonomous tasks

Within the approved plan, AI can:
- discover candidate companies
- deduplicate and verify companies
- research business fit and evidence
- discover contacts and contact endpoints
- assess confidence and qualification
- draft buyer-centric email content
- run quality gates
- schedule and send email touches within the approved policy
- synchronize inbound events
- propose internal tasks and timing
- analyze replies and recommend a human next action

## Human approval required

- LinkedIn, WhatsApp, Instagram and Facebook outbound actions
- company/contact merge
- cross-system CRM transfer
- material customer stage changes where configured as sensitive
- changes to do-not-contact/suppression status
- global sending rules, provider credentials or authorization scope
- deletion/export of sensitive data where policy requires confirmation

## Execution state machine

Task states:
- queued
- running
- awaiting_provider
- awaiting_verification
- completed_verified
- failed_retryable
- failed_terminal
- outcome_unknown
- blocked_by_policy
- cancelled

A task can enter completed_verified only when its acceptance criteria and evidence references pass independent validation.

## Task identity and reliability

Every run has a stable run ID. Every task has a stable task ID. Every execution attempt has a separate attempt ID. Every externally visible action has an idempotency key where the provider supports it.

Before retrying a send with an unknown outcome:
1. query provider status using provider message ID or idempotency key
2. reconcile mailbox sent folder/provider events
3. only retry when duplicate-send risk is resolved

Persist checkpoints, worker lease/heartbeat, attempt count, retry-after, failure category and terminal reason. Exhausted retries go to a review queue; they are never silently marked successful.

## Autonomous email send gate

Before every send, a deterministic policy service must check:
- active, unexpired authorization for this exact plan
- recipient belongs to the approved scope
- recipient and endpoint are not suppressed
- no reply already received
- no hard bounce, complaint or unsubscribe
- sequence touch and cooldown limits
- daily/weekly account limits
- recipient-local permitted sending window
- sender account is healthy and authorized
- message quality checks passed
- no materially changed plan/message scope requiring renewed approval

The AI model cannot bypass this gate. The send worker accepts only a validated send command from the policy service.

## Email content quality gate

- company/contact identity and source confidence above configured thresholds
- message contains a buyer-relevant reason to engage
- no unsupported claims, fabricated customer cases, fabricated certifications or guaranteed outcomes
- distinct value/angle from previous touches
- buyer-side reply-likelihood assessment
- subject/body similarity check against previous messages
- clear and easy-to-answer CTA
- localization and language checks
- applicable compliance and unsubscribe requirements
- fail closed when evidence is insufficient

Low-quality drafts are revised automatically a bounded number of times. If still failing, they are held for human attention; they are not sent to hit a quota.

## Customer nurturing

AI recommends the next local-time window using verified timezone confidence, local working hours, prior touch history, event confidence and contact history. An open pixel is weak evidence and cannot alone trigger a send or shorten cooldown. The approved plan may authorize automatic follow-ups 2–4, but all stop/suppression rules apply.

## Stop and pause rules

Immediately pause the relevant contact endpoint sequence on:
- inbound reply
- hard bounce
- unsubscribe/complaint
- do-not-contact flag
- manual takeover
- opportunity progression out of cold outreach
- plan authorization revoked/expired
- sending account/provider degraded or disconnected
- budget or rate limit reached

## Evidence and reporting

Store provider request/response IDs, source URLs, timestamps, message IDs, event IDs and verification outcomes. Never treat AI prose as evidence. Distinguish sent/accepted from delivered and open-detected from explicit read receipt.
