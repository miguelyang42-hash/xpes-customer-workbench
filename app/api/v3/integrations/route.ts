import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET() {
  // No credentials, account identifiers or environment values leave this route.
  const configured = (keys: string[]) => keys.every(key => Boolean(process.env[key]?.trim()));
  return NextResponse.json({ checkedAt: new Date().toISOString(), services: [
    { id:"ai", name:"AI model", group:"Research", status:configured(["AI_GATEWAY_API_KEY","AI_GATEWAY_BASE_URL","AI_GATEWAY_MODEL"])?"configured":"not_configured", method:"api", requirements:["AI_GATEWAY_API_KEY","AI_GATEWAY_BASE_URL","AI_GATEWAY_MODEL"], purpose:"Product analysis and research summaries" },
    { id:"exa", name:"Web research", group:"Research", status:configured(["EXA_API_KEY"])?"configured":"not_configured", method:"api", requirements:["EXA_API_KEY"], purpose:"Search public sources and attach evidence" },
    { id:"google", name:"Google / Gmail", group:"Email", status:"not_connected", method:"oauth", requirements:["Workspace sign-in and account ownership","Encrypted credential storage","Google OAuth application and stable callback URL"], purpose:"Read replies and send authorized emails" },
    { id:"microsoft", name:"Microsoft 365", group:"Email", status:"not_connected", method:"oauth", requirements:["Workspace sign-in and account ownership","Encrypted credential storage","Microsoft OAuth application and callback URL"], purpose:"Connect a business mailbox" },
    { id:"tencent", name:"Tencent Enterprise Mail", group:"Email", status:"not_connected", method:"mail", requirements:["Workspace sign-in and account ownership","Encrypted credential storage","Mailbox connection method and authorization code"], purpose:"Connect your company mailbox" },
    { id:"linkedin", name:"LinkedIn", group:"Social", status:"not_connected", method:"oauth", requirements:["Workspace sign-in and account ownership","Encrypted credential storage","Approved platform application and permissions"], purpose:"Use only account data permitted by the platform" },
    { id:"meta", name:"Instagram / Facebook", group:"Social", status:"not_connected", method:"oauth", requirements:["Workspace sign-in and account ownership","Encrypted credential storage","Eligible account and approved Meta application"], purpose:"Connect eligible business accounts" },
    { id:"whatsapp", name:"WhatsApp", group:"Social", status:"not_connected", method:"pending", requirements:["Choose personal linked-device or Business Platform connection","Workspace sign-in and account ownership","Encrypted connection storage"], purpose:"Support multiple numbers with separate connection records" }
  ] }, { headers: { "Cache-Control":"no-store" } });
}
