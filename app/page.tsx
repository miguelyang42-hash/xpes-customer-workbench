"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight, ArrowUpRight, Bell, Bot, Building2, CheckCircle2, ChevronDown, ChevronRight,
  CircleAlert, ClipboardList, CircleHelp, Compass, Download, ExternalLink, Globe2, Inbox,
  Layers3, Mail, Menu, MessageCircle, MoreHorizontal, Plus, Search, Send, Settings2,
  ShieldCheck, Sparkles, Target, Users, X, Zap, RefreshCw, PanelRight
} from "lucide-react";

type Customer = {
  id: number; company: string; country: string; product: string; type: string;
  grade: "A" | "B" | "C"; stage: string; next: string; contact: string;
  email: string; emailStatus: string; summary: string; updated: string;
};
const customers: Customer[] = [
  { id: 1, company: "Nordic Water Systems", country: "Sweden", product: "UV water disinfection", type: "System integrator", grade: "A", stage: "Technical inquiry", next: "Confirm UVT and flow rate", contact: "Technical Manager · unverified", email: "contact@nordicwater.example", emailStatus: "Needs verification", summary: "Industrial water-treatment integrator. Initial interest in UV equipment; operating conditions are not yet confirmed.", updated: "Today, 10:42" },
  { id: 2, company: "SolarGuard Outdoor", country: "United States", product: "Solar mosquito killer", type: "Brand / distributor", grade: "A", stage: "Awaiting reply", next: "Review buyer response", contact: "Purchasing Manager · source pending", email: "buyer@solarguard.example", emailStatus: "Unverified", summary: "Outdoor pest-control product range. Potential fit for private-label product expansion; verify product category and sourcing role.", updated: "Yesterday" },
  { id: 3, company: "PureTech Solutions", country: "Germany", product: "185nm TOC lamps", type: "Service provider", grade: "B", stage: "Research", next: "Find maintenance decision-maker", contact: "Not identified", email: "Not found", emailStatus: "Not available", summary: "Water-treatment service provider. Need to verify whether it maintains ultrapure-water UV systems before outreach.", updated: "2 days ago" },
  { id: 4, company: "Andes Distribution", country: "Peru", product: "Solar mosquito killer", type: "Distributor", grade: "B", stage: "Verification", next: "Verify sales channels", contact: "Business contact · unverified", email: "sales@andes.example", emailStatus: "Needs verification", summary: "Possible outdoor consumer-products distributor. Local channel coverage and relevant product sales remain unverified.", updated: "Today, 09:18" },
  { id: 5, company: "Aqua Process Engineering", country: "Malaysia", product: "UV water disinfection", type: "Engineering company", grade: "A", stage: "Ready for review", next: "Approve first-touch message", contact: "Project Engineer · verified source", email: "projects@aquaprocess.example", emailStatus: "Source verified", summary: "Engineering company with water-treatment projects. Relevant application fit found; technical scope and purchasing authority need confirmation.", updated: "Today, 08:30" },
  { id: 6, company: "CleanTech Components", country: "Brazil", product: "UV replacement lamps", type: "Importer / wholesaler", grade: "C", stage: "Do not contact", next: "Resolve contact quality issue", contact: "Unknown", email: "info@cleantech.example", emailStatus: "Hard bounce · suppressed", summary: "Previous address produced a permanent delivery failure. Address is suppressed; company record retained for future research.", updated: "Nov 11" }
];
const navGroups = [
  { label: "WORKSPACE", items: [
    { id: "overview", label: "Command Center", icon: Compass },
    { id: "plans", label: "Development Plans", icon: Target },
    { id: "customers", label: "Customer Database", icon: Building2 },
    { id: "inbox", label: "Conversation Hub", icon: MessageCircle }
  ]},
  { label: "EXECUTION", items: [
    { id: "outreach", label: "Outreach Center", icon: Send },
    { id: "mail", label: "AI Mail Manager", icon: Mail },
    { id: "tasks", label: "Tasks & Audit", icon: ClipboardList }
  ]},
  { label: "SYSTEM", items: [
    { id: "models", label: "Model Connections", icon: Bot },
    { id: "settings", label: "Settings", icon: Settings2 }
  ]}
];
const stageOptions = ["All stages", "Research", "Verification", "Ready for review", "Awaiting reply", "Technical inquiry", "Do not contact"];

