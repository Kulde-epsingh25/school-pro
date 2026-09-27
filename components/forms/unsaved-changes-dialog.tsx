"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export interface UnsavedChangesDialogProps {
  open: boolean;
  onStay: () => void;
  onLeave: () => void;
  title?: string;
  description?: string;
}

export function UnsavedChangesDialog({
  open,
  onStay,
  onLeave,
  title = "Unsaved Changes",
  description = "You have modified records or form fields that haven't been saved yet. Leaving now will discard all unsaved edits.",
}: UnsavedChangesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onStay()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2.5 text-warning-foreground dark:text-warning mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-warning/10 text-warning">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed pt-1">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button variant="outline" size="sm" onClick={onStay}>
            Stay on Page
          </Button>
          <Button variant="destructive" size="sm" onClick={onLeave}>
            Discard & Leave
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
