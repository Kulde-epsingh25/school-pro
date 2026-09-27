import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { LucideIcon, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

export interface KPICardProps {
  title: string;
  value: string | number;
  comparison?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon: LucideIcon;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
}

export function KPICard({
  title,
  value,
  comparison,
  trend,
  trendValue,
  icon: Icon,
  loading = false,
  onClick,
  className,
}: KPICardProps) {
  if (loading) {
    return (
      <Card className="p-4 border-border/80 bg-surface">
        <div className="flex justify-between items-start mb-3">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
        <Skeleton className="h-7 w-20 mb-2" />
        <Skeleton className="h-3.5 w-32" />
      </Card>
    );
  }

  return (
    <Card
      onClick={onClick}
      className={cn(
        "border border-border/80 bg-surface transition-all duration-150",
        onClick && "cursor-pointer hover:border-primary/50 hover:shadow-xs",
        className
      )}
    >
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</span>
          <div className="p-2 rounded-md bg-secondary text-primary">
            <Icon className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-foreground font-mono">{value}</span>
        </div>
        {(comparison || trendValue) && (
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            {trend === "up" && <ArrowUpRight className="w-3.5 h-3.5 text-success" />}
            {trend === "down" && <ArrowDownRight className="w-3.5 h-3.5 text-danger" />}
            {trend === "neutral" && <Minus className="w-3.5 h-3.5 text-muted-foreground" />}
            {trendValue && (
              <span
                className={cn(
                  "font-medium",
                  trend === "up" && "text-success",
                  trend === "down" && "text-danger"
                )}
              >
                {trendValue}
              </span>
            )}
            {comparison && <span className="truncate">{comparison}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
