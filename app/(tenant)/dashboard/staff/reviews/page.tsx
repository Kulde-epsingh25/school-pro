"use client";

import React, { useState } from "react";
import { 
    Star, 
    Award, 
    CheckCircle2, 
    Plus, 
    Search, 
    TrendingUp, 
    User, 
    Calendar 
} from "lucide-react";

interface ReviewCycle {
    id: string;
    staffName: string;
    department: string;
    cycleYear: string;
    teachingScore: number;
    administrativeScore: number;
    peerRating: number;
    status: "Completed" | "In Review" | "Scheduled";
}

const REVIEWS: ReviewCycle[] = [
    {
        id: "1",
        staffName: "Prof. Robert Thorne",
        department: "Physics",
        cycleYear: "2025-2026",
        teachingScore: 4.8,
        administrativeScore: 4.5,
        peerRating: 4.9,
        status: "Completed"
    },
    {
        id: "2",
        staffName: "Ms. Clara Oswald",
        department: "English",
        cycleYear: "2025-2026",
        teachingScore: 4.6,
        administrativeScore: 4.7,
        peerRating: 4.6,
        status: "In Review"
    }
];

export default function StaffReviewsPage() {
    const [reviews, setReviews] = useState<ReviewCycle[]>(REVIEWS);

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Award className="h-8 w-8 text-primary" />
                        Staff Performance Reviews & 360 Appraisals
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Annual faculty appraisal cycles, peer feedback, student survey ratings, and career advancement OKRs.
                    </p>
                </div>
            </div>

            {/* Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map(r => (
                    <div key={r.id} className="bg-card border rounded-2xl p-6 shadow-sm space-y-4 hover:border-primary/40 transition">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-base text-foreground">{r.staffName}</h3>
                                <div className="text-xs text-muted-foreground">{r.department} • Cycle {r.cycleYear}</div>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                r.status === "Completed"
                                    ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300"
                                    : "bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300"
                            }`}>
                                {r.status}
                            </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 bg-muted/40 p-3 rounded-xl text-center">
                            <div>
                                <div className="text-xs text-muted-foreground">Teaching</div>
                                <div className="text-base font-extrabold text-foreground flex items-center justify-center gap-0.5">
                                    {r.teachingScore} <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-muted-foreground">Admin OKRs</div>
                                <div className="text-base font-extrabold text-foreground flex items-center justify-center gap-0.5">
                                    {r.administrativeScore} <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-muted-foreground">Peer 360</div>
                                <div className="text-base font-extrabold text-foreground flex items-center justify-center gap-0.5">
                                    {r.peerRating} <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                </div>
                            </div>
                        </div>

                        <button className="w-full py-2 text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 rounded-xl transition">
                            View Full Appraisal Dossier
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