export default function Home() {
  const [active, setActive] = useState("overview");
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("All countries");
  const [stage, setStage] = useState("All stages");
  const [product, setProduct] = useState("All products");
  const [selected, setSelected] = useState<Customer | null>(null);
  const [notice, setNotice] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [mailTab, setMailTab] = useState("All");
  const [draft, setDraft] = useState("Hi Alex,\n\nI noticed your company offers outdoor pest-control products. Would adding a private-label solar mosquito killer help expand your current range?\n\nWe can share a short comparison of suitable configurations for your market. Would that be useful?\n\nBest regards,\nXPES Team");

  const filtered = useMemo(() => customers.filter(c => {
    const text = [c.company, c.country, c.product, c.type, c.contact, c.email].join(" ").toLowerCase();
    return (!query || text.includes(query.toLowerCase()))
      && (country === "All countries" || c.country === country)
      && (stage === "All stages" || c.stage === stage)
      && (product === "All products" || c.product === product);
  }), [query, country, stage, product]);

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3200);
  };
  const title = navGroups.flatMap(g => g.items).find(i => i.id === active)?.label ?? "Command Center";

  return (
    <main className="app-shell">
      <aside className={"sidebar " + (mobileMenu ? "sidebar-open" : "")}>
        <div className="brand-lockup">
          <div className="brand-mark">X</div>
          <div><div className="brand-name">XPES <span>ENGINE</span></div><div className="brand-caption">AI SALES WORKSPACE</div></div>
          <button className="icon-button mobile-close" onClick={() => setMobileMenu(false)} aria-label="Close menu"><X size={18}/></button>
        </div>
        <div className="workspace-switch"><div className="workspace-avatar">X</div><div className="workspace-copy"><strong>XPES Global Sales</strong><span>Independent workspace</span></div><ChevronDown size={15}/></div>
        <div className="nav-scroll">
          {navGroups.map(group => <div className="nav-group" key={group.label}>
            <div className="nav-label">{group.label}</div>
            {group.items.map(item => {
              const Icon = item.icon;
              return <button key={item.id} className={"nav-item " + (active === item.id ? "active" : "")} onClick={() => { setActive(item.id); setMobileMenu(false); }}>
                <Icon size={17}/><span>{item.label}</span>
                {item.id === "inbox" && <span className="nav-count">2</span>}
              </button>;
            })}
          </div>)}
        </div>
        <div className="sidebar-bottom">
          <div className="system-health"><span className="health-dot"></span><div><strong>Workspace preview</strong><span>External services not connected</span></div></div>
          <div className="user-row"><div className="user-avatar">XP</div><div><strong>XPES Administrator</strong><span>Owner workspace</span></div><MoreHorizontal size={17}/></div>
        </div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button mobile-menu" onClick={() => setMobileMenu(true)} aria-label="Open menu"><Menu size={19}/></button>
            <div className="breadcrumbs"><span>XPES</span><ChevronRight size={14}/><strong>{title}</strong></div>
          </div>
          <div className="topbar-actions">
            <div className="environment-pill"><span></span> V1.0 PREVIEW</div>
            <button className="icon-button" aria-label="Help" onClick={() => showNotice("V1.0 preview: no real customer data or external actions are connected yet.")}><CircleHelp size={18}/></button>
            <button className="icon-button notification-button" aria-label="Notifications" onClick={() => showNotice("No live notifications. Connect the backend to enable real alerts.")}><Bell size={18}/></button>
            <div className="top-avatar">XP</div>
          </div>
        </header>

        <div className="page-content">
          {active === "overview" && <Overview onNavigate={setActive} onNotice={showNotice}/>}
          {active === "customers" && <section>
            <div className="page-heading"><div><div className="eyebrow">CUSTOMER ASSETS</div><h1>Customer Database</h1><p>A clean view of every account, contact and next action.</p></div><button className="primary-button" onClick={() => showNotice("Customer creation will be enabled after the database is connected.")}><Plus size={16}/> Add customer</button></div>
            <div className="filter-panel">
              <div className="search-box"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search company, country, product, contact…"/></div>
              <select value={country} onChange={e=>setCountry(e.target.value)}><option>All countries</option>{Array.from(new Set(customers.map(c=>c.country))).sort().map(c=><option key={c}>{c}</option>)}</select>
              <select value={product} onChange={e=>setProduct(e.target.value)}><option>All products</option>{Array.from(new Set(customers.map(c=>c.product))).map(p=><option key={p}>{p}</option>)}</select>
              <select value={stage} onChange={e=>setStage(e.target.value)}>{stageOptions.map(s=><option key={s}>{s}</option>)}</select>
              <button className="secondary-button compact" onClick={()=>{setQuery("");setCountry("All countries");setProduct("All products");setStage("All stages");}}><RefreshCw size={15}/> Reset</button>
            </div>
            <div className="table-card">
              <div className="table-toolbar"><div><strong>{filtered.length} accounts</strong><span> · Click a row to view the full profile</span></div><button className="ghost-button" onClick={()=>showNotice("Export will be enabled when the customer database is connected.")}><Download size={15}/> Export</button></div>
              <div className="table-wrap"><table><thead><tr><th>COMPANY</th><th>COUNTRY</th><th>PRODUCT FIT</th><th>STAGE</th><th>GRADE</th><th>NEXT ACTION</th></tr></thead><tbody>
                {filtered.map(c=><tr key={c.id} onClick={()=>setSelected(c)} className="click-row"><td><div className="company-cell"><div className="company-logo">{c.company.slice(0,1)}</div><div><strong>{c.company}</strong><span>{c.type}</span></div></div></td><td>{c.country}</td><td>{c.product}</td><td><span className={"stage-tag " + (c.stage==="Do not contact"?"stage-danger":c.stage==="Awaiting reply"||c.stage==="Technical inquiry"?"stage-green":"")}>{c.stage}</span></td><td><span className={"grade grade-"+c.grade.toLowerCase()}>{c.grade}</span></td><td><span className="next-action">{c.next}</span></td></tr>)}
              </tbody></table>{filtered.length===0&&<div className="empty-state">No matching accounts. Try changing your filters.</div>}</div>
              <div className="table-footer">Showing {filtered.length} sample accounts <span>Demo data · not connected to a live CRM</span></div>
            </div>
            {selected && <CustomerDrawer customer={selected} onClose={()=>setSelected(null)}/>}
          </section>}

          {active === "plans" && <section>
            <div className="page-heading"><div><div className="eyebrow">AUTONOMOUS WORKFLOWS</div><h1>Development Plans</h1><p>Define a market, product and buyer profile before execution.</p></div><button className="primary-button" onClick={()=>showNotice("Plan builder will be connected to the task engine in the next build stage.")}><Plus size={16}/> New plan</button></div>
            <div className="plan-grid">
              <div className="plan-card featured-plan"><div className="plan-card-top"><span className="plan-icon"><Target size={18}/></span><span className="stage-tag stage-green">Draft template</span></div><h3>Solar Mosquito Killer · South America</h3><p>Find local brands, importers and outdoor pest-control distributors.</p><div className="plan-meta"><span><Globe2 size={14}/> Peru · Chile · Brazil</span><span><Users size={14}/> Brand / distributor</span></div><div className="plan-bottom"><span>Not started</span><button className="text-button" onClick={()=>showNotice("This is a planning template. No search has been started.")}>Configure <ArrowRight size={14}/></button></div></div>
              <div className="plan-card"><div className="plan-card-top"><span className="plan-icon"><Layers3 size={18}/></span><span className="stage-tag">Draft template</span></div><h3>185nm TOC Replacement Lamps</h3><p>Identify ultrapure-water system owners, service companies and replacement channels.</p><div className="plan-meta"><span><Globe2 size={14}/> North America · Taiwan · SEA</span><span><Users size={14}/> Service / integrator</span></div><div className="plan-bottom"><span>Not started</span><button className="text-button" onClick={()=>showNotice("This is a planning template. No search has been started.")}>Configure <ArrowRight size={14}/></button></div></div>
              <div className="plan-card"><div className="plan-card-top"><span className="plan-icon"><Zap size={18}/></span><span className="stage-tag">Draft template</span></div><h3>Industrial UV Water Disinfection</h3><p>Find water-treatment engineering firms, OEM partners and project integrators.</p><div className="plan-meta"><span><Globe2 size={14}/> Global</span><span><Users size={14}/> Engineering / OEM</span></div><div className="plan-bottom"><span>Not started</span><button className="text-button" onClick={()=>showNotice("This is a planning template. No search has been started.")}>Configure <ArrowRight size={14}/></button></div></div>
            </div>
          </section>}

          {active === "inbox" && <section>
            <div className="page-heading"><div><div className="eyebrow">CUSTOMER RELATIONSHIPS</div><h1>Conversation Hub</h1><p>One place for customer replies, context and reviewed AI suggestions.</p></div><span className="stage-tag">Demo conversations</span></div>
            <div className="conversation-layout"><div className="conversation-list"><div className="conversation-search"><Search size={15}/><span>Search conversations</span></div>{customers.filter(c=>c.id===1||c.id===2).map((c,i)=><button key={c.id} className={"conversation-item "+(i===0?"conversation-active":"")} onClick={()=>setSelected(c)}><div className="conversation-avatar">{c.company[0]}</div><div className="conversation-preview"><div><strong>{c.company}</strong><time>{i===0?"10:42":"Yesterday"}</time></div><span>{i===0?"Could you recommend a UV system for our flow?":"Can you share specifications and MOQ?"}</span><small>{c.product}</small></div></button>)}</div>
              <div className="chat-panel"><div className="chat-header"><div className="conversation-avatar">N</div><div><strong>Nordic Water Systems</strong><span>Technical inquiry · Demo thread</span></div><button className="ghost-button" onClick={()=>showNotice("Customer profile preview. Connect the database to load verified records.")}><PanelRight size={15}/> Profile</button></div><div className="chat-messages"><div className="chat-date">TODAY</div><div className="bubble bubble-out">Would an OEM UV disinfection reactor be relevant for your water-treatment projects?</div><div className="bubble bubble-in">We are interested. Can you recommend a UV system for a flow of 20 m³/h?</div><div className="ai-suggestion"><div className="ai-suggestion-title"><Sparkles size={15}/> AI REPLY SUGGESTION <span>Needs review</span></div><p>Thank you for your interest. To recommend a suitable UV reactor, could you share the UV transmittance, target microorganism or required UV dose, and operating pressure? We can then review the configuration against your flow requirement.</p><button className="secondary-button compact" onClick={()=>showNotice("Demo reply copied. No email has been sent.")}>Copy suggestion</button></div></div><div className="chat-compose"><textarea value={draft} onChange={e=>setDraft(e.target.value)} aria-label="Reply draft"/><div><span>Human review required · demo only</span><button className="primary-button" onClick={()=>showNotice("No live mailbox is connected. This draft has not been sent.")}><Send size={15}/> Send reply</button></div></div></div>
            </div>
          </section>}

          {active === "outreach" && <section><div className="page-heading"><div><div className="eyebrow">MULTI-CHANNEL ENGAGEMENT</div><h1>Outreach Center</h1><p>AI prepares context and copy; you control social-platform actions.</p></div></div><div className="channel-grid">{[{name:"LinkedIn",desc:"Open verified company or contact profile",icon:"in"},{name:"WhatsApp",desc:"Open an existing business conversation",icon:"wa"},{name:"Instagram",desc:"Review brand profile and prepare a message",icon:"ig"},{name:"Facebook",desc:"Open company page and prepare outreach",icon:"fb"}].map(c=><div className="channel-card" key={c.name}><div className="channel-logo">{c.icon}</div><div><h3>{c.name}</h3><p>{c.desc}</p><span className="stage-tag">Manual action</span></div><button className="ghost-button" onClick={()=>showNotice("Customer-specific links will appear after contact profiles are verified.")}>Open <ExternalLink size={14}/></button></div>)}</div><div className="notice-card"><ShieldCheck size={19}/><div><strong>Human-controlled social outreach</strong><p>V1.0 will not automate scraping or bulk messaging on social platforms. It will prepare verified links and drafts, record your confirmation separately from platform-verified delivery.</p></div></div></section>}

          {active === "mail" && <section><div className="page-heading"><div><div className="eyebrow">EMAIL OPERATIONS</div><h1>AI Mail Manager</h1><p>Separate AI prospecting mail from your everyday business inbox.</p></div><span className="stage-tag">Mailbox not connected</span></div><div className="mail-tabs">{["All","Sent","Replies","Bounces","Unsubscribed","Auto-replies","Priority"].map(t=><button key={t} className={mailTab===t?"mail-tab active-mail-tab":"mail-tab"} onClick={()=>setMailTab(t)}>{t}</button>)}</div><div className="mail-empty"><div className="empty-icon"><Inbox size={25}/></div><h3>{mailTab==="All"?"Your AI mail workspace is ready":mailTab+" folder"}</h3><p>Connect Gmail or Tencent Enterprise Mail to synchronize real messages, delivery events and replies. Nothing will be moved or sent before you approve the connection and rules.</p><button className="secondary-button" onClick={()=>showNotice("Mailbox connection is scheduled for the integration stage. No account has been accessed.")}>View connection requirements <ArrowRight size={15}/></button></div></section>}

          {active === "tasks" && <section><div className="page-heading"><div><div className="eyebrow">EXECUTION CONTROL</div><h1>Tasks & Audit</h1><p>Completion is evidence-based, never based on an AI self-report.</p></div></div><div className="audit-banner"><ShieldCheck size={20}/><div><strong>Evidence-first task accounting</strong><p>Every future task will have an ID, attempt history, external evidence, final state and recovery decision.</p></div></div><div className="audit-grid">{[{n:"Queued",v:"—",d:"Persistent pending work"},{n:"Running",v:"—",d:"Worker heartbeat"},{n:"Needs review",v:"—",d:"Uncertain or risky state"},{n:"Failed",v:"—",d:"Recorded reason and retry policy"}].map(x=><div className="metric-card" key={x.n}><span>{x.n}</span><strong>{x.v}</strong><small>{x.d}</small></div>)}</div><div className="table-card"><div className="table-toolbar"><strong>Execution ledger</strong><span>Live task history will appear after backend setup.</span></div><div className="empty-state">No production tasks have been run. This is intentional: no external action is enabled in the preview.</div></div></section>}

          {active === "models" && <section><div className="page-heading"><div><div className="eyebrow">MODEL-AGNOSTIC ARCHITECTURE</div><h1>Model Connections</h1><p>Choose providers independently of the business workflow.</p></div><button className="primary-button" onClick={()=>showNotice("Model connection setup will request your provider endpoint and API key through encrypted settings. Do not paste keys into chat.")}><Plus size={16}/> Add provider</button></div><div className="model-grid">{[{name:"OpenAI-compatible API",desc:"Custom endpoint · model name · encrypted key",tag:"Provider adapter"},{name:"DeepSeek",desc:"Optional model provider",tag:"Provider adapter"},{name:"Google Gemini",desc:"Optional model provider",tag:"Provider adapter"},{name:"Anthropic Claude",desc:"Optional model provider",tag:"Provider adapter"}].map(m=><div className="model-card" key={m.name}><div className="model-symbol"><Bot size={20}/></div><div><h3>{m.name}</h3><p>{m.desc}</p><span className="stage-tag">{m.tag}</span></div><button className="secondary-button compact" onClick={()=>showNotice("No model provider is connected yet.")}>Configure</button></div>)}</div><div className="notice-card"><ShieldCheck size={19}/><div><strong>Credential safety</strong><p>API keys will be stored server-side as encrypted secrets. They will never be exposed in browser code or chat messages.</p></div></div></section>}

          {active === "settings" && <section><div className="page-heading"><div><div className="eyebrow">WORKSPACE CONTROL</div><h1>Settings</h1><p>Workspace identity, permissions, data and safety rules.</p></div></div><div className="settings-list">{[{title:"Workspace",desc:"XPES AI Sales Engine · Independent environment"},{title:"Data ownership",desc:"Exportable customer records, task history and audit trail"},{title:"Safety policy",desc:"No unverified contact auto-send; no false completion states"},{title:"Integrations",desc:"Gmail, Tencent Mail, model providers and search services"},{title:"Backup & recovery",desc:"Automated database backups and restore drills"}].map(x=><div className="settings-row" key={x.title}><div><strong>{x.title}</strong><span>{x.desc}</span></div><ChevronRight size={17}/></div>)}</div></section>}
        </div>
        <footer className="footer"><span>XPES AI Sales Engine · Independent V1.0 build</span><span>Preview environment · No live customer actions</span></footer>
      </section>
      {notice && <div className="toast"><CheckCircle2 size={17}/>{notice}<button onClick={() => setNotice("")}><X size={15}/></button></div>}
    </main>
  );
}

