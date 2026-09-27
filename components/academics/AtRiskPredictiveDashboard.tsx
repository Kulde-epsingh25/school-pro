"use client";

import React, { useState, useMemo } from "react";
import { evaluateStudentRisk, StudentPerformanceInput } from "@/lib/student-intelligence";
import { AtRiskStudentAlert, RiskSeverity } from "@/types/advanced-features";
import { KPICard } from "@/components/feedback/kpi-card";
import { StatusBadge, StatusType } from "@/components/feedback/status-badge";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorBoundary } from "@/components/feedback/error-boundary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatPercentage, formatDate } from "@/lib/formatters";
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle,
  TrendingDown,
  BookOpen,
  UserCheck,
  Search,
  Filter,
  CalendarPlus,
  Activity,
  Layers,
} from "lucide-react";

export interface AtRiskPredictiveDashboardProps {
  students?: StudentPerformanceInput[];
}

function AtRiskPredictiveDashboardContent({ students = [] }: AtRiskPredictiveDashboardProps) {
  const [selectedSeverity, setSelectedSeverity] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [scheduledInterventions, setScheduledInterventions] = useState<Record<string, string>>({});

  const evaluatedStudents: AtRiskStudentAlert[] = useMemo(() => {
    return (students || []).map(evaluateStudentRisk);
  }, [students]);

  const filteredStudents = useMemo(() => {
    return evaluatedStudents.filter((student) => {
      const matchesSearch =
        student.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.mentorTeacherName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSeverity = selectedSeverity === "ALL" || student.severity === selectedSeverity;
      return matchesSearch && matchesSeverity;
    });
  }, [evaluatedStudents, searchQuery, selectedSeverity]);

  const severityBadge = (severity: RiskSeverity) => {
    switch (severity) {
      case "CRITICAL":
        return <StatusBadge status="danger" label="Critical Risk" icon={ShieldAlert} size="sm" />;
      case "HIGH":
        return <StatusBadge status="warning" label="High Risk" icon={AlertTriangle} size="sm" />;
      case "MODERATE":
        return <StatusBadge status="pending" label="Moderate Risk" size="sm" />;
      case "STABLE":
        return <StatusBadge status="info" label="Stable" size="sm" />;
      case "THRIVING":
        return <StatusBadge status="success" label="Thriving" icon={CheckCircle} size="sm" />;
    }
  };

  const handleScheduleIntervention = (studentId: string) => {
    setScheduledInterventions((prev) => ({
      ...prev,
      [studentId]: formatDate(new Date()),
    }));
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedSeverity("ALL");
  };

  const criticalCount = evaluatedStudents.filter((s) => s.severity === "CRITICAL").length;
  const highRiskCount = evaluatedStudents.filter((s) => s.severity === "HIGH").length;
  const moderateCount = evaluatedStudents.filter((s) => s.severity === "MODERATE").length;
  const thrivingCount = evaluatedStudents.filter(
    (s) => s.severity === "THRIVING" || s.severity === "STABLE"
  ).length;

  return (
    <div className="w-full space-y-6">
      {/* Top Banner and Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-lg border border-border/80 bg-surface">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-danger" /> Academic Early-Warning & At-Risk Predictor
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Multi-variate predictive engine correlating chronic absenteeism, GPA decay, and missing submissions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[200px] sm:min-w-[240px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search student or mentor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 text-xs"
            />
          </div>

          <div className="relative">
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="h-9 px-3 text-xs rounded-md border border-border bg-surface text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus cursor-pointer"
            >
              <option value="ALL">All Severity Levels</option>
              <option value="CRITICAL">Critical Only</option>
              <option value="HIGH">High Risk</option>
              <option value="MODERATE">Moderate</option>
              <option value="STABLE">Stable</option>
              <option value="THRIVING">Thriving</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPI Metric Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Critical Watchlist"
          value={criticalCount}
          comparison="Immediate intervention required"
          trend="down"
          trendValue="Highest priority"
          icon={ShieldAlert}
        />
        <KPICard
          title="High Risk Watchlist"
          value={highRiskCount}
          comparison="Close academic monitoring"
          trend="down"
          icon={AlertTriangle}
        />
        <KPICard
          title="Moderate Attention"
          value={moderateCount}
          comparison="Advisor follow-up scheduled"
          trend="neutral"
          icon={Activity}
        />
        <KPICard
          title="Passing / Thriving"
          value={thrivingCount}
          comparison="Meeting benchmark objectives"
          trend="up"
          trendValue="+12% term-over-term"
          icon={CheckCircle}
        />
      </div>

      {/* Student List & Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <span>Showing {filteredStudents.length} of {evaluatedStudents.length} evaluated students</span>
          {(searchQuery || selectedSeverity !== "ALL") && (
            <button
              onClick={resetFilters}
              className="text-primary hover:underline cursor-pointer font-medium"
            >
              Reset active filters
            </button>
          )}
        </div>

        {evaluatedStudents.length === 0 ? (
          <EmptyState
            type="no-data"
            title="No At-Risk Students Flagged"
            description="All student attendance, GPA, and behavioral thresholds are currently within healthy academic boundaries."
            icon={CheckCircle}
          />
        ) : filteredStudents.length === 0 ? (
          <EmptyState
            type="no-results"
            title="No students match active filters"
            description="Try searching for another student name, grade, or change your severity level selection."
            actionLabel="Reset Filters"
            onAction={resetFilters}
          />
        ) : (
          filteredStudents.map((student) => (
            <Card
              key={student.studentId}
              className={`transition-all ${
                student.severity === "CRITICAL"
                  ? "border-danger/40 bg-danger/5"
                  : student.severity === "HIGH"
                  ? "border-warning/40 bg-warning/5"
                  : "border-border/80 bg-surface"
              }`}
            >
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-base font-bold text-foreground">{student.studentName}</h3>
                      <span className="text-xs text-muted-foreground font-mono bg-muted/60 px-2 py-0.5 rounded-md">
                        {student.grade} · Section {student.section}
                      </span>
                      {severityBadge(student.severity)}
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 pt-0.5">
                      <UserCheck className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>Mentor: <strong className="text-foreground font-medium">{student.mentorTeacherName}</strong></span>
                    </p>
                  </div>

                  {/* Score & Key Metrics */}
                  <div className="flex items-center gap-5 sm:gap-8 shrink-0">
                    <div className="text-right">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                        Attendance
                      </span>
                      <span
                        className={`text-sm font-bold font-mono ${
                          student.attendanceRate < 80 ? "text-danger" : "text-foreground"
                        }`}
                      >
                        {formatPercentage(student.attendanceRate)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                        GPA
                      </span>
                      <span
                        className={`text-sm font-bold font-mono ${
                          student.currentGpa < 2.0 ? "text-danger" : "text-foreground"
                        }`}
                      >
                        {student.currentGpa.toFixed(2)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                        Risk Index
                      </span>
                      <span className="text-base font-black text-foreground font-mono">
                        {student.compositeRiskScore}
                        <span className="text-xs font-normal text-muted-foreground">/100</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Risk Drivers & Recommended Interventions */}
                <div className="mt-4 pt-3 border-t border-border/60 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <h4 className="font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                      <TrendingDown className="h-3.5 w-3.5 text-danger" /> Primary Risk Drivers
                    </h4>
                    <ul className="space-y-1">
                      {student.primaryRiskDrivers.map((driver, idx) => (
                        <li key={idx} className="text-foreground flex items-start gap-1.5">
                          <span className="text-danger font-bold">•</span>
                          <span>{driver}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                      <BookOpen className="h-3.5 w-3.5 text-primary" /> Recommended Interventions
                    </h4>
                    <ul className="space-y-1">
                      {student.recommendedInterventions.map((rec, idx) => (
                        <li key={idx} className="text-foreground flex items-start gap-1.5">
                          <span className="text-success font-bold">✓</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="mt-4 pt-3 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-xs text-muted-foreground">
                    {scheduledInterventions[student.studentId] ? (
                      <span className="text-success font-medium flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Intervention logged for{" "}
                        {scheduledInterventions[student.studentId]}
                      </span>
                    ) : student.lastInterventionDate ? (
                      `Last intervention recorded: ${formatDate(student.lastInterventionDate)}`
                    ) : (
                      "No prior intervention recorded on file"
                    )}
                  </span>

                  <Button
                    size="sm"
                    onClick={() => handleScheduleIntervention(student.studentId)}
                    className="gap-1.5"
                  >
                    <CalendarPlus className="w-3.5 h-3.5" />
                    Schedule Intervention
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export function AtRiskPredictiveDashboard(props: AtRiskPredictiveDashboardProps = {}) {
  return (
    <ErrorBoundary fallbackTitle="Unable to load At-Risk Predictive Analytics">
      <AtRiskPredictiveDashboardContent {...props} />
    </ErrorBoundary>
  );
}
