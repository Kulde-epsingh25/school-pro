"use client";

import React, { useState } from "react";
import { 
    Activity, 
    AlertTriangle, 
    TrendingUp, 
    TrendingDown, 
    Search, 
    Filter, 
    GraduationCap,
    Sparkles,
    User
} from "lucide-react";

interface StudentScoreAnalytics {
    id: string;
    studentName: string;
    grade: string;
    termAverage: number;
    trend: "up" | "down" | "stable";
    atRisk: boolean;
    weakestSubject: string;
    strongestSubject: string;
    attendanceRate: number;
}

const SCORE_DATA: StudentScoreAnalytics[] = [
    {
        id: "1",
        studentName: "Liam Johnson",
        grade: "Grade 10-A",
        termAverage: 62.4,
        trend: "down",
        atRisk: true,
        weakestSubject: "Physics (48%)",
        strongestSubject: "History (78%)",
        attendanceRate: 74
    },
    {
        id: "2",
        studentName: "Ananya Patel",
        grade: "Grade 10-A",
        termAverage: 94.2,
        trend: "up",
        atRisk: false,
        weakestSubject: "French (88%)",
        strongestSubject: "Mathematics (99%)",
        attendanceRate: 98
    },
    {
        id: "3",
        studentName: "Lucas Silva",
        grade: "Grade 10-A",
        termAverage: 71.0,
        trend: "stable",
        atRisk: false,
        weakestSubject: "Chemistry (64%)",
        strongestSubject: "Physical Ed (92%)",
        attendanceRate: 88
    }
];

export default function GradebookAnalyticsPage() {
    const [scores, setScores] = useState<StudentScoreAnalytics[]>(SCORE_DATA);
    const [search, setSearch] = useState("");

    const atRiskCount = scores.filter(s => s.atRisk).length;

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Activity className="h-8 w-8 text-primary" />
                        Gradebook Trends & At-Risk Analytics
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Predictive academic performance tracking, longitudinal grade trends, and early intervention flags.
                    </p>
                </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-card border rounded-2xl p-5 flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <GraduationCap className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-foreground">75.8%</div>
                        <div className="text-xs text-muted-foreground">Class Median Score</div>
                    </div>
                </div>
                <div className="bg-card border rounded-2xl p-5 flex items-center gap-4">
                    <div className="p-3 bg-rose-50 dark:bg-rose-950/50 text-rose-600 rounded-xl">
                        <AlertTriangle className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">{atRiskCount} Students</div>
                        <div className="text-xs text-muted-foreground">Flagged for Academic Intervention</div>
                    </div>
                </div>
                <div className="bg-card border rounded-2xl p-5 flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-xl">
                        <TrendingUp className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">+4.2%</div>
                        <div className="text-xs text-muted-foreground">Term-over-Term Improvement</div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b">
                    <input
                        type="text"
                        placeholder="Filter by student name..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full sm:w-72 px-4 py-2 bg-background text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b">
                            <tr>
                                <th className="px-6 py-3">Student</th>
                                <th className="px-6 py-3">Term Average</th>
                                <th className="px-6 py-3">Trajectory</th>
                                <th className="px-6 py-3">Needs Focus (Weakest)</th>
                                <th className="px-6 py-3">Strongest Area</th>
                                <th className="px-6 py-3">Attendance</th>
                                <th className="px-6 py-3 text-right">Intervention</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {scores.map(s => (
                                <tr key={s.id} className="hover:bg-muted/30 transition">
                                    <td className="px-6 py-4 font-bold text-foreground">
                                        {s.studentName}
                                        <div className="text-xs font-normal text-muted-foreground">{s.grade}</div>
                                    </td>
                                    <td className="px-6 py-4 font-bold">
                                        <span className={s.atRisk ? "text-rose-600 dark:text-rose-400" : "text-foreground"}>
                                            {s.termAverage}%
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {s.trend === "up" && (
                                            <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                                                <TrendingUp className="h-4 w-4" /> Rising
                                            </span>
                                        )}
                                        {s.trend === "down" && (
                                            <span className="flex items-center gap-1 text-rose-600 text-xs font-bold">
                                                <TrendingDown className="h-4 w-4" /> Dropping
                                            </span>
                                        )}
                                        {s.trend === "stable" && (
                                            <span className="text-muted-foreground text-xs font-medium">Stable</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-xs font-medium text-rose-700 dark:text-rose-300">
                                        {s.weakestSubject}
                                    </td>
                                    <td className="px-6 py-4 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                                        {s.strongestSubject}
                                    </td>
                                    <td className="px-6 py-4 text-xs">
                                        <span className={`font-semibold ${s.attendanceRate < 75 ? "text-rose-600 font-bold" : "text-foreground"}`}>
                                            {s.attendanceRate}%
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-xs font-semibold px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition">
                                            Action Plan
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
