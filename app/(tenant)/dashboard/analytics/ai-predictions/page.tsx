"use client";

import React, { useState } from "react";
import { 
    Sparkles, 
    TrendingDown, 
    TrendingUp, 
    AlertTriangle, 
    CheckCircle2, 
    Brain, 
    FileText, 
    RefreshCw,
    User,
    Calendar,
    Send,
    ArrowRight
} from "lucide-react";

interface AIPrediction {
    id: string;
    studentName: string;
    grade: string;
    riskScore: number; // 0-100
    riskFactors: string[];
    aiSuggestedIntervention: string;
    predictedExamOutcome: string;
    status: "Action Required" | "Intervention In Progress" | "Resolved";
}

const INITIAL_PREDICTIONS: AIPrediction[] = [
    {
        id: "1",
        studentName: "Liam Johnson",
        grade: "Grade 10-A",
        riskScore: 84,
        riskFactors: [
            "Physics score dropped by 16% over last 3 weeks",
            "Attendance fallen to 74% (3 consecutive Friday absences)",
            "Late homework submission in Chemistry"
        ],
        aiSuggestedIntervention: "Schedule 1-on-1 counseling session, assign peer tutor (Ananya Patel) for Physics kinematics, and send automated attendance alert to parent.",
        predictedExamOutcome: "Projected Term Final: 54% (At-risk of failing STEM prerequisites)",
        status: "Action Required"
    },
    {
        id: "2",
        studentName: "Dev Patel",
        grade: "Grade 9-C",
        riskScore: 42,
        riskFactors: [
            "Mathematics quiz volatility (High variance: 90% vs 45%)",
            "Strong participation in extracurriculars"
        ],
        aiSuggestedIntervention: "Provide modular practice test sets on quadratic equations to stabilize comprehension.",
        predictedExamOutcome: "Projected Term Final: 76% (Moderate trajectory)",
        status: "Intervention In Progress"
    }
];

export default function AIPredictiveAnalyticsPage() {
    const [predictions, setPredictions] = useState<AIPrediction[]>(INITIAL_PREDICTIONS);
    const [generating, setGenerating] = useState(false);

    const triggerAIRefresh = () => {
        setGenerating(true);
        setTimeout(() => setGenerating(false), 1200);
    };

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Brain className="h-8 w-8 text-indigo-600" />
                        AI Early Warning & Student Performance Prediction
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Machine-learning predictive models analyzing attendance, quiz cadence, and homework latency to prevent academic failure.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={triggerAIRefresh}
                        disabled={generating}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition shadow-sm disabled:opacity-50"
                    >
                        <RefreshCw className={`h-4 w-4 ${generating ? "animate-spin" : ""}`} />
                        {generating ? "Analyzing Neural Data..." : "Run AI Predictive Scan"}
                    </button>
                </div>
            </div>

            {/* AI Insights Summary Banner */}
            <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-amber-300" />
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                            Neural Model v4.2 Diagnostic
                        </span>
                    </div>
                    <h2 className="text-xl font-bold">
                        94.8% Academic Intervention Accuracy
                    </h2>
                    <p className="text-xs text-indigo-100 leading-relaxed">
                        The neural diagnostic model has evaluated 4,280 continuous data points across 12 classrooms. Early intervention within 7 days recovers 88% of struggling students.
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/20">
                    <div className="text-center">
                        <div className="text-3xl font-extrabold">2</div>
                        <div className="text-[11px] text-indigo-200 uppercase font-semibold">Critical Risks</div>
                    </div>
                    <div className="h-10 w-px bg-white/20" />
                    <div className="text-center">
                        <div className="text-3xl font-extrabold text-emerald-400">14</div>
                        <div className="text-[11px] text-indigo-200 uppercase font-semibold">Recovered</div>
                    </div>
                </div>
            </div>

            {/* Predictions List */}
            <div className="space-y-4">
                {predictions.map(p => (
                    <div key={p.id} className="bg-card border rounded-3xl p-6 shadow-sm space-y-4 hover:border-indigo-300 transition">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4">
                            <div className="flex items-center gap-3">
                                <h3 className="font-bold text-lg text-foreground">{p.studentName}</h3>
                                <span className="text-xs bg-muted px-2.5 py-1 rounded-md font-medium text-foreground">{p.grade}</span>
                                <span className={`px-3 py-0.5 rounded-full text-xs font-extrabold ${
                                    p.riskScore > 70
                                        ? "bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 animate-pulse"
                                        : "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300"
                                }`}>
                                    Risk Score: {p.riskScore}/100
                                </span>
                            </div>

                            <span className="text-xs font-semibold px-3 py-1 bg-muted rounded-full text-foreground">
                                {p.status}
                            </span>
                        </div>

                        {/* Risk Factors */}
                        <div className="space-y-2">
                            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                <AlertTriangle className="h-3.5 w-3.5 text-rose-500" /> Detected Contributing Indicators:
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                {p.riskFactors.map((f, i) => (
                                    <div key={i} className="text-xs bg-muted/40 p-2.5 rounded-xl border text-foreground">
                                        • {f}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* AI Suggested Action */}
                        <div className="bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 p-4 rounded-2xl space-y-1.5">
                            <div className="text-xs font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                                <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                                AI Recommended Action Plan:
                            </div>
                            <p className="text-xs text-indigo-950 dark:text-indigo-100 leading-relaxed font-medium">
                                {p.aiSuggestedIntervention}
                            </p>
                            <div className="text-xs text-rose-700 dark:text-rose-300 font-semibold pt-1">
                                {p.predictedExamOutcome}
                            </div>
                        </div>

                        {/* Action Toolbar */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                            <div className="text-xs text-muted-foreground">
                                Automated Parent Notification Ready
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl transition flex items-center gap-1.5 shadow-sm">
                                    <Send className="h-3.5 w-3.5" /> Dispatch Intervention Plan
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
