"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { AtRiskPredictiveDashboard } from "@/components/academics/AtRiskPredictiveDashboard";
import { StudentHealthClinicHub } from "@/components/clinic/StudentHealthClinicHub";
import { AssetProcurementHub } from "@/components/finance/AssetProcurementHub";
import { AdmissionsKanban } from "@/components/admissions/AdmissionsKanban";
import { KPICard } from "@/components/feedback/kpi-card";
import { StatusBadge } from "@/components/feedback/status-badge";
import { DataTable, ColumnDef } from "@/components/tables/data-table";
import { ActivityTimeline, TimelineEvent } from "@/components/feedback/activity-timeline";
import { DataDiff } from "@/components/feedback/data-diff";
import { Can } from "@/components/permissions/can";
import { MetricLineChart } from "@/components/charts/metric-line-chart";
import { MetricBarChart } from "@/components/charts/metric-bar-chart";
import { MetricDonutChart } from "@/components/charts/metric-donut-chart";
import { SyncStatus } from "@/components/feedback/sync-status";
import { FileUploader } from "@/components/upload/file-uploader";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Users,
  GraduationCap,
  ShieldCheck,
  Stethoscope,
  Building,
  DollarSign,
  TrendingUp,
  FileCheck2,
  Lock,
  Layers,
  Sparkles,
  FileText,
  UserCheck,
  BarChart3,
  Clock,
  Key,
  UploadCloud,
} from "lucide-react";
import { formatCurrency, formatPercentage } from "@/lib/formatters";

type ActiveTab = "academics" | "clinic" | "finance" | "admissions" | "design-system";

interface SampleStudentRow {
  id: string;
  regNo: string;
  name: string;
  grade: string;
  attendance: number;
  feeStatus: "PAID" | "PARTIAL" | "OVERDUE";
  mentor: string;
}

const SAMPLE_STUDENT_ROWS: SampleStudentRow[] = [
  { id: "stu-1", regNo: "STU-2026-001", name: "Aarav Sharma", grade: "Grade 10-A", attendance: 94.5, feeStatus: "PAID", mentor: "Ms. Shalini Gupta" },
  { id: "stu-2", regNo: "STU-2026-002", name: "Priya Menon", grade: "Grade 9-B", attendance: 76.0, feeStatus: "PARTIAL", mentor: "Mr. David Miller" },
  { id: "stu-3", regNo: "STU-2026-003", name: "Aditya Roy", grade: "Grade 10-A", attendance: 68.0, feeStatus: "OVERDUE", mentor: "Ms. Shalini Gupta" },
  { id: "stu-4", regNo: "STU-2026-004", name: "Sneha Reddy", grade: "Grade 10-C", attendance: 96.0, feeStatus: "PAID", mentor: "Ms. Shalini Gupta" },
  { id: "stu-5", regNo: "STU-2026-005", name: "Kunal Ghosh", grade: "Grade 8-A", attendance: 89.0, feeStatus: "PAID", mentor: "Mrs. Leela Nair" },
];

const SAMPLE_TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: "tl-1",
    title: "Zero-Trust Privilege Delegation Granted",
    description: "Temporary Exam Coordinator access granted to Vice Principal Dr. Rao for 7 days.",
    timestamp: new Date(Date.now() - 1000 * 60 * 25),
    actor: "Principal S. Ramanujan",
    type: "warning",
    icon: Key,
  },
  {
    id: "tl-2",
    title: "Term Fee Ledger Reconciled",
    description: "Bank statement sync matched 482 payment transactions ($241,000).",
    timestamp: new Date(Date.now() - 1000 * 60 * 180),
    actor: "Bursar Menon",
    type: "success",
    icon: DollarSign,
  },
  {
    id: "tl-3",
    title: "Clinic Visit Encounter Logged",
    description: "Student Devansh Singh admitted to infirmary with high fever; parent notified.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    actor: "Nurse Grace Thomas",
    type: "info",
    icon: Stethoscope,
  },
];

const ATTENDANCE_TREND_DATA = [
  { label: "Apr", value: 94.2 },
  { label: "May", value: 92.8 },
  { label: "Jun", value: 89.5 },
  { label: "Jul", value: 91.0 },
  { label: "Aug", value: 93.4 },
  { label: "Sep", value: 95.1 },
];

const REVENUE_BAR_DATA = [
  { label: "Tuition", value: 3850000 },
  { label: "Transport", value: 480000 },
  { label: "Hostel", value: 320000 },
  { label: "Library", value: 85000 },
  { label: "Lab Fees", value: 120000 },
];

