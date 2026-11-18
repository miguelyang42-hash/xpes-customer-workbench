"use client";

import { useEffect, useMemo, useState } from "react";
import {V3LaunchCenter,V3MailGateway,V3ModelGateway,V3Nurturing} from "./v3-workspace";
import {
  ArrowRight, ArrowUpRight, Bell, Bot, Building2, CheckCircle2, ChevronDown, ChevronRight,
  CircleAlert, ClipboardList, CircleHelp, Compass, Download, ExternalLink, Globe2, Inbox,
  Layers3, Mail, Menu, MessageCircle, MoreHorizontal, Plus, Search, Send, Settings2,
  ShieldCheck, Sparkles, Target, Users, X, Zap, RefreshCw, PanelRight, CalendarDays, Clock3, ListTodo
} from "lucide-react";

type Customer = {
  id: number; company: string; country: string; product: string; type: string;
  grade: "A" | "B" | "C"; stage: string; next: string; contact: string;
  email: string; emailStatus: string; summary: string; updated: string;
  website?: string; sourceUrl?: string; createdAt?: string;
};
type FollowUpTask = {
  id: string; title: string; description: string; dueDate: string;
  priority: "urgent" | "high" | "normal" | "low"; status: "open" | "completed" | "cancelled";
  customerId?: number; customerName?: string; createdAt: string; completedAt?: string;
};
const todayLocal = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0,10); };
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
    { id: "inbox", label: "Conversation Hub", icon: MessageCircle },
    { id: "nurturing", label: "Customer Nurturing", icon: RefreshCw }
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
  "Customer Nurturing": "客户持续开发",
  "Start development": "启动开发流程",
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
  "Research": "调研中",
  "Verification": "核实中",
  "Ready for review": "待审核",
  "Awaiting reply": "等待回复",
  "Technical inquiry": "技术询盘",
  "Do not contact": "禁止联系",
  "AI Sales Workspace · Independent environment": "AI Sales Workspace · 独立环境",
  "Independent environment": "独立环境",
  "Export": "导出",
  "Showing": "显示",
  "sample accounts": "条演示客户",
  "Solar Mosquito Killer · South America": "太阳能灭蚊灯 · 南美市场",
  "Brand / distributor": "品牌商 / 经销商",
  "This is a planning template. No search has been started.": "这是开发计划模板，尚未启动实际搜索。",
  "185nm TOC Replacement Lamps": "185nm TOC 替换灯",
  "Service / integrator": "服务商 / 系统集成商",
  "Industrial UV Water Disinfection": "工业 UV 水消毒",
  "Engineering / OEM": "工程公司 / OEM",
  "Technical inquiry · Demo thread": "技术询盘 · 演示会话",
  "TODAY": "今天",
  "No live mailbox is connected. This draft has not been sent.": "尚未连接真实邮箱，此草稿没有发送。",
  "Customer-specific links will appear after contact profiles are verified.": "核实联系人档案后，将显示对应链接。",
  "OpenAI-compatible API": "兼容 OpenAI 的 API",
  "Custom endpoint · model name · encrypted key": "自定义接口 · 模型名称 · 加密密钥",
  "Optional model provider": "可选模型服务商",
  "Provider adapter": "模型适配器",
  "No model provider is connected yet.": "尚未连接模型服务商。",
  "Product fit": "产品匹配",
  "Customer grade": "客户等级",
  "Development stage": "开发阶段",
  "Last updated": "最后更新",
  "View all": "查看全部",
  "Development plans": "开发计划",
  "Customer assets": "客户资产",
  "Conversation hub": "客户会话中心",
  "Execution audit": "执行审计",
  "Demo reply copied. No email has been sent.": "已复制演示回复，没有发送邮件。",
  "Connect the live database before creating tasks.": "请先连接真实数据库，再创建跟进任务。",
  "Plan builder will be connected to the task engine in the next build stage.": "开发计划编辑器将在下一阶段接入任务引擎。",
  "Export will be enabled after cloud database setup.": "连接云端数据库后即可导出。",
  "Company website": "公司网站",
  "Source record": "资料来源",
  "Opportunities & interactions": "商机与沟通记录",
  "Initial product interest · qualification not completed": "初步产品兴趣 · 尚未完成需求确认",
  "No verified interaction history yet": "暂时没有已核实的沟通记录",
  "Communication history will be added after mailbox and messaging connections.": "接入邮箱和消息渠道后，将在这里汇总沟通历史。",

  "Needs attention": "需要处理",
  "Today": "今天",
  "Follow-up task": "客户跟进",
  "Not specified": "未指定",
  "Not provided": "未提供",
  "Not identified": "未识别",
  "Source verified": "来源已核实",
  "Unverified": "未核实",
  "Not available": "不可用",
  "Distributor": "经销商",
  "Importer / wholesaler": "进口商 / 批发商",
  "Manufacturer": "制造商",
  "Service provider": "服务商",
  "End user": "终端用户",
  "Other": "其他",
  "Today's Action Center": "今日行动中心",
  "Overdue": "已逾期",
  "Open tasks": "待办任务",
  "Create task": "新建任务",
  "No follow-up tasks yet": "还没有跟进任务",
  "Create your first task so the system can help you keep the next step visible.": "创建第一条跟进任务，让系统帮你持续掌握客户下一步行动。",
  "Due": "截止日期",
  "Mark complete": "标记完成",
  "Completed": "已完成",
  "Cancelled": "已取消",
  "Urgent": "紧急",
  "High": "高",
  "Normal": "普通",
  "Low": "低",
  "All tasks": "全部任务",
  "Open only": "只看待处理",
  "Completed only": "只看已完成",
  "Task saved in this browser. Cloud sync will be enabled after database setup.": "任务已保存在当前浏览器。连接数据库后才能云端同步。",
  "Customer saved in this browser. Cloud sync will be enabled after database setup.": "客户已保存在当前浏览器。连接数据库后才能云端同步。",
  "Company name": "公司名称",
  "Country": "国家",
  "Website": "公司网站",
  "Product interest": "感兴趣的产品",
  "Company type": "公司类型",
  "Contact name": "联系人姓名",
  "Job title": "职位",
  "Source URL": "信息来源链接",
  "Notes": "备注",
  "Save customer": "保存客户",
  "Cancel": "取消",
  "New customer": "新增客户",
  "New follow-up task": "新建跟进任务",
  "Task title": "任务标题",
  "Related customer": "关联客户",
  "No customer linked": "暂不关联客户",
  "Description": "任务说明",
  "Due date": "截止日期",
  "Save task": "保存任务",
  "Saved in this browser": "保存在当前浏览器",
  "Cloud database not connected": "云端数据库尚未连接",
  "Local draft data only. Do not use this browser-only preview as your sole business record.": "当前仅保存在本浏览器。不要将此预览版作为唯一业务档案。",
  "Task status": "任务状态",
  "Customer profile": "客户档案",
  "Add contact and opportunity records in the next database stage.": "联系人和商机独立档案将在数据库阶段接入。",
  "No customers match your filters.": "没有符合筛选条件的客户。",
  "All records": "全部记录",
  "Customer records": "客户档案",
  "Search by company, contact, email, country or product.": "按公司、联系人、邮箱、国家或产品搜索。",
  "Demo records are examples; records you add are saved locally until cloud setup.": "演示客户仅供参考；你新增的记录在云端连接前保存在本地。",
  "Task completed manually. No external message was sent.": "已由人工标记任务完成，没有发送任何外部消息。",
  "Add a customer first": "请先新增客户",
  "Select a customer": "选择客户",
  "Today's tasks": "今日任务",
  "No overdue tasks": "没有逾期任务",
  "Task history": "任务记录",
  "Created locally": "本地创建",
  "Company": "公司",
  "Stage": "阶段",
  "Next action": "下一步行动",
  "Verify company and contact": "核实公司和联系人",
  "A new customer record. Verify the company and contact before outreach.": "新建客户档案。触达前请核实公司和联系人。",
  "This is a manual reminder. It does not send a message or claim external work was completed.": "这是人工跟进提醒，不会发送消息，也不会声称外部工作已完成。",
  "Integration services": "集成服务",
  "Authorize email, social and research accounts for this workspace.": "为此工作空间授权邮箱、社媒和研究账号。",
  "Email": "邮箱",
  "Social media": "社交媒体",
  "Research services": "研究服务",
  "Not connected": "未连接",
  "Connect account": "连接账号",
  "OAuth setup is not configured for this service yet. No account was authorized.": "此服务尚未配置 OAuth 授权，当前没有账号连接成功。",
  "Google / Gmail": "Google / Gmail",
  "Microsoft 365": "Microsoft 365",
  "Tencent Enterprise Mail": "腾讯企业邮箱",
  "LinkedIn": "LinkedIn",
  "Instagram / Facebook": "Instagram / Facebook",
  "WhatsApp Business": "WhatsApp Business",
  "Web research": "网页研究",
  "Account authorization and granted permissions will be shown here after OAuth is configured.": "配置 OAuth 后，这里会显示已授权账号和授予的权限。"
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
  const [extraCustomers, setExtraCustomers] = useState<Customer[]>([]);
  const [tasks, setTasks] = useState<FollowUpTask[]>([]);
  const [storageReady, setStorageReady] = useState(false);
  const [customerModal, setCustomerModal] = useState(false);
  const [taskModal, setTaskModal] = useState(false);
  const [taskCustomer, setTaskCustomer] = useState<Customer | null>(null);
  const allCustomers = useMemo(() => [...extraCustomers, ...customers], [extraCustomers]);
  useEffect(() => {
    try {
      const savedCustomers = window.localStorage.getItem("ai-sales-workspace-customers");
      const savedTasks = window.localStorage.getItem("ai-sales-workspace-tasks");
      if (savedCustomers) setExtraCustomers(JSON.parse(savedCustomers));
      if (savedTasks) setTasks(JSON.parse(savedTasks));
    } catch { /* Invalid local preview data is ignored safely. */ }
    setStorageReady(true);
  }, []);
  useEffect(() => {
    if (!storageReady) return;
    window.localStorage.setItem("ai-sales-workspace-customers", JSON.stringify(extraCustomers));
    window.localStorage.setItem("ai-sales-workspace-tasks", JSON.stringify(tasks));
  }, [extraCustomers, tasks, storageReady]);

  const filtered = useMemo(() => allCustomers.filter(c => {
    const text = [c.company, c.country, c.product, c.type, c.contact, c.email].join(" ").toLowerCase();
    return (!query || text.includes(query.toLowerCase()))
      && (country === "All countries" || c.country === country)
      && (stage === "All stages" || c.stage === stage)
      && (product === "All products" || c.product === product);
  }), [allCustomers, query, country, stage, product]);

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3200);
  };
  const saveCustomer = (customer: Customer) => {
    setExtraCustomers(prev => [customer, ...prev]);
    setCustomerModal(false);
    showNotice(t("Customer saved in this browser. Cloud sync will be enabled after database setup."));
  };
  const saveTask = (task: FollowUpTask) => {
    setTasks(prev => [task, ...prev]);
    setTaskModal(false);
    setTaskCustomer(null);
    showNotice(t("Task saved in this browser. Cloud sync will be enabled after database setup."));
  };
  const openTaskModal = (customer: Customer | null = null) => {
    setTaskCustomer(customer);
    setTaskModal(true);
  };
  const completeTask = (id: string) => {
    setTasks(prev => prev.map(task => task.id === id ? { ...task, status: "completed", completedAt: new Date().toISOString() } : task));
    showNotice(t("Task completed manually. No external message was sent."));
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
                {item.id === "tasks" && tasks.filter(task=>task.status==="open").length>0 && <span className="nav-count">{tasks.filter(task=>task.status==="open").length}</span>}
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
          {active === "overview" && <Overview onNavigate={setActive} onNotice={showNotice} t={t} tasks={tasks} customersCount={allCustomers.length} onCreateTask={()=>openTaskModal(null)} onCompleteTask={completeTask}/>}
          {active === "customers" && <section>
            <div className="page-heading"><div><div className="eyebrow">{t("CUSTOMER ASSETS")}</div><h1>{t("Customer Database")}</h1><p>{t("A clean view of every account, contact and next action.")}</p></div><button className="primary-button" onClick={() => setCustomerModal(true)}><Plus size={16}/> {t("Add customer")}</button></div>
            <div className="filter-panel">
              <div className="search-box"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={t("Search company, country, product, contact…")}/></div>
              <select value={country} onChange={e=>setCountry(e.target.value)}><option>{t("All countries")}</option>{Array.from(new Set(allCustomers.map(c=>c.country))).sort().map(c=><option key={c}>{c}</option>)}</select>
              <select value={product} onChange={e=>setProduct(e.target.value)}><option>{t("All products")}</option>{Array.from(new Set(allCustomers.map(c=>c.product))).map(p=><option key={p}>{p}</option>)}</select>
              <select value={stage} onChange={e=>setStage(e.target.value)}>{stageOptions.map(s=><option key={s}>{t(s)}</option>)}</select>
              <button className="secondary-button compact" onClick={()=>{setQuery("");setCountry("All countries");setProduct("All products");setStage("All stages");}}><RefreshCw size={15}/> {t("Reset")}</button>
            </div>
            <div className="table-card customer-list-card">
                <div className="table-toolbar"><div><strong>{filtered.length} {t("accounts")}</strong><span> · {t("Click a row to view the full profile")}</span></div><button className="ghost-button" onClick={()=>showNotice(t("Export will be enabled after cloud database setup."))}><Download size={15}/> {t("Export")}</button></div>
                <div className="customer-card-list">
                  {filtered.map(c=><button type="button" key={c.id} className="customer-card" onClick={()=>setSelected(c)}>
                    <div className="customer-card-main"><div className="company-logo">{c.company.slice(0,1)}</div><div className="customer-card-copy"><strong>{c.company}</strong><span>{c.country} · {t(c.type)} · {c.product}</span><small>{c.contact} · {c.email}</small></div></div>
                    <div className="customer-card-side"><span className={"grade grade-"+c.grade.toLowerCase()}>{c.grade}</span><span className={"stage-tag "+(c.stage==="Do not contact"?"stage-danger":c.stage==="Awaiting reply"||c.stage==="Technical inquiry"?"stage-green":"")}>{t(c.stage)}</span><small>{t("Next action")}: {t(c.next)}</small><ChevronRight size={17}/></div>
                  </button>)}
                  {filtered.length===0&&<div className="empty-state">{t("No customers match your filters.")}</div>}
                </div>
                <div className="table-footer">{t("Showing")} {filtered.length} {t("accounts")} <span>{t("Demo records are examples; records you add are saved locally until cloud setup.")}</span></div>
              </div>
              {selected && <CustomerDrawer customer={selected} onClose={()=>setSelected(null)} onCreateTask={()=>{openTaskModal(selected);setSelected(null);}} t={t}/>}
          </section>}

          {active === "plans" && <V3LaunchCenter t={t}/>}
          {active === "nurturing" && <V3Nurturing t={t}/>}
          
          {active === "inbox" && <section>
            <div className="page-heading"><div><div className="eyebrow">CUSTOMER RELATIONSHIPS</div><h1>{t("Conversation Hub")}</h1><p>{t("One place for customer replies, context and reviewed AI suggestions.")}</p></div><span className="stage-tag">{t("Demo conversations")}</span></div>
            <div className="conversation-layout"><div className="conversation-list"><div className="conversation-search"><Search size={15}/><span>{t("Search conversations")}</span></div>{customers.filter(c=>c.id===1||c.id===2).map((c,i)=><button key={c.id} className={"conversation-item "+(i===0?"conversation-active":"")} onClick={()=>setSelected(c)}><div className="conversation-avatar">{c.company[0]}</div><div className="conversation-preview"><div><strong>{c.company}</strong><time>{i===0?"10:42":"Yesterday"}</time></div><span>{i===0?"Could you recommend a UV system for our flow?":"Can you share specifications and MOQ?"}</span><small>{c.product}</small></div></button>)}</div>
              <div className="chat-panel"><div className="chat-header"><div className="conversation-avatar">N</div><div><strong>Nordic Water Systems</strong><span>{t("Technical inquiry · Demo thread")}</span></div><button className="ghost-button" onClick={()=>showNotice(t("Customer profile preview. Connect the database to load verified records."))}><PanelRight size={15}/> {t("Profile")}</button></div><div className="chat-messages"><div className="chat-date">{t("TODAY")}</div><div className="bubble bubble-out">Would an OEM UV disinfection reactor be relevant for your water-treatment projects?</div><div className="bubble bubble-in">We are interested. Can you recommend a UV system for a flow of 20 m³/h?</div><div className="ai-suggestion"><div className="ai-suggestion-title"><Sparkles size={15}/> AI REPLY SUGGESTION <span>Needs review</span></div><p>Thank you for your interest. To recommend a suitable UV reactor, could you share the UV transmittance, target microorganism or required UV dose, and operating pressure? We can then review the configuration against your flow requirement.</p><button className="secondary-button compact" onClick={()=>showNotice(t("Demo reply copied. No email has been sent."))}>{t("Copy suggestion")}</button></div></div><div className="chat-compose"><textarea value={draft} onChange={e=>setDraft(e.target.value)} aria-label="Reply draft"/><div><span>{t("Human review required · demo only")}</span><button className="primary-button" onClick={()=>showNotice("No live mailbox is connected. This draft has not been sent.")}><Send size={15}/> {t("Send reply")}</button></div></div></div>
            </div>
          </section>}

          {active === "outreach" && <section><div className="page-heading"><div><div className="eyebrow">MULTI-CHANNEL ENGAGEMENT</div><h1>{t("Outreach Center")}</h1><p>{t("AI prepares context and copy; you control social-platform actions.")}</p></div></div><div className="channel-grid">{[{name:"LinkedIn",desc:"Open verified company or contact profile",icon:"in"},{name:"WhatsApp",desc:"Open an existing business conversation",icon:"wa"},{name:"Instagram",desc:"Review brand profile and prepare a message",icon:"ig"},{name:"Facebook",desc:"Open company page and prepare outreach",icon:"fb"}].map(c=><div className="channel-card" key={c.name}><div className="channel-logo">{c.icon}</div><div><h3>{c.name}</h3><p>{t(c.desc)}</p><span className="stage-tag">{t("Manual action")}</span></div><button className="ghost-button" onClick={()=>showNotice("Customer-specific links will appear after contact profiles are verified.")}>{t("Open")} <ExternalLink size={14}/></button></div>)}</div><div className="notice-card"><ShieldCheck size={19}/><div><strong>{t("Human-controlled social outreach")}</strong><p>{t("V1.0 will not automate scraping or bulk messaging on social platforms. It will prepare verified links and drafts, record your confirmation separately from platform-verified delivery.")}</p></div></div></section>}

          {active === "mail" && <V3MailGateway t={t}/>}
          
          {active === "tasks" && <TaskCenter tasks={tasks} onCreate={()=>openTaskModal(null)} onComplete={completeTask} t={t}/>}

          {active === "models" && <V3ModelGateway t={t}/>}
          
          {active === "settings" && <section><div className="page-heading"><div><div className="eyebrow">WORKSPACE CONTROL</div><h1>{t("Settings")}</h1><p>{t("Workspace identity, permissions, data and safety rules.")}</p></div></div><div className="settings-list">{[{title:"Workspace",desc:"AI Sales Workspace · Independent environment"},{title:"Data ownership",desc:"Exportable customer records, task history and audit trail"},{title:"Safety policy",desc:"No unverified contact auto-send; no false completion states"},{title:"Integrations",desc:"Gmail, Tencent Mail, model providers and search services"},{title:"Backup & recovery",desc:"Automated database backups and restore drills"}].map(x=><div className="settings-row" key={x.title}><div><strong>{t(x.title)}</strong><span>{t(x.desc)}</span></div><ChevronRight size={17}/></div>)}</div><div style={{marginTop:24,background:"#fff",border:"1px solid #dfe6ee",borderRadius:14,padding:22}}><div style={{marginBottom:18}}><h2 style={{margin:"0 0 6px",fontSize:20}}>{t("Integration services")}</h2><p style={{margin:0,color:"#718096",fontSize:14}}>{t("Authorize email, social and research accounts for this workspace.")}</p></div>{[{group:"Email",items:["Google / Gmail","Microsoft 365","Tencent Enterprise Mail"]},{group:"Social media",items:["LinkedIn","Instagram / Facebook","WhatsApp Business"]},{group:"Research services",items:["Web research"]}].map(group=><div key={group.group} style={{marginTop:20}}><h3 style={{fontSize:14,color:"#53677e",margin:"0 0 10px"}}>{t(group.group)}</h3><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:10}}>{group.items.map(name=><div key={name} style={{border:"1px solid #e5eaf0",borderRadius:10,padding:14,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}><div><strong style={{display:"block",fontSize:14}}>{t(name)}</strong><span style={{display:"inline-block",marginTop:6,fontSize:12,color:"#9a6b18",background:"#fff7e6",padding:"3px 8px",borderRadius:999}}>{t("Not connected")}</span></div><button className="ghost-button" onClick={()=>showNotice(t("OAuth setup is not configured for this service yet. No account was authorized."))}>{t("Connect account")}</button></div>)}</div></div>)}<p style={{margin:"18px 0 0",fontSize:12,color:"#8795a5"}}>{t("Account authorization and granted permissions will be shown here after OAuth is configured.")}</p></div></section>}
        </div>
        <footer className="footer"><span>AI Sales Workspace · V3 Design Preview</span><span>{t("Preview environment · No live customer actions")}</span></footer>
      </section>
      {customerModal && <CustomerForm onClose={()=>setCustomerModal(false)} onSave={saveCustomer} t={t}/>}
      {taskModal && <TaskForm customers={allCustomers} initialCustomer={taskCustomer} onClose={()=>{setTaskModal(false);setTaskCustomer(null);}} onSave={saveTask} t={t}/>}
      {notice && <div className="toast"><CheckCircle2 size={17}/>{notice}<button onClick={() => setNotice("")}><X size={15}/></button></div>}
    </main>
  );
}

