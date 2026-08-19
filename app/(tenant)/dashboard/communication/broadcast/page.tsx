"use client";

import React, { useState } from "react";
import { 
    Send, 
    Bell, 
    MessageSquare, 
    Mail, 
    Smartphone, 
    CheckCircle2, 
    Clock, 
    Users, 
    Filter, 
    Sparkles,
    AlertCircle,
    Eye,
    Plus
} from "lucide-react";

interface BroadcastMessage {
    id: string;
    title: string;
    channels: ("In-App Push" | "Email (Resend)" | "SMS Gateway")[];
    targetAudience: "All Parents" | "All Teachers" | "Grade 10 Parents" | "Bus Route 4 Guardians" | "All Students";
    recipientCount: number;
    deliveredCount: number;
    openRatePct: number;
    scheduledAt: string;
    status: "Sent & Delivered" | "Scheduled" | "Draft";
    previewText: string;
}

const BROADCAST_HISTORY: BroadcastMessage[] = [
    {
        id: "1",
        title: "Annual Sports Day Schedule & Parent Seating Pass",
        channels: ["In-App Push", "Email (Resend)"],
        targetAudience: "All Parents",
        recipientCount: 1450,
        deliveredCount: 1442,
        openRatePct: 92.4,
        scheduledAt: "2026-08-18 08:30",
        status: "Sent & Delivered",
        previewText: "Dear Parents, we are thrilled to welcome you to our 15th Annual Sports Day this Saturday..."
    },
    {
        id: "2",
        title: "Urgent: Route 4 Bus Delay (15 Mins - Road Repair)",
        channels: ["SMS Gateway", "In-App Push"],
        targetAudience: "Bus Route 4 Guardians",
        recipientCount: 38,
        deliveredCount: 38,
        openRatePct: 100,
        scheduledAt: "2026-08-19 07:45",
        status: "Sent & Delivered",
        previewText: "URGENT: School Bus #12 on Route 4 is delayed by approximately 15 minutes due to utility repairs..."
    },
    {
        id: "3",
        title: "Term 1 Mid-Term Examination Timetable Release",
        channels: ["In-App Push", "Email (Resend)"],
        targetAudience: "Grade 10 Parents",
        recipientCount: 180,
        deliveredCount: 0,
        openRatePct: 0,
        scheduledAt: "2026-08-22 09:00",
        status: "Scheduled",
        previewText: "The official examination calendar and hall ticket seat allocations for Grade 10 have been published..."
    }
];

