"use client";

import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface DonutSegment {
  name: string;
  value: number;
  color: string;
}

export interface MetricDonutChartProps {
  title: string;
  description?: string;
  data: DonutSegment[];
  centerLabel?: string;
  centerValue?: string;
  loading?: boolean;
  className?: string;
}

export function MetricDonutChart({
  title,
  description,
  data,
  centerLabel,
  centerValue,
  loading = false,
  className,
}: MetricDonutChartProps) {
  if (loading) {
    return (
      <Card className={cn("p-4 border-border/80", className)}>
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-3 w-48 mb-6" />
        <div className="flex justify-center items-center h-48">
          <Skeleton className="h-36 w-36 rounded-full" />
        </div>
      </Card>
    );
  }

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card className={cn("border-border/80 bg-surface", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold text-foreground">{title}</CardTitle>
        {description && (
          <CardDescription className="text-xs text-muted-foreground">{description}</CardDescription>
        )}
      </CardHeader>

      <CardContent className="pt-2">
        <div className="relative h-56 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0];
                    const percent = ((Number(item.value) / total) * 100).toFixed(1);
                    return (
                      <div className="rounded-lg border border-border bg-surface p-2.5 shadow-md text-xs">
                        <span className="font-semibold text-muted-foreground block text-[11px]">
                          {item.name}
                        </span>
                        <span className="font-bold text-foreground font-mono text-sm">
                          {Number(item.value).toLocaleString()} ({percent}%)
                        </span>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Centered KPI Metric */}
          {(centerLabel || centerValue) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              {centerValue && (
                <span className="text-lg font-black tracking-tight text-foreground font-mono leading-none">
                  {centerValue}
                </span>
              )}
              {centerLabel && (
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-1">
                  {centerLabel}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-3 border-t border-border/60 text-xs">
          {data.map((segment) => (
            <div key={segment.name} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: segment.color }} />
              <span className="text-muted-foreground text-[11px]">{segment.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
