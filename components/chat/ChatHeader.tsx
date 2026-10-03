"use client";

import * as React from "react";
import { Menu, Plus, Settings2, Sparkles, ChevronDown, Check, BookOpen, Download, FileText, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { AVAILABLE_MODELS, getModelById } from "@/lib/ai";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatHeaderProps {
  title?: string;
  modelName: string;
  onModelChange?: (modelId: string) => void;
  onToggleSidebar?: () => void;
  onNewChat: () => void;
  onOpenSettings: () => void;
  onOpenPromptLibrary?: () => void;
  onExport?: (format: "markdown" | "json") => void;
  hasMessages?: boolean;
}

export function ChatHeader({
  title = "AI Assistant",
  modelName,
  onModelChange,
  onToggleSidebar,
  onNewChat,
  onOpenSettings,
  onOpenPromptLibrary,
  onExport,
  hasMessages = false,
}: ChatHeaderProps) {
  const currentModel = getModelById(modelName);

  // Group models by provider
  const providers = [
    "OpenAI",
    "DeepSeek",
    "xAI (Grok)",
    "Anthropic",
    "Google",
    "Open Source / Astra",
  ] as const;

  return (
    <header className="h-14 border-b border-border px-3 sm:px-4 flex items-center justify-between bg-background/80 backdrop-blur-xs sticky top-0 z-10 shrink-0">
      <div className="flex items-center gap-2 overflow-hidden mr-2">
        {/* Mobile toggle button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="md:hidden shrink-0"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* New chat icon for quick access */}
        <Button
          variant="ghost"
          size="iconSm"
          onClick={onNewChat}
          className="hidden sm:flex shrink-0 text-muted-foreground hover:text-foreground"
          title="New conversation"
          aria-label="Start new conversation"
        >
          <Plus className="h-4 w-4" />
        </Button>

        {/* Active conversation title */}
        <div className="flex items-center gap-2 min-w-0">
          <h1 className="text-sm font-semibold truncate text-foreground">
            {title}
          </h1>

          {/* Interactive Model Selector Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-muted/80 hover:bg-muted text-foreground border border-border/80 transition-all cursor-pointer select-none shrink-0"
                title="Switch AI model"
                aria-label="Select AI Model"
              >
                <Sparkles className="h-3 w-3 text-primary" />
                <span className="font-semibold">{currentModel.name}</span>
                <ChevronDown className="h-3 w-3 opacity-60" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-80 max-h-[460px] overflow-y-auto p-1.5"
            >
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-b border-border/60 mb-1">
                Select Model ({AVAILABLE_MODELS.length} available)
              </div>

              {providers.map((provider) => {
                const models = AVAILABLE_MODELS.filter((m) => m.provider === provider);
                if (models.length === 0) return null;

                return (
                  <div key={provider} className="py-1">
                    <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                      {provider}
                    </div>
                    {models.map((m) => {
                      const isSelected = m.id === currentModel.id;
                      return (
                        <DropdownMenuItem
                          key={m.id}
                          onClick={() => onModelChange?.(m.id)}
                          className={`flex items-start justify-between p-2 rounded-lg gap-2 cursor-pointer ${
                            isSelected ? "bg-primary/10 text-primary font-medium" : ""
                          }`}
                        >
                          <div className="flex flex-col min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-semibold">{m.name}</span>
                              {m.badge && (
                                <span className="px-1.5 py-0.2 rounded text-[10px] bg-muted border border-border/60 text-muted-foreground">
                                  {m.badge}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-muted-foreground truncate leading-normal">
                              {m.description}
                            </span>
                          </div>
                          {isSelected && (
                            <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                          )}
                        </DropdownMenuItem>
                      );
                    })}
                    <DropdownMenuSeparator className="my-1" />
                  </div>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {onExport && hasMessages && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="iconSm"
                title="Export Conversation"
                aria-label="Export Conversation"
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <Download className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => onExport("markdown")}
                className="flex items-center gap-2 text-xs cursor-pointer"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Export as Markdown (.md)</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onExport("json")}
                className="flex items-center gap-2 text-xs cursor-pointer"
              >
                <Code className="h-3.5 w-3.5" />
                <span>Export as JSON (.json)</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <Button
          variant="ghost"
          size="iconSm"
          onClick={onOpenPromptLibrary}
          title="Prompt Library & Datasets"
          aria-label="Open Prompt Library"
          className="text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <BookOpen className="h-4 w-4" />
        </Button>
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenSettings}
          title="Settings"
          aria-label="Open settings"
          className="cursor-pointer"
        >
          <Settings2 className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
