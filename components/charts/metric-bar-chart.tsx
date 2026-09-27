"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface BarDataPoint {
  label: string;
  value: number;
}

export interface MetricBarChartProps {
  title: string;
  description?: string;
  data: BarDataPoint[];
  valuePrefix?: string;
  valueSuffix?: string;
  loading?: boolean;
  color?: string;
  className?: string;
}

export function MetricBarChart({
  title,
  description,
  data,
  valuePrefix = "",
  valueSuffix = "",
  loading = false,
  color = "var(--primary)",
  className,
}: MetricBarChartProps) {
  if (loading) {
    return (
      <Card className={cn("p-4 border-border/80", className)}>
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-3 w-48 mb-6" />
        <Skeleton className="h-48 w-full rounded-md" />
      </Card>
    );
  }

  return (
    <Card className={cn("border-border/80 bg-surface", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold text-foreground">{title}</CardTitle>
        {description && (
          <CardDescription className="text-xs text-muted-foreground">{description}</CardDescription>
        )}
      </CardHeader>

      <CardContent className="pt-2">
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                tickFormatter={(val) => `${valuePrefix}${val}${valueSuffix}`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0];
                    return (
                      <div className="rounded-lg border border-border bg-surface p-2.5 shadow-md text-xs">
                        <span className="font-semibold text-muted-foreground block text-[11px]">
                          {item.payload.label}
                        </span>
                        <span className="font-bold text-foreground font-mono text-sm">
                          {valuePrefix}
                          {Number(item.value).toLocaleString()}
                          {valueSuffix}
                        </span>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
