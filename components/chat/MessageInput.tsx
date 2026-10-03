"use client";

import * as React from "react";
import { ArrowUp, Square, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MessageInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: () => void;
  isStreaming: boolean;
  onStop: () => void;
  disabled?: boolean;
  onOpenAttachment?: () => void;
}

export function MessageInput({
  input,
  setInput,
  onSubmit,
  isStreaming,
  onStop,
  disabled = false,
  onOpenAttachment,
}: MessageInputProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isStreaming && input.trim() && !disabled) {
        onSubmit();
      }
    }
  };

  const isInputEmpty = !input.trim();

  return (
    <div className="w-full max-w-3xl mx-auto px-3 sm:px-6 pb-3 pt-1">
      {/* ChatGPT-style rounded prompt container */}
      <div className="relative flex flex-col w-full rounded-3xl bg-[#f4f4f4] dark:bg-[#2f2f2f] border border-transparent focus-within:border-border/80 shadow-xs transition-all p-2.5">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything..."
          disabled={disabled}
          rows={1}
          maxLength={4000}
          className="w-full resize-none bg-transparent px-3 pt-1 pb-1 text-[15px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none disabled:opacity-50 min-h-[36px] max-h-[200px]"
          aria-label="Message prompt input"
        />

        <div className="flex items-center justify-between px-1 pt-1">
          <div className="flex items-center gap-1 text-muted-foreground">
            <button
              type="button"
              className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Add attachment"
              aria-label="Add attachment"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            {isStreaming ? (
              <button
                type="button"
                onClick={onStop}
                title="Stop generating"
                aria-label="Stop response generation"
                className="h-8 w-8 rounded-full bg-foreground text-background flex items-center justify-center hover:opacity-85 transition-opacity cursor-pointer"
              >
                <Square className="h-3 w-3 fill-current" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onSubmit}
                disabled={isInputEmpty || disabled}
                title="Send message"
                aria-label="Send message"
                className={`h-8 w-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  isInputEmpty
                    ? "bg-muted-foreground/20 text-muted-foreground/50 cursor-not-allowed"
                    : "bg-foreground text-background hover:opacity-90 shadow-2xs active:scale-95"
                }`}
              >
                <ArrowUp className="h-4 w-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      </div>

      <p className="text-[11px] text-center text-muted-foreground/80 mt-2 select-none">
        ChatGPT can make mistakes. Check important info.
      </p>
    </div>
  );
}
