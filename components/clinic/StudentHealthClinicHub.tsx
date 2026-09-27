"use client";

import React, { useState } from "react";
import { ClinicVisit, MedicalAlert } from "@/types/advanced-features";
import {
  Activity,
  AlertOctagon,
  HeartPulse,
  UserPlus,
  Check,
  Clock,
  PhoneCall,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Plus,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { StatusBadge } from "@/components/feedback/status-badge";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorBoundary } from "@/components/feedback/error-boundary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { formatDateTime, formatDate } from "@/lib/formatters";

export interface StudentHealthClinicHubProps {
  initialAlerts?: MedicalAlert[];
  initialVisits?: ClinicVisit[];
}

function StudentHealthClinicHubContent({ initialAlerts = [], initialVisits = [] }: StudentHealthClinicHubProps) {
  const [alerts] = useState<MedicalAlert[]>(initialAlerts);
  const [visits, setVisits] = useState<ClinicVisit[]>(initialVisits);

  // New visit modal state
  const [showAddVisit, setShowAddVisit] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [grade, setGrade] = useState("");
  const [complaint, setComplaint] = useState("");
  const [treatment, setTreatment] = useState("");
  const [outcome, setOutcome] = useState<ClinicVisit["outcome"]>("RETURNED_TO_CLASS");

  const handleAddVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !complaint) return;

    const newVisit: ClinicVisit = {
      id: `vis-${Date.now()}`,
      tenantId: "tenant-sunrise",
      studentId: `stu-${Date.now()}`,
      studentName,
      grade: grade || "Grade 8-A",
      timestamp: new Date().toISOString(),
      chiefComplaint: complaint,
      treatmentProvided: treatment || "Observation, resting vitals checked.",
      outcome,
      attendingNurseName: "Nurse Grace Thomas",
      parentNotified: outcome === "PARENT_PICKUP" || outcome === "EMERGENCY_TRANSFER",
    };

    setVisits([newVisit, ...visits]);
    setStudentName("");
    setGrade("");
    setComplaint("");
    setTreatment("");
    setShowAddVisit(false);
  };

  const getOutcomeBadge = (outcome: ClinicVisit["outcome"]) => {
    switch (outcome) {
      case "RETURNED_TO_CLASS":
        return <StatusBadge status="success" label="Returned to Class" size="sm" />;
      case "PARENT_PICKUP":
        return <StatusBadge status="warning" label="Parent Pickup" size="sm" />;
      case "SENT_HOME":
        return <StatusBadge status="pending" label="Sent Home" size="sm" />;
      case "EMERGENCY_TRANSFER":
        return <StatusBadge status="danger" label="Emergency Transfer" icon={ShieldAlert} size="sm" />;
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header and Compliance Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-lg border border-border/80 bg-surface">
        <div>
          <div className="flex items-center gap-2">
            <HeartPulse className="h-5 w-5 text-danger" />
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Student Health & Clinic Care Hub
            </h2>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-secondary text-primary border border-border/80">
              <Lock className="w-3 h-3" /> Privileged Vault
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Zero-trust audited medical registry, life-critical allergy protocols, and infirmary logs.
          </p>
        </div>

        <Button
          onClick={() => setShowAddVisit(true)}
          className="gap-1.5 bg-danger text-danger-foreground hover:bg-danger/90"
        >
          <UserPlus className="h-4 w-4" />
          Log Clinic Intake
        </Button>
      </div>

      {/* Critical Medical Protocols Banner */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 px-1">
          <AlertOctagon className="h-4 w-4 text-danger" /> Active Emergency Medical Protocols
        </h3>
        {alerts.length === 0 ? (
          <EmptyState
            type="no-data"
            title="No Active Emergency Medical Protocols"
            description="No critical student allergies or high-risk medical alerts currently recorded."
            icon={ShieldCheck}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {alerts.map((alert) => (
            <Card
              key={alert.id}
              className="border-danger/30 bg-danger/5 flex flex-col justify-between"
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{alert.studentName}</h4>
                    <span className="text-xs text-muted-foreground font-mono">{alert.grade}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-danger/10 text-danger border border-danger/20 uppercase tracking-wider">
                    {alert.severity.replace(/_/g, " ")}
                  </span>
                </div>

                <p className="text-xs font-semibold text-danger leading-relaxed">
                  {alert.description}
                </p>

                <div className="border-t border-danger/20 pt-2.5 text-[11px] text-muted-foreground space-y-1">
                  <p className="text-foreground leading-tight">
                    <span className="font-semibold text-foreground">Protocol:</span> {alert.actionProtocol}
                  </p>
                  <p className="flex items-center gap-1 text-primary pt-0.5 font-medium">
                    <PhoneCall className="h-3 w-3 shrink-0" /> {alert.emergencyContact}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>

      {/* Infirmary Visits Ledger */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Activity className="h-4 w-4 text-primary" /> Daily Infirmary & Clinic Activity
          </h3>
          <span className="text-xs text-muted-foreground">
            Total records: {visits.length}
          </span>
        </div>

        {visits.length === 0 ? (
          <EmptyState
            title="No clinic visits logged today"
            description="The infirmary log is clear for this session. Log an intake whenever a student reports with symptoms."
            actionLabel="Log Intake"
            onAction={() => setShowAddVisit(true)}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student & Timestamp</TableHead>
                <TableHead>Chief Complaint</TableHead>
                <TableHead>Treatment Provided</TableHead>
                <TableHead>Outcome</TableHead>
                <TableHead>Attending Nurse</TableHead>
                <TableHead>Parent Notified</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visits.map((vis) => (
                <TableRow key={vis.id}>
                  <TableCell>
                    <span className="font-semibold text-foreground block">{vis.studentName}</span>
                    <span className="text-xs text-muted-foreground font-mono">
                      {vis.grade} · {formatDateTime(vis.timestamp)}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate font-medium text-xs">
                    {vis.chiefComplaint}
                  </TableCell>
                  <TableCell className="max-w-[220px] truncate text-xs text-muted-foreground">
                    {vis.treatmentProvided}
                  </TableCell>
                  <TableCell>{getOutcomeBadge(vis.outcome)}</TableCell>
                  <TableCell className="text-xs text-foreground font-medium">
                    {vis.attendingNurseName}
                  </TableCell>
                  <TableCell>
                    {vis.parentNotified ? (
                      <span className="text-xs font-semibold text-success flex items-center gap-1">
                        <Check className="h-3.5 w-3.5" /> Notified
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Not Required</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Accessible Dialog for Clinic Intake */}
      <Dialog open={showAddVisit} onOpenChange={setShowAddVisit}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Log Clinic Intake Record</DialogTitle>
            <DialogDescription>
              Record student presentation at the school infirmary. This action is recorded in the zero-trust audit log.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddVisit} className="space-y-4 my-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Student Name *</label>
                <Input
                  required
                  placeholder="e.g. Devansh Singh"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Grade & Section</label>
                <Input
                  placeholder="e.g. Grade 6-A"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Chief Complaint / Symptoms *</label>
              <Input
                required
                placeholder="e.g. High fever, sprained wrist, nausea"
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Treatment Given / Medication Administered</label>
              <Input
                placeholder="e.g. Paracetamol 250mg, cold compress, rest in bed #3"
                value={treatment}
                onChange={(e) => setTreatment(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Encounter Outcome</label>
              <select
                value={outcome}
                onChange={(e) => setOutcome(e.target.value as ClinicVisit["outcome"])}
                className="w-full h-9 px-3 text-xs rounded-md border border-border bg-surface text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus cursor-pointer"
              >
                <option value="RETURNED_TO_CLASS">Returned to Class</option>
                <option value="PARENT_PICKUP">Parent Pickup</option>
                <option value="SENT_HOME">Sent Home</option>
                <option value="EMERGENCY_TRANSFER">Emergency Hospital Transfer</option>
              </select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setShowAddVisit(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-danger hover:bg-danger/90">
                Save Health Record
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function StudentHealthClinicHub(props: StudentHealthClinicHubProps = {}) {
  return (
    <ErrorBoundary fallbackTitle="Unable to load Student Health & Clinic Hub">
      <StudentHealthClinicHubContent {...props} />
    </ErrorBoundary>
  );
}
