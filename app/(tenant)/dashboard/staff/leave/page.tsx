"use client";

import React, { useState } from "react";
import { 
    Calendar, 
    CheckCircle2, 
    Clock, 
    Plus, 
    XCircle, 
    User, 
    FileText,
    AlertCircle
} from "lucide-react";

interface LeaveItem {
    id: string;
    staffName: string;
    role: string;
    leaveType: "Sick Leave" | "Casual Leave" | "Maternity/Paternity" | "Academic Duty";
    startDate: string;
    endDate: string;
    daysCount: number;
    reason: string;
    status: "Approved" | "Pending Approval" | "Rejected";
}

const LEAVES: LeaveItem[] = [
    {
        id: "1",
        staffName: "Pooja Sharma",
        role: "Primary Science Teacher",
        leaveType: "Sick Leave",
        startDate: "2026-08-20",
        endDate: "2026-08-22",
        daysCount: 3,
        reason: "Viral fever and doctor-advised bed rest",
        status: "Pending Approval"
    },
    {
        id: "2",
        staffName: "David Miller",
        role: "Head of Physical Education",
        leaveType: "Academic Duty",
        startDate: "2026-08-15",
        endDate: "2026-08-16",
        daysCount: 2,
        reason: "Escorting school basketball team to State Championship",
        status: "Approved"
    }
];

export default function StaffLeavePage() {
    const [leaves, setLeaves] = useState<LeaveItem[]>(LEAVES);

    const updateStatus = (id: string, newStatus: LeaveItem["status"]) => {
        setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
    };

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Calendar className="h-8 w-8 text-primary" />
                        Staff Leave Management & Approvals
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Review faculty leave applications, track balance entitlements, and assign substitute teachers.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition shadow-sm">
                        <Plus className="h-4 w-4" />
                        Apply for Leave
                    </button>
                </div>
            </div>

            {/* Leave Applications Table */}
            <div className="space-y-4">
                {leaves.map(l => (
                    <div key={l.id} className="bg-card border rounded-2xl p-6 shadow-sm space-y-3 hover:border-primary/40 transition">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h3 className="font-bold text-base text-foreground">{l.staffName}</h3>
                                <span className="text-xs bg-muted px-2.5 py-0.5 rounded-md font-medium text-foreground">{l.role}</span>
                                <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-md">
                                    {l.leaveType}
                                </span>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                l.status === "Approved"
                                    ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300"
                                    : l.status === "Pending Approval"
                                    ? "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300"
                                    : "bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300"
                            }`}>
                                {l.status}
                            </span>
                        </div>

                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                            <span>Duration: <strong className="text-foreground">{l.startDate} to {l.endDate}</strong> ({l.daysCount} days)</span>
                        </div>

                        <p className="text-xs text-foreground bg-muted/40 p-3 rounded-xl border leading-relaxed">
                            <span className="font-semibold text-muted-foreground">Reason:</span> &ldquo;{l.reason}&rdquo;
                        </p>

                        {l.status === "Pending Approval" && (
                            <div className="flex items-center gap-2 pt-1">
                                <button
                                    onClick={() => updateStatus(l.id, "Approved")}
                                    className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg transition shadow-sm flex items-center gap-1"
                                >
                                    <CheckCircle2 className="h-3.5 w-3.5" /> Approve Leave
                                </button>
                                <button
                                    onClick={() => updateStatus(l.id, "Rejected")}
                                    className="px-3.5 py-1.5 text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 rounded-lg transition shadow-sm flex items-center gap-1"
                                >
                                    <XCircle className="h-3.5 w-3.5" /> Reject
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
