import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Upload, Plus } from "lucide-react";

interface PageHeaderProps {
  title: string;
  count?: number;
  onAdd?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  addLabel?: string;
  exportLabel?: string;
  importLabel?: string;
}

export function PageHeader({ 
  title, 
  count, 
  onAdd, 
  onExport, 
  onImport,
  addLabel = "Add",
  exportLabel = "Export",
  importLabel = "Import"
}: PageHeaderProps) {
  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-md border shadow-sm mb-4">
      <h1 className="text-xl font-semibold text-gray-800">
        {title}{count !== undefined && `(${count})`}
      </h1>
      <div className="flex items-center gap-2">
        {onExport && (
          <Button variant="outline" size="sm" className="flex items-center gap-2 shadow-sm transition-all hover:bg-gray-50" onClick={onExport}>
            <Upload className="w-4 h-4" /> {exportLabel}
          </Button>
        )}
        {onImport && (
          <Button variant="outline" size="sm" className="flex items-center gap-2 shadow-sm transition-all hover:bg-gray-50" onClick={onImport}>
            <Download className="w-4 h-4" /> {importLabel}
          </Button>
        )}
        {onAdd && (
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 shadow-sm transition-all" onClick={onAdd}>
            <Plus className="w-4 h-4" /> {addLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
