import { db } from "@/lib/db";
import { getAuthUserId } from "@/lib/auth";
import { ChatAppShell } from "@/components/chat/ChatAppShell";
import { getMemoryConversation } from "@/lib/memoryStore";

interface ConversationPageProps {
  params: Promise<{
    conversationId: string;
  }>;
}

export default async function ConversationPage({ params }: ConversationPageProps) {
  const { conversationId } = await params;
  const userId = (await getAuthUserId()) || "dev_user_local";

  let conversationTitle = "Conversation";
  let initialMessages: Array<{
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
  }> = [];

  try {
    const dbConv = await db.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (dbConv) {
      conversationTitle = dbConv.title;
      initialMessages = dbConv.messages.map((m) => ({
        id: m.id,
        role: m.role as "user" | "assistant" | "system",
        content: m.content,
      }));
    }
  } catch {
    // Check memory store fallback
  }

  if (initialMessages.length === 0) {
    const mem = getMemoryConversation(conversationId);
    if (mem) {
      conversationTitle = mem.title;
      initialMessages = mem.messages.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
      }));
    }
  }

  return (
    <ChatAppShell
      conversationId={conversationId}
      initialTitle={conversationTitle}
      initialMessages={initialMessages}
    />
  );
}
