"use client";

import React, { useState } from "react";
import { 
    KeyRound, 
    Clock, 
    ShieldAlert, 
    UserPlus, 
    CheckCircle2, 
    AlertCircle, 
    UserCheck,
    Calendar
} from "lucide-react";

interface DelegationItem {
    id: string;
    granteeName: string;
    granteeEmail: string;
    delegatedRole: string;
    granterName: string;
    reason: string;
    expiresAt: string;
    status: "Active" | "Expired" | "Revoked";
}

const INITIAL_DELEGATIONS: DelegationItem[] = [
    {
        id: "1",
        granteeName: "Marcus Vance",
        granteeEmail: "marcus.v@school.edu",
        delegatedRole: "Finance Approver (Temporary)",
        granterName: "Dr. Evelyn Reed (Principal)",
        reason: "Covering for Chief Bursar medical leave",
        expiresAt: "2026-08-25 18:00",
        status: "Active"
    },
    {
        id: "2",
        granteeName: "Priya Menon",
        granteeEmail: "priya.m@school.edu",
        delegatedRole: "Grade 10 Exam Invigilator Lead",
        granterName: "Academic Dean",
        reason: "Mid-term examination hall coordination",
        expiresAt: "2026-08-15 17:00",
        status: "Expired"
    }
];

export default function DelegatedAccessPage() {
    const [delegations, setDelegations] = useState<DelegationItem[]>(INITIAL_DELEGATIONS);

    const revokeAccess = (id: string) => {
        setDelegations(prev => prev.map(d => d.id === id ? { ...d, status: "Revoked" } : d));
    };

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <KeyRound className="h-8 w-8 text-primary" />
                        Time-Boxed Delegated Admin Privileges
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Grant time-expiring elevated permissions to staff members without permanently modifying their primary role.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition shadow-sm">
                        <UserPlus className="h-4 w-4" />
                        New Time-Boxed Delegation
                    </button>
                </div>
            </div>

            {/* Delegations Table */}
            <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-lg text-foreground">Active & Historical Delegations</h3>

                <div className="space-y-4">
                    {delegations.map(d => (
                        <div key={d.id} className="border rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/40 transition">
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-foreground text-base">{d.granteeName}</h4>
                                    <span className="text-xs text-muted-foreground">({d.granteeEmail})</span>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                        d.status === "Active"
                                            ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300"
                                            : "bg-muted text-muted-foreground"
                                    }`}>
                                        {d.status}
                                    </span>
                                </div>
                                <div className="text-xs font-semibold text-primary">
                                    Assigned Scope: {d.delegatedRole}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Reason: &ldquo;{d.reason}&rdquo; • Authorized by: {d.granterName}
                                </div>
                                <div className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" />
                                    Expires At: {d.expiresAt}
                                </div>
                            </div>

                            {d.status === "Active" && (
                                <div>
                                    <button
                                        onClick={() => revokeAccess(d.id)}
                                        className="px-3.5 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 rounded-lg transition border border-destructive/20"
                                    >
                                        Revoke Immediately
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
