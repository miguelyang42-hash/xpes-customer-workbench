"use client";

import { useEffect, useMemo, useState } from "react";
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
const translations: Record<string, string> = {
  "WORKSPACE": "工作空间",
  "EXECUTION": "执行中心",
  "SYSTEM": "系统管理",
  "Command Center": "工作总览",
  "Development Plans": "市场开发计划",
  "Customer Database": "客户档案库",
  "Conversation Hub": "客户会话中心",
  "Outreach Center": "客户触达中心",
  "AI Mail Manager": "AI 邮件管理",
  "Tasks & Audit": "任务与审计",
  "Model Connections": "AI 模型连接",
  "Settings": "系统设置",
  "AI SALES WORKSPACE": "智能销售工作空间",
  "SALES DEVELOPMENT SYSTEM": "销售开发系统",
  "Global Sales Workspace": "全球销售工作空间",
  "Independent workspace": "独立工作空间",
  "Workspace preview": "工作空间预览",
  "External services not connected": "外部服务尚未连接",
  "Workspace Administrator": "工作空间管理员",
  "Owner workspace": "管理员工作空间",
  "V1.0 PREVIEW": "V1.0 预览",
  "Help": "帮助",
  "Notifications": "通知",
  "No live notifications. Connect the backend to enable real alerts.": "暂无实时通知。连接后台后可启用提醒。",
  "Customer creation will be enabled after the database is connected.": "连接数据库后即可新增客户。",
  "Add customer": "新增客户",
  "Search company, country, product, contact…": "搜索公司、国家、产品或联系人…",
  "All countries": "所有国家",
  "All products": "所有产品",
  "All stages": "所有阶段",
  "Reset": "重置",
  "accounts": "个客户",
  "Click a row to view the full profile": "点击客户行查看完整档案",
  "COMPANY": "公司",
  "COUNTRY": "国家",
  "PRODUCT FIT": "产品匹配",
  "STAGE": "阶段",
  "GRADE": "等级",
  "NEXT ACTION": "下一步行动",
  "No matching accounts. Try changing your filters.": "没有找到匹配客户，请调整筛选条件。",
  "Demo data · not connected to a live CRM": "演示数据 · 尚未连接真实客户系统",
  "CUSTOMER ASSETS": "客户资产",
  "A clean view of every account, contact and next action.": "集中查看客户档案、联系人和下一步行动。",
  "AUTONOMOUS WORKFLOWS": "开发工作流",
  "Define a market, product and buyer profile before execution.": "执行前先明确目标市场、产品和买家画像。",
  "New plan": "新建开发计划",
  "CUSTOMER RELATIONSHIPS": "客户关系",
  "One place for customer replies, context and reviewed AI suggestions.": "集中查看客户回复、沟通背景和待审核的 AI 建议。",
  "Demo conversations": "演示会话",
  "MULTI-CHANNEL ENGAGEMENT": "多渠道触达",
  "AI prepares context and copy; you control social-platform actions.": "AI 负责准备背景和文案，社媒操作由你确认。",
  "EMAIL OPERATIONS": "邮件管理",
  "Separate AI prospecting mail from your everyday business inbox.": "将 AI 开发邮件与日常业务邮箱分开管理。",
  "Mailbox not connected": "邮箱尚未连接",
  "EXECUTION CONTROL": "执行控制",
  "Completion is evidence-based, never based on an AI self-report.": "任务完成必须有证据，不能仅凭 AI 自我报告。",
  "Evidence-first task accounting": "以执行证据为准",
  "Every future task will have an ID, attempt history, external evidence, final state and recovery decision.": "每项任务都将记录唯一编号、执行历史、外部证据、最终状态和恢复决策。",
  "Queued": "待执行",
  "Running": "执行中",
  "Needs review": "待审核",
  "Failed": "失败",
  "Persistent pending work": "持续保留的待办任务",
  "Worker heartbeat": "执行器心跳状态",
  "Uncertain or risky state": "结果不确定或存在风险",
  "Recorded reason and retry policy": "记录失败原因和重试策略",
  "Execution ledger": "执行记录",
  "Live task history will appear after backend setup.": "完成后台配置后，这里将显示实时任务历史。",
  "No production tasks have been run. This is intentional: no external action is enabled in the preview.": "当前尚未执行生产任务。这是有意设置的：预览环境不会执行外部操作。",
  "MODEL-AGNOSTIC ARCHITECTURE": "模型中立架构",
  "Choose providers independently of the business workflow.": "模型服务商与业务工作流相互独立。",
  "Add provider": "添加服务商",
  "Credential safety": "凭证安全",
  "API keys will be stored server-side as encrypted secrets. They will never be exposed in browser code or chat messages.": "API 密钥将加密保存在服务器端，不会暴露在浏览器代码或聊天消息中。",
  "WORKSPACE CONTROL": "工作空间管理",
  "Workspace identity, permissions, data and safety rules.": "管理工作空间身份、权限、数据和安全规则。",
  "Workspace": "工作空间",
  "Data ownership": "数据所有权",
  "Exportable customer records, task history and audit trail": "客户档案、任务历史和审计记录均可导出",
  "Safety policy": "安全策略",
  "No unverified contact auto-send; no false completion states": "未经核实的联系人不得自动发送；不得虚报任务完成",
  "Integrations": "集成服务",
  "Gmail, Tencent Mail, model providers and search services": "Gmail、腾讯企业邮箱、模型服务商和搜索服务",
  "Backup & recovery": "备份与恢复",
  "Automated database backups and restore drills": "自动数据库备份与恢复演练",
  "Independent V1.0 build": "独立版本 V1.0",
  "Preview environment · No live customer actions": "预览环境 · 不执行真实客户操作",
  "SATURDAY · NOVEMBER 14, 2026": "销售工作总览",
  "Good morning": "早上好",
  "Your sales development command center is ready.": "你的销售开发工作台已准备就绪。",
  "Create development plan": "创建开发计划",
  "Independent workspace initialized": "独立工作空间已初始化",
  "This is the first UI build. Demo records are clearly marked; real database, AI models and mailboxes are not connected yet.": "这是首个界面版本。演示记录均已标注；真实数据库、AI 模型和邮箱尚未连接。",
  "PREVIEW": "预览",
  "Business pulse": "业务概况",
  "Production metrics will appear after verified data is connected.": "连接并核实真实数据后，这里将显示业务指标。",
  "These are placeholders, not live operating figures.": "这些是占位数据，不代表真实业务数据。",
  "Why no live metrics?": "为什么没有实时数据？",
  "Verified new accounts": "已核实的新客户",
  "Qualified outreach": "有效客户触达",
  "Meaningful replies": "有效客户回复",
  "Active opportunities": "活跃商机",
  "Requires live research + deduplication": "需要真实背调和去重",
  "Requires external send evidence": "需要真实发送记录",
  "Excludes auto-replies and bounces": "不包含自动回复和退信",
  "Requires real commercial progress": "需要真实业务进展",
  "LIVE DATA PENDING": "等待真实数据",
  "Priority queue": "优先事项",
  "Suggested work · sample records": "建议处理事项 · 演示记录",
  "High priority": "高优先级",
  "Needs verification": "待核实",
  "Suppressed": "已抑制",
  "View customer database": "查看客户档案库",
  "Development pipeline": "客户开发阶段",
  "Sample stage distribution": "演示阶段分布",
  "Sample distribution only. No live customer pipeline is connected.": "仅为演示分布，尚未连接真实客户管线。",
  "Core workspaces": "核心工作区",
  "Designed around the complete customer development loop.": "围绕完整的客户开发流程设计。",
  "Product, market, buyer profile and target": "产品、市场、买家画像与目标",
  "Search, filter, deduplicate and expand profiles": "搜索、筛选、去重和完善客户档案",
  "Buyer context, AI suggestions and human review": "客户背景、AI 建议和人工审核",
  "Real evidence, failures and safe recovery": "真实执行证据、失败记录和安全恢复",
  "Find local brands, importers and outdoor pest-control distributors.": "寻找当地品牌商、进口商和户外灭虫产品经销商。",
  "Identify ultrapure-water system owners, service companies and replacement channels.": "寻找超纯水系统用户、服务商和替换灯渠道。",
  "Find water-treatment engineering firms, OEM partners and project integrators.": "寻找水处理工程公司、OEM 合作伙伴和项目集成商。",
  "Draft template": "计划模板",
  "Not started": "尚未开始",
  "Configure": "配置",
  "Search conversations": "搜索会话",
  "Profile": "客户档案",
  "AI REPLY SUGGESTION": "AI 回复建议",
  "Human review required · demo only": "需要人工审核 · 仅为演示",
  "Send reply": "发送回复",
  "Manual action": "手动操作",
  "Open": "打开",
  "Human-controlled social outreach": "人工控制社媒触达",
  "V1.0 will not automate scraping or bulk messaging on social platforms. It will prepare verified links and drafts, record your confirmation separately from platform-verified delivery.": "V1.0 不会自动抓取或批量发送社媒消息。系统只准备经过核实的链接和草稿，并将你的确认与平台实际送达记录分开保存。",
  "All": "全部",
  "Sent": "已发送",
  "Replies": "回复",
  "Bounces": "退信",
  "Unsubscribed": "已退订",
  "Auto-replies": "自动回复",
  "Priority": "优先",
  "Your AI mail workspace is ready": "AI 邮件工作区已准备就绪",
  "Connect Gmail or Tencent Enterprise Mail to synchronize real messages, delivery events and replies. Nothing will be moved or sent before you approve the connection and rules.": "连接 Gmail 或腾讯企业邮箱以同步真实邮件、送达事件和客户回复。未经你批准连接和规则，不会移动或发送任何邮件。",
  "View connection requirements": "查看连接要求",
  "Open verified company or contact profile": "打开已核实的公司或联系人主页",
  "Open an existing business conversation": "打开已有业务会话",
  "Review brand profile and prepare a message": "查看品牌主页并准备消息",
  "Open company page and prepare outreach": "打开公司主页并准备触达消息",
  "Review a technical inquiry": "处理技术询盘",
  "Verify purchasing contact": "核实采购联系人",
  "Investigate hard-bounce source": "调查永久退信原因",
  "Nordic Water Systems · UV reactor": "Nordic Water Systems · UV 反应器",
  "SolarGuard Outdoor · Solar mosquito killer": "SolarGuard Outdoor · 太阳能灭蚊灯",
  "CleanTech Components · Replacement lamps": "CleanTech Components · 替换灯",
  "Customer profile preview. Connect the database to load verified records.": "客户档案预览。连接数据库后可加载已核实的客户信息。",
  "Copy suggestion": "复制建议",
  "Copy company name": "复制公司名称",
  "Create follow-up task": "创建跟进任务",
  "CUSTOMER PROFILE": "客户档案",
  "AI business summary": "AI 业务摘要",
  "Business snapshot": "业务概览",
  "Contact information": "联系信息",
  "Next best action": "下一步最佳行动",
  "Identity and role require source verification": "身份和职位仍需核实来源",
  "Recommendation only · not an executed task": "仅为建议 · 尚未执行任务",
  "AI Workspace": "AI 工作空间",
  "LIVE DATA PENDING": "等待真实数据",
  "All stages": "所有阶段",
  "Research": "调研中",
  "Verification": "核实中",
  "Ready for review": "待审核",
  "Awaiting reply": "等待回复",
  "Technical inquiry": "技术询盘",
  "Do not contact": "禁止联系",
  "All products": "所有产品",
  "Workspace preview": "工作空间预览",
  "V1.0 PREVIEW": "V1.0 预览",
  "AI Sales Workspace · Independent environment": "AI Sales Workspace · 独立环境",
  "Independent environment": "独立环境",
  "Exportable customer records, task history and audit trail": "客户档案、任务历史和审计记录均可导出",
  "No unverified contact auto-send; no false completion states": "未经核实的联系人不得自动发送；不得虚报任务完成",
  "Automated database backups and restore drills": "自动数据库备份与恢复演练"
};
type Language = "en" | "zh";

