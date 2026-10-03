"use client";

import * as React from "react";
import {
  Code2,
  Lightbulb,
  FileText,
  Compass,
  Sparkles,
  BookOpen,
} from "lucide-react";

interface EmptyChatProps {
  onSelectPrompt: (prompt: string) => void;
  onOpenPromptLibrary?: () => void;
}

const QUICK_ACTIONS = [
  {
    label: "Explain quantum computing",
    prompt: "Explain quantum computing in simple terms.",
    icon: Lightbulb,
  },
  {
    label: "Write a Python script",
    prompt: "Write an efficient Python function to sort a list with examples.",
    icon: Code2,
  },
  {
    label: "Help me write",
    prompt: "Help me write a professional follow-up email after a job interview.",
    icon: FileText,
  },
  {
    label: "Brainstorm ideas",
    prompt: "Give me 5 creative ideas for a full-stack web application.",
    icon: Compass,
  },
];

export function EmptyChat({ onSelectPrompt, onOpenPromptLibrary }: EmptyChatProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-2xl mx-auto my-auto select-none">
      <div className="h-10 w-10 rounded-full bg-foreground/5 dark:bg-white/10 flex items-center justify-center mb-5 text-foreground">
        <Sparkles className="h-5 w-5" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-8 text-foreground text-center">
        What can I help with?
      </h1>

      <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl">
        {onOpenPromptLibrary && (
          <button
            onClick={onOpenPromptLibrary}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-primary/40 bg-primary/5 hover:bg-primary/10 text-xs font-medium text-foreground transition-all shadow-2xs cursor-pointer active:scale-98"
          >
            <BookOpen className="h-3.5 w-3.5 text-primary" />
            <span>Explore 300+ Prompts & Roles</span>
          </button>
        )}
        {QUICK_ACTIONS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => onSelectPrompt(item.prompt)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-border/80 bg-background hover:bg-muted/70 text-xs text-foreground/90 transition-all shadow-2xs hover:border-foreground/20 cursor-pointer active:scale-98"
            >
              <Icon className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
