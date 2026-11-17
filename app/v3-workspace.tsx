"use client";

import {useEffect,useState} from "react";
import {AlertTriangle,ArrowRight,BookOpen,CheckCircle2,Clock3,Database,FileCheck2,Globe2,Inbox,Mail,PauseCircle,Play,Plus,RefreshCw,Search,Send,Settings2,ShieldCheck,Target,Users,WifiOff,Zap} from "lucide-react";

type T=(key:string)=>string;
type Plan={
 id:string; name:string; product:string; countries:string; buyers:string; goal:number; candidateCap:number;
 dailyLimit:number; weeklyLimit:number; maxTouches:number; startHour:string; endHour:string;
 mailbox:string; scopeApproved:boolean; approvalTime?:string; updatedAt:string; stage:"draft"|"authorized";
};
type Run={id:string;planId:string;createdAt:string;status:"blocked";reason:string};
const initialPlans:Plan[]=[
 {id:"template-southamerica",name:"Solar Mosquito Killer · South America",product:"Solar mosquito killer",countries:"Peru, Chile, Brazil",buyers:"Importers, brands, distributors",goal:100,candidateCap:400,dailyLimit:25,weeklyLimit:100,maxTouches:4,startHour:"09:00",endHour:"17:00",mailbox:"",scopeApproved:false,updatedAt:"",stage:"draft"},
 {id:"template-toc",name:"185nm TOC Replacement Lamps",product:"185nm TOC UV lamps",countries:"North America, Taiwan, Southeast Asia",buyers:"Ultrapure-water system integrators and service providers",goal:100,candidateCap:400,dailyLimit:20,weeklyLimit:80,maxTouches:4,startHour:"09:00",endHour:"17:00",mailbox:"",scopeApproved:false,updatedAt:"",stage:"draft"}
];
const zh:Record<string,string>={
 "Launch Center":"一键开发中心","Create development plan":"新建开发计划","Development plan":"开发计划","Configured plans":"开发计划","Choose or edit a plan, then verify launch conditions.":"选择或编辑计划，再检查启动条件。","New plan":"新建计划","Plan name":"计划名称","Product":"产品","Target countries":"目标国家","Buyer profile":"目标买家","Verified customer target":"有效客户目标","Maximum search candidates":"最多搜索候选企业","Daily email limit":"每日发件上限","Weekly email limit":"每周发件上限","Maximum touches per contact":"每个联系人最多触达次数","Local sending window":"客户当地发件时段","Sending account":"发件邮箱","No mailboxes connected":"暂无已连接邮箱","Draft":"草稿","Authorization scope":"开发授权范围","Approve plan policy":"确认开发授权策略","Revoke authorization":"撤销计划授权","Authorization saved as local preview only. Sending is still disabled.":"本地预览已记录授权意向；真实发送仍然禁用。","No production authorization was created.":"未创建任何生产授权。","Plan settings changed; prior authorization cleared.":"计划发生修改，原授权已失效。","Save plan":"保存计划","Edit plan":"编辑计划","Prepare launch":"准备启动","Launch readiness":"启动检查","Live start unavailable":"尚不可真实启动","Run evidence":"执行证据","No verified execution records":"尚无已核实执行记录","We never count drafts or AI claims as completed work.":"不会将草稿或 AI 自述当作实际完成。","Missing prerequisites":"未满足的条件","Independent database":"独立数据库","Execution workers":"任务执行器","Search and verification provider":"搜索与核实服务","Connected sending mailbox":"已连接发件邮箱","Policy and suppression checks":"策略与禁发检查","Attempt blocked":"启动被拦截","The current prototype cannot run external jobs or send emails.":"当前原型不能执行外部任务或发送邮件。","This is a configuration preview only. No search, mail, or CRM update occurred.":"仅为配置预览，没有搜索、发信或修改 CRM。","Automatic email after plan authorization":"计划授权后自动发送邮件","No per-message approval for email; social outreach is always human operated.":"邮件不逐封审核；社交平台仍由人工触达。","Review checklist":"启动前检查","Edit":"编辑","Close":"关闭","Back":"返回","Select plan":"选择计划","No active run":"当前没有执行任务","Requires database, worker, provider and mailbox connections.":"需要连接数据库、执行器、服务和邮箱。","Approval does not connect accounts or authorize production sending.":"本地授权不代表账号已连接或生产发送已启用。","Cancel":"取消","Saved locally":"已保存在此浏览器","No real messages sent":"没有发送任何真实消息","Plan authorization":"计划授权","Production send locked":"生产发送已锁定","Connection status":"连接状态","Not connected":"未连接","Configured account":"账号配置","Add account":"添加账号","Mail Gateway":"统一邮箱网关","Account connection methods":"邮箱接入方式","Provider":"服务商","Address":"邮箱地址","Connection method":"连接方式","Account nickname":"账号名称","Gmail":"Gmail","Tencent Enterprise Mail":"腾讯企业邮箱","Other provider":"其他服务商","Save account draft":"保存账号配置草稿","This records an account configuration draft only; no credentials are requested or stored.":"仅保存账号配置草稿，不会要求或储存密钥。","Mail sync":"邮件同步","AI development folders":"AI 开发邮件分类","Sent":"已发送","Received":"已收到","Bounced":"退信","Rejected":"拒收","Engagement":"互动","Archived":"归档","Credentials must be configured in the secure server connection flow after backend deployment.":"后端上线后须通过安全服务端流程配置密钥。","AI Gateway":"统一 AI 网关","One default model":"一个默认模型","API base URL":"API 接口地址","Model identifier":"模型名称","Fallback disabled by default":"备用模型默认关闭","Do not enter an API key in this browser preview.":"不要在浏览器预览中填写 API Key。","Save model configuration draft":"保存模型配置草稿","No model is connected; the preview cannot call AI.":"尚未连接模型；预览不会调用 AI。","Customer Nurturing":"客户持续开发","Four-touch sequence":"四轮开发序列","Initial outreach":"首次开发","Follow-up 2":"二次开发","Follow-up 3":"三次开发","Follow-up 4":"四次开发","Long-term nurture":"长期培育","Email follow-ups may auto-send only inside an active approved plan.":"邮件跟进仅可在有效授权计划内自动发送。","Tracking pixels are not confirmed human reads.":"追踪像素事件不代表真人已读。","Reply or hard bounce stops the contact sequence.":"回复或硬退信将停止联系人序列。","All figures stay empty until real events are verified.":"真实事件核验前不显示业绩数据。","Effective prospects":"有效客户","Accepted emails":"服务商接受邮件","Qualified replies":"有效回复","Pending exceptions":"待处理异常","Sequence monitor":"跟进序列监控","No live sequence records yet":"目前没有真实序列记录","Review required":"需要人工处理","Social messages":"社媒消息","Human only":"仅人工触达","System boundary":"系统隔离","Existing CRM remains independent and read-only from this workspace.":"原有 CRM 与此工作台独立，仅允许受控只读核对。","Changes to prospect records cannot modify the existing CRM.":"对潜客库的操作不会修改原 CRM。","Provider connection":"服务连接","No service has been connected.":"未连接任何服务。","Start with product and market":"只需要输入产品和市场",
 "No knowledge base required. The AI should research the product, market and buyer segments from verifiable sources.":"无需搭建知识库。AI 应通过可核实的信息来源研究产品、市场和买家群体。",
 "Product or product link":"产品名称或产品链接",
 "Target market or countries":"目标市场或国家",
 "Example product input":"例如：185nm TOC UV lamps，或产品官网链接",
 "Example market input":"例如：美国、台湾、马来西亚",
 "AI product & market intelligence":"AI 产品与市场研究",
 "Discover actual applications, regional demand, buyer segments, decision makers, competing solutions and search terms, with citations and confidence ratings.":"自动研究产品应用、当地需求、客户类型、决策人、竞争方案和搜索关键词，并附来源与可信度。",
 "Research product and market":"开始 AI 市场研究",
 "Research queued for integration, not executed":"研究功能等待接入，尚未执行",
 "No live search or AI model is connected yet. The system has not analyzed your market and has not identified real customers.":"尚未连接实时搜索和 AI 模型，因此没有完成市场分析，也没有找到真实客户。",
 "Research report will include":"研究结果将包含",
 "Product recognition":"产品识别与理解",
 "Uses, product specifications, buying factors and constraints":"应用场景、关键参数、采购关注点和产品限制",
 "Target market analysis":"目标市场分析",
 "Demand drivers, local competition, channels and regulatory considerations":"需求来源、当地竞争、销售渠道及相关法规",
 "Recommended buyer segments":"推荐客户群体",
 "Buyer companies, relevant roles, priority ranking and exclusions":"企业类型、决策岗位、客户优先级和排除条件",
 "Discovery strategy":"客户发现策略",
 "Country-language keywords and independently verifiable company sources":"当地语言搜索词和可追溯的企业信息来源",
 "Awaiting research":"等待研究",
 "Optional: adjust development limits":"可选：展开开发限制设置",
 "Hide optional settings":"收起可选设置",
 "Draft only. Saving does not imply market research is complete or approve email sending.":"只保存开发意向；不代表已完成市场研究，也不代表授权发送邮件。",
 "Save research brief":"保存开发意向",
 "Verified product and market research must be completed first":"需要先完成产品和市场研究并核实结果",
"Research access token":"研究访问令牌",
 "Enter the workspace research access token":"输入工作台研究访问令牌",
 "This token is held only in this page session and is not saved.":"令牌仅在当前页面会话中使用，不会保存。",
 "Researching...":"研究中...",
 "Research in progress":"正在研究",
 "Searching product applications, market signals and relevant buyer segments.":"正在搜索产品应用、市场信号和匹配的买家群体。",
 "Research could not be completed":"研究未能完成",
 "Research report ready":"研究报告已生成",
 "unique sources":"个独立来源",
 "Clear report":"清除报告",
 "Product applications":"产品应用场景",
 "Market overview":"市场概况",
 "Decision roles":"决策岗位",
 "Evidence":"依据来源",
 "Discovery keywords":"客户开发关键词",
 "Assumptions and research gaps":"研究假设与信息缺口",
 "Sources":"信息来源",
 "Publication date unavailable":"发布日期未提供",
 "confidence":"可信度",
 "High":"高",
 "Medium":"中",
 "Low":"低"
};
const local=(t:T,k:string)=>t(k)===k?(typeof window!=="undefined"&&document.documentElement.lang==="zh-CN"?(zh[k]||k):k):t(k);
const dateNow=()=>new Date().toISOString();
const blank=():Plan=>({id:"local-"+Date.now(),name:"",product:"",countries:"",buyers:"",goal:100,candidateCap:400,dailyLimit:20,weeklyLimit:80,maxTouches:4,startHour:"09:00",endHour:"17:00",mailbox:"",scopeApproved:false,updatedAt:"",stage:"draft"});

