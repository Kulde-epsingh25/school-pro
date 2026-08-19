"use client";

import React, { useState } from "react";
import { 
    DollarSign, 
    Plus, 
    Percent, 
    Tag, 
    GraduationCap, 
    Check, 
    Edit, 
    Trash2,
    Sparkles
} from "lucide-react";

interface FeeStructureItem {
    id: string;
    name: string;
    grade: string;
    tuitionFee: number;
    labFee: number;
    examFee: number;
    transportFee: number;
    siblingDiscountPct: number;
    earlyBirdDiscountPct: number;
}

const INITIAL_STRUCTURES: FeeStructureItem[] = [
    {
        id: "1",
        name: "High School Science Track (Annual)",
        grade: "Grade 11 & 12 (Science)",
        tuitionFee: 4500,
        labFee: 800,
        examFee: 300,
        transportFee: 600,
        siblingDiscountPct: 15,
        earlyBirdDiscountPct: 5,
    },
    {
        id: "2",
        name: "Middle School Standard Annual",
        grade: "Grade 6 - 8",
        tuitionFee: 3200,
        labFee: 300,
        examFee: 200,
        transportFee: 500,
        siblingDiscountPct: 10,
        earlyBirdDiscountPct: 5,
    },
    {
        id: "3",
        name: "Primary Montessori Package",
        grade: "Grade 1 - 5",
        tuitionFee: 2800,
        labFee: 150,
        examFee: 150,
        transportFee: 450,
        siblingDiscountPct: 10,
        earlyBirdDiscountPct: 5,
    }
];

export default function FeeStructuresPage() {
    const [structures, setStructures] = useState<FeeStructureItem[]>(INITIAL_STRUCTURES);

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <DollarSign className="h-8 w-8 text-emerald-600" />
                        Fee Structures & Discount Policies
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Configure class-wise fee heads, lab fees, sibling discounts, and scholarship rules.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition shadow-sm">
                        <Plus className="h-4 w-4" />
                        Create Fee Template
                    </button>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {structures.map(s => {
                    const totalBase = s.tuitionFee + s.labFee + s.examFee + s.transportFee;
                    return (
                        <div key={s.id} className="bg-card border rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-bold text-lg text-foreground">{s.name}</h3>
                                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-md mt-1">
                                            <GraduationCap className="h-3 w-3" />
                                            {s.grade}
                                        </span>
                                    </div>
                                </div>

                                <div className="text-3xl font-extrabold text-foreground">
                                    ${totalBase.toLocaleString()}
                                    <span className="text-xs font-normal text-muted-foreground ml-1">/ student / year</span>
                                </div>

                                <div className="border-t pt-4 space-y-2 text-xs">
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Tuition Base:</span>
                                        <span className="font-medium text-foreground">${s.tuitionFee}</span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Lab & Practical Fee:</span>
                                        <span className="font-medium text-foreground">${s.labFee}</span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Examination Fee:</span>
                                        <span className="font-medium text-foreground">${s.examFee}</span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Transport Fee:</span>
                                        <span className="font-medium text-foreground">${s.transportFee}</span>
                                    </div>
                                </div>

                                <div className="border-t pt-3 space-y-1.5 bg-muted/40 p-3 rounded-lg text-xs">
                                    <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-medium">
                                        <Percent className="h-3.5 w-3.5" />
                                        Sibling Discount: {s.siblingDiscountPct}% off
                                    </div>
                                    <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-300 font-medium">
                                        <Tag className="h-3.5 w-3.5" />
                                        Early Bird Payment: {s.earlyBirdDiscountPct}% off
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <button className="flex-1 py-2 text-xs font-medium bg-muted hover:bg-muted/80 rounded-lg transition text-foreground">
                                    Edit Heads
                                </button>
                                <button className="py-2 px-3 text-xs font-medium text-destructive hover:bg-destructive/10 rounded-lg transition">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
