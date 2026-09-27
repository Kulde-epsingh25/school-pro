"use client";

import React, { useState } from "react";
import { Search, Bell, Moon, Sun, HelpCircle, Shield } from "lucide-react";
import { Breadcrumbs, BreadcrumbItem } from "./breadcrumbs";
import { NotificationCenter } from "@/components/feedback/notification-center";
import { MobileNav } from "./mobile-nav";
import { cn } from "@/lib/utils";

interface HeaderProps {
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
  onOpenCommandPalette?: () => void;
}

export function Header({
  breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }],
  className,
  onOpenCommandPalette,
}: HeaderProps) {
  const [isDark, setIsDark] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [unreadCount] = useState(3);

  const toggleTheme = () => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark");
      setIsDark(!isDark);
    }
  };

  return (
    <>
      <header
        className={cn(
          "h-14 px-4 sm:px-6 flex items-center justify-between border-b border-border/80 bg-surface/80 backdrop-blur-xs sticky top-0 z-20 shrink-0",
          className
        )}
      >
        {/* Left: Mobile Nav Drawer Trigger & Breadcrumbs Hierarchy */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <MobileNav />
          <Breadcrumbs items={breadcrumbs} />
        </div>

        {/* Center: Command Palette Trigger */}
        <div className="hidden md:flex items-center max-w-sm w-full mx-4">
          <button
            onClick={onOpenCommandPalette}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-md border border-border bg-surface-muted/60 text-muted-foreground text-xs hover:border-primary/50 hover:bg-surface-muted transition-colors cursor-pointer"
            aria-label="Open global search (Command + K)"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Search students, staff, modules, fee ledgers...</span>
            </div>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 rounded border border-border bg-surface px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
        </div>

        {/* Right: Quick Context, Alerts, Theme, Help */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Academic Session Badge */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary text-[11px] font-medium text-secondary-foreground border border-border/70 select-none">
            <Shield className="w-3 h-3 text-primary" />
            <span>AY 2026–27 · Term 1</span>
          </div>

          {/* Notifications Trigger */}
          <button
            onClick={() => setNotificationOpen(true)}
            className="relative p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
            aria-label={`Notifications, ${unreadCount} unread`}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-danger"></span>
              </span>
            )}
          </button>

          {/* Dark/Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
            aria-label="Toggle visual theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-warning" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Help / Institutional Documentation */}
          <button
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
            aria-label="Help and Documentation"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Slide-in Notification Center */}
      <NotificationCenter
        open={notificationOpen}
        onOpenChange={setNotificationOpen}
      />
    </>
  );
}
