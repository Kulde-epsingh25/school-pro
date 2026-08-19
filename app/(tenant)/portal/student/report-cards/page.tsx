"use client";

import React, { useState } from "react";
import { Award, Download, TrendingUp, CheckCircle2, BookOpen, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubjectGrade {
  subject: string;
  code: string;
  creditHours: number;
  grade: string;
  gpaPoint: number;
  teacherRemarks: string;
}

const REPORT_CARD: {
  term: string;
  academicYear: string;
  studentName: string;
  gradeLevel: string;
  rollNumber: string;
  attendancePercentage: number;
  termGPA: number;
  cumulativeGPA: number;
  classRank: string;
  grades: SubjectGrade[];
} = {
  term: "Semester 1 Final",
  academicYear: "2026-2027",
  studentName: "Alex Vance",
  gradeLevel: "Grade 11 - Science Honors",
  rollNumber: "SCI-1104",
  attendancePercentage: 96.4,
  termGPA: 3.92,
  cumulativeGPA: 3.86,
  classRank: "3rd out of 42",
  grades: [
    { subject: "Advanced Physics", code: "PHY-301", creditHours: 4, grade: "A+", gpaPoint: 4.0, teacherRemarks: "Demonstrates exceptional analytical mastery in quantum lab experiments." },
    { subject: "Calculus & Analytical Geometry", code: "MAT-301", creditHours: 4, grade: "A", gpaPoint: 4.0, teacherRemarks: "Outstanding problem-solving in multivariable differential problems." },
    { subject: "Organic & Physical Chemistry", code: "CHE-301", creditHours: 4, grade: "A-", gpaPoint: 3.7, teacherRemarks: "Strong lab techniques; focus on equilibrium stoichiometry calculations." },
    { subject: "Molecular Biology & Genetics", code: "BIO-301", creditHours: 4, grade: "A", gpaPoint: 4.0, teacherRemarks: "Consistent high scores on genetic sequencing practicals." },
    { subject: "English Literature & Rhetoric", code: "ENG-301", creditHours: 3, grade: "B+", gpaPoint: 3.3, teacherRemarks: "Eloquent essays with clear persuasive arguments." }
  ]
};

export default function MyReportCardsPage() {
  const [report] = useState(REPORT_CARD);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Award className="h-8 w-8 text-amber-500" />
            Official Academic Report Cards
          </h1>
          <p className="text-muted-foreground mt-1">
            Certified semester transcripts, course credit breakdown, and term GPA rankings.
          </p>
        </div>
        <div>
          <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
            <Download className="h-4 w-4" />
            Download PDF Transcript
          </Button>
        </div>
      </div>

      {/* Transcript Header Summary Card */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-indigo-300 font-semibold">{report.academicYear} • {report.term}</span>
            <h2 className="text-2xl font-bold">{report.studentName}</h2>
            <p className="text-sm text-slate-300">{report.gradeLevel} • Roll No: {report.rollNumber}</p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
              <div className="text-xs text-slate-300 font-medium">Term GPA</div>
              <div className="text-2xl font-extrabold text-amber-400 mt-0.5">{report.termGPA}</div>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
              <div className="text-xs text-slate-300 font-medium">Cumulative GPA</div>
              <div className="text-2xl font-extrabold text-emerald-400 mt-0.5">{report.cumulativeGPA}</div>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
              <div className="text-xs text-slate-300 font-medium">Class Rank</div>
              <div className="text-xl font-bold text-white mt-0.5">{report.classRank}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Grades Table */}
      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-bold text-base text-foreground">Course Performance Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b">
              <tr>
                <th className="px-6 py-3">Course / Subject</th>
                <th className="px-6 py-3">Credits</th>
                <th className="px-6 py-3">Grade</th>
                <th className="px-6 py-3">Grade Points</th>
                <th className="px-6 py-3">Instructor Evaluation</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {report.grades.map((g, idx) => (
                <tr key={idx} className="hover:bg-muted/30 transition">
                  <td className="px-6 py-4">
                    <div className="font-bold text-foreground">{g.subject}</div>
                    <div className="text-xs font-mono text-muted-foreground">{g.code}</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-muted-foreground">
                    {g.creditHours}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300">
                      {g.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-foreground">
                    {g.gpaPoint.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground italic">
                    &ldquo;{g.teacherRemarks}&rdquo;
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
