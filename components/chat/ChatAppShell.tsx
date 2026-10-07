"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { SettingsDialog } from "@/components/settings/SettingsDialog";
import { ConversationItemData } from "@/components/sidebar/ConversationItem";
import { MessageItem } from "@/components/chat/MessageList";

interface ChatAppShellProps {
  conversationId?: string;
  initialTitle?: string;
  initialMessages?: MessageItem[];
}

export function ChatAppShell({
  conversationId,
  initialTitle,
  initialMessages = [],
}: ChatAppShellProps) {
  const router = useRouter();
  const [conversations, setConversations] = React.useState<ConversationItemData[]>([]);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = React.useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [selectedModel, setSelectedModel] = React.useState("gpt-4o-mini");
  const [temperature, setTemperature] = React.useState(0.7);

  // Load user settings from localStorage on client
  React.useEffect(() => {
    try {
      const savedModel = localStorage.getItem("ai_assistant_model");
      if (savedModel) setSelectedModel(savedModel);
      const savedTemp = localStorage.getItem("ai_assistant_temp");
      if (savedTemp) setTemperature(parseFloat(savedTemp));
      const savedSidebar = localStorage.getItem("vengpt_sidebar_open");
      if (savedSidebar !== null) {
        setIsDesktopSidebarOpen(savedSidebar === "true");
      }
    } catch {
      // storage unavailable
    }
  }, []);

  const handleToggleDesktopSidebar = () => {
    setIsDesktopSidebarOpen((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("vengpt_sidebar_open", next ? "true" : "false");
      } catch {}
      return next;
    });
  };

  const handleToggleSidebar = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsMobileSidebarOpen((prev) => !prev);
    } else {
      handleToggleDesktopSidebar();
    }
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    try {
      localStorage.setItem("ai_assistant_model", model);
    } catch {}
  };

  const handleTemperatureChange = (temp: number) => {
    setTemperature(temp);
    try {
      localStorage.setItem("ai_assistant_temp", temp.toString());
    } catch {}
  };

  // Fetch conversations list
  const fetchConversations = React.useCallback(async () => {
    try {
      const res = await fetch("/api/conversations");
      if (res.ok) {
        const data = await res.json();
        if (data?.conversations) {
          setConversations(data.conversations);
        }
      }
    } catch (err) {
      console.error("Failed to load conversations:", err);
    }
  }, []);

  React.useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const handleNewChat = () => {
    router.push("/chat");
  };

  const handleRename = async (id: string, newTitle: string) => {
    try {
      const res = await fetch(`/api/conversations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });
      if (res.ok) {
        setConversations((prev) =>
          prev.map((c) => (c.id === id ? { ...c, title: newTitle } : c))
        );
      }
    } catch (err) {
      console.error("Rename error:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/conversations/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setConversations((prev) => prev.filter((c) => c.id !== id));
        if (conversationId === id) {
          router.push("/chat");
        }
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleClearAll = async () => {
    try {
      const res = await fetch("/api/conversations", {
        method: "DELETE",
      });
      if (res.ok) {
        setConversations([]);
        router.push("/chat");
      }
    } catch (err) {
      console.error("Clear all error:", err);
    }
  };

  const handleConversationCreated = (newId: string, newTitle: string) => {
    setConversations((prev) => [
      {
        id: newId,
        title: newTitle,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      ...prev.filter((c) => c.id !== newId),
    ]);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Sidebar (Collapsible Desktop and Mobile drawer) */}
      <Sidebar
        conversations={conversations}
        activeId={conversationId}
        isDesktopOpen={isDesktopSidebarOpen}
        onToggleDesktop={handleToggleDesktopSidebar}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onNewChat={handleNewChat}
        onRename={handleRename}
        onDelete={handleDelete}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Chat View */}
      <ChatContainer
        conversationId={conversationId}
        initialTitle={initialTitle}
        initialMessages={initialMessages}
        selectedModel={selectedModel}
        onModelChange={handleModelChange}
        temperature={temperature}
        isSidebarOpen={isDesktopSidebarOpen}
        onToggleSidebar={handleToggleSidebar}
        onNewChat={handleNewChat}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onConversationCreated={handleConversationCreated}
      />

      {/* Settings Dialog */}
      <SettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        selectedModel={selectedModel}
        onModelChange={handleModelChange}
        temperature={temperature}
        onTemperatureChange={handleTemperatureChange}
        onClearAllConversations={handleClearAll}
      />
    </div>
  );
}
