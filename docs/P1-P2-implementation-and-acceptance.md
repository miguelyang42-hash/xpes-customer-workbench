# P1 / P2 implementation notes

## P1 — Customer records

The customer area is designed around a compact account list. Each row surfaces only the fields needed for scanning:
- Company and country
- Company type and product interest
- Primary contact and email status
- Customer stage and next action

Opening a record reveals the fuller company profile, source URL, contact details, initial product interest, interaction-history status and next action.

The database separates entities instead of putting everything into one spreadsheet row:
- `companies`: company identity and business profile
- `contacts`: people and roles belonging to a company
- `contact_methods`: email, phone, WhatsApp and social endpoints with evidence, verification and suppression states
- `products`: the workspace product catalogue
- `opportunities` + `opportunity_products`: commercial opportunities and their product scope
- `interactions`: channel-neutral communication timeline
- `channel_accounts`: account metadata for multiple channel identities; credentials are stored outside Postgres

A contact endpoint is not considered verified merely because a value exists. Every endpoint carries a verification state, source, last checked time and suppression fields. Hard bounces can be suppressed without deleting the company or contact.

## P2 — Daily action and follow-up

The dashboard prioritizes due and overdue tasks. Tasks can be created from the task center or directly from a customer profile, and can be linked to a customer.

A task has:
- Stable ID, title, description and type
- Due date and priority
- Linked company/contact/opportunity/plan
- Owner/assignee
- Explicit status and completion time
- Append-only task event history

Marking a reminder complete is a manual user action only. It does not mean an email was sent, a WhatsApp message was delivered, a customer was contacted or an external task succeeded.

## P3 — Customer nurturing and multi-touch follow-up

The approved next product-design module is a dedicated Customer Nurturing Center. It manages the initial outreach plus follow-ups 2–4 and, when separately authorized, a bounded long-term nurture plan.

Confirmed user decisions:
- Every follow-up message requires human review and explicit approval before sending.
- AI recommends recipient-local timing using local working hours, engagement-event confidence and the contact's interaction history.
- AI may create drafts and reminders, but it does not autonomously send follow-ups.
- Open tracking is not proof of a human read; proxy/prefetch events are marked unverified.
- Replies, hard bounces, opt-outs, complaints and manual takeover pause or stop the relevant contact-level sequence.
- Company, contact, endpoint and opportunity lifecycles remain separate. A reply from one contact must not cause blind outreach to another employee.
- Every draft, approval, send attempt and provider event must be auditable. AI self-report is never execution evidence.

Detailed requirements and acceptance tests: `docs/customer-nurturing-follow-up-engine.md`.

## Safety and data ownership

- Every business table is workspace-scoped and protected by Row Level Security.
- Cross-workspace relationships are prevented with composite foreign keys.
- Task and audit event ledgers are append-only.
- Channel-account rows store only metadata and a secret reference. OAuth tokens and API keys must never be stored in these tables or browser code.
- The browser preview currently stores newly added customers and tasks in local storage only. It is a prototype, not a production database.

## Acceptance checks before production

1. Create a workspace and authenticate its owner.
2. Verify that a second workspace cannot read or write the first workspace's records.
3. Create one company with at least three contacts and multiple contact methods.
4. Mark one email as hard-bounced and confirm it is suppressed for future sends without deleting the company.
5. Create two opportunities for the same company with different products and currencies.
6. Create tasks due today, overdue and in the future; verify the dashboard counts and sorting.
7. Complete a task manually and confirm a task event is recorded; confirm no external message is sent.
8. Refresh and sign in from another device; confirm cloud records persist after Supabase is connected.
9. Export a company, contacts, opportunities, interactions and task history without losing relationships.
10. Confirm the system never reports an external send or delivery without provider evidence.

## Current release boundary

The current feature branch is a preview. The SQL migration has been prepared but not applied because the new isolated Supabase project has not yet been provisioned. The UI's new customer/task records are browser-local until cloud authentication and database integration are completed.
