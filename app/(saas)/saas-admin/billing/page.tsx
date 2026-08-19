"use client";

import React, { useState } from "react";
import { 
    CreditCard, 
    CheckCircle2, 
    Sparkles, 
    Building2, 
    Users, 
    HardDrive, 
    MessageSquare, 
    ArrowUpRight,
    Zap
} from "lucide-react";

interface PlanTier {
    id: string;
    name: string;
    price: number;
    description: string;
    studentQuota: number;
    storageGB: number;
    features: string[];
    isPopular?: boolean;
}

const PLANS: PlanTier[] = [
    {
        id: "starter",
        name: "Starter Campus",
        price: 99,
        description: "Essential academics, attendance, and fee collection for small schools.",
        studentQuota: 250,
        storageGB: 50,
        features: ["Core Academic Scheduling", "Daily Student Attendance", "Online Fee Collections", "Parent Portal", "Standard Email Support"]
    },
    {
        id: "growth",
        name: "Growth Pro",
        price: 249,
        description: "Complete institution suite with GPS bus tracking, hostel, and digital exams.",
        studentQuota: 1000,
        storageGB: 250,
        features: ["All Starter Features", "Live GPS Transport Tracking", "Hostel & Room Allocations", "Examinations & GPA Engine", "SMS & Push Notifications", "Priority 24/7 Support"],
        isPopular: true
    },
    {
        id: "enterprise",
        name: "Multi-Campus Enterprise",
        price: 599,
        description: "Designed for universities and school groups requiring custom RBAC and APIs.",
        studentQuota: 5000,
        storageGB: 1000,
        features: ["All Growth Features", "Multi-Campus Headquarter Console", "Custom RBAC & 4D Permissions", "Biometric Hardware Webhooks", "Dedicated Account Manager", "Custom SLA & Audit Archive"]
    }
];

export default function SaaSAdminBillingPage() {
    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    <CreditCard className="h-8 w-8 text-primary" />
                    SaaS Subscription Plans & Billing Engine
                </h1>
                <p className="text-muted-foreground mt-1">
                    Manage tier pricing, license quotas, usage metering, and recurring tenant subscriptions.
                </p>
            </div>

            {/* Pricing Tier Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {PLANS.map(plan => (
                    <div 
                        key={plan.id}
                        className={`bg-card border rounded-3xl p-6 shadow-sm flex flex-col justify-between relative transition hover:shadow-md ${
                            plan.isPopular ? "border-primary ring-2 ring-primary/20" : ""
                        }`}
                    >
                        {plan.isPopular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow">
                                <Sparkles className="h-3 w-3" /> Most Popular
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <h3 className="font-bold text-xl text-foreground">{plan.name}</h3>
                                <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
                            </div>

                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-extrabold text-foreground">${plan.price}</span>
                                <span className="text-xs text-muted-foreground">/ school / month</span>
                            </div>

                            <div className="border-t pt-4 space-y-2 text-xs text-muted-foreground">
                                <div className="flex items-center gap-2 text-foreground font-medium">
                                    <Users className="h-4 w-4 text-primary" />
                                    Up to {plan.studentQuota.toLocaleString()} Active Students
                                </div>
                                <div className="flex items-center gap-2 text-foreground font-medium">
                                    <HardDrive className="h-4 w-4 text-primary" />
                                    {plan.storageGB} GB Cloud Storage Included
                                </div>
                            </div>

                            <div className="border-t pt-4 space-y-2.5">
                                {plan.features.map(f => (
                                    <div key={f} className="flex items-center gap-2 text-xs text-foreground">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                        <span>{f}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6">
                            <button className={`w-full py-2.5 rounded-xl font-semibold text-xs transition flex items-center justify-center gap-1.5 ${
                                plan.isPopular 
                                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow"
                                    : "bg-muted text-foreground hover:bg-muted/80"
                            }`}>
                                Edit Tier Configuration
                                <ArrowUpRight className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