function Overview({ onNavigate, onNotice, t, tasks, customersCount, onCreateTask, onCompleteTask }: { onNavigate: (id:string)=>void; onNotice: (message:string)=>void; t: (value:string)=>string; tasks: FollowUpTask[]; customersCount:number; onCreateTask:()=>void; onCompleteTask:(id:string)=>void }) {
  return <section>
    <div className="welcome-row"><div><div className="eyebrow">V3 · PREVIEW WORKSPACE</div><h1>{t("Good morning")}</h1><p>{t("Your sales development command center is ready.")}</p></div><div className="v3-home-actions"><button className="secondary-button" onClick={()=>onNavigate("customers")}><Users size={16}/> {t("Customer Database")}</button><button className="primary-button" onClick={()=>onNavigate("plans")}><Zap size={17}/>{t("Start development")}</button></div></div>
    <div className="preview-banner"><div className="preview-icon"><Sparkles size={18}/></div><div><strong>{t("Independent workspace initialized")}</strong><p>{t("This is the first UI build. Demo records are clearly marked; real database, AI models and mailboxes are not connected yet.")}</p></div><span className="preview-status">{t("PREVIEW")}</span></div>
    <div className="section-title"><div><h2>{t("Business pulse")}</h2><p>{t("Production metrics will appear after verified data is connected.")}</p></div><button className="ghost-button" onClick={()=>onNotice(t("These are placeholders, not live operating figures."))}>{t("Why no live metrics?")}</button></div>
    <div className="metric-grid">
      <Metric icon={<Building2 size={17}/>} label={t("Verified new accounts")} value="—" hint={t("Requires live research + deduplication")} t={t}/>
      <Metric icon={<Send size={17}/>} label={t("Qualified outreach")} value="—" hint={t("Requires external send evidence")} t={t}/>
      <Metric icon={<MessageCircle size={17}/>} label={t("Meaningful replies")} value="—" hint={t("Excludes auto-replies and bounces")} t={t}/>
      <Metric icon={<Target size={17}/>} label={t("Active opportunities")} value="—" hint={t("Requires real commercial progress")} t={t}/>
    </div>
    <div className="dashboard-grid">
      <div className="panel priority-panel">
        <div className="panel-heading"><div><h2>{t("Today's Action Center")}</h2><p>{t("Today's tasks")} · {tasks.filter(x=>x.status==="open" && x.dueDate<=todayLocal()).length}</p></div><button className="primary-button compact" onClick={onCreateTask}><Plus size={14}/> {t("Create task")}</button></div>
        <TodayActionList tasks={tasks} onComplete={onCompleteTask} onCreateTask={onCreateTask} t={t}/>
      </div>
      <div className="panel pipeline-panel">
        <div className="panel-heading"><div><h2>{t("Customer records")}</h2><p>{t("Saved in this browser")}</p></div><button className="ghost-button" onClick={()=>onNavigate("customers")}>{t("View all")}</button></div>
        <div className="portfolio-stat"><strong>{customersCount}</strong><span>{t("All records")} · {t("Demo records are examples; records you add are saved locally until cloud setup.")}</span></div>
        <div className="pipeline-note"><CircleAlert size={15}/> {t("Local draft data only. Do not use this browser-only preview as your sole business record.")}</div>
        <button className="panel-link" onClick={onCreateTask}>{t("Create task")} <ArrowRight size={15}/></button>
      </div>
    </div>
    <div className="section-title"><div><h2>{t("Core workspaces")}</h2><p>{t("Designed around the complete customer development loop.")}</p></div></div>
    <div className="quick-grid">{[{id:"plans",icon:<Target size={18}/>,title:"Development Plans",desc:"Product, market, buyer profile and target"},{id:"customers",icon:<Users size={18}/>,title:"Customer assets",desc:"Search, filter, deduplicate and expand profiles"},{id:"inbox",icon:<MessageCircle size={18}/>,title:"Conversation hub",desc:"Buyer context, AI suggestions and human review"},{id:"tasks",icon:<ShieldCheck size={18}/>,title:"Execution audit",desc:"Real evidence, failures and safe recovery"}].map(x=><button className="quick-card" key={x.id} onClick={()=>onNavigate(x.id)}><span>{x.icon}</span><strong>{t(x.title)}</strong><small>{t(x.desc)}</small><ArrowUpRight size={15}/></button>)}</div>
  </section>;
}