export default function OmnichannelBroadcastPage() {
    const [broadcasts, setBroadcasts] = useState<BroadcastMessage[]>(BROADCAST_HISTORY);
    const [showComposer, setShowComposer] = useState(false);

    // Form state for new broadcast
    const [title, setTitle] = useState("");
    const [targetAudience, setTargetAudience] = useState<BroadcastMessage["targetAudience"]>("All Parents");
    const [pushChannel, setPushChannel] = useState(true);
    const [emailChannel, setEmailChannel] = useState(true);
    const [smsChannel, setSmsChannel] = useState(false);
    const [body, setBody] = useState("");

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        const channels: ("In-App Push" | "Email (Resend)" | "SMS Gateway")[] = [];
        if (pushChannel) channels.push("In-App Push");
        if (emailChannel) channels.push("Email (Resend)");
        if (smsChannel) channels.push("SMS Gateway");

        const newMsg: BroadcastMessage = {
            id: String(Date.now()),
            title,
            channels,
            targetAudience,
            recipientCount: targetAudience === "All Parents" ? 1450 : 180,
            deliveredCount: targetAudience === "All Parents" ? 1445 : 180,
            openRatePct: 88.5,
            scheduledAt: "Just now",
            status: "Sent & Delivered",
            previewText: body
        };

        setBroadcasts([newMsg, ...broadcasts]);
        setShowComposer(false);
        setTitle("");
        setBody("");
    };

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Send className="h-8 w-8 text-primary" />
                        Omnichannel Communication & Broadcast Center
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Dispatch emergency SMS alerts, transactional emails, and push notifications with real-time delivery audit metrics.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setShowComposer(!showComposer)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition shadow-sm"
                    >
                        <Plus className="h-4 w-4" />
                        {showComposer ? "Hide Composer" : "New Broadcast Campaign"}
                    </button>
                </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-card border rounded-2xl p-5 flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-xl">
                        <Mail className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-foreground">99.2%</div>
                        <div className="text-xs text-muted-foreground">Email Delivery Rate (Resend API)</div>
                    </div>
                </div>
                <div className="bg-card border rounded-2xl p-5 flex items-center gap-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/50 text-blue-600 rounded-xl">
                        <Smartphone className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-foreground">3.2s</div>
                        <div className="text-xs text-muted-foreground">Average SMS Gateway Latency</div>
                    </div>
                </div>
                <div className="bg-card border rounded-2xl p-5 flex items-center gap-4">
                    <div className="p-3 bg-purple-50 dark:bg-purple-950/50 text-purple-600 rounded-xl">
                        <Bell className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-foreground">91.8%</div>
                        <div className="text-xs text-muted-foreground">Parent App Open Rate</div>
                    </div>
                </div>
            </div>

            {/* Composer Card (Collapsible) */}
            {showComposer && (
                <form onSubmit={handleSend} className="bg-card border-2 border-primary/40 rounded-3xl p-6 shadow-md space-y-4 animate-in fade-in zoom-in-95">
                    <div className="flex items-center gap-2 pb-2 border-b">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <h3 className="font-bold text-base text-foreground">Compose Broadcast Announcement</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-foreground">Announcement Title</label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. Science Fair Registration Deadline"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="w-full px-3 py-2 bg-background border text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-foreground">Target Audience Cohort</label>
                            <select
                                value={targetAudience}
                                onChange={e => setTargetAudience(e.target.value as any)}
                                className="w-full px-3 py-2 bg-background border text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="All Parents">All Parents (1,450 recipients)</option>
                                <option value="All Teachers">All Teachers & Faculty (120 recipients)</option>
                                <option value="Grade 10 Parents">Grade 10 Parents (180 recipients)</option>
                                <option value="Bus Route 4 Guardians">Bus Route 4 Guardians (38 recipients)</option>
                                <option value="All Students">All Students (1,200 recipients)</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">Dispatch Channels (Multi-Channel Blast)</label>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                                <input type="checkbox" checked={pushChannel} onChange={e => setPushChannel(e.target.checked)} className="rounded" />
                                📲 In-App Push Notification
                            </label>
                            <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                                <input type="checkbox" checked={emailChannel} onChange={e => setEmailChannel(e.target.checked)} className="rounded" />
                                ✉️ Email (Resend)
                            </label>
                            <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                                <input type="checkbox" checked={smsChannel} onChange={e => setSmsChannel(e.target.checked)} className="rounded" />
                                💬 Emergency SMS Gateway
                            </label>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">Message Body (Supports dynamic tags: {"{{student_name}}"}, {"{{school_name}}"})</label>
                        <textarea
                            required
                            rows={4}
                            placeholder="Write your announcement content..."
                            value={body}
                            onChange={e => setBody(e.target.value)}
                            className="w-full p-3 bg-background border text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => setShowComposer(false)}
                            className="px-4 py-2 text-xs font-semibold bg-muted hover:bg-muted/80 rounded-xl transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl transition shadow flex items-center gap-1.5"
                        >
                            <Send className="h-3.5 w-3.5" /> Dispatch Campaign
                        </button>
                    </div>
                </form>
            )}

            {/* Broadcast History */}
            <div className="space-y-4">
                <h3 className="font-bold text-lg text-foreground">Recent Broadcasts & Delivery Audits</h3>
                {broadcasts.map(b => (
                    <div key={b.id} className="bg-card border rounded-3xl p-6 shadow-sm space-y-3 hover:border-primary/40 transition">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h4 className="font-bold text-base text-foreground">{b.title}</h4>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                    b.status === "Sent & Delivered"
                                        ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300"
                                        : "bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300"
                                }`}>
                                    {b.status}
                                </span>
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" /> {b.scheduledAt}
                            </div>
                        </div>

                        <p className="text-xs text-muted-foreground line-clamp-2 italic bg-muted/30 p-3 rounded-xl border">
                            &ldquo;{b.previewText}&rdquo;
                        </p>

                        <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-3">
                                <div>Target: <strong className="text-foreground">{b.targetAudience}</strong></div>
                                <div>• Channels: {b.channels.join(", ")}</div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div>Delivered: <strong className="text-emerald-600 font-bold">{b.deliveredCount}/{b.recipientCount}</strong></div>
                                <div>Open Rate: <strong className="text-primary font-bold">{b.openRatePct}%</strong></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
