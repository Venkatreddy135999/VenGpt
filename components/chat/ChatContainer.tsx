"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { MessageList, MessageItem } from "@/components/chat/MessageList";
import { MessageInput } from "@/components/chat/MessageInput";
import { EmptyChat } from "@/components/chat/EmptyChat";
import { AlertCircle, X } from "lucide-react";

interface ChatContainerProps {
  conversationId?: string;
  initialTitle?: string;
  initialMessages?: MessageItem[];
  selectedModel: string;
  onModelChange?: (model: string) => void;
  temperature: number;
  onToggleSidebar?: () => void;
  onNewChat: () => void;
  onOpenSettings: () => void;
  onConversationCreated?: (id: string, title: string) => void;
}

export function ChatContainer({
  conversationId,
  initialTitle = "New Conversation",
  initialMessages = [],
  selectedModel,
  onModelChange,
  temperature,
  onToggleSidebar,
  onNewChat,
  onOpenSettings,
  onConversationCreated,
}: ChatContainerProps) {
  const router = useRouter();
  const [messages, setMessages] = React.useState<MessageItem[]>(initialMessages);
  const [input, setInput] = React.useState("");
  const [isStreaming, setIsStreaming] = React.useState(false);
  const [streamingContent, setStreamingContent] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [title, setTitle] = React.useState(initialTitle);

  const abortControllerRef = React.useRef<AbortController | null>(null);
  const activeConversationIdRef = React.useRef<string | undefined>(conversationId);

  // Sync state if conversationId or initialMessages change from route navigation
  React.useEffect(() => {
    activeConversationIdRef.current = conversationId;
    setMessages(initialMessages);
    setTitle(initialTitle);
    setError(null);
  }, [conversationId, initialMessages, initialTitle]);

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (streamingContent) {
      setMessages((prev) => [
        ...prev,
        {
          id: `interrupted-${Date.now()}`,
          role: "assistant",
          content: streamingContent,
        },
      ]);
    }
    setStreamingContent("");
    setIsStreaming(false);
  };

  const sendMessage = async (overridePrompt?: string) => {
    const textToSend = (overridePrompt ?? input).trim();
    if (!textToSend || isStreaming) return;

    setError(null);
    setInput("");

    const userMessage: MessageItem = {
      id: `user-${Date.now()}`,
      role: "user",
      content: textToSend,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsStreaming(true);
    setStreamingContent("");

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          conversationId: activeConversationIdRef.current,
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          model: selectedModel,
          temperature,
        }),
      });

      if (!response.ok) {
        let errMessage = "Failed to communicate with AI Assistant.";
        try {
          const errData = await response.json();
          if (errData?.error) errMessage = errData.error;
        } catch {}
        setError(errMessage);
        setIsStreaming(false);
        setStreamingContent("");
        return;
      }

      // Check headers for new conversation ID
      const returnedConvId = response.headers.get("X-Conversation-Id");
      const returnedTitleEncoded = response.headers.get("X-Conversation-Title");
      const returnedTitle = returnedTitleEncoded
        ? decodeURIComponent(returnedTitleEncoded)
        : undefined;

      if (returnedConvId && returnedConvId !== activeConversationIdRef.current) {
        activeConversationIdRef.current = returnedConvId;
        if (returnedTitle) setTitle(returnedTitle);
        if (onConversationCreated) {
          onConversationCreated(returnedConvId, returnedTitle || "New Conversation");
        }
        // Seamlessly update browser URL without full reload
        window.history.replaceState(null, "", `/chat/${returnedConvId}`);
      }

      if (!response.body) {
        setError("No response body received from server.");
        setIsStreaming(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        setStreamingContent(accumulated);
      }

      if (accumulated.trim()) {
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: accumulated,
          },
        ]);
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        // Handled cleanly in handleStop
        return;
      }
      setError(err?.message || "An unexpected error occurred.");
    } finally {
      setIsStreaming(false);
      setStreamingContent("");
      abortControllerRef.current = null;
    }
  };

  const handleRegenerateLast = async () => {
    if (messages.length === 0 || isStreaming) return;

    // Remove last assistant message
    const trimmed = [...messages];
    if (trimmed[trimmed.length - 1]?.role === "assistant") {
      trimmed.pop();
    }
    if (trimmed.length === 0) return;

    const lastUserMessage = trimmed[trimmed.length - 1];
    if (lastUserMessage?.role !== "user") return;

    setMessages(trimmed.slice(0, trimmed.length - 1));
    await sendMessage(lastUserMessage.content);
  };

  return (
    <div className="flex flex-col flex-1 h-screen overflow-hidden bg-background">
      {/* Header */}
      <ChatHeader
        title={title}
        modelName={selectedModel}
        onModelChange={onModelChange}
        onToggleSidebar={onToggleSidebar}
        onNewChat={onNewChat}
        onOpenSettings={onOpenSettings}
      />

      {/* Error banner */}
      {error && (
        <div className="mx-4 mt-3 p-3 rounded-lg border border-destructive/40 bg-destructive/10 text-destructive text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="p-1 hover:opacity-70 rounded cursor-pointer"
            aria-label="Dismiss error"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Main chat viewport */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {messages.length === 0 && !isStreaming ? (
          <EmptyChat onSelectPrompt={(prompt) => sendMessage(prompt)} />
        ) : (
          <MessageList
            messages={messages}
            isStreaming={isStreaming}
            streamingContent={streamingContent}
            onRegenerateLast={handleRegenerateLast}
          />
        )}
      </main>

      {/* Multiline Input box */}
      <MessageInput
        input={input}
        setInput={setInput}
        onSubmit={() => sendMessage()}
        isStreaming={isStreaming}
        onStop={handleStop}
        disabled={isStreaming}
      />
    </div>
  );
}
