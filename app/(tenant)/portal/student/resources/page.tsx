"use client";

import React, { useState } from "react";
import { BookOpen, Video, FileText, Download, Search, Filter, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Resource {
  id: string;
  title: string;
  subject: string;
  type: "PDF Document" | "Video Lecture" | "Practice Worksheet" | "Slide Deck";
  teacher: string;
  uploadedDate: string;
  fileSize: string;
}

const RESOURCES: Resource[] = [
  {
    id: "1",
    title: "Organic Chemistry: Functional Groups & Reactions Guide",
    subject: "Chemistry",
    type: "PDF Document",
    teacher: "Dr. Marie Curie",
    uploadedDate: "2026-08-15",
    fileSize: "4.2 MB"
  },
  {
    id: "2",
    title: "Calculus III: Multivariable Derivatives & Integrals",
    subject: "Mathematics",
    type: "Slide Deck",
    teacher: "Dr. Alan Turing",
    uploadedDate: "2026-08-10",
    fileSize: "8.5 MB"
  },
  {
    id: "3",
    title: "Classical Mechanics: Newton's Laws Lab Demonstration",
    subject: "Physics",
    type: "Video Lecture",
    teacher: "Dr. Albert Einstein",
    uploadedDate: "2026-08-08",
    fileSize: "145 MB"
  },
  {
    id: "4",
    title: "Molecular Genetics & DNA Replication Worksheet",
    subject: "Biology",
    type: "Practice Worksheet",
    teacher: "Dr. Jane Goodall",
    uploadedDate: "2026-08-02",
    fileSize: "1.8 MB"
  }
];

export default function StudentResourcesPage() {
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("ALL");

  const filtered = RESOURCES.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.subject.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = selectedSubject === "ALL" || r.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            Learning Resources & LMS Hub
          </h1>
          <p className="text-muted-foreground mt-1">
            Access teacher-uploaded study notes, video lectures, and practice assignments for all your enrolled courses.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search study materials, notes, subjects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {["ALL", "Mathematics", "Physics", "Chemistry", "Biology"].map(sub => (
            <Button
              key={sub}
              variant={selectedSubject === sub ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSubject(sub)}
              className="text-xs"
            >
              {sub}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(item => (
          <div key={item.id} className="bg-card border rounded-2xl p-5 shadow-sm space-y-3 hover:border-blue-400 transition flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300">
                  {item.subject}
                </span>
                <span className="text-xs text-muted-foreground">{item.type} • {item.fileSize}</span>
              </div>
              <h3 className="font-bold text-lg text-foreground">{item.title}</h3>
              <p className="text-xs text-muted-foreground">Instructor: {item.teacher} • Added: {item.uploadedDate}</p>
            </div>
            <div className="pt-2 border-t flex items-center justify-between">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <Download className="h-3.5 w-3.5" /> Download Asset
              </Button>
              <Button size="sm" className="gap-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white">
                <ExternalLink className="h-3.5 w-3.5" /> Open in Viewer
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
