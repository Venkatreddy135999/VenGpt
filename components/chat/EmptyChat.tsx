"use client";

import * as React from "react";
import { Sparkles, Code2, GraduationCap, Lightbulb } from "lucide-react";

interface EmptyChatProps {
  onSelectPrompt: (prompt: string) => void;
}

const EXAMPLE_PROMPTS = [
  {
    title: "Explain quantum computing simply",
    subtitle: "Concepts explained with real-world analogies",
    icon: Sparkles,
  },
  {
    title: "Write a Python program to sort a list",
    subtitle: "Clean, documented, and idiomatic Python code",
    icon: Code2,
  },
  {
    title: "Help me create a study plan",
    subtitle: "Structured daily schedule for learning new skills",
    icon: GraduationCap,
  },
  {
    title: "Explain this concept step by step",
    subtitle: "Deep-dive breakdown with clear milestones",
    icon: Lightbulb,
  },
];

export function EmptyChat({ onSelectPrompt }: EmptyChatProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto my-auto">
      <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 text-primary shadow-xs">
        <Sparkles className="h-6 w-6" />
      </div>

      <h2 className="text-2xl font-bold tracking-tight mb-2 text-foreground">
        How can I help you today?
      </h2>
      <p className="text-sm text-muted-foreground mb-8 max-w-md">
        Ask a question, generate code, brainstorm ideas, or analyze concepts. Choose a suggestion below or type your own prompt.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
        {EXAMPLE_PROMPTS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => onSelectPrompt(item.title)}
              className="group p-4 rounded-xl border border-border bg-card hover:bg-muted/60 hover:border-primary/40 transition-all text-left flex flex-col justify-between shadow-xs cursor-pointer active:scale-[0.99]"
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="p-1.5 rounded-lg bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                </div>
                <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  {item.title}
                </span>
              </div>
              <p className="text-xs text-muted-foreground pl-8">
                {item.subtitle}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
