"use client";

import * as React from "react";
import { ArrowUp, Square, Plus, Globe, Mic, MicOff } from "lucide-react";

interface MessageInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (options?: { webSearch?: boolean }) => void;
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
  const [isWebSearch, setIsWebSearch] = React.useState(false);
  const [isListening, setIsListening] = React.useState(false);
  const recognitionRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [input]);

  // Clean up speech recognition on unmount
  React.useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, []);

  const handleToggleVoice = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsListening(false);
      return;
    }

    if (
      typeof window === "undefined" ||
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      alert("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript.trim()) {
          setInput(input ? `${input.trim()} ${transcript.trim()}` : transcript.trim());
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSend = () => {
    if (!isStreaming && input.trim() && !disabled) {
      onSubmit({ webSearch: isWebSearch });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
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
          placeholder="Message VenGPT..."
          disabled={disabled}
          rows={1}
          maxLength={4000}
          className="w-full resize-none bg-transparent px-3 pt-1 pb-1 text-[15px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none disabled:opacity-50 min-h-[38px] max-h-[200px]"
          aria-label="Message prompt input"
        />

        <div className="flex items-center justify-between px-1 pt-1.5">
          {/* Left tools: Attachment (+) and Web Search toggle */}
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <button
              type="button"
              onClick={onOpenAttachment}
              className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Add attachment or curated prompt"
              aria-label="Add attachment"
            >
              <Plus className="h-4 w-4" />
            </button>

            {/* ChatGPT Web Search toggle */}
            <button
              type="button"
              onClick={() => setIsWebSearch((prev) => !prev)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                isWebSearch
                  ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 shadow-2xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10"
              }`}
              title={isWebSearch ? "Web Search enabled" : "Search the web"}
              aria-label="Toggle web search"
            >
              <Globe className="h-3.5 w-3.5" />
              <span className="text-[11px] font-medium">Search</span>
            </button>
          </div>

          {/* Right tools: Voice Input and Send/Stop button */}
          <div className="flex items-center gap-1.5 ml-auto">
            {/* Voice Dictation (Mic) */}
            <button
              type="button"
              onClick={handleToggleVoice}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                isListening
                  ? "bg-rose-500/20 text-rose-500 animate-pulse border border-rose-500/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10"
              }`}
              title={isListening ? "Listening... click to stop" : "Voice dictation"}
              aria-label="Voice input"
            >
              {isListening ? (
                <MicOff className="h-4 w-4 text-rose-500" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </button>

            {/* Circular Send / Stop button matching ChatGPT */}
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
                onClick={handleSend}
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
        VenGPT can make mistakes. Verify important information.
      </p>
    </div>
  );
}
