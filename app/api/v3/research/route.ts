import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

export const runtime = "nodejs";
export const maxDuration = 60;

type SearchResult={title?:string;url?:string;publishedDate?:string;highlights?:string[];text?:string;author?:string};
type SearchResponse={results?:SearchResult[]};

const clean=(v:unknown,max=300)=>typeof v==="string"?v.trim().slice(0,max):"";
const unique=(xs:string[])=>Array.from(new Set(xs.filter(Boolean)));
const safeUrl=(v:string)=>{try{const u=new URL(v);return u.protocol==="https:"||u.protocol==="http:"?u.toString():"";}catch{return "";}};

export async function POST(req:NextRequest){
 const gate=process.env.V3_RESEARCH_ACCESS_TOKEN;
 const supplied=req.headers.get("x-research-access-token")||"";
 if(!gate||supplied.length!==gate.length||!timingSafeEqual(Buffer.from(supplied),Buffer.from(gate))){
  return NextResponse.json({ok:false,error:"Research service is not configured or access is denied."},{status:503});
 }
 const exaKey=process.env.EXA_API_KEY;
 const modelKey=process.env.AI_GATEWAY_API_KEY;
 const model=process.env.AI_GATEWAY_MODEL;
 const base=(process.env.AI_GATEWAY_BASE_URL||"").replace(/\/$/,"");
 if(!exaKey||!modelKey||!model||!base){
  return NextResponse.json({ok:false,error:"Missing server configuration: EXA_API_KEY, AI_GATEWAY_BASE_URL, AI_GATEWAY_API_KEY, AI_GATEWAY_MODEL and V3_RESEARCH_ACCESS_TOKEN are required."},{status:503});
 }
 let body:{product?:unknown;market?:unknown};
 try{body=await req.json();}catch{return NextResponse.json({ok:false,error:"Invalid JSON request."},{status:400});}
 const product=clean(body.product,220),market=clean(body.market,180);
 if(product.length<2||market.length<2)return NextResponse.json({ok:false,error:"Enter a product and target market."},{status:400});
 const queries=[
  `Identify the product category, real-world applications, typical specifications and buying criteria for ${product}. Prefer manufacturers, technical documentation and established industry sources.`,
  `Research the ${product} market in ${market}: demand drivers, industry structure, distribution channels, competitor alternatives and relevant compliance issues. Prefer current official and industry sources.`,
  `Identify the most relevant types of companies and buyer decision-maker roles in ${market} that could buy, distribute, integrate, service or use ${product}. Find evidence-backed company examples and useful local-language search terms.`
 ];
 const headers={"Content-Type":"application/json","x-api-key":exaKey};
 const searchResults=await Promise.all(queries.map(async query=>{
  const r=await fetch("https://api.exa.ai/search",{method:"POST",headers,body:JSON.stringify({query,type:"auto",numResults:5,contents:{highlights:true}}),signal:AbortSignal.timeout(25000)});
  if(!r.ok)throw new Error("Search provider returned "+r.status);
  return await r.json() as SearchResponse;
 }));
 const merged=searchResults.flatMap(x=>x.results||[]);
 const seen=new Set<string>();
 const sources=merged.filter(x=>{const u=safeUrl(x.url||"");if(!u||seen.has(u))return false;seen.add(u);return true;}).slice(0,12).map((x,i)=>({
  id:"S"+(i+1),title:clean(x.title,240)||"Untitled source",url:safeUrl(x.url||""),
  publishedDate:clean(x.publishedDate,40)||null,
  excerpts:(x.highlights||[]).map(v=>clean(v,900)).filter(Boolean).slice(0,3),
  text:clean(x.text,1000)||undefined
 }));
 if(!sources.length)return NextResponse.json({ok:false,error:"Search returned no usable sources. Try a more specific product name or market."},{status:502});
 const system=`You are a B2B export-market research analyst. Produce concise, practical product-market intelligence for a sales development workspace. Use ONLY the supplied source evidence for factual claims. Distinguish sourced facts from reasoned hypotheses. Never invent market size, demand volumes, certifications, purchasing intent or named company facts. If evidence is thin, state unknown. Recommend buyer segments and job titles, not generic consumers unless the product is genuinely consumer-facing. Cite sources inline using [S1] style IDs. Return valid JSON only with this shape:
{
 "productProfile":{"normalizedName":"string","category":"string","applications":["string"],"buyingCriteria":["string"],"uncertainties":["string"]},
 "marketProfile":{"overview":"string","demandSignals":["string"],"channels":["string"],"competitorAlternatives":["string"],"complianceUnknowns":["string"]},
 "buyerSegments":[{"name":"string","priority":"High|Medium|Low","whyFit":"string","companyProfile":"string","decisionRoles":["string"],"buyingTriggers":["string"],"exclusions":["string"],"confidence":"High|Medium|Low","evidence":["S1"]}],
 "discoveryStrategy":{"keywords":["string"],"localLanguageQueries":["string"],"companySourceTypes":["string"]},
 "assumptions":["string"],"gaps":["string"],"recommendedNextStep":"string"
}
Keep the report useful, not verbose. Do not cite a source ID not present in input.`;
 const user=JSON.stringify({product,market,sources});
 const endpoint=base.endsWith("/chat/completions")?base:base+"/chat/completions";
 const modelResponse=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+modelKey},body:JSON.stringify({model,temperature:0.2,max_tokens:2800,response_format:{type:"json_object"},messages:[{role:"system",content:system},{role:"user",content:user}]}),signal:AbortSignal.timeout(35000)});
 if(!modelResponse.ok){const detail=(await modelResponse.text()).slice(0,500);return NextResponse.json({ok:false,error:"AI model request failed ("+modelResponse.status+"): "+detail},{status:502});}
 const payload=await modelResponse.json();
 const raw=payload?.choices?.[0]?.message?.content;
 let report:unknown;
 try{report=JSON.parse(typeof raw==="string"?raw:"");}catch{return NextResponse.json({ok:false,error:"AI response was not valid structured JSON. Please retry."},{status:502});}
 return NextResponse.json({ok:true,product,market,generatedAt:new Date().toISOString(),sourcesReviewed:merged.length,uniqueSources:sources.length,sources,report});
}
