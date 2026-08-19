"use client";

import React, { useState } from "react";
import { 
    FileText, 
    Trash2, 
    Download, 
    ShieldAlert, 
    Search, 
    User, 
    CheckCircle2, 
    Clock, 
    AlertCircle 
} from "lucide-react";

interface DataRequest {
    id: string;
    requestType: "FULL_EXPORT" | "RIGHT_TO_ERASURE";
    subjectName: string;
    subjectEmail: string;
    subjectRole: "Student" | "Staff" | "Parent";
    requestedAt: string;
    status: "Processing" | "Ready for Download" | "Completed" | "Pending Approval";
}

const INITIAL_REQUESTS: DataRequest[] = [
    {
        id: "1",
        requestType: "FULL_EXPORT",
        subjectName: "Kavita Sharma",
        subjectEmail: "kavita.s@example.com",
        subjectRole: "Student",
        requestedAt: "2026-08-18",
        status: "Ready for Download"
    },
    {
        id: "2",
        requestType: "RIGHT_TO_ERASURE",
        subjectName: "Robert Miller",
        subjectEmail: "r.miller@example.com",
        subjectRole: "Staff",
        requestedAt: "2026-08-17",
        status: "Pending Approval"
    }
];

export default function DataRequestsPage() {
    const [requests, setRequests] = useState<DataRequest[]>(INITIAL_REQUESTS);

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <FileText className="h-8 w-8 text-primary" />
                        GDPR & FERPA Data Privacy Requests
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Handle data portability exports and right-to-be-forgotten / erasure compliance workflows.
                    </p>
                </div>
            </div>

            {/* Requests List */}
            <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-lg text-foreground">Compliance Requests Ledger</h3>

                <div className="space-y-3">
                    {requests.map(r => (
                        <div key={r.id} className="border rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/40 transition">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                        r.requestType === "FULL_EXPORT"
                                            ? "bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300"
                                            : "bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300"
                                    }`}>
                                        {r.requestType === "FULL_EXPORT" ? "📦 Full Data Archive" : "🗑️ Right to Erasure"}
                                    </span>
                                    <span className="font-bold text-foreground">{r.subjectName}</span>
                                    <span className="text-xs text-muted-foreground">({r.subjectEmail})</span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Role: <span className="font-medium text-foreground">{r.subjectRole}</span> • Requested: {r.requestedAt}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {r.status === "Ready for Download" && (
                                    <button className="px-4 py-2 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl transition flex items-center gap-1.5 shadow">
                                        <Download className="h-3.5 w-3.5" /> Download Encrypted ZIP
                                    </button>
                                )}
                                {r.status === "Pending Approval" && (
                                    <button className="px-4 py-2 text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 rounded-xl transition flex items-center gap-1.5 shadow">
                                        Review & Authorize Purge
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
