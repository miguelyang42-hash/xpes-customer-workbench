/**
 * V3 independent send policy gate.
 *
 * This module has NO network or provider access. It does not send mail.
 * Call from an authenticated server worker only, with fresh persisted evidence.
 * Never rely on an AI model or frontend approval flag as authorization.
 */
export type SendPolicy={
 planId:string; planVersion:string; authorizedBy:string; authorizedAt:string; expiresAt:string;
 canSendEmail:boolean; allowedSenderAccountIds:string[]; allowedMarkets:string[];
 dailyMax:number; weeklyMax:number; maxTouches:number; quietHoursStart:string; quietHoursEnd:string;
};
export type SendContext={
 planId:string; planVersion:string; senderAccountId:string; market:string;
 contactId:string; endpointId:string; email:string; touch:number;
 companyVerified:boolean; endpointVerified:boolean; sourceDocumented:boolean;
 suppression:boolean; unsubscribed:boolean; complaint:boolean; hardBounce:boolean;
 replied:boolean; humanTakeover:boolean; prospectAlreadyInCrm:boolean;
 senderConnected:boolean; providerHealthy:boolean; qualityPassed:boolean;
 previousSendOutcomeUnknown:boolean; alreadySubmittedThisTouch:boolean;
 dailySendCount:number; weeklySendCount:number; localClockHHMM:string;
 nowIso:string;
};
export type GateResult={allowed:boolean;reasons:string[]};
const hhmm=(x:string)=>/^([01]\d|2[0-3]):[0-5]\d$/.test(x)?Number(x.slice(0,2))*60+Number(x.slice(3)):NaN;
export function evaluateEmailSend(policy:SendPolicy|null,ctx:SendContext):GateResult{
 const reasons:string[]=[];
 if(!policy)return {allowed:false,reasons:["missing_authorization"]};
 const now=Date.parse(ctx.nowIso);
 if(!Number.isFinite(now)||!Number.isFinite(Date.parse(policy.expiresAt)))reasons.push("invalid_clock");
 if(!policy.authorizedBy||!policy.authorizedAt||!policy.canSendEmail)reasons.push("not_authorized");
 if(policy.planId!==ctx.planId||policy.planVersion!==ctx.planVersion)reasons.push("scope_version_mismatch");
 if(Number.isFinite(now)&&now>=Date.parse(policy.expiresAt))reasons.push("authorization_expired");
 if(!policy.allowedSenderAccountIds.includes(ctx.senderAccountId))reasons.push("sender_out_of_scope");
 if(!policy.allowedMarkets.includes(ctx.market))reasons.push("market_out_of_scope");
 if(!Number.isInteger(ctx.touch)||ctx.touch<1||ctx.touch>policy.maxTouches||ctx.touch>4)reasons.push("touch_limit");
 if(!ctx.companyVerified||!ctx.endpointVerified||!ctx.sourceDocumented)reasons.push("insufficient_research_evidence");
 if(ctx.suppression||ctx.unsubscribed||ctx.complaint||ctx.hardBounce)reasons.push("recipient_suppressed");
 if(ctx.replied||ctx.humanTakeover)reasons.push("conversation_taken_over");
 if(ctx.prospectAlreadyInCrm)reasons.push("existing_crm_account");
 if(!ctx.senderConnected||!ctx.providerHealthy)reasons.push("provider_unavailable");
 if(!ctx.qualityPassed)reasons.push("quality_gate_failed");
 if(ctx.previousSendOutcomeUnknown)reasons.push("reconciliation_required");
 if(ctx.alreadySubmittedThisTouch)reasons.push("duplicate_touch");
 if(!Number.isInteger(policy.dailyMax)||policy.dailyMax<1||ctx.dailySendCount>=policy.dailyMax)reasons.push("daily_cap");
 if(!Number.isInteger(policy.weeklyMax)||policy.weeklyMax<1||ctx.weeklySendCount>=policy.weeklyMax)reasons.push("weekly_cap");
 const local=hhmm(ctx.localClockHHMM),start=hhmm(policy.quietHoursStart),end=hhmm(policy.quietHoursEnd);
 if(!Number.isFinite(local)||!Number.isFinite(start)||!Number.isFinite(end)||start>=end||local<start||local>=end)reasons.push("outside_local_window");
 if(!ctx.contactId||!ctx.endpointId||!ctx.email)reasons.push("missing_recipient");
 return {allowed:reasons.length===0,reasons};
}
export type TaskEvidence={taskId:string;kind:string;reference:string;checkedBy:string;valid:boolean};
export function canVerifyTaskComplete(taskId:string,evidence:TaskEvidence[]):boolean{
 return evidence.some(e=>e.taskId===taskId&&e.valid&&!!e.reference&&!!e.checkedBy&&e.checkedBy!=="ai_self_report");
}
export function classifyMailEvent(event:"send_requested"|"provider_accepted"|"delivered"|"open_detected"|"explicit_read_receipt"|"replied"|"hard_bounce"|"soft_bounce"|"unsubscribed"){
 const states={
 send_requested:{reported:"queued",confirmedHumanRead:false},
 provider_accepted:{reported:"accepted",confirmedHumanRead:false},
 delivered:{reported:"delivered",confirmedHumanRead:false},
 open_detected:{reported:"open_detected_unverified",confirmedHumanRead:false},
 explicit_read_receipt:{reported:"explicit_read_receipt",confirmedHumanRead:false},
 replied:{reported:"replied",confirmedHumanRead:false},
 hard_bounce:{reported:"hard_bounce",confirmedHumanRead:false},
 soft_bounce:{reported:"soft_bounce",confirmedHumanRead:false},
 unsubscribed:{reported:"suppressed",confirmedHumanRead:false}
 } as const;
 return states[event];
}
