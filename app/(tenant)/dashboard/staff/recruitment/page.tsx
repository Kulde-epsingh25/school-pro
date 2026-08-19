"use client";

import React, { useState } from "react";
import { 
    Users, 
    Briefcase, 
    Plus, 
    Search, 
    Clock, 
    CheckCircle2, 
    FileText,
    Calendar,
    Send
} from "lucide-react";

interface JobOpening {
    id: string;
    title: string;
    department: string;
    type: "Full-time" | "Part-time" | "Contract";
    applicantsCount: number;
    status: "Active" | "Interviewing" | "Closed";
    postedDate: string;
}

const JOBS: JobOpening[] = [
    {
        id: "1",
        title: "Senior High School Mathematics Teacher",
        department: "Mathematics",
        type: "Full-time",
        applicantsCount: 14,
        status: "Interviewing",
        postedDate: "2026-08-01"
    },
    {
        id: "2",
        title: "Certified School Nurse (RN)",
        department: "Student Health & Wellness",
        type: "Full-time",
        applicantsCount: 6,
        status: "Active",
        postedDate: "2026-08-10"
    },
    {
        id: "3",
        title: "Robotics & STEM Lab Instructor",
        department: "Science & Technology",
        type: "Part-time",
        applicantsCount: 9,
        status: "Active",
        postedDate: "2026-08-12"
    }
];

export default function StaffRecruitmentPage() {
    const [jobs, setJobs] = useState<JobOpening[]>(JOBS);

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Briefcase className="h-8 w-8 text-primary" />
                        Staff Recruitment & Applicant Tracking (ATS)
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Post faculty job openings, review candidate resumes, schedule interviews, and issue offer letters.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition shadow-sm">
                        <Plus className="h-4 w-4" />
                        Post New Job Opening
                    </button>
                </div>
            </div>

            {/* Jobs List */}
            <div className="space-y-4">
                {jobs.map(j => (
                    <div key={j.id} className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/40 transition">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-3">
                                <h3 className="font-bold text-base text-foreground">{j.title}</h3>
                                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                                    j.status === "Active"
                                        ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300"
                                        : "bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300"
                                }`}>
                                    {j.status}
                                </span>
                            </div>

                            <div className="text-xs text-muted-foreground">
                                Department: <span className="font-medium text-foreground">{j.department}</span> • Type: <span className="font-medium text-foreground">{j.type}</span>
                            </div>

                            <div className="text-xs text-muted-foreground flex items-center gap-2 pt-1">
                                <span className="font-bold text-primary">{j.applicantsCount} Applicants</span>
                                <span>• Posted: {j.postedDate}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 border-t md:border-t-0 pt-3 md:pt-0">
                            <button className="px-4 py-2 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl transition shadow">
                                View Applicant Kanban
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
