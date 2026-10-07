export interface UserRequest {
  prompt: string;
  conversationHistory: Array<{ role: "user" | "assistant" | "system"; content: string }>;
  model?: string;
  temperature?: number;
  parameters?: Record<string, any>;
  extractedEntities?: Record<string, any>;
}

export interface ToolResult {
  type: "text" | "image" | "data" | "error";
  content: string; // The primary markdown response or description
  imageUrl?: string;
  imageAlt?: string;
  imagePrompt?: string;
  metadata?: Record<string, any>;
}

export interface AITool {
  getName(): string;
  getDescription(): string;
  canHandle(request: UserRequest): boolean;
  execute(request: UserRequest): Promise<ToolResult>;
}
