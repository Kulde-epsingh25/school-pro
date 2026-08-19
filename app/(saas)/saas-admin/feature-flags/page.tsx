"use client";

import React, { useState } from "react";
import { 
    Flag, 
    ToggleLeft, 
    ToggleRight, 
    Sparkles, 
    CheckCircle2, 
    ShieldCheck, 
    Search 
} from "lucide-react";

interface FeatureFlagItem {
    id: string;
    key: string;
    name: string;
    description: string;
    category: "Beta" | "General Availability" | "Enterprise Only";
    enabledCount: number;
    totalTenants: number;
    globalDefault: boolean;
}

const INITIAL_FLAGS: FeatureFlagItem[] = [
    {
        id: "1",
        key: "MODULE_TRANSPORT_GPS",
        name: "Live GPS Bus Tracking & Telemetry",
        description: "Enables real-time bus location tracking and ETA push notifications for parents.",
        category: "General Availability",
        enabledCount: 42,
        totalTenants: 50,
        globalDefault: true
    },
    {
        id: "2",
        key: "MODULE_HOSTEL_BOARDING",
        name: "Hostel & Bed Allocation System",
        description: "Provides room assignments, warden logs, and student curfew tracking.",
        category: "Enterprise Only",
        enabledCount: 18,
        totalTenants: 50,
        globalDefault: false
    },
    {
        id: "3",
        key: "MODULE_ALUMNI_NETWORK",
        name: "Alumni Directory & Giving Portal",
        description: "Engages graduates with networking directory, chapter events, and donation campaigns.",
        category: "Beta",
        enabledCount: 12,
        totalTenants: 50,
        globalDefault: false
    },
    {
        id: "4",
        key: "MODULE_LMS_RESOURCES",
        name: "LMS & Digital Learning Repository",
        description: "Classroom lecture video streaming, document repository, and interactive quizzes.",
        category: "General Availability",
        enabledCount: 48,
        totalTenants: 50,
        globalDefault: true
    }
];

export default function FeatureFlagsPage() {
    const [flags, setFlags] = useState<FeatureFlagItem[]>(INITIAL_FLAGS);

    const toggleGlobal = (id: string) => {
        setFlags(prev => prev.map(f => f.id === id ? { ...f, globalDefault: !f.globalDefault } : f));
    };

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Flag className="h-8 w-8 text-primary" />
                        SaaS Feature Flags & Module Rollout
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Control per-tenant module availability, phased beta rollouts, and enterprise feature gates.
                    </p>
                </div>
            </div>

            {/* Flags Grid */}
            <div className="space-y-4">
                {flags.map(flag => (
                    <div key={flag.id} className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition">
                        <div className="space-y-2 max-w-2xl">
                            <div className="flex items-center gap-3">
                                <h3 className="font-bold text-base text-foreground">{flag.name}</h3>
                                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                                    flag.category === "General Availability" 
                                        ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300"
                                        : flag.category === "Enterprise Only"
                                        ? "bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300"
                                        : "bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300"
                                }`}>
                                    {flag.category}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                {flag.description}
                            </p>
                            <div className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded inline-block">
                                Key: {flag.key}
                            </div>
                        </div>

                        <div className="flex items-center gap-6 border-t md:border-t-0 pt-4 md:pt-0">
                            <div className="text-right">
                                <div className="text-sm font-bold text-foreground">{flag.enabledCount} / {flag.totalTenants}</div>
                                <div className="text-xs text-muted-foreground">Schools Active</div>
                            </div>
                            <button
                                onClick={() => toggleGlobal(flag.id)}
                                className="flex items-center gap-2 text-xs font-semibold px-4 py-2 bg-muted hover:bg-muted/80 rounded-xl transition text-foreground"
                            >
                                {flag.globalDefault ? (
                                    <>
                                        <ToggleRight className="h-5 w-5 text-emerald-600" />
                                        Default ON
                                    </>
                                ) : (
                                    <>
                                        <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                                        Default OFF
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
