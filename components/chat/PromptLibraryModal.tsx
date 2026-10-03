"use client";

import * as React from "react";
import { Search, Sparkles, BookOpen, ArrowRight } from "lucide-react";
import { PROMPT_DATASET, PromptItem } from "@/lib/dataset";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface PromptLibraryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectPrompt: (prompt: string) => void;
}

export function PromptLibraryModal({
  open,
  onOpenChange,
  onSelectPrompt,
}: PromptLibraryModalProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");

  const categories = [
    "All",
    "Coding & Engineering",
    "Writing & Content",
    "Business & Career",
    "Reasoning & Learning",
    "Roleplay & Personas",
    "Creative & Lifestyle",
  ];

  const filtered = React.useMemo(() => {
    return PROMPT_DATASET.filter((p) => {
      const matchesCat =
        selectedCategory === "All" || p.category === selectedCategory;
      const matchesQuery =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.contributor && p.contributor.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCat && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border bg-muted/20">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <BookOpen className="h-4 w-4" />
              </div>
              <DialogTitle className="text-base font-semibold">
                Prompt Library & Dataset
              </DialogTitle>
            </div>
            <span className="text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border">
              {filtered.length} of {PROMPT_DATASET.length} templates
            </span>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Explore 300+ community and expert prompt personas, developer roles, and creative templates.
          </DialogDescription>

          {/* Search */}
          <div className="relative mt-3">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 300+ prompts (e.g. Ethereum, Terminal, Interview, Python)..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-border bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-foreground text-background"
                    : "bg-background border border-border/80 text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-xs text-muted-foreground">
              No matching prompts found in library for &quot;{searchQuery}&quot;.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-border bg-card hover:border-foreground/30 transition-all flex flex-col justify-between group shadow-2xs"
              >
                <div className="mb-2">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-semibold text-foreground truncate">
                      {item.title}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      {item.for_devs && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-medium border border-emerald-500/20">
                          Dev
                        </span>
                      )}
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted border border-border/60 text-muted-foreground">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="p-2 rounded-lg bg-muted/40 font-mono text-[11px] text-muted-foreground/90 line-clamp-2 mb-2 break-words">
                  {item.prompt.slice(0, 140)}...
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-muted-foreground/70">
                    {item.contributor ? `@${item.contributor}` : "curated"}
                  </span>
                  <button
                    onClick={() => {
                      onSelectPrompt(item.prompt);
                      onOpenChange(false);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-medium text-foreground hover:text-primary transition-colors cursor-pointer"
                  >
                    <span>Use Template</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
