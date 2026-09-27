import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export type StatusType = "success" | "warning" | "danger" | "info" | "neutral" | "pending" | "processing";

interface StatusBadgeProps {
  status: StatusType;
  label: string;
  icon?: LucideIcon;
  size?: "sm" | "md";
  className?: string;
}

const statusStyles: Record<StatusType, string> = {
  success: "bg-success/10 text-success border-success/30",
  warning: "bg-warning/10 text-warning-foreground dark:text-warning border-warning/30",
  danger: "bg-danger/10 text-danger border-danger/30",
  info: "bg-info/10 text-info border-info/30",
  neutral: "bg-muted text-muted-foreground border-border",
  pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
  processing: "bg-primary/10 text-primary border-primary/30",
};

export function StatusBadge({
  status,
  label,
  icon: Icon,
  size = "md",
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium border rounded-full transition-colors select-none",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs",
        statusStyles[status],
        className
      )}
    >
      {Icon && <Icon className={cn("shrink-0", size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5")} />}
      <span>{label}</span>
    </span>
  );
}
