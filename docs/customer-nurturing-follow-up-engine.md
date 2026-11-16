# Customer Nurturing & Multi-touch Follow-up Engine — Product Specification

Status: Approved product-design decision for the next workspace design iteration. This is a product specification, not a claim that the feature is implemented or connected to live mailboxes.

## 1. Confirmed operating decisions

1. Routine email outreach (initial email and follow-ups 2–4) is sent automatically only within a one-time, versioned user-approved development-plan authorization. Individual email approval is not required.
2. AI recommends the next follow-up time using the contact's local working hours, observed engagement events and that contact's historical interaction pattern.
3. AI may research, reason, draft, score, schedule and send email touches within the approved plan limits. AI must not expand the authorization or send outside the approved scope.
4. Email-open events are weak engagement signals, not proof that a person read or understood a message.
5. Every send, delivery, open, reply, bounce, unsubscribe and approval must be represented by its own evidence-backed event. AI text is not evidence.
6. The follow-up sequence is contact-specific, while the company account and opportunity provide shared context.

## 2. Where it belongs in the workspace

Add a dedicated **Customer Nurturing / 持续开发中心** workspace module. It should not be buried inside a large customer table.

Recommended views:
- **Due for review / 今日待审核** — AI-prepared follow-up drafts that need a human decision.
- **Engagement signals / 已检测互动** — opened-event, click-event and reply signals with confidence/source labels.
- **Active sequences / 跟进中的客户** — each contact's current touch number, next recommended time and pause reason.
- **Paused & nurture / 暂停与长期培育** — contacts paused by reply, bounce, unsubscribe, manual takeover, opportunity progression or sequence limit.
- **Sequence analytics / 跟进效果** — outcomes by touch number, product, market, contact role and message angle.

The customer profile should show a concise sequence summary and link into the detailed timeline. The Conversation Hub remains the place to handle actual replies and ongoing conversations.

## 3. Contact-level sequence model

A sequence belongs to a specific:
- Workspace
- Company
- Contact
- Contact method / recipient endpoint
- Development plan or campaign
- Channel account used for the outreach

Do not treat an entire company as one recipient. A company may have multiple people with different roles and different interaction histories. A reply from one contact pauses that contact's cold-outreach sequence immediately. The system must then assess company-level context before suggesting contact with another person; it must not blindly continue the same sequence to colleagues.

A sequence should record:
- Stable sequence ID and version
- Company, contact and endpoint IDs
- Development plan, product and market
- Current touch number: initial outreach, follow-up 2, follow-up 3, follow-up 4, then long-term nurture or closed
- Current state and pause/stop reason
- Previous touch IDs and timestamps
- Next recommended action and proposed local-time window
- AI timing rationale and confidence
- Human review status, reviewer, approval time and approved content version
- Provider message ID and send evidence, if sent
- Sequence limits, cooldown and suppression checks

The initial outreach plus follow-ups 2–4 is the default maximum cold sequence. Long-term nurture is a separate, lower-frequency plan requiring its own review and permission. Do not keep sending indefinitely.

## 4. Engagement event taxonomy and evidence quality

Keep these events distinct:

| Event | Meaning | Reporting rule |
|---|---|---|
| Send requested | User approved and a send request was submitted | Not yet sent |
| Provider accepted | Mail provider accepted the request and returned an identifier | Count as sent/accepted, not delivered |
| Delivered | Provider supplied a delivery event or reliable status | Count as delivered only with evidence |
| Open detected | Tracking pixel or provider event was triggered | Weak engagement signal only |
| Explicit read receipt | A supported protocol/provider supplied an explicit read receipt | Record separately; do not infer from a pixel |
| Link clicked | A tracked link event occurred | Record source and scanner/bot confidence |
| Replied | An inbound message was received and matched to the thread/contact | Strong interaction signal |
| Hard bounce | Provider reports a permanent delivery failure | Suppress the affected endpoint |
| Soft bounce | Temporary delivery issue | Apply bounded retry/review policy |
| Unsubscribe / complaint | Recipient opted out or complained | Immediately suppress the endpoint and apply required scope |

