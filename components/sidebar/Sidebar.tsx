"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Bot, Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConversationList } from "@/components/sidebar/ConversationList";
import { ConversationItemData } from "@/components/sidebar/ConversationItem";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@/components/auth/AuthControls";

interface SidebarProps {
  conversations: ConversationItemData[];
  activeId?: string;
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
  isOpenMobile,
  onCloseMobile,
  onNewChat,
  onRename,
  onDelete,
  onOpenSettings,
}: SidebarProps) {
  const content = (
    <div className="flex flex-col h-full bg-[hsl(var(--sidebar-bg))] border-r border-border w-72 shrink-0 select-none">
      {/* Header / Brand */}
      <div className="p-3 border-b border-border flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold text-foreground text-sm px-1 py-1 rounded-lg hover:opacity-85 transition-opacity"
        >
          <div className="h-7 w-7 rounded-lg bg-foreground text-background flex items-center justify-center">
            <Bot className="h-4 w-4" />
          </div>
          <span>AI Assistant</span>
        </Link>

        {/* Mobile close button */}
        <Button
          variant="ghost"
          size="iconSm"
          onClick={onCloseMobile}
          className="md:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <Button
          onClick={() => {
            onNewChat();
            onCloseMobile();
          }}
          className="w-full justify-start gap-2 shadow-xs bg-foreground text-background hover:opacity-90 font-medium text-xs h-9"
        >
          <Plus className="h-4 w-4" />
          <span>New Chat</span>
        </Button>
      </div>

      {/* Conversations List with Search */}
      <ConversationList
        conversations={conversations}
        activeId={activeId}
        onRename={onRename}
        onDelete={onDelete}
        onSelect={onCloseMobile}
      />

      {/* Footer / Account / Settings */}
      <div className="p-3 border-t border-border mt-auto bg-muted/20 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          {/* Clerk authentication widget */}
          <div className="shrink-0 flex items-center">
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
          </div>

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
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <aside className="hidden md:block h-screen shrink-0">
        {content}
      </aside>

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
