"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  type TableDensity,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/feedback/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Download,
  Trash2,
  CheckSquare,
  Square,
  MinusSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ColumnDef<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

export interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  searchPlaceholder?: string;
  searchField?: (row: T) => string;
  loading?: boolean;
  bulkActions?: {
    label: string;
    action: (selectedIds: string[]) => void;
    variant?: "default" | "secondary" | "destructive" | "outline";
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  onExportCsv?: () => void;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  searchPlaceholder = "Search records...",
  searchField,
  loading = false,
  bulkActions,
  onExportCsv,
  className,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [density, setDensity] = useState<TableDensity>("default");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filtered dataset
  const filteredData = useMemo(() => {
    if (!searchQuery || !searchField) return data;
    return data.filter((row) =>
      searchField(row).toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery, searchField]);

  // Paginated slice
  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedIds.size === paginatedData.length && paginatedData.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedData.map(keyExtractor)));
    }
  };

  const toggleSelectRow = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const isAllSelected =
    paginatedData.length > 0 && selectedIds.size === paginatedData.length;
  const isPartiallySelected =
    selectedIds.size > 0 && selectedIds.size < paginatedData.length;

  return (
    <div className={cn("space-y-3.5", className)}>
      {/* Top Toolbar: Search, Density, Export & Bulk Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-8 text-xs h-9"
          />
        </div>

        {/* Right Actions: Density & Export */}
        <div className="flex items-center gap-2">
          {/* Density Switcher */}
          <div className="flex rounded-md border border-border bg-surface-muted/60 p-0.5 text-xs">
            <button
              onClick={() => setDensity("compact")}
              className={cn(
                "px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer",
                density === "compact"
                  ? "bg-surface text-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Compact density"
            >
              Compact
            </button>
            <button
              onClick={() => setDensity("default")}
              className={cn(
                "px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer",
                density === "default"
                  ? "bg-surface text-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Default density"
            >
              Default
            </button>
            <button
              onClick={() => setDensity("comfortable")}
              className={cn(
                "px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer",
                density === "comfortable"
                  ? "bg-surface text-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Comfortable density"
            >
              Comfortable
            </button>
          </div>

          {onExportCsv && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExportCsv}
              className="gap-1.5 text-xs h-9"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </Button>
          )}
        </div>
      </div>

      {/* Bulk Action Bar (When Rows Selected) */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between px-4 py-2.5 rounded-lg border border-primary/40 bg-primary/5 text-foreground animate-in fade-in duration-150">
          <span className="text-xs font-semibold text-primary">
            {selectedIds.size} {selectedIds.size === 1 ? "record" : "records"} selected
          </span>
          <div className="flex items-center gap-2">
            {bulkActions?.map((action, idx) => {
              const ActionIcon = action.icon;
              return (
                <Button
                  key={idx}
                  size="sm"
                  variant={action.variant || "secondary"}
                  onClick={() => action.action(Array.from(selectedIds))}
                  className="gap-1.5 text-xs h-8"
                >
                  {ActionIcon && <ActionIcon className="w-3.5 h-3.5" />}
                  {action.label}
                </Button>
              );
            })}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedIds(new Set())}
              className="text-xs h-8 text-muted-foreground"
            >
              Deselect All
            </Button>
          </div>
        </div>
      )}

      {/* Table Body */}
      {loading ? (
        <div className="rounded-lg border border-border p-4 space-y-3">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : paginatedData.length === 0 ? (
        <EmptyState
          type={searchQuery ? "no-results" : "empty"}
          title={searchQuery ? "No matching records" : "No records found"}
          description={
            searchQuery
              ? `No records found matching "${searchQuery}". Clear your search query to see all records.`
              : "This table currently contains no data rows."
          }
          actionLabel={searchQuery ? "Clear Search" : undefined}
          onAction={searchQuery ? () => setSearchQuery("") : undefined}
        />
      ) : (
        <Table density={density}>
          <TableHeader>
            <TableRow>
              {bulkActions && (
                <TableHead className="w-10">
                  <button
                    onClick={handleSelectAll}
                    className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                    aria-label="Select all rows"
                  >
                    {isAllSelected ? (
                      <CheckSquare className="w-4 h-4 text-primary" />
                    ) : isPartiallySelected ? (
                      <MinusSquare className="w-4 h-4 text-primary" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </TableHead>
              )}
              {columns.map((col) => (
                <TableHead key={col.key}>{col.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((row) => {
              const id = keyExtractor(row);
              const isSelected = selectedIds.has(id);
              return (
                <TableRow
                  key={id}
                  className={cn(isSelected && "bg-primary/5")}
                >
                  {bulkActions && (
                    <TableCell>
                      <button
                        onClick={() => toggleSelectRow(id)}
                        className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                        aria-label="Select row"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-primary" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </TableCell>
                  )}
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {col.render ? col.render(row) : (row as Record<string, unknown>)[col.key] as React.ReactNode}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {/* Pagination Footer */}
      {!loading && filteredData.length > 0 && (
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <span>
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, filteredData.length)} of{" "}
            {filteredData.length} records
          </span>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-8 px-2"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>
            <span className="px-2 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-8 px-2"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
