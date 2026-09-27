"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function Tooltip({ children }: { children: React.ReactNode }) {
  return <div className="relative inline-block group">{children}</div>;
}

export function TooltipTrigger({
  asChild,
  children,
  render,
  ...props
}: React.HTMLAttributes<HTMLElement> & { asChild?: boolean; render?: any }) {
  if (React.isValidElement(render)) {
    return React.cloneElement(render as React.ReactElement<any>, {
      ...props,
    });
  }
  return <div {...props}>{children}</div>;
}

export function TooltipContent({
  children,
  className,
  side = "top",
}: {
  children: React.ReactNode;
  className?: string;
  side?: "top" | "bottom" | "left" | "right";
}) {
  return (
    <div
      role="tooltip"
      className={cn(
        "pointer-events-none absolute z-50 rounded-md bg-foreground px-2 py-1 text-xs text-background opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap shadow-md",
        side === "top" && "bottom-full left-1/2 -translate-x-1/2 mb-1.5",
        side === "bottom" && "top-full left-1/2 -translate-x-1/2 mt-1.5",
        side === "left" && "right-full top-1/2 -translate-y-1/2 mr-1.5",
        side === "right" && "left-full top-1/2 -translate-y-1/2 ml-1.5",
        className
      )}
    >
      {children}
    </div>
  );
}
