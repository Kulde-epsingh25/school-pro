"use client";

import React, { useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  AlertTriangle,
  Info,
  ShieldAlert,
  Clock,
  X,
  ExternalLink,
} from "lucide-react";
import { formatRelativeTime } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/feedback/status-badge";
import { cn } from "@/lib/utils";

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  category: "Critical" | "Warning" | "Action Required" | "Informational";
  timestamp: string | Date;
  read: boolean;
  link?: string;
}

const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: "notif-1",
    title: "Critical Student Allergy Alert",
    message: "Student Kabir Malhotra (Grade 4-B) reported to infirmary. Severe peanut allergy protocol active.",
    category: "Critical",
    timestamp: new Date(Date.now() - 1000 * 60 * 12),
    read: false,
    link: "/dashboard/students/health",
  },
  {
    id: "notif-2",
    title: "Purchase Order Pending Sign-Off",
    message: "PO-2026-089 for Oxford University Press ($1,115.00) requires Principal sign-off.",
    category: "Action Required",
    timestamp: new Date(Date.now() - 1000 * 60 * 65),
    read: false,
    link: "/dashboard/finance/procurement",
  },
  {
    id: "notif-3",
    title: "At-Risk Academic Early Warning",
    message: "Aditya Roy (Grade 10-A) attendance dropped below 70% threshold. Intervention recommended.",
    category: "Warning",
    timestamp: new Date(Date.now() - 1000 * 60 * 240),
    read: false,
    link: "/dashboard/analytics/ai-predictions",
  },
  {
    id: "notif-4",
    title: "Biometric Hardware Sync Completed",
    message: "All 14 biometric attendance turnstiles successfully synced with campus database.",
    category: "Informational",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
    read: true,
  },
];

export function NotificationCenter({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [notifications, setNotifications] = useState<SystemNotification[]>(INITIAL_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<string>("ALL");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const filtered = notifications.filter((n) => {
    if (activeFilter === "UNREAD") return !n.read;
    if (activeFilter !== "ALL") return n.category === activeFilter;
    return true;
  });

  const getCategoryBadge = (category: SystemNotification["category"]) => {
    switch (category) {
      case "Critical":
        return <StatusBadge status="danger" label="Critical" size="sm" icon={ShieldAlert} />;
      case "Warning":
        return <StatusBadge status="warning" label="Warning" size="sm" icon={AlertTriangle} />;
      case "Action Required":
        return <StatusBadge status="pending" label="Action Required" size="sm" icon={Clock} />;
      case "Informational":
        return <StatusBadge status="info" label="Info" size="sm" icon={Info} />;
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-overlay/50 backdrop-blur-2xs transition-opacity"
        onClick={() => onOpenChange(false)}
      />

      {/* Surface Drawer */}
      <div className="relative w-full max-w-md rounded-xl border border-border bg-surface shadow-2xl overflow-hidden z-50 flex flex-col max-h-[85vh] animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/80 bg-surface">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Notification Center</h3>
            {unreadCount > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-danger text-danger-foreground font-mono">
                {unreadCount} new
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </Button>
            )}
            <button
              onClick={() => onOpenChange(false)}
              className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-2.5 border-b border-border/60 bg-surface-muted/30 overflow-x-auto text-xs">
          {["ALL", "UNREAD", "Critical", "Action Required"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap",
                activeFilter === filter
                  ? "bg-surface text-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-border/60 p-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              No notifications matching current filter.
            </div>
          ) : (
            filtered.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={cn(
                  "p-3.5 space-y-1.5 hover:bg-muted/30 transition-colors cursor-pointer rounded-lg",
                  !notif.read && "bg-primary/5"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    )}
                    <h4 className="text-xs font-semibold text-foreground leading-tight">
                      {notif.title}
                    </h4>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono shrink-0">
                    {formatRelativeTime(notif.timestamp)}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed pl-4">
                  {notif.message}
                </p>

                <div className="flex items-center justify-between pl-4 pt-1">
                  {getCategoryBadge(notif.category)}
                  {notif.link && (
                    <a
                      href={notif.link}
                      className="text-[11px] font-medium text-primary hover:underline flex items-center gap-1"
                    >
                      View Record <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
