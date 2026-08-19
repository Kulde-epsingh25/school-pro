"use client";

import React, { useState } from "react";
import { CalendarCheck, CheckCircle2, XCircle, Clock, AlertTriangle, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DayRecord {
  date: string;
  day: string;
  status: "Present" | "Absent" | "Late" | "Holiday" | "Excused";
  session: "Full Day" | "Morning Only" | "Afternoon Only";
  remarks?: string;
}

const ATTENDANCE_LOG: DayRecord[] = [
  { date: "2026-08-18", day: "Tuesday", status: "Present", session: "Full Day", remarks: "On time" },
  { date: "2026-08-17", day: "Monday", status: "Present", session: "Full Day", remarks: "On time" },
  { date: "2026-08-14", day: "Friday", status: "Late", session: "Full Day", remarks: "Arrived 10 mins late (Traffic)" },
  { date: "2026-08-13", day: "Thursday", status: "Present", session: "Full Day", remarks: "On time" },
  { date: "2026-08-12", day: "Wednesday", status: "Excused", session: "Morning Only", remarks: "Clinic Visit" },
  { date: "2026-08-11", day: "Tuesday", status: "Present", session: "Full Day", remarks: "On time" },
  { date: "2026-08-10", day: "Monday", status: "Present", session: "Full Day", remarks: "On time" },
];

export default function MyAttendancePage() {
  const [records] = useState<DayRecord[]>(ATTENDANCE_LOG);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <CalendarCheck className="h-8 w-8 text-emerald-600" />
            My Daily Attendance History
          </h1>
          <p className="text-muted-foreground mt-1">
            Biometric and homeroom morning roll-call logs with session-by-session records.
          </p>
        </div>
      </div>

      {/* Attendance Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-card border rounded-2xl p-5 shadow-sm">
          <div className="text-xs text-muted-foreground uppercase font-semibold">Overall Attendance</div>
          <div className="text-3xl font-extrabold text-emerald-600 mt-1">94.8%</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Complies with 85% requirement</div>
        </div>
        <div className="bg-card border rounded-2xl p-5 shadow-sm">
          <div className="text-xs text-muted-foreground uppercase font-semibold">Days Present</div>
          <div className="text-3xl font-extrabold text-foreground mt-1">42</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Out of 45 academic days</div>
        </div>
        <div className="bg-card border rounded-2xl p-5 shadow-sm">
          <div className="text-xs text-muted-foreground uppercase font-semibold">Late Arrivals</div>
          <div className="text-3xl font-extrabold text-amber-600 mt-1">2</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Under threshold limit</div>
        </div>
        <div className="bg-card border rounded-2xl p-5 shadow-sm">
          <div className="text-xs text-muted-foreground uppercase font-semibold">Excused Absences</div>
          <div className="text-3xl font-extrabold text-blue-600 mt-1">1</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Documented medical leave</div>
        </div>
      </div>

      {/* Daily Attendance History Table */}
      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-bold text-base text-foreground">August 2026 Roll Call Log</h3>
          <span className="text-xs text-muted-foreground">Showing last 7 school days</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Day of Week</th>
                <th className="px-6 py-3">Session</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Remarks / Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {records.map((r, i) => (
                <tr key={i} className="hover:bg-muted/30 transition">
                  <td className="px-6 py-4 font-mono font-semibold text-xs text-foreground">
                    {r.date}
                  </td>
                  <td className="px-6 py-4 font-medium text-foreground">
                    {r.day}
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">
                    {r.session}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      r.status === "Present"
                        ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300"
                        : r.status === "Late"
                        ? "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300"
                        : r.status === "Excused"
                        ? "bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300"
                        : "bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300"
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">
                    {r.remarks || "—"}
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
