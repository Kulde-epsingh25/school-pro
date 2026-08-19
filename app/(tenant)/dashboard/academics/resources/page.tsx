"use client";

import React, { useState } from "react";
import { 
    GraduationCap, 
    Upload, 
    FileText, 
    Video, 
    Link2, 
    Search, 
    Download, 
    Filter, 
    BookOpen,
    Eye
} from "lucide-react";

interface ResourceItem {
    id: string;
    title: string;
    subject: string;
    grade: string;
    type: "PDF Document" | "Video Lecture" | "Slide Deck" | "Lab Manual";
    fileSize: string;
    uploadedBy: string;
    uploadedDate: string;
}

const RESOURCES: ResourceItem[] = [
    {
        id: "1",
        title: "Calculus Fundamentals & Limits Cheat Sheet",
        subject: "Mathematics",
        grade: "Grade 12",
        type: "PDF Document",
        fileSize: "4.2 MB",
        uploadedBy: "Prof. Alan Turing",
        uploadedDate: "2026-08-15"
    },
    {
        id: "2",
        title: "Organic Chemistry: Functional Groups Masterclass",
        subject: "Chemistry",
        grade: "Grade 11",
        type: "Video Lecture",
        fileSize: "450 MB",
        uploadedBy: "Dr. Rosalind Franklin",
        uploadedDate: "2026-08-12"
    },
    {
        id: "3",
        title: "World War II Timeline & Primary Sources",
        subject: "History",
        grade: "Grade 10",
        type: "Slide Deck",
        fileSize: "18.5 MB",
        uploadedBy: "Mr. Winston Churchill",
        uploadedDate: "2026-08-08"
    }
];

export default function LearningResourcesPage() {
    const [resources, setResources] = useState<ResourceItem[]>(RESOURCES);
    const [search, setSearch] = useState("");

    const filtered = resources.filter(r => 
        r.title.toLowerCase().includes(search.toLowerCase()) || 
        r.subject.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <GraduationCap className="h-8 w-8 text-primary" />
                        Learning Resources & LMS Repository
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Central library for lecture slides, recorded sessions, practice sheets, and reference materials.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition shadow-sm">
                        <Upload className="h-4 w-4" />
                        Upload Resource
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex items-center gap-3 bg-card border rounded-2xl p-4 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by topic, subject, or title..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-background text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filtered.map(r => (
                    <div key={r.id} className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-primary/40 transition">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className={`text-xs px-2.5 py-0.5 rounded-md font-semibold ${
                                    r.type === "Video Lecture"
                                        ? "bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300"
                                        : r.type === "PDF Document"
                                        ? "bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300"
                                        : "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300"
                                }`}>
                                    {r.type}
                                </span>
                                <span className="text-xs text-muted-foreground font-mono">{r.fileSize}</span>
                            </div>

                            <h3 className="font-bold text-base text-foreground leading-snug">{r.title}</h3>

                            <div className="text-xs text-muted-foreground space-y-1">
                                <div>Subject: <span className="font-medium text-foreground">{r.subject}</span> ({r.grade})</div>
                                <div>Instructor: <span className="font-medium text-foreground">{r.uploadedBy}</span></div>
                            </div>
                        </div>

                        <div className="pt-2 border-t flex items-center gap-2">
                            <button className="flex-1 py-2 text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 rounded-xl transition flex items-center justify-center gap-1.5">
                                <Eye className="h-3.5 w-3.5" /> View Online
                            </button>
                            <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition">
                                <Download className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
