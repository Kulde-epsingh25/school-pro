"use client";

import React, { useState } from "react";
import { 
  GraduationCap, 
  Calendar, 
  FileText, 
  CreditCard, 
  Bell, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  TrendingUp,
  Award
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";

export default function StudentDashboardPage() {
  const user = useAuthStore(state => state.user);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="bg-white/20 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Student Academic Portal
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || "Student"}! 👋
          </h1>
          <p className="text-blue-100 text-sm">
            Here is your daily summary: 2 assignments due this week, overall attendance is at 94.8%, and semester exam timetables are published.
          </p>
          <div className="flex gap-3 pt-2">
            <Link href="/portal/student/timetable">
              <Button size="sm" className="bg-white text-blue-900 font-bold hover:bg-blue-50">
                View Timetable
              </Button>
            </Link>
            <Link href="/portal/student/assignments">
              <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                My Assignments
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/50 text-blue-600 rounded-xl">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">94.8%</div>
            <div className="text-xs text-muted-foreground">Term Attendance</div>
          </div>
        </div>

        <div className="bg-card border rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-xl">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">3.82 / 4.0</div>
            <div className="text-xs text-muted-foreground">Cumulative GPA</div>
          </div>
        </div>

        <div className="bg-card border rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/50 text-amber-600 rounded-xl">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">2 Active</div>
            <div className="text-xs text-muted-foreground">Pending Submissions</div>
          </div>
        </div>

        <div className="bg-card border rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-purple-50 dark:bg-purple-950/50 text-purple-600 rounded-xl">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-600">Paid</div>
            <div className="text-xs text-muted-foreground">Semester Tuition Status</div>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-card border rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Today's Class Schedule
            </h3>
            <Link href="/portal/student/timetable" className="text-xs font-semibold text-blue-600 hover:underline">
              Full Schedule →
            </Link>
          </div>

          <div className="space-y-3">
            {[
              { time: "08:30 - 09:30 AM", subject: "Advanced Physics", teacher: "Dr. Albert Einstein", room: "Lab 3" },
              { time: "09:45 - 10:45 AM", subject: "Organic Chemistry", teacher: "Dr. Marie Curie", room: "Chemistry Hall 1" },
              { time: "11:00 - 12:00 PM", subject: "Calculus & Linear Algebra", teacher: "Dr. Alan Turing", room: "Room 204" },
              { time: "01:30 - 02:30 PM", subject: "Molecular Biology", teacher: "Dr. Jane Goodall", room: "Bio Lab 2" },
            ].map((slot, i) => (
              <div key={i} className="flex items-center justify-between p-3.5 border rounded-xl hover:border-blue-300 transition">
                <div className="space-y-0.5">
                  <div className="font-bold text-sm text-foreground">{slot.subject}</div>
                  <div className="text-xs text-muted-foreground">{slot.teacher} • {slot.room}</div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-muted rounded-md text-foreground">
                  {slot.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Portal Navigation Links */}
        <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-lg text-foreground">Quick Actions</h3>

          <div className="space-y-2.5">
            {[
              { title: "Learning Resources Hub", href: "/portal/student/resources", desc: "Lecture slides, videos, notes", icon: BookOpen },
              { title: "My Assignments", href: "/portal/student/assignments", desc: "Submit homework & view grades", icon: FileText },
              { title: "Official Report Cards", href: "/portal/student/report-cards", desc: "Term transcripts & GPA", icon: Award },
              { title: "Tuition & Fee Receipts", href: "/portal/student/fees", desc: "Payment history & invoices", icon: CreditCard },
              { title: "Student Noticeboard", href: "/portal/student/noticeboard", desc: "Campus announcements & news", icon: Bell },
            ].map((nav, idx) => (
              <Link key={idx} href={nav.href} className="flex items-center justify-between p-3 border rounded-xl hover:border-blue-400 hover:bg-muted/30 transition">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-950/50 text-blue-600 rounded-lg">
                    <nav.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground">{nav.title}</div>
                    <div className="text-[10px] text-muted-foreground">{nav.desc}</div>
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
