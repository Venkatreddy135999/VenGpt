"use client";

import * as React from "react";
import {
  Code2,
  Image as ImageIcon,
  FileText,
  Trophy,
  Calculator,
  Lightbulb,
  Sparkles,
  BookOpen,
  Database,
} from "lucide-react";

interface EmptyChatProps {
  onSelectPrompt: (prompt: string) => void;
  onOpenPromptLibrary?: () => void;
}

const CHATGPT_SUGGESTIONS = [
  {
    category: "Create Image",
    label: "Generate futuristic city",
    prompt: "Generate a futuristic city at night.",
    icon: ImageIcon,
    color: "text-purple-500 bg-purple-500/10",
  },
  {
    category: "RAG & Architecture",
    label: "Next.js App Router & RAG",
    prompt: "Explain Next.js App Router Architecture and how RAG works.",
    icon: Database,
    color: "text-teal-500 bg-teal-500/10",
  },
  {
    category: "Coding",
    label: "Java star pattern",
    prompt: "Give me a Java star pattern.",
    icon: Code2,
    color: "text-blue-500 bg-blue-500/10",
  },
  {
    category: "Sports Records",
    label: "Most runs in ODI cricket",
    prompt: "Who has scored the most runs in ODI cricket?",
    icon: Trophy,
    color: "text-amber-500 bg-amber-500/10",
  },
  {
    category: "Writing",
    label: "Rewrite message",
    prompt: "Rewrite this message professionally: I cannot submit the work today because of another urgent task.",
    icon: FileText,
    color: "text-emerald-500 bg-emerald-500/10",
  },
  {
    category: "Concept",
    label: "Java polymorphism",
    prompt: "What is Java polymorphism?",
    icon: Lightbulb,
    color: "text-orange-500 bg-orange-500/10",
  },
  {
    category: "Mathematics",
    label: "Calculate 125 * 37",
    prompt: "What is 125 * 37?",
    icon: Calculator,
    color: "text-pink-500 bg-pink-500/10",
  },
];

export function EmptyChat({ onSelectPrompt, onOpenPromptLibrary }: EmptyChatProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-2xl mx-auto my-auto select-none">
      {/* VenGPT ChatGPT-style center logo */}
      <div className="h-12 w-12 rounded-2xl bg-foreground text-background flex items-center justify-center mb-4 shadow-sm">
        <Sparkles className="h-6 w-6" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-foreground text-center">
        What can I help with today?
      </h1>

      <p className="text-xs sm:text-sm text-muted-foreground mb-8 text-center max-w-md">
        VenGPT can generate images, write & debug code, verify current facts, calculate math, and assist with any topic.
      </p>

      {/* ChatGPT-style grid of capability cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-xl">
        {CHATGPT_SUGGESTIONS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => onSelectPrompt(item.prompt)}
              className="flex items-center gap-3 p-3 rounded-2xl border border-border/80 bg-background hover:bg-muted/60 text-left transition-all shadow-2xs hover:border-foreground/30 cursor-pointer active:scale-98 group"
            >
              <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-medium text-muted-foreground">
                  {item.category}
                </span>
                <span className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                  {item.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {onOpenPromptLibrary && (
        <button
          onClick={onOpenPromptLibrary}
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:bg-muted/60 text-xs font-medium text-muted-foreground hover:text-foreground transition-all cursor-pointer shadow-2xs"
        >
          <BookOpen className="h-3.5 w-3.5 text-primary" />
          <span>Browse 300+ Curated Prompts & Personas</span>
        </button>
      )}
    </div>
  );
}
