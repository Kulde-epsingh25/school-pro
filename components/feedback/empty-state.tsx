import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Inbox, SearchX, Plus, RefreshCw, LucideIcon } from "lucide-react";

export interface EmptyStateProps {
  type?: "empty" | "no-results" | "error" | "no-data";
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  action?: {
    label: string;
    onClick?: () => void;
  };
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export function EmptyState({
  type = "empty",
  title,
  description,
  icon: CustomIcon,
  actionLabel,
  onAction,
  action,
  secondaryActionLabel,
  onSecondaryAction,
  className,
}: EmptyStateProps) {
  const effectiveActionLabel = action?.label || actionLabel;
  const effectiveOnAction = action?.onClick || onAction;
  const Icon = CustomIcon
    ? CustomIcon
    : type === "no-results"
    ? SearchX
    : Inbox;

  const defaultTitle =
    type === "no-results"
      ? "No matching records found"
      : type === "error"
      ? "Unable to load data"
      : "No records yet";

  const defaultDescription =
    type === "no-results"
      ? "No records matched your search query or active filters. Try refining or resetting filters."
      : type === "error"
      ? "A network error or service interruption occurred while fetching this data."
      : "There are currently no items in this section. Get started by creating the first record.";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-lg border border-dashed border-border/80 bg-surface/50",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/60 text-muted-foreground mb-4">
        <Icon className="h-6 w-6" />
      </div>
      <h4 className="text-base font-semibold text-foreground tracking-tight">
        {title || defaultTitle}
      </h4>
      <p className="mt-1.5 text-xs text-muted-foreground max-w-sm leading-relaxed">
        {description || defaultDescription}
      </p>

      {(effectiveActionLabel || secondaryActionLabel) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {effectiveActionLabel && (
            <Button size="sm" onClick={effectiveOnAction} className="gap-1.5">
              {type === "no-results" ? (
                <RefreshCw className="w-3.5 h-3.5" />
              ) : (
                <Plus className="w-3.5 h-3.5" />
              )}
              {effectiveActionLabel}
            </Button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <Button size="sm" variant="outline" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
