"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  GraduationCap,
  Users,
  Stethoscope,
  Building,
  DollarSign,
  ShieldCheck,
  Server,
  FileText,
  Settings,
  X,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

interface CommandItem {
  id: string;
  title: string;
  category: "Navigation" | "Academics" | "Administration" | "Actions";
  href?: string;
  action?: () => void;
  icon: React.ComponentType<{ className?: string }>;
  roleRequired?: string;
}

const COMMAND_ITEMS: CommandItem[] = [
  {
    id: "nav-dash",
    title: "Go to Executive Dashboard",
    category: "Navigation",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "nav-atrisk",
    title: "Open At-Risk AI Predictor",
    category: "Academics",
    href: "/dashboard/analytics/ai-predictions",
    icon: GraduationCap,
  },
  {
    id: "nav-students",
    title: "Browse Students Directory",
    category: "Academics",
    href: "/dashboard/students",
    icon: Users,
  },
  {
    id: "nav-admissions",
    title: "Open Admissions Kanban Pipeline",
    category: "Academics",
    href: "/dashboard/students/admissions",
    icon: BookOpen,
  },
  {
    id: "nav-clinic",
    title: "Access Student Health & Clinic Hub",
    category: "Navigation",
    href: "/dashboard/students/health",
    icon: Stethoscope,
  },
  {
    id: "nav-procurement",
    title: "Open Fixed Assets & Procurement",
    category: "Navigation",
    href: "/dashboard/finance/procurement",
    icon: Building,
  },
  {
    id: "nav-fees",
    title: "Manage Fee Collection & Ledgers",
    category: "Navigation",
    href: "/dashboard/finance/fees",
    icon: DollarSign,
  },
  {
    id: "nav-roles",
    title: "Manage Roles & 4D RBAC Matrix",
    category: "Administration",
    href: "/admin/roles",
    icon: ShieldCheck,
  },
  {
    id: "nav-users",
    title: "User Accounts & Delegations",
    category: "Administration",
    href: "/admin/users",
    icon: Users,
  },
  {
    id: "nav-saas",
    title: "SaaS Platform Operations",
    category: "Administration",
    href: "/saas-admin",
    icon: Server,
    roleRequired: "saas_super_admin",
  },
  {
    id: "act-theme",
    title: "Toggle Visual Theme (Light / Dark)",
    category: "Actions",
    action: () => {
      document.documentElement.classList.toggle("dark");
    },
    icon: Settings,
  },
];

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isSaaSAdmin = user?.roles?.includes("saas_super_admin");

  const filteredCommands = COMMAND_ITEMS.filter((item) => {
    if (item.roleRequired === "saas_super_admin" && !isSaaSAdmin) {
      return false;
    }
    if (!query) return true;
    return (
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    );
  });

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (!open) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onOpenChange(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev === 0 ? Math.max(0, filteredCommands.length - 1) : prev - 1
        );
      } else if (e.key === "Enter" && filteredCommands[selectedIndex]) {
        e.preventDefault();
        executeCommand(filteredCommands[selectedIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, selectedIndex, filteredCommands, onOpenChange]);

  const executeCommand = (item: CommandItem) => {
    onOpenChange(false);
    if (item.action) {
      item.action();
    } else if (item.href) {
      router.push(item.href);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-overlay backdrop-blur-xs transition-opacity"
        onClick={() => onOpenChange(false)}
      />

      {/* Surface */}
      <div className="relative w-full max-w-xl rounded-xl border border-border bg-surface shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-border/80">
          <Search className="w-4 h-4 text-muted-foreground shrink-0 mr-3" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-12 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-muted/50 px-1.5 font-mono text-[10px] text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto custom-scrollbar p-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No matching commands or destinations found.
            </div>
          ) : (
            filteredCommands.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => executeCommand(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-lg text-xs cursor-pointer transition-colors",
                    isSelected
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-foreground hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={cn("w-4 h-4 shrink-0", isSelected ? "text-primary-foreground" : "text-muted-foreground")} />
                    <span className="truncate">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={cn(
                        "text-[10px] uppercase font-mono px-1.5 py-0.5 rounded",
                        isSelected
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {item.category}
                    </span>
                    {isSelected && <ArrowRight className="w-3.5 h-3.5" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Keyboard Helper Footer */}
        <div className="px-4 py-2 bg-surface-muted/50 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="font-mono text-[10px]">School Pro Command Center</span>
        </div>
      </div>
    </div>
  );
}
