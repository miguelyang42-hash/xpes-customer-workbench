# V3 integration delivery plan

## Implemented
- Settings service catalog backed by GET /api/v3/integrations.
- API credential presence is labelled configured, never connected or verified.
- OAuth services remain not connected until persisted grants and provider verification exist.
- Responses contain no credentials or environment values. No browser-local authorization simulation.

## Next implementation gates
1. Workspace authentication and server-side membership checks.
2. Durable database with workspace-isolated connections, encrypted credentials and audit events.
3. Google OAuth application registration and stable callback URL. Use state, PKCE and single-use callback validation. Request permissions incrementally.
4. Verify the granted account and permissions, persist the connection, then display connected account and authorized capabilities.
5. Refresh/revocation handling, reconnect and disconnect; audit changes without logging tokens.
6. Microsoft mailbox connector, Tencent mailbox connection appropriate to its supported method, approved social platform integrations.
7. Personal WhatsApp linked-device support and Business Platform support require separate implementation choices; do not silently migrate a personal number.

## Acceptance
- Authorization cancelled, expired or rejected never produces a connected state.
- Configuration presence does not count as a successful service call.
- AI has access only to granted capabilities through server-side tools, never raw credentials.
- Multi-account connections are isolated by workspace and number/account identity.
- Unsupported capabilities and missing platform approvals are visible before attempting authorization.
- Customer credibility assessments retain source URLs and uncertainty; account connection alone does not establish authenticity.

## Operator configuration still required
Current deployment has AI/search configuration only. OAuth client applications, workspace identity and durable credential storage are not configured. Preview deployment protection is not a substitute for workspace authentication.
