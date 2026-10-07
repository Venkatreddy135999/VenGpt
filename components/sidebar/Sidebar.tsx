"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Settings, X, Sparkles, PanelLeft, SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConversationList } from "@/components/sidebar/ConversationList";
import { ConversationItemData } from "@/components/sidebar/ConversationItem";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@/components/auth/AuthControls";

interface SidebarProps {
  conversations: ConversationItemData[];
  activeId?: string;
  isDesktopOpen?: boolean;
  onToggleDesktop?: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onNewChat: () => void;
  onRename: (id: string, newTitle: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onOpenSettings: () => void;
}

export function Sidebar({
  conversations,
  activeId,
  isDesktopOpen = true,
  onToggleDesktop,
  isOpenMobile,
  onCloseMobile,
  onNewChat,
  onRename,
  onDelete,
  onOpenSettings,
}: SidebarProps) {
  const content = (
    <div className="flex flex-col h-full bg-[hsl(var(--sidebar-bg))] border-r border-border w-64 sm:w-68 shrink-0 select-none">
      {/* Header / Brand & Top Actions matching ChatGPT */}
      <div className="p-3 border-b border-border/50 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-foreground text-sm px-1 py-1 rounded-lg hover:opacity-85 transition-opacity"
        >
          <div className="h-6 w-6 rounded-md bg-foreground text-background flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <span className="font-bold tracking-tight text-sm">VenGPT</span>
        </Link>

        <div className="flex items-center gap-0.5">
          {/* New Chat icon button */}
          <Button
            variant="ghost"
            size="iconSm"
            onClick={() => {
              onNewChat();
              onCloseMobile();
            }}
            title="New chat"
            aria-label="New chat"
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <SquarePen className="h-4 w-4" />
          </Button>

          {/* Desktop collapse sidebar / Mobile close */}
          <Button
            variant="ghost"
            size="iconSm"
            onClick={() => {
              if (onToggleDesktop) onToggleDesktop();
              onCloseMobile();
            }}
            title="Close sidebar"
            aria-label="Close sidebar"
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Conversations List with Search and Temporal Grouping */}
      <ConversationList
        conversations={conversations}
        activeId={activeId}
        onRename={onRename}
        onDelete={onDelete}
        onSelect={onCloseMobile}
      />

      {/* Footer / Account / Settings */}
      <div className="p-2.5 border-t border-border mt-auto bg-muted/20 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "h-7 w-7",
                },
              }}
            />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="outline" size="sm" className="text-xs h-7 px-2">
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>

          <div className="truncate text-xs font-medium text-foreground">
            My Workspace
          </div>
        </div>

        <div className="flex items-center gap-0.5 shrink-0">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="iconSm"
            onClick={onOpenSettings}
            title="Settings"
            aria-label="Settings"
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop collapsible sidebar */}
      {isDesktopOpen && (
        <aside className="hidden md:block h-screen shrink-0 animate-in slide-in-from-left-2 duration-150">
          {content}
        </aside>
      )}

      {/* Mobile drawer with backdrop */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 flex-1 max-w-xs w-full animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
