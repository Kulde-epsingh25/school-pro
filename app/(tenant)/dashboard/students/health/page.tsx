"use client";

import React, { useState } from "react";
import { 
    HeartPulse, 
    AlertTriangle, 
    ShieldCheck, 
    Search, 
    Plus, 
    FileText, 
    User, 
    Phone, 
    Clock, 
    Activity
} from "lucide-react";

interface HealthRecordItem {
    id: string;
    studentName: string;
    grade: string;
    bloodGroup: string;
    allergies: string[];
    medications: string[];
    emergencyContact: string;
    lastClinicVisit?: string;
    status: "Healthy" | "Under Medication" | "Severe Allergy Alert";
}

const INITIAL_HEALTH_RECORDS: HealthRecordItem[] = [
    {
        id: "1",
        studentName: "Liam Johnson",
        grade: "Grade 10-A",
        bloodGroup: "O+",
        allergies: ["Peanuts", "Penicillin"],
        medications: ["EpiPen (Carried)"],
        emergencyContact: "+1 555 019 2834 (Father)",
        lastClinicVisit: "2026-08-12",
        status: "Severe Allergy Alert"
    },
    {
        id: "2",
        studentName: "Sophia Martinez",
        grade: "Grade 8-B",
        bloodGroup: "A+",
        allergies: ["Dust Mites"],
        medications: ["Inhaler as needed"],
        emergencyContact: "+1 555 019 9922 (Mother)",
        lastClinicVisit: "2026-08-01",
        status: "Under Medication"
    },
    {
        id: "3",
        studentName: "Dev Patel",
        grade: "Grade 9-C",
        bloodGroup: "B+",
        allergies: [],
        medications: [],
        emergencyContact: "+91 98765 11223 (Guardian)",
        status: "Healthy"
    }
];

export default function HealthRecordsPage() {
    const [records, setRecords] = useState<HealthRecordItem[]>(INITIAL_HEALTH_RECORDS);
    const [search, setSearch] = useState("");

    const filtered = records.filter(r => 
        r.studentName.toLowerCase().includes(search.toLowerCase()) || 
        r.grade.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <HeartPulse className="h-8 w-8 text-rose-500" />
                        Student Health & Medical Records
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Secure medical profiles, emergency contacts, allergy logs, and clinic incident tracking.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white text-sm font-medium rounded-lg hover:bg-rose-700 transition shadow-sm">
                        <Plus className="h-4 w-4" />
                        Log Clinic Visit
                    </button>
                </div>
            </div>

            {/* Zero-Trust Security Alert Notice */}
            <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-xl p-4 flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-rose-600 dark:text-rose-400 mt-0.5" />
                <div className="text-xs text-rose-800 dark:text-rose-200 space-y-0.5">
                    <span className="font-semibold">HIPAA / FERPA Zero-Trust Audit Active:</span>
                    <p>All reads and modifications to student medical data are recorded in the compliance audit log with timestamp, operator ID, and tenant scope.</p>
                </div>
            </div>

            {/* Search and Table */}
            <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b flex items-center gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by student name or class..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-background text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b">
                            <tr>
                                <th className="px-6 py-3">Student</th>
                                <th className="px-6 py-3">Blood Group</th>
                                <th className="px-6 py-3">Allergies & Medical Alerts</th>
                                <th className="px-6 py-3">Emergency Contact</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filtered.map(r => (
                                <tr key={r.id} className="hover:bg-muted/30 transition">
                                    <td className="px-6 py-4 font-medium">
                                        <div className="text-foreground">{r.studentName}</div>
                                        <div className="text-xs text-muted-foreground">{r.grade}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 font-bold rounded-md text-xs">
                                            {r.bloodGroup}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {r.allergies.length > 0 ? (
                                                r.allergies.map(a => (
                                                    <span key={a} className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 rounded text-xs">
                                                        ⚠️ {a}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-xs text-muted-foreground">None reported</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1 font-medium text-foreground">
                                            <Phone className="h-3 w-3 text-muted-foreground" />
                                            {r.emergencyContact}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                            r.status === "Healthy"
                                                ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
                                                : r.status === "Under Medication"
                                                ? "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300"
                                                : "bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 animate-pulse"
                                        }`}>
                                            {r.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-xs text-primary hover:underline font-medium">
                                            View Clinical File
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
