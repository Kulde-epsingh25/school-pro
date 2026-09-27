"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  GraduationCap,
  Stethoscope,
  DollarSign,
  Bus,
  ShieldCheck,
  Server,
  ChevronDown,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { TenantSwitcher } from "./tenant-switcher";
import { cn } from "@/lib/utils";

interface NavSubItem {
  title: string;
  href: string;
  badge?: string;
}

interface NavSection {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  roleRequired?: string;
  items: NavSubItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Academic Operations",
    icon: GraduationCap,
    items: [
      { title: "Academic Overview", href: "/dashboard" },
      { title: "At-Risk AI Predictor", href: "/dashboard/analytics/ai-predictions", badge: "AI" },
      { title: "Students Directory", href: "/dashboard/students" },
      { title: "Admissions Pipeline", href: "/dashboard/students/admissions" },
      { title: "Classes & Timetable", href: "/dashboard/academics/classes" },
      { title: "Examinations", href: "/dashboard/academics/exams" },
    ],
  },
  {
    title: "Specialty Care & Health",
    icon: Stethoscope,
    items: [
      { title: "Clinic & Infirmary", href: "/dashboard/students/health", badge: "Vault" },
      { title: "Counseling & Notes", href: "/dashboard/students/counseling" },
    ],
  },
  {
    title: "Finance & Operations",
    icon: DollarSign,
    items: [
      { title: "Fee Collection", href: "/dashboard/finance/fees" },
      { title: "Procurement & Assets", href: "/dashboard/finance/procurement" },
      { title: "Payroll Ledger", href: "/dashboard/finance/payroll" },
    ],
  },
  {
    title: "Campus Facilities",
    icon: Bus,
    items: [
      { title: "Transport Fleet & GPS", href: "/dashboard/transport" },
      { title: "Library Catalog", href: "/dashboard/library" },
      { title: "Hostel & Rooms", href: "/dashboard/hostel" },
    ],
  },
  {
    title: "Institution Admin",
    icon: ShieldCheck,
    items: [
      { title: "User Accounts", href: "/admin/users" },
      { title: "Roles & 4D RBAC", href: "/admin/roles" },
      { title: "Audit Trail", href: "/admin/audit" },
      { title: "Campus Settings", href: "/admin/settings" },
    ],
  },
  {
    title: "SaaS Platform Admin",
    icon: Server,
    roleRequired: "saas_super_admin",
    items: [
      { title: "Platform Overview", href: "/saas-admin" },
      { title: "Tenant Directory", href: "/saas-admin/tenants" },
      { title: "Subscription Plans", href: "/saas-admin/billing" },
      { title: "Global Security Audit", href: "/saas-admin/audit" },
    ],
  },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>("Academic Operations");
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const userRoles = user?.roles || ["super_admin"];
  const isSaaSSuperAdmin = userRoles.includes("saas_super_admin");

  const toggleSection = (title: string) => {
    setExpandedSection((prev) => (prev === title ? null : title));
  };

  const handleLogout = () => {
    clearAuth();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  return (
    <div className="md:hidden">
      {/* Mobile Menu Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
        aria-label="Open mobile navigation menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Slide-over Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-overlay backdrop-blur-xs transition-opacity"
            onClick={() => setOpen(false)}
          />

          {/* Drawer Surface */}
          <div className="relative flex flex-col w-72 max-w-[85vw] h-full bg-surface border-r border-border shadow-2xl z-50 animate-in slide-in-from-left duration-200">
            {/* Header */}
            <div className="flex items-center justify-between h-14 px-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground font-black text-xs">
                  SP
                </div>
                <span className="font-bold text-sm text-foreground">School Pro</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tenant Context */}
            <div className="p-3 border-b border-border/70">
              <TenantSwitcher className="w-full" />
            </div>

            {/* Nav Items */}
            <nav className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1.5">
              {NAV_SECTIONS.filter((section) => {
                if (section.roleRequired === "saas_super_admin" && !isSaaSSuperAdmin) {
                  return false;
                }
                return true;
              }).map((section) => {
                const Icon = section.icon;
                const isExpanded = expandedSection === section.title;

                return (
                  <div key={section.title} className="space-y-1">
                    <button
                      onClick={() => toggleSection(section.title)}
                      className="w-full min-h-[44px] flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-primary shrink-0" />
                        <span>{section.title}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="pl-6 space-y-1 border-l border-border/60 ml-4 py-1">
                        {section.items.map((item) => {
                          const isActive = pathname === item.href;
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setOpen(false)}
                              className={cn(
                                "min-h-[40px] flex items-center justify-between px-3 py-2 rounded-md text-xs transition-colors",
                                isActive
                                  ? "bg-primary text-primary-foreground font-semibold"
                                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                              )}
                            >
                              <span className="truncate">{item.title}</span>
                              {item.badge && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-secondary text-primary">
                                  {item.badge}
                                </span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-3 border-t border-border bg-surface-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0">
                  {user?.name?.slice(0, 2).toUpperCase() || "AD"}
                </div>
                <div className="flex flex-col min-w-0 truncate">
                  <span className="text-xs font-semibold text-foreground truncate">
                    {user?.name || "Administrator"}
                  </span>
                  <span className="text-[10px] text-muted-foreground truncate">
                    {userRoles[0]?.replace("_", " ") || "Super Admin"}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-md text-muted-foreground hover:text-danger"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
