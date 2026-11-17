# V3 Research Service — First Connection

The research flow makes three bounded Exa searches and one AI synthesis request. It does not send email, contact customers, or update the CRM.

## Preview environment variables

Set these on the Vercel project **Preview** environment:

| Name | Purpose |
|---|---|
| `EXA_API_KEY` | Exa search API key |
| `AI_GATEWAY_BASE_URL` | OpenAI-compatible API base URL, e.g. `https://api.example.com/v1` |
| `AI_GATEWAY_API_KEY` | API key for the selected default model provider |
| `AI_GATEWAY_MODEL` | Exact model ID supplied by the provider |

The Preview deployment is protected by Vercel SSO. The research page therefore does not ask the user to enter a second access token. Keep Preview deployment protection enabled; do not share protection-bypass links.

`V3_RESEARCH_ACCESS_TOKEN` remains optional for local development and any deployment that does not use Vercel Preview protection. If configured, use a random 32-byte value and keep it private. Production must not expose the research endpoint without an authenticated access control.

Never place provider API keys in Git, browser local storage, source code, screenshots, or chat messages. Provider keys are read only by the server.

## Vercel setup

1. Open Vercel → the `ai-sales-workspace` project → Settings → Environment Variables.
2. Add the four required variables above to **Preview** only.
3. Use the provider's OpenAI-compatible base URL and exact model ID. The application appends `/chat/completions`; do not include that path unless the provider explicitly requires a custom route.
4. Save variables and redeploy branch `v3-autonomous-customer-development`.
5. Open the latest Preview deployment, sign in through Vercel, and enter a product and target market in the development-plan research form.
6. Check report citations, source links, buyer-segment evidence and stated information gaps.

## Security and cost boundaries

- Vercel SSO protects the Preview page and its same-origin research API. Local development and non-Preview deployments require the optional research access token.
- Each accepted research run executes three search requests, up to five results each, then one synthesis request.
- Results are URL-deduplicated and capped at 12 unique sources in the synthesis context.
- Research errors return a failed state; the UI must not claim a successful report.
- This is a Preview integration, not yet a durable job queue, multi-user RBAC system, or production cost-control system.
- Keep Vercel Preview protection enabled. Revoke provider keys if they appear in a screenshot or chat message.

## First acceptance test

For a valid request, the report should contain a product profile, market profile, buyer segments, decision roles, discovery terms, assumptions and information gaps. Every factual citation must refer to a returned source ID, every source link should open the original page, and the report should show its generated time and source count. No email is sent and no customer record is written.

If a provider configuration is missing or a request fails, the page should show a clear failure. It must not display fake research results or store a completed status.
