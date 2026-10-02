"use client";

import * as React from "react";
import { Menu, Plus, Settings2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface ChatHeaderProps {
  title?: string;
  modelName: string;
  onToggleSidebar?: () => void;
  onNewChat: () => void;
  onOpenSettings: () => void;
}

export function ChatHeader({
  title = "AI Assistant",
  modelName,
  onToggleSidebar,
  onNewChat,
  onOpenSettings,
}: ChatHeaderProps) {
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
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-muted text-muted-foreground border border-border/60 shrink-0">
            <Sparkles className="h-2.5 w-2.5 text-primary" />
            {modelName}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenSettings}
          title="Settings"
          aria-label="Open settings"
        >
          <Settings2 className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
