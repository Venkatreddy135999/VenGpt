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
    <div className="flex flex-col flex-1 overflow-hidden">
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
        ) : (
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