Email privacy proxies, image prefetching, corporate security scanners and automated link scanners can create false opens/clicks. Therefore:
- Never label a tracking-pixel event as a confirmed human read.
- Store event source, provider event ID, timestamp, endpoint, confidence and bot/proxy indicators where available.
- Deduplicate repeated events by provider event ID or stable event fingerprint.
- Repeated opens of the same email must not create multiple follow-up tasks.
- Open activity alone must never trigger an immediate send or prove purchase intent.
- If the provider cannot distinguish human activity from proxy/scanner activity, display **Open detected — unverified**.

For channels that do not provide reliable engagement events, do not fabricate read receipts. Use only official/provider-supported events and manual activity records.

## 5. AI timing recommendation

The AI timing engine proposes a follow-up window; it does not send the message.

Inputs:
- Verified contact timezone or best-supported timezone with a confidence label
- Recipient's local business hours and user-configured send windows
- Initial send and previous touch timestamps
- Open/click/reply events, including confidence and event source
- Contact's historical response times and previous engagement pattern
- Country/market context and verified holidays where a trusted calendar source is available
- Product, buyer role, campaign objective and previous message angle
- Previous follow-up intervals and sequence-level frequency limits
- Workspace quiet hours, mailbox limits and contact suppression status

Output:
- Recommended local date/time window
- Equivalent workspace-local time
- Rationale: why this window is recommended
- Confidence level and missing data
- Next touch angle and proposed value to the buyer
- Earliest allowed time and latest useful time under configured policy

If timezone or working hours are uncertain, show the uncertainty and request a human decision rather than pretending precision. Never schedule outside configured recipient-local sending windows. Respect weekends, holidays and workspace quiet hours when those calendars/settings are known.

The timing engine should use engagement as one signal among several. A suspected open may raise review priority, but it must not shorten a minimum cooldown or bypass human approval.

## 6. Plan authorization and deterministic send gate

Every follow-up is prepared by AI and checked by deterministic policy/quality gates. Routine emails inside the approved plan do not enter a per-message approval queue. The monitoring view must show:
- Company and contact identity, role and recipient endpoint
- Source and verification status of the contact details
- Previous message, previous send time and sequence touch number
- Engagement timeline with event confidence labels
- AI explanation of why this follow-up is timely
- Buyer's likely problem and the new value offered this time
- Comparison with previous messages to prevent repetitive wording
- Full message preview and subject
- Sending mailbox/channel account
- Recipient-local proposed send time and workspace-local equivalent
- Suppression, frequency and duplicate checks

Human actions:
- Pause or resume an authorized plan
- Edit plan scope and re-authorize when material fields change
- Pause or stop a contact sequence
- Review exceptions and low-confidence drafts
- Edit a future message strategy or disable automatic follow-up

The authorization is tied to an immutable plan version, permitted recipient scope, sending account, sequence cap, frequency limits, local-time windows, compliance settings and expiry. Any material change invalidates the authorization and requires a new human approval. The AI model cannot create or broaden authorization. A deterministic policy service must approve each send attempt against the active plan authorization and current suppression/event state.

## 7. Stop, pause and handoff rules

Immediately pause the affected contact sequence when:
- A reply is received
- A hard bounce is recorded
- An unsubscribe or complaint is received
- The contact is marked do-not-contact
- A human takes over the conversation
- A meeting, quotation or active opportunity changes the contact from cold outreach to sales follow-up
- The maximum configured touch count is reached

For soft bounces, temporary provider failures or uncertain send results, pause and reconcile before retrying. Never blindly resend after a timeout: first query provider status using the message ID/idempotency key where supported.

An unsubscribe/complaint must suppress future outreach according to the applicable scope and policy. A human may not casually override a legally required suppression.

## 8. Buyer-centric message strategy

