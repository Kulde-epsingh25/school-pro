"use client";

import React, { useState } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { BreadcrumbItem } from "./breadcrumbs";
import { CommandPalette } from "@/components/navigation/command-palette";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function AppShell({
  children,
  breadcrumbs,
  title,
  description,
  actions,
  className,
}: AppShellProps) {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Global Command Palette */}
      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
      />

      {/* Universal Institutional Sidebar */}
      <Sidebar className="no-print" />

      {/* Main View Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header
          breadcrumbs={breadcrumbs}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          className="no-print"
        />

        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8">
          {/* Optional Consistent Page Header */}
          {(title || actions) && (
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-border/60">
              <div>
                {title && (
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                )}
              </div>
              {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
            </div>
          )}

          {/* Dynamic Page Content */}
          <div className={cn("space-y-6 max-w-7xl mx-auto", className)}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
