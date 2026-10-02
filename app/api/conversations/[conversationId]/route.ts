import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthUserId } from "@/lib/auth";
import {
  getMemoryConversation,
  deleteMemoryConversation,
  saveMemoryConversation,
} from "@/lib/memoryStore";

interface RouteParams {
  params: Promise<{
    conversationId: string;
  }>;
}

// GET /api/conversations/[conversationId]
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const userId = (await getAuthUserId()) || "dev_user_local";
    const { conversationId } = await params;

    if (!conversationId) {
      return NextResponse.json({ error: "Missing conversation ID" }, { status: 400 });
    }

    try {
      const conversation = await db.conversation.findUnique({
        where: { id: conversationId },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
            select: {
              id: true,
              role: true,
              content: true,
              createdAt: true,
            },
          },
        },
      });

      if (conversation) {
        return NextResponse.json({ conversation });
      }
    } catch {
      // Check memory store
    }

    const mem = getMemoryConversation(conversationId);
    if (mem) {
      return NextResponse.json({
        conversation: {
          id: mem.id,
          title: mem.title,
          createdAt: mem.createdAt.toISOString(),
          updatedAt: mem.updatedAt.toISOString(),
          messages: mem.messages,
        },
      });
    }

    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversation." },
      { status: 500 }
    );
  }
}

// PATCH /api/conversations/[conversationId] - Rename
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const userId = (await getAuthUserId()) || "dev_user_local";
    const { conversationId } = await params;
    const body = await req.json().catch(() => ({}));
    const { title } = body;

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json({ error: "Valid title is required" }, { status: 400 });
    }

    const newTitle = title.trim().slice(0, 100);

    try {
      const updated = await db.conversation.update({
        where: { id: conversationId },
        data: { title: newTitle },
      });
      return NextResponse.json({ conversation: updated });
    } catch {}

    const mem = getMemoryConversation(conversationId);
    if (mem) {
      mem.title = newTitle;
      mem.updatedAt = new Date();
      return NextResponse.json({ conversation: mem });
    }

    return NextResponse.json({ conversation: { id: conversationId, title: newTitle } });
  } catch (error) {
    console.error("Error updating conversation:", error);
    return NextResponse.json(
      { error: "Failed to update conversation." },
      { status: 500 }
    );
  }
}

// DELETE /api/conversations/[conversationId]
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { conversationId } = await params;

    try {
      await db.conversation.delete({
        where: { id: conversationId },
      });
    } catch {}

    deleteMemoryConversation(conversationId);

    return NextResponse.json({ success: true, message: "Conversation deleted." });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return NextResponse.json(
      { error: "Failed to delete conversation." },
      { status: 500 }
    );
  }
}
