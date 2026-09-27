"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Component ErrorBoundary caught an error:", error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-6 text-center rounded-lg border border-danger/30 bg-danger/5 text-foreground my-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-danger/10 text-danger mb-3">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <h4 className="text-sm font-semibold text-foreground">
            {this.props.fallbackTitle || "Unable to display this widget"}
          </h4>
          <p className="mt-1 text-xs text-muted-foreground max-w-md">
            An unexpected error occurred while rendering this section. Other sections continue to function normally.
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={this.handleRetry}
            className="mt-4 gap-1.5 border-danger/40 hover:bg-danger/10"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Retry
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
