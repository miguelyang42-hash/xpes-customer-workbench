"use client";
import { useEffect, useState } from "react";
type Service = {id:string; name:string; group:string; status:string; method:string; requirements:string[]; purpose:string};
const zh: Record<string,string> = {
"Integration services":"集成服务","Refresh status":"刷新状态","Loading…":"正在检查…","Email":"邮箱","Social":"社交媒体","Research":"AI 与研究",
"AI model":"AI 模型","Web research":"网页研究","Tencent Enterprise Mail":"腾讯企业邮箱",
"Configured · not verified":"已配置 · 待验证","Not configured":"未配置","Not connected":"未连接","Connection details":"连接详情","Setup details":"配置详情",
"Close":"关闭","Required before connection":"接入前需要完成","Workspace sign-in and account ownership":"工作台登录与账号归属",
"Encrypted credential storage":"授权凭证的加密存储","Google OAuth application and stable callback URL":"Google 授权应用与固定回调地址",
"Microsoft OAuth application and callback URL":"Microsoft 授权应用与回调地址","Mailbox connection method and authorization code":"确认邮箱连接方式并设置授权码",
"Approved platform application and permissions":"平台应用与所需权限审批","Eligible account and approved Meta application":"符合要求的账号与已获批 Meta 应用",
"Choose personal linked-device or Business Platform connection":"确认个人版关联设备或商业平台的接入方式","Encrypted connection storage":"连接信息的加密存储",
"Product analysis and research summaries":"分析产品并生成研究总结","Search public sources and attach evidence":"搜索公开资料并保留证据来源",
"Read replies and send authorized emails":"读取回复并按授权发送邮件","Connect a business mailbox":"连接商务邮箱","Connect your company mailbox":"连接企业邮箱",
"Use only account data permitted by the platform":"使用平台允许访问的账号资料","Connect eligible business accounts":"连接符合条件的商业账号",
"Support multiple numbers with separate connection records":"支持多个号码，分别管理连接记录",
"Configuration found does not mean the service is reachable. Verify AI and research from their workspace modules.":"检测到配置不代表服务已连通；AI 与研究服务需在对应模块验证。",
"Account connection is not available until the requirements below are completed.":"完成以下接入条件后，才能进行账号连接。",
"Could not check status. Please retry.":"无法获取状态，请重试。","Last checked":"最近检查",
"Accounts and permissions will appear here after verified authorization.":"真实授权成功后，这里将显示账号与授权权限。"
};
export default function IntegrationServices({ t }: {t:(value:string)=>string}) {
  const cn = t("Settings") === "系统设置";
  const text = (s:string) => cn ? zh[s] ?? s : s;
  const [services,setServices]=useState<Service[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  const [checked,setChecked]=useState("");
  const [selected,setSelected]=useState<Service|null>(null);
  async function refresh(){
    setLoading(true);setError("");
    try {
      const res=await fetch("/api/v3/integrations",{cache:"no-store"});
      if(!res.ok)throw new Error("status");
      const data=await res.json();
      if(!Array.isArray(data.services))throw new Error("shape");
      setServices(data.services);setChecked(data.checkedAt);
    } catch {setError("Could not check status. Please retry.");setServices([]);setChecked("");}
    finally{setLoading(false);}
  }
  useEffect(()=>{void refresh();},[]);
  return <div style={{marginTop:24,padding:22,background:"#fff",border:"1px solid #dfe6ee",borderRadius:14}}>
    <div style={{display:"flex",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}><div><h2 style={{margin:"0 0 6px",fontSize:20}}>{text("Integration services")}</h2><p style={{color:"#718096",fontSize:14}}>{text("Accounts and permissions will appear here after verified authorization.")}</p></div><button className="secondary-button" disabled={loading} onClick={()=>void refresh()}>{text(loading?"Loading…":"Refresh status")}</button></div>
    {error && <p role="alert">{text(error)}</p>}
    {["Email","Social","Research"].map(group=><div key={group} style={{marginTop:20}}><h3 style={{fontSize:15}}>{text(group)}</h3><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:12}}>{services.filter(s=>s.group===group).map(s=><div key={s.id} style={{padding:16,border:"1px solid #e5eaf0",borderRadius:12}}><strong>{text(s.name)}</strong><div style={{marginTop:8,fontSize:12,color:s.status==="configured"?"#386b85":"#8a682f"}}>{text(s.status==="configured"?"Configured · not verified":s.status==="not_configured"?"Not configured":"Not connected")}</div><p style={{fontSize:13,color:"#718096",minHeight:36}}>{text(s.purpose)}</p><button className="ghost-button" onClick={()=>setSelected(s)}>{text(s.method==="api"?"Setup details":"Connection details")}</button></div>)}</div></div>)}
    {checked && <p style={{color:"#8795a5",fontSize:12,marginTop:18}}>{text("Last checked")}: {new Date(checked).toLocaleString(cn?"zh-CN":"en-US")}</p>}
    {selected && <div style={{position:"fixed",inset:0,background:"rgba(15,30,45,.35)",zIndex:100,display:"grid",placeItems:"center",padding:20}} onClick={()=>setSelected(null)}><div role="dialog" aria-modal="true" aria-label={text(selected.name)} style={{maxWidth:540,width:"100%",background:"white",borderRadius:16,padding:24}} onClick={e=>e.stopPropagation()}><h2>{text(selected.name)}</h2><p>{text(selected.method==="api"?"Configuration found does not mean the service is reachable. Verify AI and research from their workspace modules.":"Account connection is not available until the requirements below are completed.")}</p><h3 style={{fontSize:15}}>{text("Required before connection")}</h3><ul>{selected.requirements.map(r=><li key={r} style={{marginBottom:10}}>{text(r)}</li>)}</ul><button className="primary-button" autoFocus onClick={()=>setSelected(null)}>{text("Close")}</button></div></div>}
  </div>;
}
