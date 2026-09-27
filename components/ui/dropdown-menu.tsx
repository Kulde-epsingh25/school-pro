"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface DropdownContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DropdownContext = React.createContext<DropdownContextType | undefined>(undefined);

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block text-left">{children}</div>
    </DropdownContext.Provider>
  );
}

export function DropdownMenuTrigger({
  asChild,
  children,
  render,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean; render?: any }) {
  const context = React.useContext(DropdownContext);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    props.onClick?.(e);
    context?.setOpen(!context.open);
  };

  if (React.isValidElement(render)) {
    return React.cloneElement(render as React.ReactElement<any>, {
      onClick: handleClick,
      ...props,
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}

export function DropdownMenuContent({
  children,
  className,
  align = "end",
  side,
  sideOffset,
}: {
  children: React.ReactNode;
  className?: string;
  align?: "start" | "end" | "center";
  side?: string;
  sideOffset?: number;
}) {
  const context = React.useContext(DropdownContext);
  if (!context?.open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => context.setOpen(false)} />
      <div
        className={cn(
          "absolute z-50 mt-1 min-w-[8rem] overflow-hidden rounded-md border border-border bg-surface p-1 text-foreground shadow-md animate-in fade-in-80",
          align === "end" ? "right-0" : align === "start" ? "left-0" : "left-1/2 -translate-x-1/2",
          className
        )}
      >
        {children}
      </div>
    </>
  );
}

export function DropdownMenuItem({
  children,
  className,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const context = React.useContext(DropdownContext);
  return (
    <div
      onClick={() => {
        if (disabled) return;
        onClick?.();
        context?.setOpen(false);
      }}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-xs outline-none transition-colors hover:bg-muted focus:bg-muted",
        disabled && "pointer-events-none opacity-50",
        className
      )}
    >
      {children}
    </div>
  );
}

export function DropdownMenuLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-2 py-1.5 text-xs font-semibold text-muted-foreground", className)}>{children}</div>;
}

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div className={cn("-mx-1 my-1 h-px bg-border", className)} />;
}

export function DropdownMenuGroup({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function DropdownMenuCheckboxItem({ children }: { children: React.ReactNode }) {
  return <div className="px-2 py-1.5 text-xs">{children}</div>;
}

export function DropdownMenuRadioItem({ children }: { children: React.ReactNode }) {
  return <div className="px-2 py-1.5 text-xs">{children}</div>;
}

export function DropdownMenuRadioGroup({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