Every follow-up must add a distinct reason for the buyer to engage. The AI must:
1. Review all previous messages and the buyer's known company context.
2. Identify what value was already offered.
3. Choose a genuinely new angle (e.g. application fit, operating cost, replacement compatibility, technical evidence, local market opportunity, case study, product range or a concise question).
4. Avoid repeating the company introduction and generic capability list.
5. Run a buyer-side test: would the recipient have a clear reason to reply, and is the ask easy to answer?
6. Compare against previous subject/body text and flag high similarity.
7. Abstain and recommend no follow-up if there is no new relevant value.

Possible progression:
- Initial outreach: a relevant business hypothesis and a concise buyer benefit.
- Follow-up 2: clarify one likely pain point or ask one easy qualification question.
- Follow-up 3: provide a useful, relevant proof point, technical note or market insight.
- Follow-up 4: offer an alternative cooperation path or politely check whether the topic is relevant now.
- Long-term nurture: only a genuinely new trigger such as a product update, market season or relevant case; avoid empty “just checking in” messages.

These are strategic options, not fixed templates. The AI must use evidence from the specific buyer and product.

## 9. Deduplication, idempotency and audit

- One active sequence per contact endpoint + campaign objective unless an authorized exception exists.
- A unique idempotency key for each approved send action.
- Repeated opens/clicks update an event timeline but do not multiply sequence steps.
- Before creating a follow-up draft, re-check replies, bounces, opt-outs, manual takeover and opportunity state.
- Persist immutable event history for every generated draft, edit, approval, rejection, send attempt, provider response, pause and stop.
- Store who approved, what exact version was approved, which mailbox was used, when it was sent and provider message ID.
- Never count a draft as a send, a provider acceptance as a delivery, an open as a reply, or an AI claim as evidence.

## 10. Analytics definitions

Report separately:
- Drafts generated
- Drafts reviewed / approved / rejected
- Send requests submitted
- Provider-accepted sends
- Confirmed deliveries
- Open-detected events (unverified and proxy-aware)
- Click events (scanner-aware)
- Replies received
- Positive/qualified replies
- Meetings / quotation requests / opportunities created
- Hard bounces, soft bounces, unsubscribes and complaints
- Conversion by touch number and message angle

Do not present “open rate” as a reliable measure of human reading. Label it as an observed tracking-event rate and disclose its limitations. Prefer reply, qualified-reply and opportunity conversion as business outcomes.

## 11. Acceptance tests before release

1. An initial email send is recorded with a provider message ID; the sequence advances only after the evidence is reconciled.
2. Multiple open events for the same message create one engagement summary, not multiple follow-up tasks.
3. A privacy-proxy/prefetch open is shown as unverified and does not trigger immediate follow-up.
4. AI proposes a recipient-local time window and explains the timing rationale; it does not send.
5. A follow-up inside an active plan authorization can be sent by the deterministic send worker only after the policy gate verifies recipient scope, endpoint health, cooldown, send limits, quality checks and suppression status.
6. Changing plan scope, sending account, recipient categories or material sending limits invalidates the authorization and requires human re-approval.
7. A reply pauses the contact's sequence and appears in the Conversation Hub.
8. A hard bounce suppresses only the failed endpoint while retaining company/contact records.
9. An unsubscribe/complaint blocks future sends according to suppression policy.
10. One contact's reply does not silently send the same sequence to another employee at the company.
11. A timeout after send submission triggers provider reconciliation, not blind resend.
12. The initial outreach plus follow-ups 2–4 reaches the configured sequence cap and then stops or moves to a separately approved nurture plan.
13. Every state and metric can be reconstructed from the append-only event ledger.
14. Analytics distinguish sent, delivered, open detected, replied and qualified reply.

## 12. Release boundary

This specification is approved for product design. The current preview has no connected production mailbox, open-tracking provider, reply synchronizer, scheduler or sending worker. The follow-up engine must not be represented as live until those integrations, evidence checks, human approval gates and acceptance tests have passed.
