"use client";

import * as React from "react";
import {
  PanelLeft,
  SquarePen,
  Settings2,
  Sparkles,
  ChevronDown,
  Check,
  BookOpen,
  Download,
  FileText,
  Code,
  Share2,
} from "lucide-react";
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
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  onNewChat: () => void;
  onOpenSettings: () => void;
  onOpenPromptLibrary?: () => void;
  onExport?: (format: "markdown" | "json") => void;
  hasMessages?: boolean;
}

export function ChatHeader({
  title = "VenGPT",
  modelName,
  onModelChange,
  isSidebarOpen = true,
  onToggleSidebar,
  onNewChat,
  onOpenSettings,
  onOpenPromptLibrary,
  onExport,
  hasMessages = false,
}: ChatHeaderProps) {
  const currentModel = getModelById(modelName);
  const [copiedShare, setCopiedShare] = React.useState(false);

  // Group models by provider
  const providers = [
    "OpenAI",
    "DeepSeek",
    "xAI (Grok)",
    "Anthropic",
    "Google",
    "Open Source / Astra",
  ] as const;

  const handleShare = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2000);
      }
    } catch {}
  };

  return (
    <header className="h-14 px-3 sm:px-4 flex items-center justify-between bg-background sticky top-0 z-10 shrink-0 select-none">
      {/* Left controls: Sidebar toggle, New chat, and Model picker */}
      <div className="flex items-center gap-1.5 overflow-hidden">
        {/* Sidebar toggle button (PanelLeft) */}
        <Button
          variant="ghost"
          size="iconSm"
          onClick={onToggleSidebar}
          title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          aria-label="Toggle sidebar"
          className="text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <PanelLeft className="h-4 w-4" />
        </Button>

        {/* New chat button (SquarePen) */}
        <Button
          variant="ghost"
          size="iconSm"
          onClick={onNewChat}
          title="New chat"
          aria-label="Start new conversation"
          className="text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <SquarePen className="h-4 w-4" />
        </Button>

        {/* ChatGPT-style Model Selector Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-muted/80 text-foreground text-sm font-semibold transition-colors cursor-pointer select-none ml-1"
              title="Select AI model"
              aria-label="Select AI Model"
            >
              <span>{currentModel.name}</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground/70" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-80 max-h-[460px] overflow-y-auto p-1.5 shadow-lg"
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

      {/* Right controls: Share, Export, Prompt library, Theme toggle, Settings */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Share chat link */}
        <Button
          variant="ghost"
          size="iconSm"
          onClick={handleShare}
          title={copiedShare ? "Link copied!" : "Share conversation link"}
          aria-label="Share conversation"
          className={`cursor-pointer ${copiedShare ? "text-emerald-500" : "text-muted-foreground hover:text-foreground"}`}
        >
          {copiedShare ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
        </Button>

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
          size="iconSm"
          onClick={onOpenSettings}
          title="VenGPT Settings"
          aria-label="Open settings"
          className="text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <Settings2 className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
