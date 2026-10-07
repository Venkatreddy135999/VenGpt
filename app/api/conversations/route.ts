import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthUserId } from "@/lib/auth";
import {
  getAllMemoryConversations,
  saveMemoryConversation,
  clearMemoryConversations,
} from "@/lib/memoryStore";

export const dynamic = "force-dynamic";

// GET /api/conversations - List all conversations for authenticated user
export async function GET() {
  try {
    const userId = (await getAuthUserId()) || "dev_user_local";

    try {
      const conversations = await db.conversation.findMany({
        where: { clerkUserId: userId },
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          title: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (conversations.length > 0) {
        return NextResponse.json({ conversations });
      }
    } catch {
      // DB unavailable or empty, check memory fallback
    }

    const memoryConvs = getAllMemoryConversations(userId).map((c) => ({
      id: c.id,
      title: c.title,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    }));

    return NextResponse.json({ conversations: memoryConvs });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json({ conversations: [] });
  }
}

// POST /api/conversations - Create a new conversation
export async function POST(req: NextRequest) {
  try {
    const userId = (await getAuthUserId()) || "dev_user_local";
    const body = await req.json().catch(() => ({}));
    const title =
      typeof body.title === "string" && body.title.trim().length > 0
        ? body.title.trim().slice(0, 100)
        : "New Conversation";

    try {
      const conversation = await db.conversation.create({
        data: {
          clerkUserId: userId,
          title,
        },
      });
      return NextResponse.json({ conversation }, { status: 201 });
    } catch {
      // Save in memory fallback
      const id = `conv-${Date.now()}`;
      const memConv = saveMemoryConversation(id, userId, title);
      return NextResponse.json({ conversation: memConv }, { status: 201 });
    }
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json(
      { error: "Failed to create conversation." },
      { status: 500 }
    );
  }
}

// DELETE /api/conversations - Delete all conversations for current user
export async function DELETE() {
  try {
    const userId = (await getAuthUserId()) || "dev_user_local";

    try {
      await db.conversation.deleteMany({
        where: { clerkUserId: userId },
      });
    } catch {}

    clearMemoryConversations(userId);

    return NextResponse.json({
      success: true,
      message: "All conversations deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting conversations:", error);
    return NextResponse.json(
      { error: "Failed to delete conversations." },
      { status: 500 }
    );
  }
}
