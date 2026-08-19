"use client";

import React, { useState } from "react";
import { Award, Download, CheckCircle2, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChildReportCard {
  childName: string;
  grade: string;
  term: string;
  academicYear: string;
  termGPA: number;
  cumulativeGPA: number;
  classRank: string;
  subjects: {
    name: string;
    grade: string;
    score: number;
    teacherComment: string;
  }[];
}

const FAMILY_REPORTS: ChildReportCard[] = [
  {
    childName: "Alex Vance",
    grade: "Grade 11 - Science Honors",
    term: "Semester 1 Final",
    academicYear: "2026-2027",
    termGPA: 3.92,
    cumulativeGPA: 3.86,
    classRank: "3rd of 42",
    subjects: [
      { name: "Advanced Physics", grade: "A+", score: 98, teacherComment: "Exceptional mastery in laboratory practicals." },
      { name: "Calculus & Geometry", grade: "A", score: 95, teacherComment: "Strong analytical skill." },
      { name: "Organic Chemistry", grade: "A-", score: 91, teacherComment: "Great conceptual understanding." },
      { name: "Molecular Biology", grade: "A", score: 94, teacherComment: "Consistent high performance." }
    ]
  },
  {
    childName: "Emma Vance",
    grade: "Grade 7 - Blue Section",
    term: "Semester 1 Final",
    academicYear: "2026-2027",
    termGPA: 3.85,
    cumulativeGPA: 3.82,
    classRank: "5th of 35",
    subjects: [
      { name: "Pre-Algebra", grade: "A", score: 96, teacherComment: "Very enthusiastic learner." },
      { name: "General Science", grade: "A", score: 93, teacherComment: "Great curiosity in science projects." },
      { name: "World History", grade: "B+", score: 88, teacherComment: "Active participant in class discussions." },
      { name: "English Language Arts", grade: "A", score: 95, teacherComment: "Superb reading comprehension." }
    ]
  }
];

export default function ParentReportCardsPage() {
  const [reports] = useState<ChildReportCard[]>(FAMILY_REPORTS);
  const [selectedIdx, setSelectedIdx] = useState(0);

  const active = reports[selectedIdx];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Award className="h-8 w-8 text-amber-500" />
            Official Student Report Cards
          </h1>
          <p className="text-muted-foreground mt-1">
            Certified semester transcripts, GPA records, and instructor assessments for your children.
          </p>
        </div>

        <div className="flex gap-2">
          {reports.map((r, i) => (
            <Button
              key={i}
              variant={selectedIdx === i ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedIdx(i)}
              className="text-xs"
            >
              {r.childName}
            </Button>
          ))}
        </div>
      </div>

      {/* Summary Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold">{active.academicYear} • {active.term}</span>
            <h2 className="text-2xl font-bold">{active.childName}</h2>
            <p className="text-sm text-slate-300">{active.grade}</p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
              <div className="text-xs text-slate-300 font-medium">Term GPA</div>
              <div className="text-2xl font-extrabold text-amber-400 mt-0.5">{active.termGPA}</div>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
              <div className="text-xs text-slate-300 font-medium">Cumulative GPA</div>
              <div className="text-2xl font-extrabold text-emerald-400 mt-0.5">{active.cumulativeGPA}</div>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
              <div className="text-xs text-slate-300 font-medium">Rank</div>
              <div className="text-xl font-bold text-white mt-0.5">{active.classRank}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Grades Table */}
      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-bold text-base text-foreground">Grade Evaluation for {active.childName}</h3>
          <Button size="sm" variant="outline" className="gap-1 text-xs">
            <Download className="h-3.5 w-3.5" /> Download Official PDF
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b">
              <tr>
                <th className="px-6 py-3">Subject</th>
                <th className="px-6 py-3">Score</th>
                <th className="px-6 py-3">Grade</th>
                <th className="px-6 py-3">Teacher Evaluation</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {active.subjects.map((s, idx) => (
                <tr key={idx} className="hover:bg-muted/30 transition">
                  <td className="px-6 py-4 font-bold text-foreground">
                    {s.name}
                  </td>
                  <td className="px-6 py-4 font-mono font-semibold text-foreground">
                    {s.score}%
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300">
                      {s.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground italic">
                    &ldquo;{s.teacherComment}&rdquo;
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
