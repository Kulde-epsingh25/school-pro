"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export function NavigationMenu({ children, className }: { children: React.ReactNode; className?: string }) {
  return <nav className={cn("relative z-10 flex max-w-max flex-1 items-center justify-center", className)}>{children}</nav>;
}

export function NavigationMenuList({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("group flex flex-1 list-none items-center justify-center space-x-1", className)}>{children}</div>;
}

export function NavigationMenuItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("relative group", className)}>{children}</div>;
}

export function NavigationMenuTrigger({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <button
      type="button"
      className={cn(
        "group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
        className
      )}
    >
      <span>{children}</span>
      <ChevronDown className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-hover:rotate-180" />
    </button>
  );
}

export function NavigationMenuContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "absolute left-0 top-full hidden w-auto rounded-md border border-border bg-surface p-2 shadow-lg group-hover:block animate-in fade-in-50",
        className
      )}
    >
      {children}
    </div>
  );
}

export function NavigationMenuLink({
  children,
  className,
  asChild,
  render,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { asChild?: boolean; render?: any }) {
  if (React.isValidElement(render)) {
    return React.cloneElement(render as React.ReactElement<any>, {
      className: cn(
        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted hover:text-accent-foreground focus:bg-muted focus:text-accent-foreground",
        (render.props as any)?.className,
        className
      ),
      ...props,
      children: children || (render.props as any)?.children,
    });
  }

  return (
    <a
      className={cn(
        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted hover:text-accent-foreground focus:bg-muted focus:text-accent-foreground",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}
