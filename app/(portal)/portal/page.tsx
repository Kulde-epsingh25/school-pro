"use client";

import React from "react";
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  HeartHandshake, 
  Truck, 
  ShieldCheck, 
  Building2, 
  ArrowRight,
  Sparkles,
  Award,
  Calendar
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const PORTALS = [
  {
    title: "Student Academic Portal",
    badge: "Active Student",
    description: "Access class timetables, learning resource hub, assignments, roll-call attendance, and official report cards.",
    href: "/portal/student",
    icon: GraduationCap,
    color: "from-blue-600 to-indigo-600",
    links: [
      { name: "My Schedule", href: "/portal/student/timetable" },
      { name: "LMS Resources", href: "/portal/student/resources" },
      { name: "Assignments", href: "/portal/student/assignments" },
      { name: "Report Cards", href: "/portal/student/report-cards" }
    ]
  },
  {
    title: "Parent & Guardian Portal",
    badge: "Family Hub",
    description: "Monitor real-time morning attendance, message homeroom teachers, view fee receipts, and track academic progress.",
    href: "/portal/parent",
    icon: Users,
    color: "from-purple-600 to-indigo-700",
    links: [
      { name: "Family Overview", href: "/portal/parent" },
      { name: "Children Profiles", href: "/portal/parent/children" },
      { name: "Direct Messages", href: "/portal/parent/messages" },
      { name: "Tuition Fees", href: "/portal/parent/fees" }
    ]
  },
  {
    title: "Staff & Faculty Portal",
    badge: "Educators",
    description: "Access master teaching schedules, staff room announcements, student gradebook input, and lesson planning tools.",
    href: "/portal/teacher/timetable",
    icon: BookOpen,
    color: "from-teal-600 to-emerald-700",
    links: [
      { name: "Teaching Timetable", href: "/portal/teacher/timetable" },
      { name: "Staff Noticeboard", href: "/portal/teacher/noticeboard" },
      { name: "Gradebook", href: "/dashboard/academics/gradebook" },
      { name: "Lesson Plans", href: "/dashboard/academics/lesson-plans" }
    ]
  },
  {
    title: "Alumni Association",
    badge: "Graduates",
    description: "Global graduate networking directory, chapter reunion events, mentorship programs, and scholarship endowments.",
    href: "/portal/alumni",
    icon: HeartHandshake,
    color: "from-indigo-700 to-purple-800",
    links: [
      { name: "Alumni Directory", href: "/portal/alumni" },
      { name: "Reunions & Chapters", href: "/portal/alumni" },
      { name: "Endowment Fund", href: "/portal/alumni" }
    ]
  },
  {
    title: "Vendor & Contractor Portal",
    badge: "Procurement",
    description: "Track school-issued purchase orders, confirm campus deliveries, and submit tax invoices for fast payment processing.",
    href: "/portal/vendor",
    icon: Truck,
    color: "from-slate-700 to-slate-900",
    links: [
      { name: "Purchase Orders", href: "/portal/vendor" },
      { name: "Submit Invoices", href: "/portal/vendor" },
      { name: "Contractor Status", href: "/portal/vendor" }
    ]
  }
];

export default function UnifiedPortalHubPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 min-h-screen">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 border border-white/20 uppercase tracking-wider text-blue-200">
            <Sparkles className="h-3.5 w-3.5" /> Unified Institution Access
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            School Pro Community Portals
          </h1>
          <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
            Welcome to the centralized multi-persona access hub. Select your dedicated portal below to access personalized academic records, communication channels, and administrative workflows.
          </p>
        </div>
      </div>

      {/* Portals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PORTALS.map((portal, idx) => (
          <div key={idx} className="bg-card border rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-primary/40 transition">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${portal.color} text-white shadow-md`}>
                  <portal.icon className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-muted text-foreground">
                  {portal.badge}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-xl text-foreground">{portal.title}</h3>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  {portal.description}
                </p>
              </div>

              <div className="border-t pt-3 space-y-1.5">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Quick Navigation
                </span>
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  {portal.links.map((link, lIdx) => (
                    <Link
                      key={lIdx}
                      href={link.href}
                      className="text-xs text-foreground/80 hover:text-primary hover:underline flex items-center gap-1 font-medium py-1"
                    >
                      • {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link href={portal.href} className="w-full block">
                <Button className="w-full gap-2 rounded-xl text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow">
                  Enter Portal <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
