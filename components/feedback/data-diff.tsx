"use client";

import React from "react";
import { ArrowRight, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DiffField {
  fieldName: string;
  previousValue: string | number | null | undefined;
  newValue: string | number | null | undefined;
}

export interface DataDiffProps {
  fields: DiffField[];
  actorName?: string;
  timestamp?: string;
  reason?: string;
  className?: string;
}

export function DataDiff({
  fields,
  actorName,
  timestamp,
  reason,
  className,
}: DataDiffProps) {
  if (!fields || fields.length === 0) return null;

  return (
    <div className={cn("rounded-lg border border-border bg-surface p-4 space-y-3", className)}>
      {/* Audit Meta Header */}
      {(actorName || timestamp || reason) && (
        <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground pb-2 border-b border-border/60 gap-2">
          <div className="flex items-center gap-2">
            {actorName && <span>Modified by: <strong className="text-foreground">{actorName}</strong></span>}
            {reason && <span className="italic">({reason})</span>}
          </div>
          {timestamp && <span className="font-mono text-[11px]">{timestamp}</span>}
        </div>
      )}

      {/* Field Level Diffs */}
      <div className="space-y-2">
        {fields.map((field, idx) => (
          <div
            key={idx}
            className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 p-2 rounded-md bg-surface-muted/40 border border-border/50"
          >
            <span className="font-semibold text-foreground min-w-[140px] uppercase tracking-wider text-[11px]">
              {field.fieldName}
            </span>

            <div className="flex items-center gap-3 flex-1">
              {/* Previous Value */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-danger/10 text-danger border border-danger/20 font-mono text-[11px]">
                <Minus className="w-3 h-3 shrink-0" />
                <span className="line-through">{String(field.previousValue ?? "—")}</span>
              </div>

              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />

              {/* New Value */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-success/10 text-success border border-success/20 font-mono text-[11px]">
                <Plus className="w-3 h-3 shrink-0" />
                <span>{String(field.newValue ?? "—")}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
