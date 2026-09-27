"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface AccordionContextType {
  value: string | string[];
  onValueChange: (val: string) => void;
}

const AccordionContext = React.createContext<AccordionContextType | undefined>(undefined);

export function Accordion({
  type = "single",
  collapsible = true,
  defaultValue,
  children,
  className,
}: {
  type?: "single" | "multiple";
  collapsible?: boolean;
  defaultValue?: string | string[];
  children: React.ReactNode;
  className?: string;
}) {
  const [value, setValue] = React.useState<string | string[]>(
    defaultValue !== undefined ? defaultValue : type === "single" ? "" : []
  );

  const handleValueChange = (itemValue: string) => {
    if (type === "single") {
      if (value === itemValue && collapsible) {
        setValue("");
      } else {
        setValue(itemValue);
      }
    } else {
      const arr = Array.isArray(value) ? value : [];
      if (arr.includes(itemValue)) {
        setValue(arr.filter((v) => v !== itemValue));
      } else {
        setValue([...arr, itemValue]);
      }
    }
  };

  return (
    <AccordionContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div className={cn("divide-y divide-border", className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

const ItemContext = React.createContext<{ value: string; isOpen: boolean }>({ value: "", isOpen: false });

export function AccordionItem({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const context = React.useContext(AccordionContext);
  const isOpen = Array.isArray(context?.value) ? context.value.includes(value) : context?.value === value;

  return (
    <ItemContext.Provider value={{ value, isOpen }}>
      <div className={cn("py-2", className)}>{children}</div>
    </ItemContext.Provider>
  );
}

export function AccordionTrigger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const item = React.useContext(ItemContext);
  const context = React.useContext(AccordionContext);

  return (
    <button
      type="button"
      onClick={() => context?.onValueChange(item.value)}
      className={cn(
        "flex w-full items-center justify-between py-2 text-sm font-semibold transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      data-state={item.isOpen ? "open" : "closed"}
    >
      <span>{children}</span>
      <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform duration-200", item.isOpen && "rotate-180")} />
    </button>
  );
}

export function AccordionContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const item = React.useContext(ItemContext);
  if (!item.isOpen) return null;

  return (
    <div className={cn("pt-1 pb-3 text-xs text-muted-foreground animate-in fade-in-50", className)}>
      {children}
    </div>
  );
}
