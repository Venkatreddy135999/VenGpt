"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { TypingIndicator } from "@/components/chat/TypingIndicator";

export interface MessageItem {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
}

interface MessageListProps {
  messages: MessageItem[];
  isStreaming: boolean;
  streamingContent?: string;
  onRegenerateLast?: () => void;
}

export function MessageList({
  messages,
  isStreaming,
  streamingContent = "",
  onRegenerateLast,
}: MessageListProps) {
  const bottomRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [showScrollBottom, setShowScrollBottom] = React.useState(false);

  // Auto-scroll when messages or streaming content changes
  React.useEffect(() => {
    if (!showScrollBottom) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, streamingContent, isStreaming, showScrollBottom]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    setShowScrollBottom(distanceFromBottom > 160);
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollBottom(false);
  };

  return (
    <div className="relative flex-1 flex flex-col overflow-hidden">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-2 sm:px-6 py-4 space-y-2 w-full max-w-4xl mx-auto"
      >
        {messages.map((msg, index) => {
          const isLastAssistant =
            index === messages.length - 1 && msg.role === "assistant";

          return (
            <MessageBubble
              key={msg.id || index}
              id={msg.id}
              role={msg.role}
              content={msg.content}
              isLast={isLastAssistant}
              onRegenerate={isLastAssistant ? onRegenerateLast : undefined}
            />
          );
        })}

        {/* Render actively streaming assistant response */}
        {isStreaming && streamingContent && (
          <MessageBubble
            id="streaming-message"
            role="assistant"
            content={streamingContent}
            isStreaming={true}
          />
        )}

        {/* Render typing indicator if streaming started but no tokens received yet */}
        {isStreaming && !streamingContent && <TypingIndicator />}

        <div ref={bottomRef} className="h-4" />
      </div>

      {/* Floating scroll to bottom button */}
      {showScrollBottom && (
        <button
          onClick={scrollToBottom}
          aria-label="Scroll to bottom"
          className="absolute bottom-4 right-6 z-10 p-2 rounded-full border border-border/80 bg-background/90 text-foreground shadow-md hover:bg-muted transition-all animate-in fade-in zoom-in-95 cursor-pointer active:scale-95"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
