"use client";

import React, { useState } from "react";
import { 
    Fingerprint, 
    CheckCircle2, 
    AlertCircle, 
    Wifi, 
    RefreshCw, 
    Search, 
    Plus, 
    Cpu, 
    User, 
    Clock, 
    Activity 
} from "lucide-react";

interface BiometricDevice {
    id: string;
    deviceName: string;
    location: string;
    ipAddress: string;
    deviceType: "Face Recognition Terminal" | "Optical Fingerprint Scanner" | "RFID Gate";
    lastHeartbeat: string;
    syncStatus: "Online (Streaming)" | "Syncing" | "Offline";
    todayScansCount: number;
}

interface LiveScanEvent {
    id: string;
    timestamp: string;
    personName: string;
    personType: "Student" | "Staff";
    gradeOrDept: string;
    deviceId: string;
    verificationType: "Face AI (99.4%)" | "Fingerprint" | "RFID Badge";
    gate: string;
}

const DEVICES: BiometricDevice[] = [
    { id: "1", deviceName: "Hikvision Face Terminal A", location: "Main Campus Gate North", ipAddress: "192.168.1.120", deviceType: "Face Recognition Terminal", lastHeartbeat: "Just now", syncStatus: "Online (Streaming)", todayScansCount: 412 },
    { id: "2", deviceName: "ZKTeco Optical Reader 1", location: "Staff Room Entrance", ipAddress: "192.168.1.125", deviceType: "Optical Fingerprint Scanner", lastHeartbeat: "10s ago", syncStatus: "Online (Streaming)", todayScansCount: 88 },
    { id: "3", deviceName: "Essen RFID Gate 4", location: "Hostel Block B Gate", ipAddress: "192.168.1.140", deviceType: "RFID Gate", lastHeartbeat: "Just now", syncStatus: "Online (Streaming)", todayScansCount: 154 }
];

const RECENT_SCANS: LiveScanEvent[] = [
    { id: "s1", timestamp: "10:52:14", personName: "Aarav Sharma", personType: "Student", gradeOrDept: "Grade 9-A", deviceId: "Hikvision Face Terminal A", verificationType: "Face AI (99.4%)", gate: "Main Gate North" },
    { id: "s2", timestamp: "10:51:50", personName: "Prof. Robert Thorne", personType: "Staff", gradeOrDept: "Physics Dept", deviceId: "ZKTeco Optical Reader 1", verificationType: "Fingerprint", gate: "Staff Room" },
    { id: "s3", timestamp: "10:50:33", personName: "Sophia Martinez", personType: "Student", gradeOrDept: "Grade 8-B", deviceId: "Hikvision Face Terminal A", verificationType: "Face AI (99.4%)", gate: "Main Gate North" }
];

export default function BiometricSyncPage() {
    const [devices, setDevices] = useState<BiometricDevice[]>(DEVICES);
    const [scans, setScans] = useState<LiveScanEvent[]>(RECENT_SCANS);

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Fingerprint className="h-8 w-8 text-emerald-600" />
                        Biometric Hardware Ingestion & Face Sync
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Real-time webhook telemetry connecting turnstiles, biometric scanners, and facial recognition terminals directly to daily attendance.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition shadow-sm">
                        <Plus className="h-4 w-4" />
                        Register Device
                    </button>
                </div>
            </div>

            {/* Device Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {devices.map(d => (
                    <div key={d.id} className="bg-card border rounded-2xl p-5 shadow-sm space-y-3">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="font-bold text-base text-foreground">{d.deviceName}</h3>
                                <div className="text-xs text-muted-foreground">{d.location}</div>
                            </div>
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full">
                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                                {d.syncStatus}
                            </span>
                        </div>

                        <div className="border-t pt-3 flex justify-between text-xs text-muted-foreground">
                            <div>IP: <span className="font-mono text-foreground">{d.ipAddress}</span></div>
                            <div>Scans Today: <strong className="text-foreground">{d.todayScansCount}</strong></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Live Ingestion Stream */}
            <div className="bg-card border rounded-2xl shadow-sm overflow-hidden space-y-3 p-6">
                <div className="flex items-center justify-between pb-2 border-b">
                    <div className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-emerald-600" />
                        <h3 className="font-bold text-lg text-foreground">Live Telemetry Ingestion Feed</h3>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">Auto-sync: Sub-second latency</span>
                </div>

                <div className="space-y-3">
                    {scans.map(s => (
                        <div key={s.id} className="border rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-emerald-300 transition">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-xl font-mono text-xs font-bold">
                                    {s.timestamp}
                                </div>
                                <div>
                                    <div className="font-bold text-sm text-foreground flex items-center gap-2">
                                        {s.personName}
                                        <span className="text-xs font-normal text-muted-foreground">({s.gradeOrDept})</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {s.gate} • Verified via <strong className="text-emerald-700 dark:text-emerald-300">{s.verificationType}</strong>
                                    </div>
                                </div>
                            </div>

                            <span className="text-xs bg-muted px-3 py-1 rounded-md font-semibold text-foreground">
                                Attendance Logged
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
