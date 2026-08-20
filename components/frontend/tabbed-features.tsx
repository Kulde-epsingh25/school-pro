"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Users,
  GraduationCap,
  DollarSign,
  MessageSquare,
  UserPlus,
  LineChart,
  HeartPulse,
  CalendarCheck,
  BookOpenCheck,
  CalendarDays,
  FileText,
  ClipboardList,
  CreditCard,
  Receipt,
  BadgePercent,
  PieChart,
  Mail,
  MessageCircle,
  Bell,
  Siren,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

type Feature = {
  icon: LucideIcon;
  label: string;
  detail: string;
};

type Tab = {
  id: string;
  label: string;
  icon: LucideIcon;
  title: string;
  description: string;
  panelTitle: string;
  href: string;
  features: Feature[];
};

const tabs: Tab[] = [
  {
    id: "students",
    label: "Student Management",
    icon: Users,
    title: "Manage Every Student In One Place",
    description:
      "Keep complete student profiles, enrollment data, health records, and academic trajectory organized so your team can act with speed.",
    panelTitle: "Student Overview",
    href: "/how-it-works",
    features: [
      { icon: UserPlus, label: "Streamlined Admissions", detail: "Online enrollment forms & auto-generated student IDs" },
      { icon: LineChart, label: "Academic Progress Tracking", detail: "Real-time grading curves and transcript export" },
      { icon: HeartPulse, label: "Health & Wellness Records", detail: "Immunization logs, dietary alerts, and medical notes" },
      { icon: CalendarCheck, label: "Attendance Monitoring", detail: "Instant RFID and manual roll-call sync" },
    ],
  },
  {
    id: "academics",
    label: "Academics",
    icon: GraduationCap,
    title: "Run Your Academics With Precision",
    description:
      "Plan curricula, build timetables, manage examinations, and deliver official digital report cards from a single connected workspace.",
    panelTitle: "Academic Center",
    href: "/how-it-works",
    features: [
      { icon: BookOpenCheck, label: "Curriculum Planning", detail: "Syllabus mapping across terms and streams" },
      { icon: CalendarDays, label: "Class Scheduling", detail: "Conflict-free room and teacher timetable engine" },
      { icon: FileText, label: "Report Cards & Grades", detail: "Automated weighted grading with PDF generator" },
      { icon: ClipboardList, label: "Assignments & Exams", detail: "Online homework submissions and seating arrangements" },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    icon: DollarSign,
    title: "Simplify Tuition And Institutional Finances",
    description:
      "Collect tuition fees online, issue itemized invoices, and track every transaction with transparent, real-time financial reporting.",
    panelTitle: "Payment Center",
    href: "/pricing",
    features: [
      { icon: CreditCard, label: "Online Fee Payments", detail: "Card, bank transfer, and mobile money gateways" },
      { icon: Receipt, label: "Automated Invoicing", detail: "Multi-child ledger and scheduled billing cycles" },
      { icon: BadgePercent, label: "Scholarships & Discounts", detail: "Merit and need-based fee waivers" },
      { icon: PieChart, label: "Financial Reports", detail: "Real-time cashflow, balances, and audit logs" },
    ],
  },
  {
    id: "communication",
    label: "Communication",
    icon: MessageSquare,
    title: "Connect With Your Whole School Community",
    description:
      "Reach parents, students, and staff instantly through unified multi-channel messaging, SMS broadcast alerts, and digital notice boards.",
    panelTitle: "Message Center",
    href: "/portal",
    features: [
      { icon: Mail, label: "Email Broadcasts", detail: "Targeted school announcements and newsletters" },
      { icon: MessageCircle, label: "SMS Messaging", detail: "Urgent bus delays and fee due alerts" },
      { icon: Bell, label: "Push Notifications", detail: "Direct mobile app alerts for parents and teachers" },
      { icon: Siren, label: "Emergency Broadcasts", detail: "One-click campus safety alerts" },
    ],
  },
];

export function TabbedFeatures() {
  const [activeId, setActiveId] = useState(tabs[0].id);
  const [selectedSubFeature, setSelectedSubFeature] = useState<number>(0);
  const active = tabs.find((t) => t.id === activeId) ?? tabs[0];

  const handleTabChange = (id: string) => {
    setActiveId(id);
    setSelectedSubFeature(0);
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
      {/* Tab bar */}
      <div className="rounded-2xl border border-border bg-card/60 p-2 shadow-sm">
        <div
          role="tablist"
          aria-label="Platform features"
          className="flex flex-wrap items-center justify-center gap-2"
        >
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = tab.id === activeId;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                id={`tab-${tab.id}`}
                onClick={() => handleTabChange(tab.id)}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground shadow-sm font-bold"
                    : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <TabIcon className="size-4" aria-hidden="true" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Panel */}
      <div
        role="tabpanel"
        id={`panel-${active.id}`}
        aria-labelledby={`tab-${active.id}`}
        className="mt-4 rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-sm"
      >
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Left: copy */}
          <div className="space-y-6">
            <div>
              <h2 className="text-balance text-3xl font-extrabold tracking-tight text-foreground">{active.title}</h2>
              <p className="mt-3 text-pretty text-base leading-relaxed text-muted-foreground">{active.description}</p>
            </div>

            <ul className="space-y-3.5 pt-2">
              {active.features.map((feature, idx) => (
                <li key={feature.label} className="flex items-start gap-3">
                  <CheckCircle2 className="size-5 shrink-0 text-primary mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="text-sm font-bold text-foreground">{feature.label}</span>
                    <p className="text-xs text-muted-foreground">{feature.detail}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <Link href={active.href}>
                <button
                  className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
                >
                  Explore {active.label} Features
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </button>
              </Link>
            </div>
          </div>

          {/* Right: interactive preview mockup */}
          <div className="rounded-2xl border border-border bg-muted/40 p-4 shadow-sm">
            <div className="rounded-xl border bg-card p-5 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <p className="text-sm font-bold text-foreground">{active.panelTitle}</p>
                <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  Live Module Interactive
                </span>
              </div>

              <div className="flex flex-col gap-2.5">
                {active.features.map((feature, i) => {
                  const FeatureIcon = feature.icon;
                  const isSelected = selectedSubFeature === i;
                  return (
                    <button
                      key={feature.label}
                      type="button"
                      onClick={() => setSelectedSubFeature(i)}
                      className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/30"
                          : "border-border/70 bg-background hover:bg-muted/60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex size-8 items-center justify-center rounded-lg ${
                            isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <FeatureIcon className="size-4" aria-hidden="true" />
                        </span>
                        <div>
                          <span className={`text-sm font-semibold block ${isSelected ? "text-primary" : "text-foreground"}`}>
                            {feature.label}
                          </span>
                          <span className="text-[11px] text-muted-foreground">{feature.detail}</span>
                        </div>
                      </div>
                      <ChevronRight className={`size-4 transition-transform ${isSelected ? "text-primary translate-x-0.5" : "text-muted-foreground"}`} aria-hidden="true" />
                    </button>
                  );
                })}
              </div>

              <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 px-4 py-3 text-xs text-muted-foreground flex items-center justify-between">
                <span>Active Sub-module: <strong className="text-foreground">{active.features[selectedSubFeature].label}</strong></span>
                <Link href={active.href} className="text-primary font-semibold hover:underline">
                  Configure →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
