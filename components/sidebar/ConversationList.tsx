"use client";

import * as React from "react";
import { Search, Trash2, AlertTriangle, MessageSquareDashed } from "lucide-react";
import {
  ConversationItem,
  ConversationItemData,
} from "@/components/sidebar/ConversationItem";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConversationListProps {
  conversations: ConversationItemData[];
  activeId?: string;
  onRename: (id: string, newTitle: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onSelect?: () => void;
}

function groupConversationsByDate(conversations: ConversationItemData[]) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - 86400000;
  const startOf7Days = startOfToday - 6 * 86400000;
  const startOf30Days = startOfToday - 29 * 86400000;

  const groups: { [key: string]: ConversationItemData[] } = {
    Today: [],
    Yesterday: [],
    "Previous 7 Days": [],
    "Previous 30 Days": [],
    Older: [],
  };

  for (const item of conversations) {
    const rawTime = item.updatedAt || item.createdAt;
    const time = rawTime ? new Date(rawTime).getTime() : startOfToday;

    if (isNaN(time) || time >= startOfToday) {
      groups["Today"].push(item);
    } else if (time >= startOfYesterday) {
      groups["Yesterday"].push(item);
    } else if (time >= startOf7Days) {
      groups["Previous 7 Days"].push(item);
    } else if (time >= startOf30Days) {
      groups["Previous 30 Days"].push(item);
    } else {
      groups["Older"].push(item);
    }
  }

  return groups;
}

export function ConversationList({
  conversations,
  activeId,
  onRename,
  onDelete,
  onSelect,
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [deleteTargetId, setDeleteTargetId] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const filtered = React.useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const query = searchQuery.toLowerCase();
    return conversations.filter((c) =>
      c.title.toLowerCase().includes(query)
    );
  }, [conversations, searchQuery]);

  const temporalGroups = React.useMemo(() => {
    if (searchQuery.trim()) return null;
    return groupConversationsByDate(conversations);
  }, [conversations, searchQuery]);

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await onDelete(deleteTargetId);
      setDeleteTargetId(null);
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const targetConversation = conversations.find((c) => c.id === deleteTargetId);

  return (
    <div className="flex flex-col flex-1 overflow-hidden select-none">
      {/* Search Bar */}
      <div className="px-3 pb-2 pt-1">
        <div className="relative flex items-center">
          <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chats..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      {/* List Container */}
      <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
            <MessageSquareDashed className="h-8 w-8 mb-2 opacity-40" />
            <p className="text-xs">
              {searchQuery ? "No matching conversations found." : "No conversations yet."}
            </p>
          </div>
        ) : temporalGroups ? (
          /* ChatGPT Temporal Grouping (Today, Yesterday, Previous 7 Days, etc.) */
          Object.entries(temporalGroups).map(([groupTitle, items]) => {
            if (items.length === 0) return null;
            return (
              <div key={groupTitle} className="mb-3">
                <div className="px-2 pt-2.5 pb-1 text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wider">
                  {groupTitle}
                </div>
                <div className="space-y-0.5">
                  {items.map((item) => (
                    <ConversationItem
                      key={item.id}
                      conversation={item}
                      isActive={item.id === activeId}
                      onRename={onRename}
                      onDelete={(id) => setDeleteTargetId(id)}
                      onSelect={onSelect}
                    />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          /* Flat list during active search filtering */
          filtered.map((item) => (
            <ConversationItem
              key={item.id}
              conversation={item}
              isActive={item.id === activeId}
              onRename={onRename}
              onDelete={(id) => setDeleteTargetId(id)}
              onSelect={onSelect}
            />
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={Boolean(deleteTargetId)}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Conversation?
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{targetConversation?.title || "this conversation"}&rdquo;?
              This will permanently remove all messages in this conversation.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteTargetId(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
