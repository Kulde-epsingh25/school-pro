"use client";

import React, { useState } from "react";
import { CalendarCheck, CheckCircle2, User, Filter, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChildAttendanceSummary {
  childName: string;
  grade: string;
  overallRate: string;
  presentDays: number;
  totalDays: number;
  lateDays: number;
  recentLogs: {
    date: string;
    day: string;
    status: "Present" | "Late" | "Excused" | "Absent";
    remarks: string;
  }[];
}

const ATTENDANCE_DATA: ChildAttendanceSummary[] = [
  {
    childName: "Alex Vance",
    grade: "Grade 11 - Science Honors",
    overallRate: "96.4%",
    presentDays: 43,
    totalDays: 45,
    lateDays: 1,
    recentLogs: [
      { date: "2026-08-18", day: "Tuesday", status: "Present", remarks: "Homeroom morning check-in on time" },
      { date: "2026-08-17", day: "Monday", status: "Present", remarks: "Homeroom morning check-in on time" },
      { date: "2026-08-14", day: "Friday", status: "Late", remarks: "Arrived 10 mins late" },
      { date: "2026-08-13", day: "Thursday", status: "Present", remarks: "Homeroom morning check-in on time" }
    ]
  },
  {
    childName: "Emma Vance",
    grade: "Grade 7 - Blue Section",
    overallRate: "98.1%",
    presentDays: 44,
    totalDays: 45,
    lateDays: 0,
    recentLogs: [
      { date: "2026-08-18", day: "Tuesday", status: "Present", remarks: "Homeroom morning check-in on time" },
      { date: "2026-08-17", day: "Monday", status: "Present", remarks: "Homeroom morning check-in on time" },
      { date: "2026-08-14", day: "Friday", status: "Present", remarks: "Homeroom morning check-in on time" },
      { date: "2026-08-13", day: "Thursday", status: "Present", remarks: "Homeroom morning check-in on time" }
    ]
  }
];

export default function ParentAttendancePage() {
  const [children] = useState<ChildAttendanceSummary[]>(ATTENDANCE_DATA);
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);

  const activeChild = children[selectedChildIndex];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <CalendarCheck className="h-8 w-8 text-emerald-600" />
            Children Attendance Logs
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time morning attendance notifications, biometric check-ins, and semester percentage tracking.
          </p>
        </div>

        {/* Child Selector Tabs */}
        <div className="flex gap-2">
          {children.map((c, idx) => (
            <Button
              key={idx}
              variant={selectedChildIndex === idx ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedChildIndex(idx)}
              className="text-xs"
            >
              {c.childName} ({c.grade.split(" - ")[0]})
            </Button>
          ))}
        </div>
      </div>

      {/* Selected Child Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-card border rounded-2xl p-5 shadow-sm">
          <div className="text-xs text-muted-foreground uppercase font-semibold">Attendance Rate</div>
          <div className="text-3xl font-extrabold text-emerald-600 mt-1">{activeChild.overallRate}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">{activeChild.childName}</div>
        </div>
        <div className="bg-card border rounded-2xl p-5 shadow-sm">
          <div className="text-xs text-muted-foreground uppercase font-semibold">Days Present</div>
          <div className="text-3xl font-extrabold text-foreground mt-1">{activeChild.presentDays}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Out of {activeChild.totalDays} sessions</div>
        </div>
        <div className="bg-card border rounded-2xl p-5 shadow-sm">
          <div className="text-xs text-muted-foreground uppercase font-semibold">Late Check-ins</div>
          <div className="text-3xl font-extrabold text-amber-600 mt-1">{activeChild.lateDays}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Within tolerance</div>
        </div>
        <div className="bg-card border rounded-2xl p-5 shadow-sm">
          <div className="text-xs text-muted-foreground uppercase font-semibold">Requirement Status</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">Exceeds 85%</div>
        </div>
      </div>

      {/* Selected Child Recent Attendance Table */}
      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-bold text-base text-foreground">Recent Roll Call for {activeChild.childName}</h3>
          <span className="text-xs text-muted-foreground">{activeChild.grade}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Day of Week</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Verification Details</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {activeChild.recentLogs.map((log, idx) => (
                <tr key={idx} className="hover:bg-muted/30 transition">
                  <td className="px-6 py-4 font-mono font-semibold text-xs text-foreground">
                    {log.date}
                  </td>
                  <td className="px-6 py-4 font-medium text-foreground">
                    {log.day}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      log.status === "Present"
                        ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300"
                        : "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300"
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">
                    {log.remarks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
