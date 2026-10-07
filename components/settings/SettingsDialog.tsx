"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AVAILABLE_MODELS } from "@/lib/ai";
import {
  Sun,
  Moon,
  Laptop,
  Trash2,
  Cpu,
  Palette,
  Database,
  User,
  AlertTriangle,
  LogOut,
  Sparkles,
} from "lucide-react";
import { SignOutButton, useUser } from "@/components/auth/AuthControls";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
  temperature: number;
  onTemperatureChange: (temp: number) => void;
  onClearAllConversations: () => Promise<void>;
}

export function SettingsDialog({
  open,
  onOpenChange,
  selectedModel,
  onModelChange,
  temperature,
  onTemperatureChange,
  onClearAllConversations,
}: SettingsDialogProps) {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = React.useState<"appearance" | "ai" | "data" | "account">("appearance");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Clerk hook - safely handle if Clerk is not mounted
  let clerkUser = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const authData = useUser();
    clerkUser = authData?.user;
  } catch {
    // dev mode fallback
  }

  const handleDeleteAll = async () => {
    setIsDeleting(true);
    try {
      await onClearAllConversations();
      setConfirmDeleteOpen(false);
      onOpenChange(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
          <div className="flex border-b border-border">
            <div className="p-4 flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-primary" />
              <span className="font-semibold text-base">VenGPT Settings</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row min-h-[340px]">
            {/* Sidebar navigation */}
            <div className="w-full sm:w-44 border-b sm:border-b-0 sm:border-r border-border p-2 space-y-1 bg-muted/20">
              <button
                onClick={() => setActiveTab("appearance")}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors text-left cursor-pointer ${
                  activeTab === "appearance"
                    ? "bg-foreground text-background font-medium"
                    : "hover:bg-muted text-foreground"
                }`}
              >
                <Palette className="h-4 w-4" />
                <span>Appearance</span>
              </button>

              <button
                onClick={() => setActiveTab("ai")}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors text-left cursor-pointer ${
                  activeTab === "ai"
                    ? "bg-foreground text-background font-medium"
                    : "hover:bg-muted text-foreground"
                }`}
              >
                <Cpu className="h-4 w-4" />
                <span>AI Model</span>
              </button>

              <button
                onClick={() => setActiveTab("data")}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors text-left cursor-pointer ${
                  activeTab === "data"
                    ? "bg-foreground text-background font-medium"
                    : "hover:bg-muted text-foreground"
                }`}
              >
                <Database className="h-4 w-4" />
                <span>Data</span>
              </button>

              <button
                onClick={() => setActiveTab("account")}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors text-left cursor-pointer ${
                  activeTab === "account"
                    ? "bg-foreground text-background font-medium"
                    : "hover:bg-muted text-foreground"
                }`}
              >
                <User className="h-4 w-4" />
                <span>Account</span>
              </button>
            </div>

            {/* Tab content */}
            <div className="flex-1 p-5 overflow-y-auto max-h-[380px]">
              {/* Appearance Tab */}
              {activeTab === "appearance" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1">Theme</h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      Select your preferred interface color theme.
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setTheme("light")}
                        className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs gap-2 transition-all cursor-pointer ${
                          theme === "light"
                            ? "border-primary bg-primary/10 font-semibold"
                            : "border-border hover:bg-muted"
                        }`}
                      >
                        <Sun className="h-5 w-5" />
                        <span>Light</span>
                      </button>

                      <button
                        onClick={() => setTheme("dark")}
                        className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs gap-2 transition-all cursor-pointer ${
                          theme === "dark"
                            ? "border-primary bg-primary/10 font-semibold"
                            : "border-border hover:bg-muted"
                        }`}
                      >
                        <Moon className="h-5 w-5" />
                        <span>Dark</span>
                      </button>

                      <button
                        onClick={() => setTheme("system")}
                        className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs gap-2 transition-all cursor-pointer ${
                          theme === "system"
                            ? "border-primary bg-primary/10 font-semibold"
                            : "border-border hover:bg-muted"
                        }`}
                      >
                        <Laptop className="h-5 w-5" />
                        <span>System</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Tab */}
              {activeTab === "ai" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-1">Model Selection</label>
                    <p className="text-xs text-muted-foreground mb-2">
                      Choose which OpenAI model powers your assistant.
                    </p>
                    <select
                      value={selectedModel}
                      onChange={(e) => onModelChange(e.target.value)}
                      className="w-full text-sm rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                      {["OpenAI", "DeepSeek", "xAI (Grok)", "Anthropic", "Google", "Open Source / Astra"].map((provider) => {
                        const models = AVAILABLE_MODELS.filter((m) => m.provider === provider);
                        if (models.length === 0) return null;
                        return (
                          <optgroup key={provider} label={provider}>
                            {models.map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.name} - {m.description}
                              </option>
                            ))}
                          </optgroup>
                        );
                      })}
                    </select>
                  </div>

                  <div className="pt-2">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-sm font-medium">Temperature</label>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-muted">
                        {temperature.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Lower values produce focused, deterministic outputs. Higher values produce creative answers.
                    </p>
                    <input
                      type="range"
                      min="0"
                      max="1.5"
                      step="0.1"
                      value={temperature}
                      onChange={(e) => onTemperatureChange(parseFloat(e.target.value))}
                      className="w-full accent-primary cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
                      <span>Precise (0.0)</span>
                      <span>Balanced (0.7)</span>
                      <span>Creative (1.5)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Data Tab */}
              {activeTab === "data" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1">Conversation History</h3>
                    <p className="text-xs text-muted-foreground mb-4">
                      Manage stored conversations and message data.
                    </p>
                    <div className="p-3.5 rounded-lg border border-destructive/20 bg-destructive/5 space-y-2">
                      <div className="flex items-center gap-2 text-destructive font-medium text-sm">
                        <AlertTriangle className="h-4 w-4" />
                        <span>Delete All Conversations</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Permanently remove all previous conversations and messages. This action cannot be undone.
                      </p>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setConfirmDeleteOpen(true)}
                        className="mt-2 text-xs"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                        Delete All Chats
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Tab */}
              {activeTab === "account" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1">Account Information</h3>
                    <p className="text-xs text-muted-foreground mb-4">
                      Your identity and authentication profile.
                    </p>
                    <div className="p-3.5 rounded-lg border border-border bg-muted/30 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                          {clerkUser?.firstName?.charAt(0) || "U"}
                        </div>
                        <div>
                          <div className="text-sm font-medium">
                            {clerkUser?.fullName || clerkUser?.primaryEmailAddress?.emailAddress || "Current User"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {clerkUser?.primaryEmailAddress?.emailAddress || "Authenticated via Clerk"}
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-border">
                        <SignOutButton>
                          <Button variant="outline" size="sm" className="w-full text-xs gap-1.5">
                            <LogOut className="h-3.5 w-3.5" />
                            Sign Out
                          </Button>
                        </SignOutButton>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Delete All */}
      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete All Conversations?
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete all your conversation history? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirmDeleteOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteAll}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Yes, Delete All"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