export default function Home() {
  const [active, setActive] = useState("overview");
  const [language, setLanguage] = useState<Language>("en");
  useEffect(() => { const saved = window.localStorage.getItem("sales-workspace-language"); if (saved === "zh" || saved === "en") setLanguage(saved); }, []);
  useEffect(() => { window.localStorage.setItem("sales-workspace-language", language); document.documentElement.lang = language === "zh" ? "zh-CN" : "en"; }, [language]);
  const t = (value: string) => language === "zh" ? (translations[value] ?? value) : value;
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("All countries");
  const [stage, setStage] = useState("All stages");
  const [product, setProduct] = useState("All products");
  const [selected, setSelected] = useState<Customer | null>(null);
  const [notice, setNotice] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [mailTab, setMailTab] = useState("All");
  const [draft, setDraft] = useState("Hi Alex,\n\nI noticed your company offers outdoor pest-control products. Would adding a private-label solar mosquito killer help expand your current range?\n\nWe can share a short comparison of suitable configurations for your market. Would that be useful?\n\nBest regards,\nSales Team");

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
  const title = t(navGroups.flatMap(g => g.items).find(i => i.id === active)?.label ?? "Command Center");

  return (
    <main className="app-shell">
      <aside className={"sidebar " + (mobileMenu ? "sidebar-open" : "")}>
        <div className="brand-lockup">
          <div className="brand-mark">AI</div>
          <div><div className="brand-name">AI <span>WORKSPACE</span></div><div className="brand-caption">{t("AI SALES WORKSPACE")}</div></div>
          <button className="icon-button mobile-close" onClick={() => setMobileMenu(false)} aria-label="Close menu"><X size={18}/></button>
        </div>
        <div className="workspace-switch"><div className="workspace-avatar">G</div><div className="workspace-copy"><strong>{t("Global Sales Workspace")}</strong><span>{t("Independent workspace")}</span></div><ChevronDown size={15}/></div>
        <div className="nav-scroll">
          {navGroups.map(group => <div className="nav-group" key={group.label}>
            <div className="nav-label">{t(group.label)}</div>
            {group.items.map(item => {
              const Icon = item.icon;
              return <button key={item.id} className={"nav-item " + (active === item.id ? "active" : "")} onClick={() => { setActive(item.id); setMobileMenu(false); }}>
                <Icon size={17}/><span>{t(item.label)}</span>
                {item.id === "inbox" && <span className="nav-count">2</span>}
              </button>;
            })}
          </div>)}
        </div>
        <div className="sidebar-bottom">
          <div className="system-health"><span className="health-dot"></span><div><strong>{t("Workspace preview")}</strong><span>{t("External services not connected")}</span></div></div>
          <div className="user-row"><div className="user-avatar">AI</div><div><strong>{t("Workspace Administrator")}</strong><span>{t("Owner workspace")}</span></div><MoreHorizontal size={17}/></div>
        </div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button mobile-menu" onClick={() => setMobileMenu(true)} aria-label="Open menu"><Menu size={19}/></button>
            <div className="breadcrumbs"><span>{t("AI Workspace")}</span><ChevronRight size={14}/><strong>{title}</strong></div>
          </div>
          <div className="topbar-actions">
            <select className="language-select" aria-label="Select language" value={language} onChange={e => setLanguage(e.target.value as Language)}><option value="en">English</option><option value="zh">中文</option></select><div className="environment-pill"><span></span> {t("V1.0 PREVIEW")}</div>
            <button className="icon-button" aria-label={t("Help")} onClick={() => showNotice("V1.0 preview: no real customer data or external actions are connected yet.")}><CircleHelp size={18}/></button>
            <button className="icon-button notification-button" aria-label={t("Notifications")} onClick={() => showNotice("No live notifications. Connect the backend to enable real alerts.")}><Bell size={18}/></button>
            <div className="top-avatar">AI</div>
          </div>
        </header>

        <div className="page-content">
          {active === "overview" && <Overview onNavigate={setActive} onNotice={showNotice} t={t}/>}
          {active === "customers" && <section>
            <div className="page-heading"><div><div className="eyebrow">{t("CUSTOMER ASSETS")}</div><h1>{t("Customer Database")}</h1><p>{t("A clean view of every account, contact and next action.")}</p></div><button className="primary-button" onClick={() => showNotice(t("Customer creation will be enabled after the database is connected."))}><Plus size={16}/> {t("Add customer")}</button></div>
            <div className="filter-panel">
              <div className="search-box"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={t("Search company, country, product, contact…")}/></div>
              <select value={country} onChange={e=>setCountry(e.target.value)}><option>{t("All countries")}</option>{Array.from(new Set(customers.map(c=>c.country))).sort().map(c=><option key={c}>{c}</option>)}</select>
              <select value={product} onChange={e=>setProduct(e.target.value)}><option>{t("All products")}</option>{Array.from(new Set(customers.map(c=>c.product))).map(p=><option key={p}>{p}</option>)}</select>
              <select value={stage} onChange={e=>setStage(e.target.value)}>{stageOptions.map(s=><option key={s}>{t(s)}</option>)}</select>
              <button className="secondary-button compact" onClick={()=>{setQuery("");setCountry("All countries");setProduct("All products");setStage("All stages");}}><RefreshCw size={15}/> {t("Reset")}</button>
            </div>
            <div className="table-card">
              <div className="table-toolbar"><div><strong>{filtered.length} {t("accounts")}</strong><span> · {t("Click a row to view the full profile")}</span></div><button className="ghost-button" onClick={()=>showNotice("Export will be enabled when the customer database is connected.")}><Download size={15}/> Export</button></div>
              <div className="table-wrap"><table><thead><tr><th>{t("COMPANY")}</th><th>{t("COUNTRY")}</th><th>{t("PRODUCT FIT")}</th><th>{t("STAGE")}</th><th>{t("GRADE")}</th><th>{t("NEXT ACTION")}</th></tr></thead><tbody>
                {filtered.map(c=><tr key={c.id} onClick={()=>setSelected(c)} className="click-row"><td><div className="company-cell"><div className="company-logo">{c.company.slice(0,1)}</div><div><strong>{c.company}</strong><span>{c.type}</span></div></div></td><td>{c.country}</td><td>{c.product}</td><td><span className={"stage-tag " + (c.stage==="Do not contact"?"stage-danger":c.stage==="Awaiting reply"||c.stage==="Technical inquiry"?"stage-green":"")}>{c.stage}</span></td><td><span className={"grade grade-"+c.grade.toLowerCase()}>{c.grade}</span></td><td><span className="next-action">{c.next}</span></td></tr>)}
              </tbody></table>{filtered.length===0&&<div className="empty-state">{t("No matching accounts. Try changing your filters.")}</div>}</div>
              <div className="table-footer">Showing {filtered.length} sample accounts <span>{t("Demo data · not connected to a live CRM")}</span></div>
            </div>
            {selected && <CustomerDrawer customer={selected} onClose={()=>setSelected(null)} t={t}/>}
          </section>}

          {active === "plans" && <section>
            <div className="page-heading"><div><div className="eyebrow">{t("AUTONOMOUS WORKFLOWS")}</div><h1>{t("Development Plans")}</h1><p>{t("Define a market, product and buyer profile before execution.")}</p></div><button className="primary-button" onClick={()=>showNotice(t("Plan builder will be connected to the task engine in the next build stage."))}><Plus size={16}/> {t("New plan")}</button></div>
            <div className="plan-grid">
              <div className="plan-card featured-plan"><div className="plan-card-top"><span className="plan-icon"><Target size={18}/></span><span className="stage-tag stage-green">Draft template</span></div><h3>Solar Mosquito Killer · South America</h3><p>Find local brands, importers and outdoor pest-control distributors.</p><div className="plan-meta"><span><Globe2 size={14}/> Peru · Chile · Brazil</span><span><Users size={14}/> Brand / distributor</span></div><div className="plan-bottom"><span>Not started</span><button className="text-button" onClick={()=>showNotice("This is a planning template. No search has been started.")}>Configure <ArrowRight size={14}/></button></div></div>
              <div className="plan-card"><div className="plan-card-top"><span className="plan-icon"><Layers3 size={18}/></span><span className="stage-tag">Draft template</span></div><h3>185nm TOC Replacement Lamps</h3><p>Identify ultrapure-water system owners, service companies and replacement channels.</p><div className="plan-meta"><span><Globe2 size={14}/> North America · Taiwan · SEA</span><span><Users size={14}/> Service / integrator</span></div><div className="plan-bottom"><span>Not started</span><button className="text-button" onClick={()=>showNotice("This is a planning template. No search has been started.")}>Configure <ArrowRight size={14}/></button></div></div>
              <div className="plan-card"><div className="plan-card-top"><span className="plan-icon"><Zap size={18}/></span><span className="stage-tag">Draft template</span></div><h3>Industrial UV Water Disinfection</h3><p>Find water-treatment engineering firms, OEM partners and project integrators.</p><div className="plan-meta"><span><Globe2 size={14}/> Global</span><span><Users size={14}/> Engineering / OEM</span></div><div className="plan-bottom"><span>Not started</span><button className="text-button" onClick={()=>showNotice("This is a planning template. No search has been started.")}>Configure <ArrowRight size={14}/></button></div></div>
            </div>
          </section>}

          {active === "inbox" && <section>
            <div className="page-heading"><div><div className="eyebrow">CUSTOMER RELATIONSHIPS</div><h1>{t("Conversation Hub")}</h1><p>{t("One place for customer replies, context and reviewed AI suggestions.")}</p></div><span className="stage-tag">{t("Demo conversations")}</span></div>
            <div className="conversation-layout"><div className="conversation-list"><div className="conversation-search"><Search size={15}/><span>Search conversations</span></div>{customers.filter(c=>c.id===1||c.id===2).map((c,i)=><button key={c.id} className={"conversation-item "+(i===0?"conversation-active":"")} onClick={()=>setSelected(c)}><div className="conversation-avatar">{c.company[0]}</div><div className="conversation-preview"><div><strong>{c.company}</strong><time>{i===0?"10:42":"Yesterday"}</time></div><span>{i===0?"Could you recommend a UV system for our flow?":"Can you share specifications and MOQ?"}</span><small>{c.product}</small></div></button>)}</div>
              <div className="chat-panel"><div className="chat-header"><div className="conversation-avatar">N</div><div><strong>Nordic Water Systems</strong><span>Technical inquiry · Demo thread</span></div><button className="ghost-button" onClick={()=>showNotice("Customer profile preview. Connect the database to load verified records.")}><PanelRight size={15}/> Profile</button></div><div className="chat-messages"><div className="chat-date">TODAY</div><div className="bubble bubble-out">Would an OEM UV disinfection reactor be relevant for your water-treatment projects?</div><div className="bubble bubble-in">We are interested. Can you recommend a UV system for a flow of 20 m³/h?</div><div className="ai-suggestion"><div className="ai-suggestion-title"><Sparkles size={15}/> AI REPLY SUGGESTION <span>Needs review</span></div><p>Thank you for your interest. To recommend a suitable UV reactor, could you share the UV transmittance, target microorganism or required UV dose, and operating pressure? We can then review the configuration against your flow requirement.</p><button className="secondary-button compact" onClick={()=>showNotice("Demo reply copied. No email has been sent.")}>Copy suggestion</button></div></div><div className="chat-compose"><textarea value={draft} onChange={e=>setDraft(e.target.value)} aria-label="Reply draft"/><div><span>Human review required · demo only</span><button className="primary-button" onClick={()=>showNotice("No live mailbox is connected. This draft has not been sent.")}><Send size={15}/> Send reply</button></div></div></div>
            </div>
          </section>}

          {active === "outreach" && <section><div className="page-heading"><div><div className="eyebrow">MULTI-CHANNEL ENGAGEMENT</div><h1>{t("Outreach Center")}</h1><p>{t("AI prepares context and copy; you control social-platform actions.")}</p></div></div><div className="channel-grid">{[{name:"LinkedIn",desc:"Open verified company or contact profile",icon:"in"},{name:"WhatsApp",desc:"Open an existing business conversation",icon:"wa"},{name:"Instagram",desc:"Review brand profile and prepare a message",icon:"ig"},{name:"Facebook",desc:"Open company page and prepare outreach",icon:"fb"}].map(c=><div className="channel-card" key={c.name}><div className="channel-logo">{c.icon}</div><div><h3>{c.name}</h3><p>{c.desc}</p><span className="stage-tag">Manual action</span></div><button className="ghost-button" onClick={()=>showNotice("Customer-specific links will appear after contact profiles are verified.")}>Open <ExternalLink size={14}/></button></div>)}</div><div className="notice-card"><ShieldCheck size={19}/><div><strong>Human-controlled social outreach</strong><p>V1.0 will not automate scraping or bulk messaging on social platforms. It will prepare verified links and drafts, record your confirmation separately from platform-verified delivery.</p></div></div></section>}

          {active === "mail" && <section><div className="page-heading"><div><div className="eyebrow">EMAIL OPERATIONS</div><h1>{t("AI Mail Manager")}</h1><p>{t("Separate AI prospecting mail from your everyday business inbox.")}</p></div><span className="stage-tag">{t("Mailbox not connected")}</span></div><div className="mail-tabs">{["All","Sent","Replies","Bounces","Unsubscribed","Auto-replies","Priority"].map(t=><button key={t} className={mailTab===t?"mail-tab active-mail-tab":"mail-tab"} onClick={()=>setMailTab(t)}>{t}</button>)}</div><div className="mail-empty"><div className="empty-icon"><Inbox size={25}/></div><h3>{mailTab==="All"?"Your AI mail workspace is ready":mailTab+" folder"}</h3><p>Connect Gmail or Tencent Enterprise Mail to synchronize real messages, delivery events and replies. Nothing will be moved or sent before you approve the connection and rules.</p><button className="secondary-button" onClick={()=>showNotice("Mailbox connection is scheduled for the integration stage. No account has been accessed.")}>View connection requirements <ArrowRight size={15}/></button></div></section>}

          {active === "tasks" && <section><div className="page-heading"><div><div className="eyebrow">EXECUTION CONTROL</div><h1>{t("Tasks & Audit")}</h1><p>{t("Completion is evidence-based, never based on an AI self-report.")}</p></div></div><div className="audit-banner"><ShieldCheck size={20}/><div><strong>Evidence-first task accounting</strong><p>Every future task will have an ID, attempt history, external evidence, final state and recovery decision.</p></div></div><div className="audit-grid">{[{n:"Queued",v:"—",d:"Persistent pending work"},{n:"Running",v:"—",d:"Worker heartbeat"},{n:"Needs review",v:"—",d:"Uncertain or risky state"},{n:"Failed",v:"—",d:"Recorded reason and retry policy"}].map(x=><div className="metric-card" key={x.n}><span>{x.n}</span><strong>{x.v}</strong><small>{x.d}</small></div>)}</div><div className="table-card"><div className="table-toolbar"><strong>Execution ledger</strong><span>Live task history will appear after backend setup.</span></div><div className="empty-state">No production tasks have been run. This is intentional: no external action is enabled in the preview.</div></div></section>}

          {active === "models" && <section><div className="page-heading"><div><div className="eyebrow">MODEL-AGNOSTIC ARCHITECTURE</div><h1>{t("Model Connections")}</h1><p>{t("Choose providers independently of the business workflow.")}</p></div><button className="primary-button" onClick={()=>showNotice("Model connection setup will request your provider endpoint and API key through encrypted settings. Do not paste keys into chat.")}><Plus size={16}/> Add provider</button></div><div className="model-grid">{[{name:"OpenAI-compatible API",desc:"Custom endpoint · model name · encrypted key",tag:"Provider adapter"},{name:"DeepSeek",desc:"Optional model provider",tag:"Provider adapter"},{name:"Google Gemini",desc:"Optional model provider",tag:"Provider adapter"},{name:"Anthropic Claude",desc:"Optional model provider",tag:"Provider adapter"}].map(m=><div className="model-card" key={m.name}><div className="model-symbol"><Bot size={20}/></div><div><h3>{m.name}</h3><p>{m.desc}</p><span className="stage-tag">{m.tag}</span></div><button className="secondary-button compact" onClick={()=>showNotice("No model provider is connected yet.")}>Configure</button></div>)}</div><div className="notice-card"><ShieldCheck size={19}/><div><strong>Credential safety</strong><p>API keys will be stored server-side as encrypted secrets. They will never be exposed in browser code or chat messages.</p></div></div></section>}

          {active === "settings" && <section><div className="page-heading"><div><div className="eyebrow">WORKSPACE CONTROL</div><h1>{t("Settings")}</h1><p>{t("Workspace identity, permissions, data and safety rules.")}</p></div></div><div className="settings-list">{[{title:"Workspace",desc:"AI Sales Workspace · Independent environment"},{title:"Data ownership",desc:"Exportable customer records, task history and audit trail"},{title:"Safety policy",desc:"No unverified contact auto-send; no false completion states"},{title:"Integrations",desc:"Gmail, Tencent Mail, model providers and search services"},{title:"Backup & recovery",desc:"Automated database backups and restore drills"}].map(x=><div className="settings-row" key={x.title}><div><strong>{x.title}</strong><span>{x.desc}</span></div><ChevronRight size={17}/></div>)}</div></section>}
        </div>
        <footer className="footer"><span>AI Sales Workspace · {t("Independent V1.0 build")}</span><span>{t("Preview environment · No live customer actions")}</span></footer>
      </section>
      {notice && <div className="toast"><CheckCircle2 size={17}/>{notice}<button onClick={() => setNotice("")}><X size={15}/></button></div>}
    </main>
  );
}

