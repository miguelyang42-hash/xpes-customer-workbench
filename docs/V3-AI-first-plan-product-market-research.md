# V3 AI-first Development Plan — Product × Market Discovery

## Approved product direction
The user does NOT want to manually fill buyer profiles, product knowledge bases, or extensive specifications before the AI can prospect. The minimum required inputs are:
1. Product name, short description, or public product link.
2. Target geography (country or market).

All other fields are suggestions or optional controls. The AI must independently research product context and relevant buyer markets, grounded in traceable sources, then propose customer targeting for quick user approval.

## Intended user flow
1. Enter product and market, press **Research product and market**.
2. Product intelligence: identify credible product category, use cases, critical buying criteria, common variants/limitations and industry terminology. Public product URLs may be consulted when authorized, but parsing a URL is not proof of correctness.
3. Market intelligence: local market structure, demand signals, import/distributor channels, regulations where relevant, competitor categories and local-language search terms.
4. Buyer segmentation: ranked potential customer types, specific decision-maker roles and company-fit indicators. Distinguish importers, distributors, OEMs, integrators, resellers and end users when appropriate.
5. Preliminary lead discovery: names/domains and evidence, with duplicate checks against the AI prospect database and optionally a read-only existing CRM matching adapter.
6. Output an editable research brief. Show evidence sources, dates, confidence level, assumptions, excluded segments and unanswered questions.
7. User accepts or lightly edits the suggested buyer segments and plan scope. Then authorize automation limits once (daily cap, recipient region, sequence limit, sending account).
8. Actual execution uses persistent task IDs and independent verification. No external send until a verified product/market brief and valid bounded plan authorization exist.

## Research confidence and source requirements
- Each claim that could materially influence target choice must carry a source URL/provider reference and retrieval date.
- Prefer primary sources, official company sites, trade directories with corroboration, and current market data.
- Do not invent market size, sales volume, product compatibility, certification or company purchase interest.
- If the product name is ambiguous, infer plausible categories but label the uncertainty and request a single clarifying distinction when it changes who the buyer is.
- If publicly accessible information is insufficient, explain gaps and optionally request a product PDF/specification, never make the upload mandatory.
- If a site is inaccessible or requires login, report that limitation rather than fabricate content.
- Do not claim a market study was run when no search/model adapter was connected.

## Concrete output schema
- product_profile: normalized name, category, critical applications, differentiation hypotheses, unsupported claims/limitations, source references
- market_profile: region, target segments, market drivers, competitive alternatives, compliance unknowns, country-specific terminology
- buyer_segments[]: segment name, rank, why-fit, typical company profile, target job titles, buying triggers, exclusion criteria, confidence, evidence
- discovery_strategy: multilingual search strings, company source categories, deduplication keys, recommended evidence threshold
- recommended_plan: provisional verified prospect target, candidate cap, geographical scope, rough estimated operating budget (only if grounded), outreach sequence strategy and compliance checks
- review_required: ambiguous product properties and unresolved high-impact factual dependencies

## Cost controls
- A compact initial product classification call and a bounded source-search batch.
- Reuse an evidence cache by product signature + market; TTL based on source volatility.
- Source-driven extraction, not repeated high-token brainstorming with multiple models.
- One default configured AI model and one unified search adapter.
- Budget-limited exploration, early stopping after adequate evidence, bounded retry count.
- Trace all costs per research run and show only verifiable metrics.

## Preview behavior (current)
The V3 modal now requires only product and market. Optional operational limits remain collapsed. Research result sections are a blueprint with **Awaiting research** statuses. The research button explicitly states that no live model/search services are connected, and it cannot claim real research or buyer identification. Local plans are drafts; production execution stays locked. Production authorization is blocked until research is verified.

## Integration acceptance tests
1. Enter a never-before-seen product and a country, with no preloaded product library; confirm that source-backed product categorization and buyer segmentation appear.
2. Input a product URL; confirm the same evidence-based pipeline, with honest handling of inaccessible pages.
3. Enter an ambiguous product name; confirm that assumptions are labelled and clarified only when material.
4. Search a niche/regulated product; confirm critical uncertainties are flagged and no fabricated certification is asserted.
5. Generate ranked buyer segments and multilingual keyword searches with sources.
6. Verify that prospective companies are real and unique before counting.
7. Confirm saved brief can be edited by a user without deleting original source provenance.
8. Confirm duplicate research uses cached sources where valid, with explicit freshness.
9. Simulate AI/search provider failure; research state must be failed/blocked, never completed.
10. Confirm no outgoing emails are possible before verified research and bounded plan authorization.