function TodayActionList({tasks,onComplete,onCreateTask,t}:{tasks:FollowUpTask[];onComplete:(id:string)=>void;onCreateTask:()=>void;t:(value:string)=>string}) {
  const due = tasks.filter(x=>x.status==="open" && x.dueDate<=todayLocal()).sort((a,b)=>({urgent:0,high:1,normal:2,low:3}[a.priority]-{urgent:0,high:1,normal:2,low:3}[b.priority]) || a.dueDate.localeCompare(b.dueDate)).slice(0,5);
  if (!due.length) return <div className="task-empty"><div className="task-empty-icon"><CalendarDays size={22}/></div><strong>{t("No follow-up tasks yet")}</strong><p>{t("Create your first task so the system can help you keep the next step visible.")}</p><button className="secondary-button" onClick={onCreateTask}><Plus size={14}/> {t("Create task")}</button></div>;
  return <div className="today-task-list">{due.map(task=><div className="today-task-row" key={task.id}><button className="task-check" aria-label={t("Mark complete")} onClick={()=>onComplete(task.id)}><CheckCircle2 size={18}/></button><div className="today-task-copy"><strong>{task.title}</strong><span>{task.customerName || t("No customer linked")} · {task.description || t("This is a manual reminder. It does not send a message or claim external work was completed.")}</span></div><div className="today-task-meta"><span className={"task-priority "+task.priority}>{t(task.priority[0].toUpperCase()+task.priority.slice(1))}</span><small>{task.dueDate<todayLocal()?t("Overdue"):t("Today")}</small></div></div>)}</div>;
}