export function V3LaunchCenter({t}:{t:T}){
 const l=(key:string)=>local(t,key);
 const [plans,setPlans]=useState<Plan[]>(initialPlans);
 const [selected,setSelected]=useState<string>(initialPlans[0].id);
 const [edit,setEdit]=useState(false); const [advanced,setAdvanced]=useState(false); const [current,setCurrent]=useState<Plan>(initialPlans[0]);
 const [researchStatus,setResearchStatus]=useState<"idle"|"pending"|"done"|"error">("idle");
 const [researchError,setResearchError]=useState("");
 const [researchResult,setResearchResult]=useState<any>(null);
 const runResearch=async()=>{setResearchStatus("pending");setResearchError("");setResearchResult(null);try{const r=await fetch("/api/v3/research",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({product:current.product,market:current.countries})});const data=await r.json();if(!r.ok||!data.ok)throw new Error(data.error||"Research failed");setResearchResult(data);setResearchStatus("done");}catch(e){setResearchError(e instanceof Error?e.message:"Research request failed");setResearchStatus("error");}};
 const [runs,setRuns]=useState<Run[]>([]);
 const [hydrated,setHydrated]=useState(false);
 useEffect(()=>{try{const x=window.localStorage.getItem("ai-v3-plan-drafts");if(x){const parsed=JSON.parse(x);if(Array.isArray(parsed)&&parsed.length)setPlans(parsed);}const y=window.localStorage.getItem("ai-v3-run-attempts");if(y){const parsed=JSON.parse(y);if(Array.isArray(parsed))setRuns(parsed);}}catch{}setHydrated(true);},[]);
 useEffect(()=>{if(hydrated){window.localStorage.setItem("ai-v3-plan-drafts",JSON.stringify(plans));window.localStorage.setItem("ai-v3-run-attempts",JSON.stringify(runs));}},[plans,runs,hydrated]);
 const chosen=plans.find(x=>x.id===selected)||plans[0];
 const editPlan=(p:Plan)=>{setCurrent({...p});setSelected(p.id);setAdvanced(false);setResearchStatus("idle");setResearchError("");setResearchResult(null);setEdit(true);};
 const change=(key:keyof Plan,value:string|number)=>setCurrent(old=>({...old,[key]:value,scopeApproved:false,approvalTime:undefined,stage:"draft"}));
 const save=()=>{if(!current.product.trim()||!current.countries.trim())return;const next={...current,name:current.name.trim()||current.product.trim()+" · "+current.countries.trim(),updatedAt:dateNow()};setPlans(prev=>[...prev.filter(x=>x.id!==current.id),next]);setSelected(next.id);setEdit(false);};
 const revoke=()=>setPlans(prev=>prev.map(x=>x.id===chosen.id?{...x,scopeApproved:false,approvalTime:undefined,stage:"draft"}:x));
 const blocked=()=>{if(!chosen)return;setRuns(prev=>[{id:"LOCAL-"+Date.now(),planId:chosen.id,createdAt:dateNow(),status:"blocked",reason:"No cloud database, execution workers, research connector or sending mailbox"},...prev]);};
 return <section className="v3-wrap">
 <div className="page-heading"><div><div className="eyebrow">V3 · AUTONOMOUS PROSPECTING</div><h1>{l("Launch Center")}</h1><p>{l("Choose or edit a plan, then verify launch conditions.")}</p></div><button className="primary-button" onClick={()=>editPlan(blank())}><Plus size={17}/>{l("New plan")}</button></div>
 <div className="v3-alert"><ShieldCheck size={20}/><div><strong>{l("Automatic email after plan authorization")}</strong><p>{l("No per-message approval for email; social outreach is always human operated.")} {l("This is a configuration preview only. No search, mail, or CRM update occurred.")}</p></div></div>
 <div className="v3-layout">
 <div className="v3-plan-list"><div className="v3-subheading">{l("Configured plans")}</div>{plans.map(p=><button key={p.id} className={"v3-plan-row "+(p.id===selected?"chosen":"")} onClick={()=>setSelected(p.id)}><strong>{p.name}</strong><span>{p.countries}</span><small>{p.scopeApproved?l("Plan authorization"):l("Draft")}</small></button>)}</div>
 {chosen&&<div className="v3-main-panel">
 <div className="v3-panel-top"><div><div className="eyebrow">{l("Development plan")}</div><h2>{chosen.name}</h2><p>{chosen.product} · {chosen.buyers}</p></div><button className="secondary-button compact" onClick={()=>editPlan(chosen)}>{l("Edit")}</button></div>
 <div className="v3-stats"><div><span>{l("Verified customer target")}</span><strong>{chosen.goal}</strong></div><div><span>{l("Maximum search candidates")}</span><strong>{chosen.candidateCap}</strong></div><div><span>{l("Daily email limit")}</span><strong>{chosen.dailyLimit}</strong></div><div><span>{l("Maximum touches per contact")}</span><strong>{chosen.maxTouches}</strong></div></div>
 <div className="v3-config"><span>{l("Target countries")}: <strong>{chosen.countries}</strong></span><span>{l("Local sending window")}: <strong>{chosen.startHour}–{chosen.endHour}</strong></span><span>{l("Sending account")}: <strong>{chosen.mailbox||l("No mailboxes connected")}</strong></span></div>
 <div className="v3-authorization"><div><h3>{l("Plan authorization")}</h3><p>{l("Approval does not connect accounts or authorize production sending.")}</p></div>{chosen.scopeApproved?<button className="secondary-button" onClick={revoke}>{l("Revoke authorization")}</button>:<button className="secondary-button" disabled title={l("Verified product and market research must be completed first")}><ShieldCheck size={16}/>{l("Approve plan policy")}</button>}</div>
 <div className="v3-preflight"><h3>{l("Launch readiness")}</h3>{[
 [l("Independent database"),false],[l("Execution workers"),false],[l("Search and verification provider"),false],[l("Connected sending mailbox"),false],[l("Policy and suppression checks"),false],
 ].map(([label,ready],i)=><div className="v3-check" key={i}><span>{ready?<CheckCircle2 size={16}/>:<AlertTriangle size={16}/>} {label}</span><small>{l("Not connected")}</small></div>)}
 <div className="v3-cta"><button className="primary-button" onClick={blocked}><Play size={17}/>{l("Prepare launch")}</button><strong>{l("Production send locked")}</strong></div><p className="v3-small">{l("Requires database, worker, provider and mailbox connections.")}</p></div>
 </div>}</div>
 <div className="v3-section"><h2>{l("Run evidence")}</h2><p>{l("We never count drafts or AI claims as completed work.")}</p>{runs.length?runs.slice(0,6).map(r=><div className="v3-run" key={r.id}><span>{r.id} · {new Date(r.createdAt).toLocaleString()}</span><strong>{l("Attempt blocked")}</strong><small>{l("The current prototype cannot run external jobs or send emails.")}</small></div>):<div className="v3-empty"><FileCheck2 size={25}/><strong>{l("No verified execution records")}</strong><p>{l("No active run")}</p></div>}</div>
 {edit&&<div className="modal-backdrop"><div className="workspace-modal v3-form v3-research-form">
 <div className="modal-heading"><div><div className="eyebrow">AI-FIRST DEVELOPMENT PLANNING</div><h2>{l("Start with product and market")}</h2><p>{l("No knowledge base required. The AI should research the product, market and buyer segments from verifiable sources.")}</p></div><button type="button" className="icon-button" onClick={()=>setEdit(false)} aria-label={l("Close")}>×</button></div>
 <div className="v3-essential-fields">
 <label>{l("Product or product link")} <span>*</span><input required value={current.product} placeholder={l("Example product input")} onChange={e=>change("product",e.target.value)}/></label>
 <label>{l("Target market or countries")} <span>*</span><input required value={current.countries} placeholder={l("Example market input")} onChange={e=>change("countries",e.target.value)}/></label>
 </div>
 <div className="v3-research-step"><div><strong>{l("AI product & market intelligence")}</strong><p>{l("Discover actual applications, regional demand, buyer segments, decision makers, competing solutions and search terms, with citations and confidence ratings.")}</p></div><button type="button" className="secondary-button" onClick={runResearch} disabled={!current.product.trim()||!current.countries.trim()||researchStatus==="pending"}><Search size={16}/>{researchStatus==="pending"?l("Researching..."):l("Research product and market")}</button></div>
 {researchStatus==="pending"&&<div className="v3-research-unavailable"><RefreshCw size={18}/><div><strong>{l("Research in progress")}</strong><p>{l("Searching product applications, market signals and relevant buyer segments.")}</p></div></div>}
 {researchStatus==="error"&&<div className="v3-research-unavailable"><AlertTriangle size={18}/><div><strong>{l("Research could not be completed")}</strong><p>{researchError}</p></div></div>}
 {researchStatus==="done"&&researchResult&&<div className="v3-live-report">
 <div className="v3-live-report-head"><div><strong>{l("Research report ready")}</strong><small>{researchResult.uniqueSources} {l("unique sources")} · {new Date(researchResult.generatedAt).toLocaleString()}</small></div><button type="button" className="secondary-button compact" onClick={()=>{setResearchResult(null);setResearchStatus("idle");}}>{l("Clear report")}</button></div>
 <h3>{researchResult.report?.productProfile?.normalizedName||current.product}</h3><p>{researchResult.report?.productProfile?.category}</p>
 <h4>{l("Product applications")}</h4><ul>{(researchResult.report?.productProfile?.applications||[]).map((x:string,i:number)=><li key={i}>{x}</li>)}</ul>
 <h4>{l("Market overview")}</h4><p>{researchResult.report?.marketProfile?.overview}</p>
 <h4>{l("Recommended buyer segments")}</h4>{(researchResult.report?.buyerSegments||[]).map((x:any,i:number)=><div className="v3-buyer-segment" key={i}><div><strong>{i+1}. {x.name}</strong><span>{l(x.priority)} · {l(x.confidence)} {l("confidence")}</span></div><p>{x.whyFit}</p><small>{l("Decision roles")}: {(x.decisionRoles||[]).join(", ")}</small><small>{l("Evidence")}: {(x.evidence||[]).join(", ")}</small></div>)}
 <h4>{l("Discovery keywords")}</h4><div className="v3-keyword-list">{(researchResult.report?.discoveryStrategy?.keywords||[]).map((x:string,i:number)=><span key={i}>{x}</span>)}</div>
 <h4>{l("Assumptions and research gaps")}</h4><ul>{[...(researchResult.report?.assumptions||[]),...(researchResult.report?.gaps||[])].map((x:string,i:number)=><li key={i}>{x}</li>)}</ul>
 <h4>{l("Sources")}</h4><ol>{(researchResult.sources||[]).map((x:any)=><li key={x.id}><a href={x.url} target="_blank" rel="noreferrer">{x.title}</a><small>{x.id} · {x.publishedDate||l("Publication date unavailable")}</small></li>)}</ol>
 </div>}
 <div className="v3-research-output">
 <div className="v3-subheading">{l("Research report will include")}</div>
 {[
 ["package",l("Product recognition"),l("Uses, product specifications, buying factors and constraints")],
 ["globe",l("Target market analysis"),l("Demand drivers, local competition, channels and regulatory considerations")],
 ["users",l("Recommended buyer segments"),l("Buyer companies, relevant roles, priority ranking and exclusions")],
 ["search",l("Discovery strategy"),l("Country-language keywords and independently verifiable company sources")]
 ].map(([icon,title,desc])=><div className="v3-research-output-row" key={title}><span className="v3-research-output-icon">{icon==="package"?<BookOpen size={16}/>:icon==="globe"?<Globe2 size={16}/>:icon==="users"?<Users size={16}/>:<Search size={16}/>}</span><div><strong>{title}</strong><small>{desc}</small></div><span className="v3-output-pending">{l("Awaiting research")}</span></div>)}
 </div>
 <button type="button" className="v3-advanced-trigger" onClick={()=>setAdvanced(x=>!x)}>{advanced?l("Hide optional settings"):l("Optional: adjust development limits")} <ArrowRight size={15}/></button>
 {advanced&&<div className="form-grid v3-advanced-fields">{([
 ["name","Plan name","text"],["buyers","Buyer profile","text"],["goal","Verified customer target","number"],["candidateCap","Maximum search candidates","number"],["dailyLimit","Daily email limit","number"],["weeklyLimit","Weekly email limit","number"],["maxTouches","Maximum touches per contact","number"],["startHour","Local sending window","time"],["endHour","Local sending window","time"]
 ] as const).map(([key,label,type])=><label key={key}>{l(label)}<input type={type} min={type==="number"?"1":undefined} value={current[key]} onChange={e=>change(key,type==="number"?Math.max(1,Number(e.target.value)):e.target.value)} /></label>)}</div>}
 <div className="modal-foot"><span>{l("Draft only. Saving does not imply market research is complete or approve email sending.")}</span><div><button className="secondary-button" onClick={()=>setEdit(false)}>{l("Cancel")}</button><button className="primary-button" disabled={!current.product.trim()||!current.countries.trim()} onClick={save}>{l("Save research brief")}</button></div></div>
 </div></div>}
 </section>;
}

