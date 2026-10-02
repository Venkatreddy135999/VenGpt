export interface MemoryMessage {
  id: string;
  conversationId: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: Date;
}

export interface MemoryConversation {
  id: string;
  clerkUserId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages: MemoryMessage[];
}

const globalForStore = globalThis as unknown as {
  memoryConversations: Map<string, MemoryConversation>;
};

export const memoryStore =
  globalForStore.memoryConversations ?? new Map<string, MemoryConversation>();

if (process.env.NODE_ENV !== "production") {
  globalForStore.memoryConversations = memoryStore;
}

export function saveMemoryConversation(
  id: string,
  userId: string,
  title: string
): MemoryConversation {
  let conv = memoryStore.get(id);
  if (!conv) {
    conv = {
      id,
      clerkUserId: userId,
      title,
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [],
    };
    memoryStore.set(id, conv);
  } else {
    conv.title = title;
    conv.updatedAt = new Date();
  }
  return conv;
}

export function addMemoryMessage(
  conversationId: string,
  role: "user" | "assistant" | "system",
  content: string
): MemoryMessage {
  let conv = memoryStore.get(conversationId);
  if (!conv) {
    conv = saveMemoryConversation(conversationId, "dev_user_local", "New Conversation");
  }

  const message: MemoryMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    conversationId,
    role,
    content,
    createdAt: new Date(),
  };

  conv.messages.push(message);
  conv.updatedAt = new Date();
  return message;
}

export function getMemoryConversation(id: string): MemoryConversation | undefined {
  return memoryStore.get(id);
}

export function getAllMemoryConversations(userId: string): MemoryConversation[] {
  return Array.from(memoryStore.values())
    .filter((c) => c.clerkUserId === userId)
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

export function deleteMemoryConversation(id: string): boolean {
  return memoryStore.delete(id);
}

export function clearMemoryConversations(userId: string): void {
  for (const [id, c] of memoryStore.entries()) {
    if (c.clerkUserId === userId) {
      memoryStore.delete(id);
    }
  }
}
