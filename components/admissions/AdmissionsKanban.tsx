"use client";

import React, { useState } from "react";
import { AdmissionApplication, AdmissionStage } from "@/types/advanced-features";
import {
  Users,
  Award,
  Calendar,
  ChevronRight,
  Search,
  Filter,
  UserCheck,
  Phone,
  FileCheck2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/feedback/status-badge";
import { KPICard } from "@/components/feedback/kpi-card";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorBoundary } from "@/components/feedback/error-boundary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPercentage, formatDate } from "@/lib/formatters";

const STAGES: { stage: AdmissionStage; title: string }[] = [
  { stage: "INQUIRY", title: "Inquiry & Leads" },
  { stage: "DOCUMENT_VERIFICATION", title: "Doc Verification" },
  { stage: "ENTRANCE_ASSESSMENT", title: "Assessment" },
  { stage: "INTERVIEW_SCHEDULED", title: "Interview" },
  { stage: "ENROLLED", title: "Enrolled" },
];

export interface AdmissionsKanbanProps {
  initialApplications?: AdmissionApplication[];
}

function AdmissionsKanbanContent({ initialApplications = [] }: AdmissionsKanbanProps) {
  const [applications, setApplications] = useState<AdmissionApplication[]>(initialApplications);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("ALL");

  const advanceStage = (id: string, currentStage: AdmissionStage) => {
    const stageFlow: AdmissionStage[] = [
      "INQUIRY",
      "DOCUMENT_VERIFICATION",
      "ENTRANCE_ASSESSMENT",
      "INTERVIEW_SCHEDULED",
      "ENROLLED",
    ];
    const currentIndex = stageFlow.indexOf(currentStage);
    if (currentIndex >= 0 && currentIndex < stageFlow.length - 1) {
      const nextStage = stageFlow[currentIndex + 1];
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, stage: nextStage } : app))
      );
    }
  };

  const filtered = applications.filter((app) => {
    const matchesSearch =
      app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.parentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = selectedGrade === "ALL" || app.applyingForGrade.includes(selectedGrade);
    return matchesSearch && matchesGrade;
  });

  const totalEnrolled = applications.filter((a) => a.stage === "ENROLLED").length;
  const inPipeline = applications.filter((a) => a.stage !== "ENROLLED").length;

  return (
    <div className="w-full space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-lg border border-border/80 bg-surface">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" /> Admissions & Enrollment Kanban
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Manage applicant intake, entrance exams, and enrollment pipelines across academic grade levels.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[200px] sm:min-w-[240px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search applicant or parent..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 text-xs"
            />
          </div>

          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="h-9 px-3 text-xs rounded-md border border-border bg-surface text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus cursor-pointer"
          >
            <option value="ALL">All Grades</option>
            <option value="Grade 1">Grade 1</option>
            <option value="Grade 6">Grade 6</option>
            <option value="Grade 8">Grade 8</option>
            <option value="Grade 9">Grade 9</option>
            <option value="Grade 11">Grade 11</option>
          </select>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Applications"
          value={applications.length}
          comparison="AY 2026-27 Enrollment Drive"
          icon={Users}
        />
        <KPICard
          title="Active In Pipeline"
          value={inPipeline}
          comparison="Under assessment or interview"
          trend="up"
          icon={Calendar}
        />
        <KPICard
          title="Accepted & Enrolled"
          value={totalEnrolled}
          comparison="Seat confirmed with fees"
          trend="up"
          trendValue="+15% vs target"
          icon={Award}
        />
        <KPICard
          title="Conversion Rate"
          value={formatPercentage((totalEnrolled / applications.length) * 100, 0)}
          comparison="From lead inquiry to enrollment"
          trend="neutral"
          icon={FileCheck2}
        />
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5 overflow-x-auto pb-4">
        {STAGES.map(({ stage, title }) => {
          const stageApps = filtered.filter((a) => a.stage === stage);
          return (
            <div
              key={stage}
              className="flex flex-col rounded-lg border border-border/70 bg-surface-muted/30 p-3 min-w-[230px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-border/60 mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {title}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-surface text-foreground border border-border/80 shadow-2xs font-mono">
                  {stageApps.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="space-y-2.5 flex-1">
                {stageApps.length === 0 ? (
                  <div className="h-24 flex items-center justify-center text-xs text-muted-foreground border border-dashed border-border/80 rounded-md">
                    No candidates
                  </div>
                ) : (
                  stageApps.map((app) => (
                    <Card
                      key={app.id}
                      className="border-border/80 bg-surface shadow-xs hover:border-primary/50 transition-all flex flex-col justify-between gap-2.5"
                    >
                      <CardContent className="p-3.5 space-y-2.5">
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <span className="text-[10px] font-mono text-muted-foreground block">
                              {app.applicationNumber}
                            </span>
                            <h4 className="text-xs font-bold text-foreground leading-tight mt-0.5">
                              {app.studentName}
                            </h4>
                            <span className="text-[11px] font-medium text-primary block mt-0.5">
                              {app.applyingForGrade}
                            </span>
                          </div>

                          {app.priority === "HIGH" && (
                            <StatusBadge status="danger" label="High" size="sm" />
                          )}
                        </div>

                        {/* Details */}
                        <div className="text-[11px] text-muted-foreground space-y-1 border-t border-border/60 pt-2">
                          <div className="flex items-center gap-1.5 truncate">
                            <Users className="h-3 w-3 shrink-0" />
                            <span className="truncate">{app.parentName}</span>
                          </div>
                          {app.assessmentScore !== undefined && (
                            <div className="flex items-center gap-1.5 text-primary font-medium">
                              <Award className="h-3 w-3 shrink-0" />
                              <span className="font-mono">Score: {app.assessmentScore}%</span>
                            </div>
                          )}
                          {app.interviewDate && (
                            <div className="flex items-center gap-1.5 text-warning-foreground dark:text-warning font-medium">
                              <Calendar className="h-3 w-3 shrink-0" />
                              <span>{app.interviewDate}</span>
                            </div>
                          )}
                        </div>

                        {/* Advance Stage Action Button */}
                        {stage !== "ENROLLED" && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => advanceStage(app.id, app.stage)}
                            className="w-full text-xs h-7 py-0 gap-1 font-semibold"
                          >
                            Advance Stage
                            <ChevronRight className="h-3 w-3" />
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AdmissionsKanban(props: AdmissionsKanbanProps = {}) {
  return (
    <ErrorBoundary fallbackTitle="Unable to load Admissions Kanban">
      <AdmissionsKanbanContent {...props} />
    </ErrorBoundary>
  );
}
