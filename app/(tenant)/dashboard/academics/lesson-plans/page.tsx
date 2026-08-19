"use client";

import React, { useState } from "react";
import { 
    BookOpen, 
    Plus, 
    Calendar, 
    CheckCircle2, 
    Clock, 
    FileText, 
    Upload, 
    User, 
    GraduationCap 
} from "lucide-react";

interface LessonPlanItem {
    id: string;
    subject: string;
    grade: string;
    teacherName: string;
    weekNumber: number;
    topic: string;
    objectives: string[];
    status: "Approved" | "Pending Review" | "Revision Requested";
    submittedDate: string;
}

const LESSON_PLANS: LessonPlanItem[] = [
    {
        id: "1",
        subject: "Physics",
        grade: "Grade 11-A",
        teacherName: "Prof. Robert Thorne",
        weekNumber: 4,
        topic: "Electromagnetic Induction & Faraday's Laws",
        objectives: [
            "Demonstrate Lenz's law with aluminum ring experiment",
            "Calculate induced EMF in uniform magnetic fields",
            "Solve 5 numerical problems from section 4.2"
        ],
        status: "Approved",
        submittedDate: "2026-08-14"
    },
    {
        id: "2",
        subject: "English Literature",
        grade: "Grade 10-C",
        teacherName: "Ms. Clara Oswald",
        weekNumber: 4,
        topic: "Shakespearean Tragedy — Macbeth Act 3 Analysis",
        objectives: [
            "Analyze character degeneration in the banquet scene",
            "Conduct dramatic reading in groups of 4",
            "Assign 500-word essay on dramatic irony"
        ],
        status: "Pending Review",
        submittedDate: "2026-08-18"
    }
];

export default function LessonPlansPage() {
    const [plans, setPlans] = useState<LessonPlanItem[]>(LESSON_PLANS);

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <BookOpen className="h-8 w-8 text-primary" />
                        Curriculum Mapping & Lesson Plans
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Submit weekly teaching milestones, track learning objectives, and review departmental plans.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition shadow-sm">
                        <Plus className="h-4 w-4" />
                        Create Lesson Plan
                    </button>
                </div>
            </div>

            {/* Plans List */}
            <div className="space-y-4">
                {plans.map(p => (
                    <div key={p.id} className="bg-card border rounded-2xl p-6 shadow-sm space-y-4 hover:border-primary/40 transition">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h3 className="font-bold text-base text-foreground">{p.topic}</h3>
                                <span className="text-xs bg-primary/10 text-primary font-semibold px-2.5 py-0.5 rounded-md">
                                    {p.subject} • {p.grade}
                                </span>
                                <span className="text-xs font-medium text-muted-foreground">
                                    Week {p.weekNumber}
                                </span>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                p.status === "Approved"
                                    ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300"
                                    : p.status === "Pending Review"
                                    ? "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300"
                                    : "bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300"
                            }`}>
                                {p.status}
                            </span>
                        </div>

                        <div className="space-y-1.5">
                            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Key Learning Objectives:</div>
                            <ul className="list-disc list-inside text-xs text-foreground space-y-1 pl-1">
                                {p.objectives.map((obj, i) => (
                                    <li key={i}>{obj}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="border-t pt-3 flex items-center justify-between text-xs text-muted-foreground">
                            <div>Teacher: <span className="font-medium text-foreground">{p.teacherName}</span></div>
                            <div>Submitted: {p.submittedDate}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
