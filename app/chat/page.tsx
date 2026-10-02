import { ChatAppShell } from "@/components/chat/ChatAppShell";
import { getAuthUserId } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NewChatPage() {
  const userId = await getAuthUserId();
  if (!userId) {
    redirect("/");
  }

  return (
    <ChatAppShell
      initialTitle="New Conversation"
      initialMessages={[]}
    />
  );
}
