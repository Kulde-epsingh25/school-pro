"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, File, FileText, CheckCircle2, AlertCircle, X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface UploadedFileItem {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "success" | "error";
  errorMessage?: string;
}

export interface FileUploaderProps {
  accept?: string;
  maxSizeBytes?: number; // e.g. 5 * 1024 * 1024 for 5MB
  maxFiles?: number;
  onFilesChange?: (files: File[]) => void;
  className?: string;
}

export function FileUploader({
  accept = ".pdf,.docx,.xlsx,.csv,.png,.jpg,.jpeg",
  maxSizeBytes = 10 * 1024 * 1024, // 10MB default
  maxFiles = 5,
  onFilesChange,
  className,
}: FileUploaderProps) {
  const [items, setItems] = useState<UploadedFileItem[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming || incoming.length === 0) return;

    const newItems: UploadedFileItem[] = [];
    const validFiles: File[] = [];

    Array.from(incoming).slice(0, maxFiles - items.length).forEach((file) => {
      const id = `upl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      if (file.size > maxSizeBytes) {
        newItems.push({
          id,
          file,
          progress: 0,
          status: "error",
          errorMessage: `File exceeds ${formatFileSize(maxSizeBytes)} limit`,
        });
      } else {
        newItems.push({
          id,
          file,
          progress: 100, // instant simulated success in frontend UI
          status: "success",
        });
        validFiles.push(file);
      }
    });

    const updated = [...items, ...newItems];
    setItems(updated);
    if (onFilesChange) {
      onFilesChange(updated.filter((i) => i.status === "success").map((i) => i.file));
    }
  };

  const removeItem = (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    if (onFilesChange) {
      onFilesChange(updated.filter((i) => i.status === "success").map((i) => i.file));
    }
  };

  return (
    <div className={cn("space-y-3.5", className)}>
      {/* Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex flex-col items-center justify-center p-6 sm:p-8 rounded-lg border-2 border-dashed transition-all cursor-pointer text-center select-none",
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-muted/30"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={maxFiles > 1}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-primary mb-3">
          <UploadCloud className="h-5 w-5" />
        </div>

        <p className="text-xs font-semibold text-foreground">
          <span className="text-primary hover:underline">Click to browse</span> or drag and drop documents
        </p>
        <p className="text-[11px] text-muted-foreground mt-1">
          Supports PDF, DOCX, XLSX, CSV, PNG, JPG (Max {formatFileSize(maxSizeBytes)})
        </p>
      </div>

      {/* Uploaded File List */}
      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg border text-xs transition-all",
                item.status === "error"
                  ? "border-danger/30 bg-danger/5 text-danger"
                  : "border-border bg-surface text-foreground"
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileText className={cn("w-4 h-4 shrink-0", item.status === "error" ? "text-danger" : "text-primary")} />
                <div className="min-w-0">
                  <p className="font-semibold text-foreground truncate max-w-[200px] sm:max-w-xs">
                    {item.file.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {formatFileSize(item.file.size)}
                    {item.errorMessage && <span className="text-danger ml-2">• {item.errorMessage}</span>}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {item.status === "success" && (
                  <span className="text-success flex items-center gap-1 font-medium text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Uploaded
                  </span>
                )}
                {item.status === "error" && (
                  <span className="text-danger flex items-center gap-1 font-medium text-[11px]">
                    <AlertCircle className="w-3.5 h-3.5" /> Failed
                  </span>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeItem(item.id);
                  }}
                  className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