function TaskCenter({tasks,onCreate,onComplete,t}:{tasks:FollowUpTask[];onCreate:()=>void;onComplete:(id:string)=>void;t:(value:string)=>string}) {
  const [filter,setFilter]=useState("open");
  const visible=tasks.filter(x=>filter==="all" || (filter==="open" && x.status==="open") || (filter==="completed" && x.status==="completed"));
  const overdue=tasks.filter(x=>x.status==="open" && x.dueDate<todayLocal()).length;
  const dueToday=tasks.filter(x=>x.status==="open" && x.dueDate===todayLocal()).length;
  return <section>
    <div className="page-heading"><div><div className="eyebrow">{t("EXECUTION CONTROL")}</div><h1>{t("Tasks & Audit")}</h1><p>{t("Completion is evidence-based, never based on an AI self-report.")}</p></div><button className="primary-button" onClick={onCreate}><Plus size={16}/> {t("Create task")}</button></div>
    <div className="audit-banner"><ShieldCheck size={20}/><div><strong>{t("Evidence-first task accounting")}</strong><p>{t("This is a manual reminder. It does not send a message or claim external work was completed.")}</p></div></div>
    <div className="audit-grid">
      <div className="metric-card"><span>{t("Open tasks")}</span><strong>{tasks.filter(x=>x.status==="open").length}</strong><small>{t("All tasks")}</small></div>
      <div className="metric-card"><span>{t("Today's tasks")}</span><strong>{dueToday}</strong><small>{t("Due date")}</small></div>
      <div className="metric-card"><span>{t("Overdue")}</span><strong>{overdue}</strong><small>{t("Needs attention")}</small></div>
      <div className="metric-card"><span>{t("Completed")}</span><strong>{tasks.filter(x=>x.status==="completed").length}</strong><small>{t("Task history")}</small></div>
    </div>
    <div className="table-card task-table-card">
      <div className="table-toolbar"><strong>{t("Task history")}</strong><select className="task-filter" value={filter} onChange={e=>setFilter(e.target.value)}><option value="open">{t("Open only")}</option><option value="all">{t("All tasks")}</option><option value="completed">{t("Completed only")}</option></select></div>
      {visible.length===0?<div className="task-empty"><div className="task-empty-icon"><ListTodo size={22}/></div><strong>{t("No follow-up tasks yet")}</strong><p>{t("Create your first task so the system can help you keep the next step visible.")}</p><button className="secondary-button" onClick={onCreate}><Plus size={14}/> {t("Create task")}</button></div>:<div className="task-list">{visible.map(task=><div className={"task-row "+(task.status==="completed"?"task-done":"")} key={task.id}><div className="task-row-main"><button className="task-check" disabled={task.status==="completed"} aria-label={t("Mark complete")} onClick={()=>onComplete(task.id)}>{task.status==="completed"?<CheckCircle2 size={18}/>:<CircleAlert size={18}/>}</button><div className="task-row-copy"><strong>{task.title}</strong><span>{task.customerName || t("No customer linked")}{task.description?" · "+task.description:""}</span></div></div><div className="task-row-meta"><span className={"task-priority "+task.priority}>{t(task.priority[0].toUpperCase()+task.priority.slice(1))}</span><small className={task.status==="open"&&task.dueDate<todayLocal()?"overdue-text":""}>{t("Due")}: {task.dueDate}</small><span className="stage-tag">{t(task.status==="completed"?"Completed":"Open")}</span></div></div>)}</div>}
    </div>
    <p className="local-storage-note"><ShieldCheck size={14}/> {t("Local draft data only. Do not use this browser-only preview as your sole business record.")}</p>
  </section>;
}

