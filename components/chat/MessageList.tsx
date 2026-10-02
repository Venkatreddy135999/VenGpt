"use client";

import * as React from "react";
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

  // Auto-scroll when messages or streaming content changes
  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent, isStreaming]);

  return (
    <div
      ref={containerRef}
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
  );
}
