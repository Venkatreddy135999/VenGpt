import { db } from "@/lib/db";
import { getAuthUserId } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { ChatAppShell } from "@/components/chat/ChatAppShell";

interface ConversationPageProps {
  params: Promise<{
    conversationId: string;
  }>;
}

export default async function ConversationPage({ params }: ConversationPageProps) {
  const { conversationId } = await params;
  const userId = await getAuthUserId();

  if (!userId) {
    redirect("/");
  }

  let conversation = null;
  try {
    conversation = await db.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });
  } catch (err) {
    console.error("Database query failed in ConversationPage:", err);
  }

  if (!conversation || conversation.clerkUserId !== userId) {
    notFound();
  }

  const initialMessages = conversation.messages.map((m) => ({
    id: m.id,
    role: m.role as "user" | "assistant" | "system",
    content: m.content,
  }));

  return (
    <ChatAppShell
      conversationId={conversation.id}
      initialTitle={conversation.title}
      initialMessages={initialMessages}
    />
  );
}