function CustomerForm({onClose,onSave,t}:{onClose:()=>void;onSave:(customer:Customer)=>void;t:(value:string)=>string}) {
  const [form,setForm]=useState({company:"",country:"",website:"",product:"",type:"Distributor",contact:"",jobTitle:"",email:"",sourceUrl:"",notes:""});
  const set=(key:keyof typeof form,value:string)=>setForm(prev=>({...prev,[key]:value}));
  const submit=(e:React.FormEvent)=>{e.preventDefault();if(!form.company.trim()||!form.country.trim())return;onSave({id:Date.now(),company:form.company.trim(),country:form.country.trim(),product:form.product.trim()||"Not specified",type:form.type,grade:"C",stage:"Research",next:"Verify company and contact",contact:form.contact.trim()?(form.jobTitle.trim()?form.jobTitle.trim()+" · "+form.contact.trim():form.contact.trim()):"Not identified",email:form.email.trim()||"Not provided",emailStatus:form.email.trim()?"Unverified":"Not available",summary:form.notes.trim()||"A new customer record. Verify the company and contact before outreach.",updated:"Just now",website:form.website.trim(),sourceUrl:form.sourceUrl.trim(),createdAt:new Date().toISOString()});};
  return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}><form className="workspace-modal" onSubmit={submit}><div className="modal-heading"><div><span className="eyebrow">{t("CUSTOMER ASSETS")}</span><h2>{t("New customer")}</h2><p>{t("Company name")} and {t("Country")} are required.</p></div><button type="button" className="icon-button" onClick={onClose}><X size={18}/></button></div>
    <div className="form-grid"><label>{t("Company name")} *<input required value={form.company} onChange={e=>set("company",e.target.value)} placeholder="Company Ltd."/></label><label>{t("Country")} *<input required value={form.country} onChange={e=>set("country",e.target.value)} placeholder="Peru"/></label><label>{t("Website")}<input value={form.website} onChange={e=>set("website",e.target.value)} placeholder="https://"/></label><label>{t("Product interest")}<input value={form.product} onChange={e=>set("product",e.target.value)} placeholder="UV water disinfection"/></label><label>{t("Company type")}<select value={form.type} onChange={e=>set("type",e.target.value)}><option value="Distributor">{t("Distributor")}</option><option value="Importer / wholesaler">{t("Importer / wholesaler")}</option><option value="Brand / distributor">{t("Brand / distributor")}</option><option value="Engineering company">{t("Engineering company")}</option><option value="Manufacturer">{t("Manufacturer")}</option><option value="Service provider">{t("Service provider")}</option><option value="End user">{t("End user")}</option><option value="Other">{t("Other")}</option></select></label><label>{t("Contact name")}<input value={form.contact} onChange={e=>set("contact",e.target.value)}/></label><label>{t("Job title")}<input value={form.jobTitle} onChange={e=>set("jobTitle",e.target.value)}/></label><label>{t("Email")}<input type="email" value={form.email} onChange={e=>set("email",e.target.value)}/></label><label className="form-wide">{t("Source URL")}<input value={form.sourceUrl} onChange={e=>set("sourceUrl",e.target.value)} placeholder="https://source-of-information.com"/></label><label className="form-wide">{t("Notes")}<textarea rows={3} value={form.notes} onChange={e=>set("notes",e.target.value)}/></label></div>
    <div className="modal-foot"><span>{t("Local draft data only. Do not use this browser-only preview as your sole business record.")}</span><div><button type="button" className="secondary-button" onClick={onClose}>{t("Cancel")}</button><button type="submit" className="primary-button"><Plus size={14}/> {t("Save customer")}</button></div></div>
  </form></div>;
}