function Overview({ onNavigate, onNotice }: { onNavigate: (id:string)=>void; onNotice: (message:string)=>void }) {
  return <section>
    <div className="welcome-row"><div><div className="eyebrow">SATURDAY · NOVEMBER 14, 2026</div><h1>Good morning, XPES.</h1><p>Your sales development command center is ready.</p></div><button className="primary-button" onClick={()=>onNavigate("plans")}><Plus size={16}/> Create development plan</button></div>
    <div className="preview-banner"><div className="preview-icon"><Sparkles size={18}/></div><div><strong>Independent workspace initialized</strong><p>This is the first UI build. Demo records are clearly marked; real database, AI models and mailboxes are not connected yet.</p></div><span className="preview-status">PREVIEW</span></div>
    <div className="section-title"><div><h2>Business pulse</h2><p>Production metrics will appear after verified data is connected.</p></div><button className="ghost-button" onClick={()=>onNotice("These are placeholders, not live operating figures.")}>Why no live metrics?</button></div>
    <div className="metric-grid">
      <Metric icon={<Building2 size={17}/>} label="Verified new accounts" value="—" hint="Requires live research + deduplication"/>
      <Metric icon={<Send size={17}/>} label="Qualified outreach" value="—" hint="Requires external send evidence"/>
      <Metric icon={<MessageCircle size={17}/>} label="Meaningful replies" value="—" hint="Excludes auto-replies and bounces"/>
      <Metric icon={<Target size={17}/>} label="Active opportunities" value="—" hint="Requires real commercial progress"/>
    </div>
    <div className="dashboard-grid">
      <div className="panel priority-panel"><div className="panel-heading"><div><h2>Priority queue</h2><p>Suggested work · sample records</p></div><span className="soft-count">03</span></div>
        {[{n:"Review a technical inquiry",d:"Nordic Water Systems · UV reactor",tag:"High priority",color:"green",action:"inbox"},{n:"Verify purchasing contact",d:"SolarGuard Outdoor · Solar mosquito killer",tag:"Needs verification",color:"amber",action:"customers"},{n:"Investigate hard-bounce source",d:"CleanTech Components · Replacement lamps",tag:"Suppressed",color:"red",action:"tasks"}].map((x,i)=><div className="priority-row" key={x.n}><div className="priority-number">0{i+1}</div><div className="priority-copy"><strong>{x.n}</strong><span>{x.d}</span></div><span className={"priority-tag "+x.color}>{x.tag}</span><button className="row-arrow" onClick={()=>onNavigate(x.action)}><ArrowUpRight size={16}/></button></div>)}
        <button className="panel-link" onClick={()=>onNavigate("customers")}>View customer database <ArrowRight size={15}/></button>
      </div>
      <div className="panel pipeline-panel"><div className="panel-heading"><div><h2>Development pipeline</h2><p>Sample stage distribution</p></div><button className="ghost-button" onClick={()=>onNavigate("customers")}>View all</button></div>
        {[{n:"Research",v:1,w:"17%"},{n:"Verification",v:1,w:"17%"},{n:"Ready for review",v:1,w:"17%"},{n:"Awaiting reply",v:1,w:"17%"},{n:"Technical inquiry",v:1,w:"17%"},{n:"Suppressed",v:1,w:"17%"}].map(x=><div className="pipeline-row" key={x.n}><span>{x.n}</span><div className="pipeline-track"><div style={{width:x.w}}/></div><strong>{x.v}</strong></div>)}
        <div className="pipeline-note"><CircleAlert size={15}/> Sample distribution only. No live customer pipeline is connected.</div>
      </div>
    </div>
    <div className="section-title"><div><h2>Core workspaces</h2><p>Designed around the complete customer development loop.</p></div></div>
    <div className="quick-grid">{[{id:"plans",icon:<Target size={18}/>,title:"Development plans",desc:"Product, market, buyer profile and target"},{id:"customers",icon:<Users size={18}/>,title:"Customer assets",desc:"Search, filter, deduplicate and expand profiles"},{id:"inbox",icon:<MessageCircle size={18}/>,title:"Conversation hub",desc:"Buyer context, AI suggestions and human review"},{id:"tasks",icon:<ShieldCheck size={18}/>,title:"Execution audit",desc:"Real evidence, failures and safe recovery"}].map(x=><button className="quick-card" key={x.id} onClick={()=>onNavigate(x.id)}><span>{x.icon}</span><strong>{x.title}</strong><small>{x.desc}</small><ArrowUpRight size={15}/></button>)}</div>
  </section>;
}
function Metric({icon,label,value,hint}:{icon:React.ReactNode;label:string;value:string;hint:string}) {
  return <div className="metric-card"><div className="metric-top"><span className="metric-icon">{icon}</span><span className="metric-period">LIVE DATA PENDING</span></div><strong>{value}</strong><span className="metric-label">{label}</span><small>{hint}</small></div>;
}
function CustomerDrawer({customer,onClose}:{customer:Customer;onClose:()=>void}) {
  return <div className="drawer-backdrop" onClick={onClose}><aside className="customer-drawer" onClick={e=>e.stopPropagation()}><div className="drawer-top"><div><div className="eyebrow">CUSTOMER PROFILE</div><h2>{customer.company}</h2><p>{customer.country} · {customer.type}</p></div><button className="icon-button" onClick={onClose}><X size={18}/></button></div><div className="drawer-summary"><Sparkles size={16}/><div><strong>AI business summary</strong><p>{customer.summary}</p></div></div><div className="drawer-section"><h3>Business snapshot</h3><div className="detail-grid"><div><span>Product fit</span><strong>{customer.product}</strong></div><div><span>Customer grade</span><strong>{customer.grade} · evidence pending</strong></div><div><span>Development stage</span><strong>{customer.stage}</strong></div><div><span>Last updated</span><strong>{customer.updated}</strong></div></div></div><div className="drawer-section"><h3>Contact information</h3><div className="contact-record"><Mail size={16}/><div><strong>{customer.email}</strong><span>{customer.emailStatus}</span></div></div><div className="contact-record"><Users size={16}/><div><strong>{customer.contact}</strong><span>Identity and role require source verification</span></div></div></div><div className="drawer-section"><h3>Next best action</h3><div className="next-action-card"><Target size={17}/><div><strong>{customer.next}</strong><span>Recommendation only · not an executed task</span></div></div></div><div className="drawer-actions"><button className="secondary-button" onClick={()=>navigator.clipboard?.writeText(customer.company)}>Copy company name</button><button className="primary-button" onClick={()=>alert("Connect the live database before creating tasks.")}>Create follow-up task</button></div></aside></div>;
}