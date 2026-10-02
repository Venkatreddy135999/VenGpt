"use client";

import * as React from "react";
import { Bot } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 py-3 px-2 sm:px-4 text-left animate-in fade-in duration-200">
      <div className="h-8 w-8 rounded-lg bg-primary/10 border border-border flex items-center justify-center shrink-0 text-primary">
        <Bot className="h-4 w-4" />
      </div>

      <div className="flex items-center gap-1.5 py-2 px-3.5 rounded-2xl bg-muted/60 border border-border/40 text-muted-foreground">
        <div className="h-2 w-2 rounded-full bg-foreground/60 dot-pulse-1" />
        <div className="h-2 w-2 rounded-full bg-foreground/60 dot-pulse-2" />
        <div className="h-2 w-2 rounded-full bg-foreground/60 dot-pulse-3" />
        <span className="text-xs font-medium ml-1.5 text-muted-foreground select-none">
          Thinking...
        </span>
      </div>
    </div>
  );
}
