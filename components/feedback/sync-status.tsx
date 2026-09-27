"use client";

import React, { useState, useEffect } from "react";
import { Wifi, WifiOff, RefreshCw, CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export type SyncState = "synced" | "syncing" | "offline" | "pending" | "failed";

export interface SyncStatusProps {
  state?: SyncState;
  pendingCount?: number;
  lastSyncedAt?: string;
  className?: string;
}

export function SyncStatus({
  state: controlledState,
  pendingCount = 0,
  lastSyncedAt = "Just now",
  className,
}: SyncStatusProps) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    if (typeof window !== "undefined") {
      setIsOnline(navigator.onLine);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const effectiveState: SyncState = controlledState
    ? controlledState
    : !isOnline
    ? "offline"
    : pendingCount > 0
    ? "pending"
    : "synced";

  switch (effectiveState) {
    case "offline":
      return (
        <div
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-danger/10 text-danger border border-danger/20 text-xs font-medium select-none",
            className
          )}
        >
          <WifiOff className="w-3.5 h-3.5" />
          <span>Offline — changes stored locally</span>
        </div>
      );
    case "syncing":
      return (
        <div
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-medium select-none",
            className
          )}
        >
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span>Syncing telemetry...</span>
        </div>
      );
    case "pending":
      return (
        <div
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-medium select-none",
            className
          )}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{pendingCount} changes pending sync</span>
        </div>
      );
    case "failed":
      return (
        <div
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-danger/10 text-danger border border-danger/20 text-xs font-medium select-none",
            className
          )}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Sync failed — tap to retry</span>
        </div>
      );
    case "synced":
    default:
      return (
        <div
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 text-success border border-success/20 text-xs font-medium select-none",
            className
          )}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Synced ({lastSyncedAt})</span>
        </div>
      );
  }
}
