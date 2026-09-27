"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumbs"
      className={cn("flex items-center text-xs text-muted-foreground", className)}
    >
      <ol className="flex items-center space-x-1.5 flex-wrap">
        <li>
          <Link
            href="/dashboard"
            className="flex items-center hover:text-foreground transition-colors p-0.5"
            aria-label="Home"
          >
            <Home className="w-3.5 h-3.5" />
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label + index} className="flex items-center space-x-1.5">
              <ChevronRight className="w-3 h-3 text-muted-foreground/60 shrink-0" />
              {isLast || !item.href ? (
                <span className="font-medium text-foreground truncate max-w-[200px]">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-foreground transition-colors truncate max-w-[160px]"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