function Overview({ onNavigate, onNotice, t }: { onNavigate: (id:string)=>void; onNotice: (message:string)=>void; t: (value:string)=>string }) {
  return <section>
    <div className="welcome-row"><div><div className="eyebrow">{t("SATURDAY · NOVEMBER 14, 2026")}</div><h1>{t("Good morning")}</h1><p>{t("Your sales development command center is ready.")}</p></div><button className="primary-button" onClick={()=>onNavigate("plans")}><Plus size={16}/> {t("Create development plan")}</button></div>
    <div className="preview-banner"><div className="preview-icon"><Sparkles size={18}/></div><div><strong>{t("Independent workspace initialized")}</strong><p>{t("This is the first UI build. Demo records are clearly marked; real database, AI models and mailboxes are not connected yet.")}</p></div><span className="preview-status">{t("PREVIEW")}</span></div>
    <div className="section-title"><div><h2>{t("Business pulse")}</h2><p>{t("Production metrics will appear after verified data is connected.")}</p></div><button className="ghost-button" onClick={()=>onNotice(t("These are placeholders, not live operating figures."))}>{t("Why no live metrics?")}</button></div>
    <div className="metric-grid">
      <Metric icon={<Building2 size={17}/>} label={t("Verified new accounts")} value="—" hint={t("Requires live research + deduplication")} t={t}/>
      <Metric icon={<Send size={17}/>} label={t("Qualified outreach")} value="—" hint={t("Requires external send evidence")} t={t}/>
      <Metric icon={<MessageCircle size={17}/>} label={t("Meaningful replies")} value="—" hint={t("Excludes auto-replies and bounces")} t={t}/>
      <Metric icon={<Target size={17}/>} label={t("Active opportunities")} value="—" hint={t("Requires real commercial progress")} t={t}/>
    </div>
    <div className="dashboard-grid">
      <div className="panel priority-panel"><div className="panel-heading"><div><h2>{t("Priority queue")}</h2><p>{t("Suggested work · sample records")}</p></div><span className="soft-count">03</span></div>
        {[{n:"Review a technical inquiry",d:"Nordic Water Systems · UV reactor",tag:"High priority",color:"green",action:"inbox"},{n:"Verify purchasing contact",d:"SolarGuard Outdoor · Solar mosquito killer",tag:"Needs verification",color:"amber",action:"customers"},{n:"Investigate hard-bounce source",d:"CleanTech Components · Replacement lamps",tag:"Suppressed",color:"red",action:"tasks"}].map((x,i)=><div className="priority-row" key={x.n}><div className="priority-number">0{i+1}</div><div className="priority-copy"><strong>{x.n}</strong><span>{x.d}</span></div><span className={"priority-tag "+x.color}>{x.tag}</span><button className="row-arrow" onClick={()=>onNavigate(x.action)}><ArrowUpRight size={16}/></button></div>)}
        <button className="panel-link" onClick={()=>onNavigate("customers")}>View customer database <ArrowRight size={15}/></button>
      </div>
      <div className="panel pipeline-panel"><div className="panel-heading"><div><h2>{t("Development pipeline")}</h2><p>{t("Sample stage distribution")}</p></div><button className="ghost-button" onClick={()=>onNavigate("customers")}>View all</button></div>
        {[{n:"Research",v:1,w:"17%"},{n:"Verification",v:1,w:"17%"},{n:"Ready for review",v:1,w:"17%"},{n:"Awaiting reply",v:1,w:"17%"},{n:"Technical inquiry",v:1,w:"17%"},{n:"Suppressed",v:1,w:"17%"}].map(x=><div className="pipeline-row" key={x.n}><span>{x.n}</span><div className="pipeline-track"><div style={{width:x.w}}/></div><strong>{x.v}</strong></div>)}
        <div className="pipeline-note"><CircleAlert size={15}/> Sample distribution only. No live customer pipeline is connected.</div>
      </div>
    </div>
    <div className="section-title"><div><h2>{t("Core workspaces")}</h2><p>{t("Designed around the complete customer development loop.")}</p></div></div>
    <div className="quick-grid">{[{id:"plans",icon:<Target size={18}/>,title:"Development plans",desc:"Product, market, buyer profile and target"},{id:"customers",icon:<Users size={18}/>,title:"Customer assets",desc:"Search, filter, deduplicate and expand profiles"},{id:"inbox",icon:<MessageCircle size={18}/>,title:"Conversation hub",desc:"Buyer context, AI suggestions and human review"},{id:"tasks",icon:<ShieldCheck size={18}/>,title:"Execution audit",desc:"Real evidence, failures and safe recovery"}].map(x=><button className="quick-card" key={x.id} onClick={()=>onNavigate(x.id)}><span>{x.icon}</span><strong>{x.title}</strong><small>{x.desc}</small><ArrowUpRight size={15}/></button>)}</div>
  </section>;
}
function Metric({icon,label,value,hint,t}:{icon:React.ReactNode;label:string;value:string;hint:string;t:(value:string)=>string}) {
  return <div className="metric-card"><div className="metric-top"><span className="metric-icon">{icon}</span><span className="metric-period">{t("LIVE DATA PENDING")}</span></div><strong>{value}</strong><span className="metric-label">{label}</span><small>{hint}</small></div>;
}
function CustomerDrawer({customer,onClose,t}:{customer:Customer;onClose:()=>void;t:(value:string)=>string}) {
  return <div className="drawer-backdrop" onClick={onClose}><aside className="customer-drawer" onClick={e=>e.stopPropagation()}><div className="drawer-top"><div><div className="eyebrow">{t("CUSTOMER PROFILE")}</div><h2>{customer.company}</h2><p>{customer.country} · {customer.type}</p></div><button className="icon-button" onClick={onClose}><X size={18}/></button></div><div className="drawer-summary"><Sparkles size={16}/><div><strong>{t("AI business summary")}</strong><p>{customer.summary}</p></div></div><div className="drawer-section"><h3>{t("Business snapshot")}</h3><div className="detail-grid"><div><span>Product fit</span><strong>{customer.product}</strong></div><div><span>Customer grade</span><strong>{customer.grade} · evidence pending</strong></div><div><span>Development stage</span><strong>{customer.stage}</strong></div><div><span>Last updated</span><strong>{customer.updated}</strong></div></div></div><div className="drawer-section"><h3>{t("Contact information")}</h3><div className="contact-record"><Mail size={16}/><div><strong>{customer.email}</strong><span>{customer.emailStatus}</span></div></div><div className="contact-record"><Users size={16}/><div><strong>{customer.contact}</strong><span>{t("Identity and role require source verification")}</span></div></div></div><div className="drawer-section"><h3>{t("Next best action")}</h3><div className="next-action-card"><Target size={17}/><div><strong>{customer.next}</strong><span>{t("Recommendation only · not an executed task")}</span></div></div></div><div className="drawer-actions"><button className="secondary-button" onClick={()=>navigator.clipboard?.writeText(customer.company)}>{t("Copy company name")}</button><button className="primary-button" onClick={()=>alert("Connect the live database before creating tasks.")}>{t("Create follow-up task")}</button></div></aside></div>;
}