const FEE_DONUT_DATA = [
  { name: "Fully Paid", value: 1420, color: "hsl(142, 71%, 45%)" },
  { name: "Partial Payment", value: 310, color: "hsl(38, 92%, 50%)" },
  { name: "Overdue Dues", value: 112, color: "hsl(0, 84%, 60%)" },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("academics");

  const studentColumns: ColumnDef<SampleStudentRow>[] = [
    {
      key: "regNo",
      header: "Reg No & Name",
      render: (row) => (
        <div>
          <span className="font-semibold text-foreground block text-xs">{row.name}</span>
          <span className="text-[10px] text-muted-foreground font-mono">{row.regNo}</span>
        </div>
      ),
    },
    {
      key: "grade",
      header: "Class & Section",
      render: (row) => <span className="font-medium text-xs">{row.grade}</span>,
    },
    {
      key: "attendance",
      header: "Attendance",
      render: (row) => (
        <span className={`font-mono text-xs font-semibold ${row.attendance < 80 ? "text-danger" : "text-foreground"}`}>
          {formatPercentage(row.attendance)}
        </span>
      ),
    },
    {
      key: "feeStatus",
      header: "Fee Status",
      render: (row) => {
        switch (row.feeStatus) {
          case "PAID":
            return <StatusBadge status="success" label="Cleared" size="sm" />;
          case "PARTIAL":
            return <StatusBadge status="warning" label="Partial" size="sm" />;
          case "OVERDUE":
            return <StatusBadge status="danger" label="Overdue" size="sm" />;
        }
      },
    },
    {
      key: "mentor",
      header: "Advisor",
      render: (row) => <span className="text-xs text-muted-foreground">{row.mentor}</span>,
    },
  ];

  return (
    <AppShell
      breadcrumbs={[
        { label: "Executive Console", href: "/dashboard" },
        {
          label:
            activeTab === "academics"
              ? "At-Risk Predictive Analytics"
              : activeTab === "clinic"
              ? "Clinic & Health Vault"
              : activeTab === "finance"
              ? "Procurement & Assets"
              : activeTab === "admissions"
              ? "Admissions Pipeline"
              : "Design System & Tokens",
        },
      ]}
      title="Institutional Executive Dashboard"
      description="Operational command center, predictive intelligence, and zero-trust administrative governance."
      actions={
        <div className="flex items-center gap-2">
          <SyncStatus state="synced" lastSyncedAt="Just now" />
          <Button size="sm" variant="outline" className="gap-1.5">
            <Lock className="w-3.5 h-3.5 text-primary" />
            Audit Log
          </Button>
        </div>
      }
    >
      {/* Primary Institutional KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Active Students"
          value="1,842"
          comparison="vs 1,698 previous term"
          trend="up"
          trendValue="+8.4%"
          icon={GraduationCap}
        />
        <KPICard
          title="Campus Attendance Rate"
          value={formatPercentage(92.4)}
          comparison="AY 2026-27 average"
          trend="up"
          trendValue="+2.1%"
          icon={TrendingUp}
        />
        <KPICard
          title="Term Fees Collected"
          value={formatCurrency(4825000, "INR")}
          comparison="88.6% of term billing target"
          trend="up"
          icon={DollarSign}
        />
        <KPICard
          title="At-Risk Alerts"
          value="8 Students"
          comparison="2 Critical interventions required"
          trend="down"
          trendValue="Action Needed"
          icon={ShieldCheck}
        />
      </div>

      {/* Module Navigation Tabs */}
      <div className="border-b border-border/80">
        <div className="flex items-center gap-1 overflow-x-auto pb-px">
          {[
            { id: "academics", label: "At-Risk Early Warning", icon: GraduationCap },
            { id: "clinic", label: "Clinic & Health Vault", icon: Stethoscope },
            { id: "finance", label: "Assets & Procurement", icon: Building },
            { id: "admissions", label: "Admissions Pipeline", icon: FileCheck2 },
            { id: "design-system", label: "Design System Primitives", icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "border-primary text-primary bg-primary/5 rounded-t-md"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-t-md"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === "academics" && <AtRiskPredictiveDashboard />}
      {activeTab === "clinic" && <StudentHealthClinicHub />}
      {activeTab === "finance" && <AssetProcurementHub />}
      {activeTab === "admissions" && <AdmissionsKanban />}

      {/* Design System Primitives Reference & Token Matrix */}
      {activeTab === "design-system" && (
        <div className="space-y-6">
          {/* Section 1: Data Visualization System */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <MetricLineChart
              title="Attendance Trajectory"
              description="6-month campus attendance rate (%)"
              data={ATTENDANCE_TREND_DATA}
              valueSuffix="%"
            />
            <MetricBarChart
              title="Revenue Streams"
              description="Term billing distribution (INR)"
              data={REVENUE_BAR_DATA}
              valuePrefix="₹"
            />
            <MetricDonutChart
              title="Fee Settlement"
              description="Collection clearance breakdown"
              data={FEE_DONUT_DATA}
              centerLabel="Active Roster"
              centerValue="1,842"
            />
          </div>

          {/* Section 2: Standardized Data Grid with Density & Bulk Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Layers className="w-4 h-4 text-primary" /> Standardized Enterprise Data Grid
              </CardTitle>
              <CardDescription>
                Features 3-tier density switching (compact, default, comfortable), live search, multi-row selection, and bulk actions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={studentColumns}
                data={SAMPLE_STUDENT_ROWS}
                keyExtractor={(r) => r.id}
                searchPlaceholder="Search student by name or register number..."
                searchField={(r) => `${r.name} ${r.regNo} ${r.grade}`}
                bulkActions={[
                  {
                    label: "Export Selected",
                    action: (ids) => alert(`Exporting ${ids.length} students`),
                    icon: FileText,
                  },
                  {
                    label: "Assign Mentor",
                    action: (ids) => alert(`Reassigning mentor for ${ids.length} students`),
                    icon: UserCheck,
                  },
                ]}
                onExportCsv={() => alert("CSV exported successfully")}
              />
            </CardContent>
          </Card>

          {/* Section 3: File Upload UX */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-primary" /> Enterprise File Upload UX
              </CardTitle>
              <CardDescription>
                Section 33 compliant document intake with drag & drop, file size/type validation, and item management.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploader maxFiles={3} />
            </CardContent>
          </Card>

          {/* Section 4: Zero-Trust Audit Diff & Activity Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" /> Audit Data Diff Presentation
                </CardTitle>
                <CardDescription>
                  Section 58 & 59 compliant before/after comparison with struck text, delta icons, and actor signatures.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataDiff
                  actorName="Exam Officer Dr. Anirudh Rao"
                  timestamp="24 Sep 2026, 04:15 PM"
                  reason="Grade moderation appeal approved by Principal"
                  fields={[
                    { fieldName: "Physics Final Mark", previousValue: "68 / 100", newValue: "76 / 100" },
                    { fieldName: "Grade Letter", previousValue: "C+", newValue: "B+" },
                    { fieldName: "Moderation Status", previousValue: "PENDING_REVIEW", newValue: "CONFIRMED" },
                  ]}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" /> Operational Activity Stream
                </CardTitle>
                <CardDescription>
                  Section 61 compliant immutable timeline for student profiles, facility tickets, and finance ledgers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ActivityTimeline events={SAMPLE_TIMELINE_EVENTS} />
              </CardContent>
            </Card>
          </div>

          {/* Section 5: Semantic Status Colors & Buttons */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="w-4 h-4 text-primary" /> Design Tokens & Component Primitives Matrix
              </CardTitle>
              <CardDescription>
                Zero hardcoded colors or ad-hoc classes. All tokens derive from CSS Custom Properties in globals.css.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Semantic Status Colors */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Semantic Status Tokens & Accessible Badges
                </h4>
                <div className="flex flex-wrap items-center gap-2.5">
                  <StatusBadge status="success" label="Active / Verified" />
                  <StatusBadge status="warning" label="Review Required" />
                  <StatusBadge status="danger" label="Critical / Overdue" />
                  <StatusBadge status="info" label="Information" />
                  <StatusBadge status="pending" label="Pending Approval" />
                  <StatusBadge status="processing" label="Syncing Telemetry" />
                  <StatusBadge status="neutral" label="Archived" />
                </div>
              </div>

              {/* Button Variant Primitives */}
              <div className="border-t border-border/60 pt-4">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Interactive Button Primitives & Micro-Interactions
                </h4>
                <div className="flex flex-wrap items-center gap-2.5">
                  <Button variant="default" size="sm">Primary Action</Button>
                  <Button variant="secondary" size="sm">Secondary Action</Button>
                  <Button variant="outline" size="sm">Outlined Button</Button>
                  <Button variant="ghost" size="sm">Ghost Button</Button>
                  <Button variant="destructive" size="sm">Destructive Action</Button>
                  <Button size="sm" loading loadingText="Synchronizing...">Submit</Button>
                </div>
              </div>

              {/* RBAC Permission Gate Demo */}
              <div className="border-t border-border/60 pt-4">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  4D RBAC Authorization Gate (`&lt;Can&gt;`)
                </h4>
                <div className="p-3.5 rounded-lg border border-border bg-surface-muted/30 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-foreground block">
                      Protected Administrative Action Area
                    </span>
                    <span className="text-muted-foreground text-[11px]">
                      Dynamically rendered only if the user holds required Subject/Action/Scope authorization.
                    </span>
                  </div>
                  <Can
                    subject="roles"
                    action="manage"
                    scope="school"
                    fallback={<span className="text-muted-foreground text-xs italic">Restricted by Policy</span>}
                  >
                    <Button size="sm" variant="outline" className="gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-primary" />
                      Manage Institutional Roles
                    </Button>
                  </Can>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </AppShell>
  );
}