function TaskForm({customers,initialCustomer,onClose,onSave,t}:{customers:Customer[];initialCustomer:Customer|null;onClose:()=>void;onSave:(task:FollowUpTask)=>void;t:(value:string)=>string}) {
  const [form,setForm]=useState({title:initialCustomer?("Follow up with "+initialCustomer.company):"",customerId:initialCustomer?String(initialCustomer.id):"",description:"",dueDate:todayLocal(),priority:"normal" as FollowUpTask["priority"]});
  const submit=(e:React.FormEvent)=>{e.preventDefault();if(!form.title.trim()||!form.dueDate)return;const linked=customers.find(c=>String(c.id)===form.customerId);onSave({id:Date.now().toString(),title:form.title.trim(),description:form.description.trim(),dueDate:form.dueDate,priority:form.priority,status:"open",customerId:linked?.id,customerName:linked?.company,createdAt:new Date().toISOString()});};
  return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}><form className="workspace-modal compact-modal" onSubmit={submit}><div className="modal-heading"><div><span className="eyebrow">{t("EXECUTION CONTROL")}</span><h2>{t("New follow-up task")}</h2><p>{t("This is a manual reminder. It does not send a message or claim external work was completed.")}</p></div><button type="button" className="icon-button" onClick={onClose}><X size={18}/></button></div>
    <div className="form-grid"><label className="form-wide">{t("Task title")} *<input required value={form.title} onChange={e=>setForm(x=>({...x,title:e.target.value}))} placeholder={t("Follow-up task")}/></label><label className="form-wide">{t("Related customer")}<select value={form.customerId} onChange={e=>setForm(x=>({...x,customerId:e.target.value}))}><option value="">{t("No customer linked")}</option>{customers.map(c=><option key={c.id} value={c.id}>{c.company} · {c.country}</option>)}</select></label><label>{t("Due date")} *<input type="date" required value={form.dueDate} onChange={e=>setForm(x=>({...x,dueDate:e.target.value}))}/></label><label>{t("Priority")}<select value={form.priority} onChange={e=>setForm(x=>({...x,priority:e.target.value as FollowUpTask["priority"]}))}><option value="urgent">{t("Urgent")}</option><option value="high">{t("High")}</option><option value="normal">{t("Normal")}</option><option value="low">{t("Low")}</option></select></label><label className="form-wide">{t("Description")}<textarea rows={3} value={form.description} onChange={e=>setForm(x=>({...x,description:e.target.value}))}/></label></div>
    <div className="modal-foot"><span>{t("Saved in this browser")}</span><div><button type="button" className="secondary-button" onClick={onClose}>{t("Cancel")}</button><button type="submit" className="primary-button"><Plus size={14}/> {t("Save task")}</button></div></div>
  </form></div>;
}

