import * as React from "react";
import { cn } from "@/lib/utils";

export type TableDensity = "compact" | "default" | "comfortable";

const TableDensityContext = React.createContext<TableDensity>("default");

export function TableProvider({
  density = "default",
  children,
}: {
  density?: TableDensity;
  children: React.ReactNode;
}) {
  return (
    <TableDensityContext.Provider value={density}>
      {children}
    </TableDensityContext.Provider>
  );
}

export function useTableDensity() {
  return React.useContext(TableDensityContext);
}

const Table = React.forwardRef<
  HTMLTableElement,
  React.TableHTMLAttributes<HTMLTableElement> & { density?: TableDensity }
>(({ className, density = "default", ...props }, ref) => (
  <TableProvider density={density}>
    <div className="relative w-full overflow-auto rounded-lg border border-border bg-surface">
      <table
        ref={ref}
        className={cn("w-full caption-bottom text-sm text-foreground", className)}
        {...props}
      />
    </div>
  </TableProvider>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b border-border bg-surface-muted/60", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className)}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-border/70 transition-colors hover:bg-muted/40 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => {
  const density = useTableDensity();
  const paddingClass =
    density === "compact"
      ? "h-8 px-2.5 py-1 text-xs"
      : density === "comfortable"
      ? "h-12 px-4 py-3 text-sm"
      : "h-10 px-3 py-2 text-xs";

  return (
    <th
      ref={ref}
      className={cn(
        "text-left align-middle font-semibold text-muted-foreground uppercase tracking-wider [&:has([role=checkbox])]:pr-0",
        paddingClass,
        className
      )}
      {...props}
    />
  );
});
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => {
  const density = useTableDensity();
  const paddingClass =
    density === "compact"
      ? "px-2.5 py-1.5 text-xs"
      : density === "comfortable"
      ? "px-4 py-3.5 text-sm"
      : "px-3 py-2.5 text-sm";

  return (
    <td
      ref={ref}
      className={cn("align-middle [&:has([role=checkbox])]:pr-0", paddingClass, className)}
      {...props}
    />
  );
});
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-xs text-muted-foreground", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
