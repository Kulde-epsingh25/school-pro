import React from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200/60", className)}
      {...props}
    />
  );
}

export function TableSkeleton({ columns = 4, rows = 5 }: { columns?: number, rows?: number }) {
  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex gap-4 border-b pb-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-6 flex-1 bg-gray-300/50" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={`row-${rowIdx}`} className="flex gap-4 py-2">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <Skeleton key={`cell-${rowIdx}-${colIdx}`} className="h-10 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 w-full space-y-4">
      <div className="flex items-center space-x-2">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}
