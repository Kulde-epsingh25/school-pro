"use client";

import React, { Component, ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error caught by dashboard ErrorBoundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-6 m-4 bg-destructive/5 border border-destructive/20 rounded-2xl flex items-start gap-4">
          <div className="p-3 bg-destructive/10 text-destructive rounded-xl shrink-0">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-foreground text-base">Module Rendering Error</h3>
            <p className="text-sm text-muted-foreground">
              {this.state.error?.message || "An unexpected error occurred while rendering this view."}
            </p>
            <Button
              onClick={this.handleReset}
              variant="outline"
              size="sm"
              className="gap-2 mt-2 h-8 text-xs font-semibold"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Reload Module
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
