"use client";

import React from "react";
import { formatRelativeTime } from "@/lib/formatters";
import { LucideIcon, CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  timestamp: string | Date;
  actor?: string;
  icon?: LucideIcon;
  badge?: string;
  type?: "default" | "success" | "warning" | "danger" | "info";
}

export interface ActivityTimelineProps {
  events: TimelineEvent[];
  className?: string;
}

const typeStyles: Record<string, { dot: string; bg: string }> = {
  default: { dot: "text-muted-foreground", bg: "bg-muted" },
  success: { dot: "text-success", bg: "bg-success/10" },
  warning: { dot: "text-warning-foreground dark:text-warning", bg: "bg-warning/10" },
  danger: { dot: "text-danger", bg: "bg-danger/10" },
  info: { dot: "text-info", bg: "bg-info/10" },
};

export function ActivityTimeline({ events, className }: ActivityTimelineProps) {
  if (!events || events.length === 0) {
    return (
      <div className="py-6 text-center text-xs text-muted-foreground">
        No recent activity logged for this entity.
      </div>
    );
  }

  return (
    <div className={cn("relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/80", className)}>
      {events.map((event) => {
        const Icon = event.icon || CircleDot;
        const style = typeStyles[event.type || "default"];

        return (
          <div key={event.id} className="relative group">
            {/* Timeline Icon Node */}
            <div
              className={cn(
                "absolute -left-6 top-0 flex h-4.5 w-4.5 items-center justify-center rounded-full border border-border bg-surface ring-4 ring-background",
                style.dot
              )}
            >
              <Icon className="h-2.5 w-2.5" />
            </div>

            {/* Event Body */}
            <div className="flex flex-col space-y-0.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-foreground leading-tight">
                  {event.title}
                </span>
                <span className="text-[11px] text-muted-foreground font-mono shrink-0">
                  {formatRelativeTime(event.timestamp)}
                </span>
              </div>

              {event.description && (
                <p className="text-xs text-muted-foreground leading-relaxed pt-0.5">
                  {event.description}
                </p>
              )}

              {event.actor && (
                <span className="text-[10px] text-muted-foreground pt-0.5">
                  By: <strong className="font-medium text-foreground">{event.actor}</strong>
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
