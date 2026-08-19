"use client";

import React, { useState } from "react";
import { 
    Layers, 
    ToggleLeft, 
    ToggleRight, 
    CheckCircle2, 
    ShieldCheck, 
    Sliders,
    Building2,
    BookOpen,
    Bus,
    Gift
} from "lucide-react";

interface TenantModule {
    id: string;
    key: string;
    title: string;
    description: string;
    icon: any;
    isEnabled: boolean;
}

const INITIAL_MODULES: TenantModule[] = [
    {
        id: "1",
        key: "MODULE_TRANSPORT",
        title: "Fleet & Transport Management",
        description: "Bus routes, live GPS vehicle tracking, and student pickup/drop allocation.",
        icon: Bus,
        isEnabled: true
    },
    {
        id: "2",
        key: "MODULE_HOSTEL",
        title: "Hostel & Boarding Operations",
        description: "Room inventory, student allocations, warden check-ins, and curfew logs.",
        icon: Building2,
        isEnabled: false
    },
    {
        id: "3",
        key: "MODULE_LIBRARY",
        title: "Digital Library System",
        description: "ISBN book cataloging, barcode scanning, issue/return ledger, and fines.",
        icon: BookOpen,
        isEnabled: true
    },
    {
        id: "4",
        key: "MODULE_ALUMNI",
        title: "Alumni Network & Giving",
        description: "Graduate networking portal, chapter events, and scholarship donation ledger.",
        icon: Gift,
        isEnabled: true
    }
];

export default function TenantModulesPage() {
    const [modules, setModules] = useState<TenantModule[]>(INITIAL_MODULES);

    const toggle = (id: string) => {
        setModules(prev => prev.map(m => m.id === id ? { ...m, isEnabled: !m.isEnabled } : m));
    };

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Layers className="h-8 w-8 text-primary" />
                        Feature Modules & Campus Configuration
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Enable or disable specialized campus modules to tailor the sidebar navigation for your school.
                    </p>
                </div>
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modules.map(m => {
                    const Icon = m.icon;
                    return (
                        <div key={m.id} className="bg-card border rounded-2xl p-6 shadow-sm flex items-start justify-between gap-4 hover:border-primary/40 transition">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
                                    <Icon className="h-6 w-6" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-bold text-base text-foreground">{m.title}</h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {m.description}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => toggle(m.id)}
                                className="p-2 text-foreground hover:opacity-80 transition shrink-0"
                            >
                                {m.isEnabled ? (
                                    <ToggleRight className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                                ) : (
                                    <ToggleLeft className="h-7 w-7 text-muted-foreground" />
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
