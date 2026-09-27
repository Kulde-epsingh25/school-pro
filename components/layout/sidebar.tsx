"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  ShieldCheck,
  Stethoscope,
  HeartHandshake,
  DollarSign,
  Package,
  BookOpen,
  Calendar,
  Award,
  Bus,
  Home,
  FileText,
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
  ShieldAlert,
  Server,
  Layers,
  ChevronLeft,
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
  roleRequired?: string; // e.g. "saas_super_admin"
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
      { title: "Gradebook", href: "/dashboard/academics/gradebook" },
    ],
  },
  {
    title: "Specialty Care & Health",
    icon: Stethoscope,
    items: [
      { title: "Clinic & Infirmary", href: "/dashboard/students/health", badge: "Vault" },
      { title: "Counseling & Interventions", href: "/dashboard/students/counseling" },
    ],
  },
  {
    title: "Finance & Supply Chain",
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
      { title: "Hostel & Boarding", href: "/dashboard/hostel" },
    ],
  },
  {
    title: "Institution Admin",
    icon: ShieldCheck,
    items: [
      { title: "User Accounts", href: "/admin/users" },
      { title: "Roles & 4D RBAC", href: "/admin/roles" },
      { title: "Delegated Privileges", href: "/admin/roles/delegations" },
      { title: "Immutable Audit Logs", href: "/admin/audit" },
      { title: "Campus Settings", href: "/admin/settings" },
    ],
  },
  {
    title: "SaaS Platform Admin",
    icon: Server,
    roleRequired: "saas_super_admin", // Strictly hidden from tenant super admins!
    items: [
      { title: "Platform Cloud Health", href: "/saas-admin" },
      { title: "Tenant Directory", href: "/saas-admin/tenants" },
      { title: "Subscription Plans", href: "/saas-admin/billing" },
      { title: "Feature Flags", href: "/saas-admin/feature-flags" },
      { title: "Global Security Audit", href: "/saas-admin/audit" },
    ],
  },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const [collapsed, setCollapsed] = useState(false);
  // Auto-collapse accordion: tracks exactly one expanded section title
  const [expandedSection, setExpandedSection] = useState<string | null>("Academic Operations");

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
    <aside
      className={cn(
        "flex flex-col h-screen border-r border-border/80 bg-surface transition-all duration-200 select-none z-30 shrink-0",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-border/80">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-black text-sm shadow-xs">
              SP
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-foreground leading-none">
                School Pro
              </span>
              <span className="text-[10px] text-muted-foreground font-mono mt-0.5">
                v2.0 Enterprise
              </span>
            </div>
          </Link>
        )}
        {collapsed && (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-black text-sm">
            SP
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Tenant Switcher Context */}
      {!collapsed && (
        <div className="p-3 border-b border-border/60">
          <TenantSwitcher className="w-full" />
        </div>
      )}

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1.5">
        {NAV_SECTIONS.filter((section) => {
          if (section.roleRequired === "saas_super_admin" && !isSaaSSuperAdmin) {
            return false;
          }
          return true;
        }).map((section) => {
          const Icon = section.icon;
          const isExpanded = expandedSection === section.title && !collapsed;
          const hasActiveRoute = section.items.some(
            (item) => pathname === item.href || pathname?.startsWith(item.href + "/")
          );

          return (
            <div key={section.title} className="space-y-1">
              <button
                onClick={() => {
                  if (collapsed) setCollapsed(false);
                  toggleSection(section.title);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer",
                  hasActiveRoute
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  {!collapsed && <span className="truncate">{section.title}</span>}
                </div>
                {!collapsed && (
                  isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  )
                )}
              </button>

              {/* Accordion Submenu Items */}
              {isExpanded && !collapsed && (
                <div className="pl-6 space-y-0.5 border-l border-border/60 ml-4 py-1">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                        )}
                      >
                        <span className="truncate">{item.title}</span>
                        {item.badge && (
                          <span
                            className={cn(
                              "text-[10px] px-1.5 py-0.2 rounded font-semibold",
                              isActive
                                ? "bg-primary-foreground/20 text-primary-foreground"
                                : "bg-secondary text-primary"
                            )}
                          >
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

      {/* User Footer Profile & Logout */}
      <div className="p-3 border-t border-border/80 bg-surface-muted/30">
        {!collapsed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0">
                {user?.name?.slice(0, 2).toUpperCase() || "AD"}
              </div>
              <div className="flex flex-col min-w-0 truncate">
                <span className="text-xs font-semibold text-foreground truncate">
                  {user?.name || "Administrator"}
                </span>
                <span className="text-[10px] text-muted-foreground truncate capitalize">
                  {userRoles[0]?.replace("_", " ") || "Super Admin"}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-md text-muted-foreground hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer"
              title="Sign out of School Pro"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="w-full flex justify-center p-1.5 rounded-md text-muted-foreground hover:text-danger hover:bg-danger/10 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
}
