"use client"

import { useState } from "react"
import type { LucideIcon } from "lucide-react"
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
} from "lucide-react"

const ACCENT = "#dd5036"

type Feature = {
  icon: LucideIcon
  label: string
}

type Tab = {
  id: string
  label: string
  icon: LucideIcon
  title: string
  description: string
  panelTitle: string
  features: Feature[]
}

const tabs: Tab[] = [
  {
    id: "students",
    label: "Student Management",
    icon: Users,
    title: "Manage Every Student In One Place",
    description:
      "Keep complete student profiles, enrollment data, and well-being records organized so your team can act with confidence.",
    panelTitle: "Student Overview",
    features: [
      { icon: UserPlus, label: "Streamlined Admissions" },
      { icon: LineChart, label: "Academic Progress Tracking" },
      { icon: HeartPulse, label: "Health & Wellness Records" },
      { icon: CalendarCheck, label: "Attendance Monitoring" },
    ],
  },
  {
    id: "academics",
    label: "Academics",
    icon: GraduationCap,
    title: "Run Your Academics With Precision",
    description:
      "Plan curricula, build timetables, and deliver report cards from a single connected academic workspace.",
    panelTitle: "Academic Center",
    features: [
      { icon: BookOpenCheck, label: "Curriculum Planning" },
      { icon: CalendarDays, label: "Class Scheduling" },
      { icon: FileText, label: "Report Cards & Grades" },
      { icon: ClipboardList, label: "Assignments & Exams" },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    icon: DollarSign,
    title: "Simplify Tuition And Finances",
    description:
      "Collect payments, issue invoices, and track every transaction with clear, real-time financial reporting.",
    panelTitle: "Payment Center",
    features: [
      { icon: CreditCard, label: "Online Payments" },
      { icon: Receipt, label: "Automated Invoicing" },
      { icon: BadgePercent, label: "Scholarships & Discounts" },
      { icon: PieChart, label: "Financial Reports" },
    ],
  },
  {
    id: "communication",
    label: "Communication",
    icon: MessageSquare,
    title: "Connect With Your Whole Community",
    description:
      "Reach parents, students, and staff instantly through unified messaging, notifications, and emergency alerts.",
    panelTitle: "Message Center",
    features: [
      { icon: Mail, label: "Email Campaigns" },
      { icon: MessageCircle, label: "SMS Messaging" },
      { icon: Bell, label: "Push Notifications" },
      { icon: Siren, label: "Emergency Alerts" },
    ],
  },
]

export function TabbedFeatures() {
  const [activeId, setActiveId] = useState(tabs[0].id)
  const active = tabs.find((t) => t.id === activeId) ?? tabs[0]

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
      {/* Tab bar */}
      <div className="rounded-2xl border border-border bg-card/60 p-3 shadow-sm">
        <div
          role="tablist"
          aria-label="Platform features"
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
        >
          {tabs.map((tab) => {
            const TabIcon = tab.icon
            const isActive = tab.id === activeId
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                id={`tab-${tab.id}`}
                onClick={() => setActiveId(tab.id)}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-border bg-background text-foreground shadow-sm"
                    : "border-transparent text-muted-foreground hover:bg-background/60 hover:text-foreground"
                }`}
              >
                <TabIcon
                  className="size-4"
                  style={isActive ? { color: ACCENT } : undefined}
                  aria-hidden="true"
                />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Panel */}
      <div
        role="tabpanel"
        id={`panel-${active.id}`}
        aria-labelledby={`tab-${active.id}`}
        className="mt-4 rounded-2xl border border-border bg-muted/40 p-6 sm:p-10"
      >
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Left: copy */}
          <div>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground">{active.title}</h2>
            <p className="mt-4 max-w-md text-pretty leading-relaxed text-muted-foreground">{active.description}</p>

            <ul className="mt-8 flex flex-col gap-4">
              {active.features.map((feature) => (
                <li key={feature.label} className="flex items-center gap-3">
                  <CheckCircle2 className="size-5 shrink-0" style={{ color: ACCENT }} aria-hidden="true" />
                  <span className="text-foreground">{feature.label}</span>
                </li>
              ))}
            </ul>

            <button
              className="group mt-10 inline-flex items-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-semibold text-background shadow-sm transition-transform hover:-translate-y-0.5"
            >
              Learn more about {active.label.toLowerCase()}
              <span className="sr-only"> about {active.label.toLowerCase()}</span>
              <span className="sr-only">{active.label}</span>
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                style={{ color: ACCENT }}
                aria-hidden="true"
              />
            </button>
          </div>

          {/* Right: preview mockup */}
          <div className="rounded-2xl border border-border bg-card p-3 shadow-lg sm:p-4">
            <div className="rounded-xl border border-border/60 bg-background p-5">
              <p className="text-sm font-semibold text-foreground">{active.panelTitle}</p>

              <div className="mt-4 flex flex-col gap-3">
                {active.features.map((feature, i) => {
                  const FeatureIcon = feature.icon
                  const isPrimary = i === 0
                  const isFaded = i === active.features.length - 1
                  return (
                    <div 
                      key={feature.label}
                      className={`flex items-center justify-between rounded-lg border px-4 py-3 transition-colors ${
                        isPrimary ? "border-border bg-card shadow-sm" : "border-border/60 bg-muted/40"
                      } ${isFaded ? "opacity-60" : ""}`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="flex size-8 items-center justify-center rounded-md"
                          style={{
                            backgroundColor: isPrimary ? `${ACCENT}1a` : undefined,
                            color: isPrimary ? ACCENT : undefined,
                          }}
                        >
                          <FeatureIcon
                            className={`size-4 ${isPrimary ? "" : "text-muted-foreground"}`}
                            aria-hidden="true"
                          />
                        </span>
                        <span className="text-sm font-medium text-foreground">{feature.label}</span>
                      </div>
                      <ChevronRight className="size-4 text-muted-foreground" aria-hidden="true" />
                    </div>
                  )
                })}
              </div>

              <div className="mt-4 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-6 text-sm text-muted-foreground">
                Configure {active.label.toLowerCase()} settings…
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
