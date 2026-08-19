"use client";

import React, { useState } from "react";
import { 
    Users, 
    UserPlus, 
    Filter, 
    Search, 
    MoreHorizontal, 
    CheckCircle2, 
    Clock, 
    Calendar,
    ArrowRight,
    Sparkles
} from "lucide-react";

interface Candidate {
    id: string;
    name: string;
    email: string;
    phone: string;
    grade: string;
    stage: "Inquiry" | "Entrance Exam" | "Interview" | "Offer Extended" | "Enrolled";
    score?: number;
    submittedDate: string;
}

const INITIAL_CANDIDATES: Candidate[] = [
    { id: "1", name: "Aarav Sharma", email: "aarav.p@example.com", phone: "+91 98765 43210", grade: "Grade 9", stage: "Inquiry", submittedDate: "2026-08-10" },
    { id: "2", name: "Zoya Khan", email: "zoya.k@example.com", phone: "+91 98765 43211", grade: "Grade 11 (Science)", stage: "Entrance Exam", score: 88, submittedDate: "2026-08-08" },
    { id: "3", name: "Ethan Williams", email: "williams.e@example.com", phone: "+1 415 555 2671", grade: "Grade 6", stage: "Interview", submittedDate: "2026-08-05" },
    { id: "4", name: "Ananya Patel", email: "ananya.patel@example.com", phone: "+91 98765 43212", grade: "Grade 10", stage: "Offer Extended", submittedDate: "2026-08-01" },
    { id: "5", name: "Leo Chen", email: "chen.leo@example.com", phone: "+1 650 555 1982", grade: "Grade 8", stage: "Enrolled", submittedDate: "2026-07-28" },
];

const STAGES: Candidate["stage"][] = ["Inquiry", "Entrance Exam", "Interview", "Offer Extended", "Enrolled"];

export default function AdmissionsPage() {
    const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
    const [search, setSearch] = useState("");
    const [selectedGrade, setSelectedGrade] = useState("ALL");

    const moveStage = (id: string, nextStage: Candidate["stage"]) => {
        setCandidates(prev => prev.map(c => c.id === id ? { ...c, stage: nextStage } : c));
    };

    const filtered = candidates.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
        const matchesGrade = selectedGrade === "ALL" || c.grade.includes(selectedGrade);
        return matchesSearch && matchesGrade;
    });

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <UserPlus className="h-8 w-8 text-primary" />
                        Admissions Kanban Pipeline
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Track prospective students across all application stages from initial inquiry to enrolled student.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition">
                        <Sparkles className="h-4 w-4" />
                        New Application
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 bg-card border rounded-xl p-3 shadow-sm">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search candidates by name or email..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-background text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <select
                        value={selectedGrade}
                        onChange={e => setSelectedGrade(e.target.value)}
                        className="bg-background border text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="ALL">All Grades</option>
                        <option value="Grade 6">Grade 6</option>
                        <option value="Grade 8">Grade 8</option>
                        <option value="Grade 9">Grade 9</option>
                        <option value="Grade 10">Grade 10</option>
                        <option value="Grade 11">Grade 11</option>
                    </select>
                </div>
            </div>

            {/* Kanban Columns */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
                {STAGES.map((stage, idx) => {
                    const stageCandidates = filtered.filter(c => c.stage === stage);
                    return (
                        <div key={stage} className="bg-muted/40 border rounded-xl p-3 min-w-[240px] flex flex-col">
                            {/* Column Header */}
                            <div className="flex items-center justify-between pb-3 border-b mb-3">
                                <span className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                                    {stage}
                                </span>
                                <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                    {stageCandidates.length}
                                </span>
                            </div>

                            {/* Candidate Cards */}
                            <div className="space-y-3 flex-1">
                                {stageCandidates.map(candidate => (
                                    <div 
                                        key={candidate.id} 
                                        className="bg-card border rounded-lg p-3.5 shadow-sm hover:shadow-md transition space-y-2 group"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="font-semibold text-sm text-foreground">{candidate.name}</h4>
                                                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md inline-block mt-1">
                                                    {candidate.grade}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="text-xs text-muted-foreground space-y-1">
                                            <div>{candidate.email}</div>
                                            <div>{candidate.phone}</div>
                                            {candidate.score !== undefined && (
                                                <div className="font-medium text-emerald-600 dark:text-emerald-400">
                                                    Exam Score: {candidate.score}%
                                                </div>
                                            )}
                                        </div>

                                        {/* Action: Advance */}
                                        {idx < STAGES.length - 1 && (
                                            <button
                                                onClick={() => moveStage(candidate.id, STAGES[idx + 1])}
                                                className="w-full mt-2 text-xs font-medium text-muted-foreground hover:text-foreground flex items-center justify-center gap-1 py-1.5 rounded-md bg-muted/60 hover:bg-muted transition"
                                            >
                                                Advance to {STAGES[idx + 1]}
                                                <ArrowRight className="h-3 w-3" />
                                            </button>
                                        )}
                                    </div>
                                ))}

                                {stageCandidates.length === 0 && (
                                    <div className="text-center py-8 text-xs text-muted-foreground">
                                        No candidates in this stage
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
