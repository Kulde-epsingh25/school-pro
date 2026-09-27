import * as React from "react";
import { cn } from "@/lib/utils";

export interface FormFieldGroupProps {
  label: string;
  description?: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormFieldGroup({
  label,
  description,
  error,
  required,
  htmlFor,
  children,
  className,
}: FormFieldGroupProps) {
  return (
    <div className={cn("space-y-1.5 text-left", className)}>
      <div className="flex items-center justify-between gap-2">
        <label
          htmlFor={htmlFor}
          className="text-xs font-semibold text-foreground leading-none flex items-center gap-1 select-none"
        >
          <span>{label}</span>
          {required && <span className="text-danger font-bold text-sm leading-none">*</span>}
        </label>
      </div>

      {description && (
        <p className="text-[11px] text-muted-foreground leading-tight">
          {description}
        </p>
      )}

      <div>{children}</div>

      {error && (
        <p className="text-xs font-medium text-danger animate-in fade-in-50 duration-150 flex items-center gap-1">
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
