"use client";

import React, { useState } from "react";
import { 
    ShieldAlert, 
    UserCheck, 
    Clock, 
    AlertTriangle, 
    Search, 
    CheckCircle2, 
    Play,
    Building2,
    Lock
} from "lucide-react";

interface SupportSession {
    id: string;
    operatorName: string;
    tenantName: string;
    targetUserEmail: string;
    ticketId: string;
    reason: string;
    startedAt: string;
    status: "Active (Auto-expires in 22m)" | "Completed" | "Terminated Early";
}

const SESSIONS: SupportSession[] = [
    {
        id: "1",
        operatorName: "Alex Morgan (SaaS Support Tier 2)",
        tenantName: "St. Xavier's International School",
        targetUserEmail: "principal@stxaviers.edu",
        ticketId: "TICK-9082",
        reason: "Diagnosing timetable period conflict in Grade 10",
        startedAt: "2026-08-19 10:15",
        status: "Active (Auto-expires in 22m)"
    },
    {
        id: "2",
        operatorName: "Devon Clark (Platform Lead)",
        tenantName: "Greenwood Valley Academy",
        targetUserEmail: "admin@greenwood.edu",
        ticketId: "TICK-8991",
        reason: "Assisting with fee structure migration",
        startedAt: "2026-08-18 14:20",
        status: "Completed"
    }
];

export default function SupportImpersonationPage() {
    const [sessions, setSessions] = useState<SupportSession[]>(SESSIONS);

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <ShieldAlert className="h-8 w-8 text-amber-500" />
                        Support Mode & Audited Impersonation
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Secure, consent-driven tenant troubleshooting sessions with mandatory ticket IDs and 30-minute auto-expiry.
                    </p>
                </div>
            </div>

            {/* Compliance Warning */}
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-4 flex items-start gap-3">
                <Lock className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                <div className="text-xs text-amber-900 dark:text-amber-200 space-y-1">
                    <span className="font-bold">Security Protocol & Non-Repudiation Policy:</span>
                    <p>
                        Every impersonation event creates an indelible cryptographically signed log entry recording IP, support ticket number, and every mutation performed inside the customer tenant.
                    </p>
                </div>
            </div>

            {/* Sessions Table */}
            <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-lg text-foreground">Impersonation Session Logs</h3>

                <div className="space-y-3">
                    {sessions.map(s => (
                        <div key={s.id} className="border rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-amber-300 transition">
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-bold text-foreground">{s.tenantName}</span>
                                    <span className="text-xs bg-muted px-2 py-0.5 rounded font-mono text-muted-foreground">{s.ticketId}</span>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                        s.status.startsWith("Active")
                                            ? "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 animate-pulse"
                                            : "bg-muted text-muted-foreground"
                                    }`}>
                                        {s.status}
                                    </span>
                                </div>

                                <div className="text-xs text-muted-foreground">
                                    <span className="font-medium text-foreground">Operator:</span> {s.operatorName} • <span className="font-medium text-foreground">Target:</span> {s.targetUserEmail}
                                </div>
                                <div className="text-xs text-muted-foreground italic">
                                    &ldquo;{s.reason}&rdquo;
                                </div>
                            </div>

                            {s.status.startsWith("Active") && (
                                <button className="px-4 py-2 text-xs font-semibold bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg transition shadow-sm">
                                    Terminate Session Now
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
