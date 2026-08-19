"use client";

import React, { useState } from "react";
import { Users, Heart, GraduationCap, Award, Calendar, Phone, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ChildProfile {
  id: string;
  name: string;
  grade: string;
  rollNo: string;
  attendance: string;
  gpa: string;
  pendingTasks: number;
  homeroomTeacher: string;
}

const CHILDREN: ChildProfile[] = [
  {
    id: "child-1",
    name: "Alex Vance",
    grade: "Grade 11 - Science Honors",
    rollNo: "SCI-1104",
    attendance: "96.4%",
    gpa: "3.92",
    pendingTasks: 2,
    homeroomTeacher: "Dr. Marie Curie"
  },
  {
    id: "child-2",
    name: "Emma Vance",
    grade: "Grade 7 - Blue Section",
    rollNo: "JHS-0722",
    attendance: "98.1%",
    gpa: "3.85",
    pendingTasks: 1,
    homeroomTeacher: "Mr. David Miller"
  }
];

export default function ParentDashboardPage() {
  const [children] = useState<ChildProfile[]>(CHILDREN);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-800 to-blue-900 text-white rounded-3xl p-8 shadow-md">
        <div className="max-w-2xl space-y-2">
          <span className="bg-white/20 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Parent & Guardian Portal
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Family Academic Overview
          </h1>
          <p className="text-indigo-100 text-sm">
            Monitor your children's real-time attendance, homework submissions, exam report cards, and tuition fee payments in one unified dashboard.
          </p>
        </div>
      </div>

      {/* Children Overview Cards */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
          <Users className="h-5 w-5 text-indigo-600" />
          Enrolled Children
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {children.map((child) => (
            <div key={child.id} className="bg-card border rounded-2xl p-6 shadow-sm space-y-5 hover:border-indigo-300 transition">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xl font-bold text-foreground">{child.name}</h4>
                  <p className="text-xs text-muted-foreground">{child.grade} • Roll No: {child.rollNo}</p>
                  <p className="text-xs text-indigo-600 font-medium mt-1">Homeroom: {child.homeroomTeacher}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold">
                  {child.name.charAt(0)}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center border-y py-3">
                <div>
                  <div className="text-xs text-muted-foreground font-medium">Attendance</div>
                  <div className="text-lg font-extrabold text-emerald-600">{child.attendance}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">Term GPA</div>
                  <div className="text-lg font-extrabold text-indigo-600">{child.gpa}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">Pending Tasks</div>
                  <div className="text-lg font-extrabold text-amber-600">{child.pendingTasks}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <Link href={`/portal/parent/report-cards`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    Report Cards
                  </Button>
                </Link>
                <Link href={`/portal/parent/attendance`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    Attendance
                  </Button>
                </Link>
                <Link href={`/portal/parent/fees`} className="flex-1">
                  <Button size="sm" className="w-full text-xs bg-indigo-600 hover:bg-indigo-700 text-white">
                    Fees & Dues
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
