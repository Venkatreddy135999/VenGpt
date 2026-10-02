import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthUserId } from "@/lib/auth";

interface RouteParams {
  params: Promise<{
    conversationId: string;
  }>;
}

// GET /api/conversations/[conversationId]
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { conversationId } = await params;
    if (!conversationId) {
      return NextResponse.json({ error: "Missing conversation ID" }, { status: 400 });
    }

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

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    // Security: ensure user owns this conversation
    if (conversation.clerkUserId !== userId) {
      return NextResponse.json({ error: "Forbidden: Not your conversation" }, { status: 403 });
    }

    return NextResponse.json({ conversation });
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
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { conversationId } = await params;
    const body = await req.json().catch(() => ({}));
    const { title } = body;

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json({ error: "Valid title is required" }, { status: 400 });
    }

    const existing = await db.conversation.findUnique({
      where: { id: conversationId },
      select: { clerkUserId: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    if (existing.clerkUserId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await db.conversation.update({
      where: { id: conversationId },
      data: {
        title: title.trim().slice(0, 100),
      },
    });

    return NextResponse.json({ conversation: updated });
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
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { conversationId } = await params;
    const existing = await db.conversation.findUnique({
      where: { id: conversationId },
      select: { clerkUserId: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    if (existing.clerkUserId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.conversation.delete({
      where: { id: conversationId },
    });

    return NextResponse.json({ success: true, message: "Conversation deleted." });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return NextResponse.json(
      { error: "Failed to delete conversation." },
      { status: 500 }
    );
  }
}
