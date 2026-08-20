import { Sparkles } from "lucide-react";
import React from "react";

export default function SmallTitle({ title }: { title: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary shadow-sm backdrop-blur">
      <Sparkles className="size-4 text-primary animate-pulse" aria-hidden="true" />
      <span>{title}</span>
    </div>
  );
}