type Account={id:string;provider:string;address:string;method:string;nickname:string};
export function V3MailGateway({t}:{t:T}){
 const l=(k:string)=>local(t,k);const [accounts,setAccounts]=useState<Account[]>([]);
 const [address,setAddress]=useState("");const [method,setMethod]=useState("MCP");const [provider,setProvider]=useState("Gmail");const [nickname,setNickname]=useState("");
 const [ready,setReady]=useState(false);
 useEffect(()=>{try{const x=window.localStorage.getItem("ai-v3-mail-account-drafts");if(x){const parsed=JSON.parse(x);if(Array.isArray(parsed))setAccounts(parsed);}}catch{}setReady(true);},[]);
 useEffect(()=>{if(ready)window.localStorage.setItem("ai-v3-mail-account-drafts",JSON.stringify(accounts));},[accounts,ready]);
 const add=()=>{if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.trim()))return;setAccounts(old=>[...old,{id:String(Date.now()),address:address.trim(),method,provider,nickname:nickname.trim()||address.trim()}]);setAddress("");setNickname("");};
 return <section className="v3-wrap"><div className="page-heading"><div><div className="eyebrow">V3 · MULTI-ACCOUNT CONNECTORS</div><h1>{l("Mail Gateway")}</h1><p>{l("Credentials must be configured in the secure server connection flow after backend deployment.")}</p></div></div>
 <div className="v3-alert"><ShieldCheck size={19}/><div><strong>{l("This records an account configuration draft only; no credentials are requested or stored.")}</strong><p>{l("No service has been connected.")}</p></div></div>
 <div className="v3-layout"><div className="v3-main-panel"><h2>{l("Add account")}</h2><div className="form-grid"><label>{l("Provider")}<select value={provider} onChange={e=>setProvider(e.target.value)}><option value="Gmail">{l("Gmail")}</option><option value="Tencent Enterprise Mail">{l("Tencent Enterprise Mail")}</option><option value="Other provider">{l("Other provider")}</option></select></label><label>{l("Connection method")}<select value={method} onChange={e=>setMethod(e.target.value)}>{["MCP","API Key","OAuth","SMTP / IMAP"].map(x=><option key={x}>{x}</option>)}</select></label><label>{l("Address")}<input type="email" value={address} onChange={e=>setAddress(e.target.value)} placeholder="sales@example.com"/></label><label>{l("Account nickname")}<input value={nickname} onChange={e=>setNickname(e.target.value)} placeholder="South America"/></label></div><button className="primary-button v3-spaced" onClick={add}><Plus size={15}/>{l("Save account draft")}</button></div><div className="v3-plan-list"><div className="v3-subheading">{l("Configured account")}</div>{accounts.length?accounts.map(a=><div className="v3-account" key={a.id}><strong>{a.nickname}</strong><span>{a.address}</span><small>{a.provider} · {a.method} · {l("Not connected")}</small></div>):<div className="v3-empty"><WifiOff size={22}/><p>{l("No mailboxes connected")}</p></div>}</div></div>
 <div className="v3-section"><h2>{l("AI development folders")}</h2><div className="v3-folders">{["Sent","Received","Bounced","Rejected","Engagement","Archived"].map(x=><div key={x}><Inbox size={16}/>{l(x)} <small>—</small></div>)}</div></div></section>;
}
export function V3ModelGateway({t}:{t:T}){
 const l=(k:string)=>local(t,k);const [url,setUrl]=useState("");const [model,setModel]=useState("");
 const [saved,setSaved]=useState(false);
 useEffect(()=>{try{const x=window.localStorage.getItem("ai-v3-model-draft");if(x){const a=JSON.parse(x);setUrl(a.url||"");setModel(a.model||"");}}catch{}},[]);
 const save=()=>{try{if(url){const u=new URL(url);if(u.protocol!=="https:")return;}window.localStorage.setItem("ai-v3-model-draft",JSON.stringify({url,model}));setSaved(true);}catch{setSaved(false);}};
 return <section className="v3-wrap"><div className="page-heading"><div><div className="eyebrow">V3 · PROVIDER-NEUTRAL</div><h1>{l("AI Gateway")}</h1><p>{l("One default model")} · {l("Fallback disabled by default")}</p></div></div><div className="v3-alert"><ShieldCheck size={20}/><div><strong>{l("Do not enter an API key in this browser preview.")}</strong><p>{l("No model is connected; the preview cannot call AI.")}</p></div></div><div className="v3-main-panel v3-model-panel"><h2>{l("One default model")}</h2><div className="form-grid"><label>{l("API base URL")}<input type="url" placeholder="https://api.example.com/v1" value={url} onChange={e=>{setUrl(e.target.value);setSaved(false);}}/></label><label>{l("Model identifier")}<input placeholder="model-id" value={model} onChange={e=>{setModel(e.target.value);setSaved(false);}}/></label></div><p>{l("Credentials must be configured in the secure server connection flow after backend deployment.")}</p><button className="primary-button" onClick={save}>{l("Save model configuration draft")}</button>{saved&&<small className="v3-saved">{l("Saved locally")}</small>}</div></section>;
}
export function V3Nurturing({t}:{t:T}){
 const l=(k:string)=>local(t,k);
 return <section className="v3-wrap"><div className="page-heading"><div><div className="eyebrow">V3 · MULTI-TOUCH CUSTOMER DEVELOPMENT</div><h1>{l("Customer Nurturing")}</h1><p>{l("Email follow-ups may auto-send only inside an active approved plan.")}</p></div></div><div className="v3-alert"><ShieldCheck size={18}/><div><strong>{l("Four-touch sequence")}</strong><p>{l("Reply or hard bounce stops the contact sequence.")} {l("Tracking pixels are not confirmed human reads.")}</p></div></div><div className="v3-stats nurture"><div><span>{l("Effective prospects")}</span><strong>—</strong></div><div><span>{l("Accepted emails")}</span><strong>—</strong></div><div><span>{l("Qualified replies")}</span><strong>—</strong></div><div><span>{l("Pending exceptions")}</span><strong>—</strong></div></div><div className="v3-section"><h2>{l("Sequence monitor")}</h2><div className="v3-steps">{["Initial outreach","Follow-up 2","Follow-up 3","Follow-up 4","Long-term nurture"].map((x,i)=><div key={x}><span className="v3-step-no">{i+1}</span><strong>{l(x)}</strong><small>{i===4?l("Review required"):l("Automatic email after plan authorization")}</small></div>)}</div><div className="v3-empty"><Inbox size={23}/><strong>{l("No live sequence records yet")}</strong><p>{l("All figures stay empty until real events are verified.")}</p></div></div></section>;
}
