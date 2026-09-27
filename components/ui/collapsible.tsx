"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface CollapsibleContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CollapsibleContext = React.createContext<CollapsibleContextType | undefined>(undefined);

export function Collapsible({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange: controlledOnOpenChange,
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  const onOpenChange = controlledOnOpenChange || setUncontrolledOpen;

  return (
    <CollapsibleContext.Provider value={{ open, onOpenChange }}>
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </CollapsibleContext.Provider>
  );
}

export function CollapsibleTrigger({
  asChild,
  children,
  onClick,
  render,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean; render?: any }) {
  const context = React.useContext(CollapsibleContext);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    context?.onOpenChange(!context.open);
  };

  if (React.isValidElement(render)) {
    return React.cloneElement(render as React.ReactElement<any>, {
      onClick: handleClick,
      "data-state": context?.open ? "open" : "closed",
      ...props,
      children: children || (render.props as any)?.children,
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      data-state={context?.open ? "open" : "closed"}
      {...props}
    >
      {children}
    </button>
  );
}

export function CollapsibleContent({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const context = React.useContext(CollapsibleContext);
  if (!context?.open) return null;

  return (
    <div
      data-state={context.open ? "open" : "closed"}
      className={cn("overflow-hidden transition-all animate-in fade-in-50", className)}
      {...props}
    >
      {children}
    </div>
  );
}
