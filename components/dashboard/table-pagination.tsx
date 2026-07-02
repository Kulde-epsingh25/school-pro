import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TablePaginationProps {
  totalItems: number;
  currentPage?: number;
  totalPages?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export function TablePagination({ 
  totalItems, 
  currentPage = 1, 
  totalPages = 1, 
  pageSize = 10,
  onPageChange,
  onPageSizeChange
}: TablePaginationProps) {
  return (
    <div className="flex items-center justify-between p-4 border-t text-sm text-gray-500 bg-white rounded-b-md">
      <div>
        0 of {totalItems} row(s) selected.
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span>Rows per page</span>
          <select 
            className="border rounded px-2 py-1 bg-white focus:outline-none shadow-sm transition-colors hover:border-gray-400"
            value={pageSize}
            onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className="font-medium text-gray-700">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex gap-1">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 shadow-sm transition-all" 
            disabled={currentPage <= 1}
            onClick={() => onPageChange?.(currentPage - 1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 shadow-sm transition-all" 
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange?.(currentPage + 1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
