"use client";

import * as React from "react";
import Link from "next/link";
import { MessageSquare, MoreHorizontal, Pencil, Trash2, Check, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/utils";

export interface ConversationItemData {
  id: string;
  title: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface ConversationItemProps {
  conversation: ConversationItemData;
  isActive: boolean;
  onRename: (id: string, newTitle: string) => Promise<void>;
  onDelete: (id: string) => void;
  onSelect?: () => void;
}

export function ConversationItem({
  conversation,
  isActive,
  onRename,
  onDelete,
  onSelect,
}: ConversationItemProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [titleInput, setTitleInput] = React.useState(conversation.title);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleSaveRename = async () => {
    if (titleInput.trim() && titleInput !== conversation.title) {
      await onRename(conversation.id, titleInput.trim());
    } else {
      setTitleInput(conversation.title);
    }
    setIsEditing(false);
  };

  const handleCancelRename = () => {
    setTitleInput(conversation.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveRename();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancelRename();
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-muted text-foreground text-sm">
        <input
          ref={inputRef}
          type="text"
          value={titleInput}
          onChange={(e) => setTitleInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-0 bg-background border border-border rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
        />
        <button
          onClick={handleSaveRename}
          className="p-1 hover:text-emerald-500 rounded cursor-pointer"
          title="Save title"
        >
          <Check className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={handleCancelRename}
          className="p-1 hover:text-destructive rounded cursor-pointer"
          title="Cancel"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`group relative flex items-center justify-between rounded-lg px-2.5 py-2 text-sm transition-colors cursor-pointer select-none ${
        isActive
          ? "bg-muted font-medium text-foreground"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
      }`}
    >
      <Link
        href={`/chat/${conversation.id}`}
        onClick={onSelect}
        className="flex items-center gap-2.5 min-w-0 flex-1 mr-1"
      >
        <MessageSquare className="h-4 w-4 shrink-0 opacity-70" />
        <div className="flex flex-col min-w-0 flex-1">
          <span className="truncate text-xs leading-snug">
            {conversation.title}
          </span>
          <span className="text-[10px] text-muted-foreground/70 font-normal">
            {formatDate(conversation.updatedAt)}
          </span>
        </div>
      </Link>

      <div className="flex items-center shrink-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-background/80 transition-colors cursor-pointer"
              aria-label="Conversation options"
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="gap-2 text-xs"
            >
              <Pencil className="h-3.5 w-3.5" />
              <span>Rename</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete(conversation.id);
              }}
              className="gap-2 text-xs text-destructive focus:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
