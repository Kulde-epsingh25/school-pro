"use client";

import React, { useState } from "react";
import { 
    Brain, 
    Lock, 
    Plus, 
    Search, 
    Calendar, 
    User, 
    ShieldAlert, 
    FileText,
    Clock,
    Tag
} from "lucide-react";

interface CounselingRecord {
    id: string;
    studentName: string;
    grade: string;
    counselorName: string;
    sessionDate: string;
    topic: string;
    confidentiality: "Strictly Confidential" | "Faculty Shared (Partial)";
    followUpDate?: string;
}

const INITIAL_NOTES: CounselingRecord[] = [
    {
        id: "1",
        studentName: "Aiden Scott",
        grade: "Grade 11-B",
        counselorName: "Dr. Sarah Jenkins",
        sessionDate: "2026-08-16",
        topic: "Exam anxiety and academic workload stress management",
        confidentiality: "Strictly Confidential",
        followUpDate: "2026-08-23"
    },
    {
        id: "2",
        studentName: "Maya Lin",
        grade: "Grade 9-A",
        counselorName: "Dr. Sarah Jenkins",
        sessionDate: "2026-08-10",
        topic: "Peer integration and extracurricular balance plan",
        confidentiality: "Faculty Shared (Partial)",
        followUpDate: "2026-09-01"
    }
];

export default function CounselingPage() {
    const [notes, setNotes] = useState<CounselingRecord[]>(INITIAL_NOTES);
    const [search, setSearch] = useState("");

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Brain className="h-8 w-8 text-indigo-600" />
                        Confidential Counseling & Wellness Records
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Secure intervention notes, behavioral plans, mental wellness check-ins, and follow-ups.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition shadow-sm">
                        <Plus className="h-4 w-4" />
                        Log Counseling Session
                    </button>
                </div>
            </div>

            {/* Zero-Trust Notice */}
            <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 rounded-2xl p-4 flex items-start gap-3">
                <Lock className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
                <div className="text-xs text-indigo-900 dark:text-indigo-200 space-y-1">
                    <span className="font-bold">Privileged Wellness Access Tier:</span>
                    <p>
                        These records are excluded from standard teacher and administrator views. Only authorized counselors and head of pastoral care have read privileges.
                    </p>
                </div>
            </div>

            {/* Notes List */}
            <div className="space-y-4">
                {notes.map(n => (
                    <div key={n.id} className="bg-card border rounded-2xl p-6 shadow-sm space-y-3 hover:border-indigo-300 transition">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-3">
                                <h3 className="font-bold text-base text-foreground">{n.studentName}</h3>
                                <span className="text-xs bg-muted px-2.5 py-0.5 rounded-md font-medium text-foreground">{n.grade}</span>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                    n.confidentiality === "Strictly Confidential"
                                        ? "bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300"
                                        : "bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300"
                                }`}>
                                    🔒 {n.confidentiality}
                                </span>
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                Session Date: {n.sessionDate}
                            </div>
                        </div>

                        <p className="text-xs text-foreground bg-muted/30 p-3 rounded-xl border leading-relaxed">
                            <span className="font-semibold text-muted-foreground">Session Topic:</span> {n.topic}
                        </p>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-muted-foreground pt-1">
                            <div>Counselor: <span className="font-medium text-foreground">{n.counselorName}</span></div>
                            {n.followUpDate && (
                                <div className="text-indigo-600 dark:text-indigo-400 font-medium">
                                    Next Follow-up Scheduled: {n.followUpDate}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