function Metric({icon,label,value,hint,t}:{icon:React.ReactNode;label:string;value:string;hint:string;t:(value:string)=>string}) {
  return <div className="metric-card"><div className="metric-top"><span className="metric-icon">{icon}</span><span className="metric-period">{t("LIVE DATA PENDING")}</span></div><strong>{value}</strong><span className="metric-label">{label}</span><small>{hint}</small></div>;
}
function CustomerDrawer({customer,onClose,onCreateTask,t}:{customer:Customer;onClose:()=>void;onCreateTask:()=>void;t:(value:string)=>string}) {
  return <div className="drawer-backdrop" onClick={onClose}><aside className="customer-drawer" onClick={e=>e.stopPropagation()}><div className="drawer-top"><div><div className="eyebrow">{t("CUSTOMER PROFILE")}</div><h2>{customer.company}</h2><p>{customer.country} · {customer.type}</p></div><button className="icon-button" onClick={onClose}><X size={18}/></button></div><div className="drawer-summary"><Sparkles size={16}/><div><strong>{t("AI business summary")}</strong><p>{customer.summary}</p></div></div><div className="drawer-section"><h3>{t("Business snapshot")}</h3><div className="detail-grid"><div><span>{t("Product fit")}</span><strong>{customer.product}</strong></div><div><span>{t("Customer grade")}</span><strong>{customer.grade} · evidence pending</strong></div><div><span>{t("Development stage")}</span><strong>{customer.stage}</strong></div><div><span>{t("Last updated")}</span><strong>{customer.updated}</strong></div></div></div><div className="drawer-section"><h3>{t("Contact information")}</h3><div className="contact-record"><Mail size={16}/><div><strong>{customer.email}</strong><span>{customer.emailStatus}</span></div></div><div className="contact-record"><Users size={16}/><div><strong>{customer.contact}</strong><span>{t("Identity and role require source verification")}</span></div></div>{customer.website&&<div className="contact-record"><Globe2 size={16}/><div><strong>{customer.website}</strong><span>{t("Company website")}</span></div></div>}{customer.sourceUrl&&<div className="contact-record"><ExternalLink size={16}/><div><strong>{customer.sourceUrl}</strong><span>{t("Source record")}</span></div></div>}</div><div className="drawer-section"><h3>{t("Opportunities & interactions")}</h3><div className="next-action-card"><Target size={17}/><div><strong>{customer.product}</strong><span>{t("Initial product interest · qualification not completed")}</span></div></div><div className="contact-record"><MessageCircle size={16}/><div><strong>{t("No verified interaction history yet")}</strong><span>{t("Communication history will be added after mailbox and messaging connections.")}</span></div></div></div><div className="drawer-section"><h3>{t("Next best action")}</h3><div className="next-action-card"><Target size={17}/><div><strong>{customer.next}</strong><span>{t("Recommendation only · not an executed task")}</span></div></div></div><div className="drawer-actions"><button className="secondary-button" onClick={()=>navigator.clipboard?.writeText(customer.company)}>{t("Copy company name")}</button><button className="primary-button" onClick={onCreateTask}>{t("Create follow-up task")}</button></div></aside></div>;
}