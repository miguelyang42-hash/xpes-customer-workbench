# V3 Research Service — First Connection

This feature runs three bounded Exa searches and one AI synthesis request. It does not send email or update the CRM.

## Required server-side Vercel environment variables

Set these on the Vercel project **Preview** environment first (do not enable Production until testing is complete):

| Name | Purpose |
|---|---|
| `V3_RESEARCH_ACCESS_TOKEN` | Random private gate token required by the research endpoint |
| `EXA_API_KEY` | Exa search API key |
| `AI_GATEWAY_BASE_URL` | OpenAI-compatible API base URL, e.g. `https://api.example.com/v1` |
| `AI_GATEWAY_API_KEY` | API key for the selected default model provider |
| `AI_GATEWAY_MODEL` | Exact model ID supplied by the provider |

Never place these values in Git, browser local storage, source code, screenshots, or chat messages. The frontend research access-token input is session-only and sends the token as a request header; provider API keys stay server-side.

## Create the access token

Generate a random 32-byte token on your own computer. On Windows PowerShell:

```powershell
$bytes = New-Object byte[] 32
[System.Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
$token = [Convert]::ToBase64String($bytes).TrimEnd('=').Replace('+','-').Replace('/','_')
$token
```

Copy the generated value directly into the Vercel environment variable named `V3_RESEARCH_ACCESS_TOKEN`. Do not send it to ChatGPT or anyone else. Keep a private copy in your password manager.

## Vercel setup

1. Open Vercel → the `ai-sales-workspace` project → Settings → Environment Variables.
2. Add all five variables above to **Preview** only.
3. Use the provider's OpenAI-compatible base URL and exact model ID. Do not include `/chat/completions` unless your provider explicitly requires a custom route; the application appends it.
4. Save variables and trigger a new deployment of branch `v3-autonomous-customer-development`.
5. Open the preview URL, enter the product and market, and paste the access token into the Research Access Token field.
6. Test with a non-sensitive product/market pair. Verify report source links, dates, buyer segment evidence and unknowns.

## Security and cost boundaries

- The API requires the access token and all provider keys on the server. No API keys are exposed to the browser.
- Each accepted research run executes exactly three search requests, up to five results each, then one synthesis request.
- Results are URL-deduplicated and capped at 12 unique sources in the synthesis context.
- Research errors return a failed state; the UI must not claim a successful report.
- This is a preview integration. It is not yet a durable job queue, multi-user RBAC system, or production cost-control system.
- Rotate the access token if exposed. Disable Preview variables to shut the endpoint off.
- Keep Vercel SSO protection enabled. The token is an additional endpoint gate, not a substitute for authenticated workspace accounts.

## First acceptance test

Expected for a valid request:
- report contains product profile, market profile, buyer segments, decision roles, discovery terms, assumptions and gaps;
- every factual citation refers to one of the source IDs returned by search;
- every source link opens the original page;
- generated time and source count are shown;
- no email is sent and no customer record is written.

Expected for invalid/missing token or missing configuration:
- request fails clearly;
- no search/model provider call is made;
- no fake research result or completed status is stored.
