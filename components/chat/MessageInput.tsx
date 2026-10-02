"use client";

import * as React from "react";
import { ArrowUp, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MessageInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: () => void;
  isStreaming: boolean;
  onStop: () => void;
  disabled?: boolean;
}

export function MessageInput({
  input,
  setInput,
  onSubmit,
  isStreaming,
  onStop,
  disabled = false,
}: MessageInputProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
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
  const maxChars = 4000;
  const currentChars = input.length;

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-6 pb-4 pt-1">
      <div className="relative flex flex-col w-full rounded-2xl border border-border bg-card shadow-xs focus-within:ring-1 focus-within:ring-ring focus-within:border-ring transition-all">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message AI Assistant... (Shift + Enter for new line)"
          disabled={disabled}
          rows={1}
          maxLength={maxChars}
          className="w-full resize-none bg-transparent px-4 pt-3.5 pb-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50 min-h-[44px] max-h-[200px]"
          aria-label="Message prompt input"
        />

        <div className="flex items-center justify-between px-3 pb-2 pt-1">
          {/* Character counter */}
          <div className="text-[11px] text-muted-foreground select-none pl-1">
            {currentChars > 50 && (
              <span>
                {currentChars} / {maxChars}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            {isStreaming ? (
              <Button
                type="button"
                size="iconSm"
                variant="default"
                onClick={onStop}
                title="Stop generating"
                aria-label="Stop response generation"
                className="h-8 w-8 rounded-full bg-foreground text-background hover:opacity-80 transition-opacity"
              >
                <Square className="h-3.5 w-3.5 fill-current" />
              </Button>
            ) : (
              <Button
                type="button"
                size="iconSm"
                variant="default"
                onClick={onSubmit}
                disabled={isInputEmpty || disabled}
                title="Send message (Enter)"
                aria-label="Send message"
                className="h-8 w-8 rounded-full bg-foreground text-background disabled:opacity-30 disabled:pointer-events-none hover:opacity-90 transition-opacity"
              >
                <ArrowUp className="h-4 w-4 stroke-[2.5]" />
              </Button>
            )}
          </div>
        </div>
      </div>
      <p className="text-[11px] text-center text-muted-foreground mt-2 select-none">
        AI Assistant may make mistakes. Verify critical facts and code before production use.
      </p>
    </div>
  );
}
