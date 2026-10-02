import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthUserId } from "@/lib/auth";

// GET /api/conversations - List all conversations for authenticated user
export async function GET() {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations. Please verify your database connection." },
      { status: 500 }
    );
  }
}

// POST /api/conversations - Create a new conversation
export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const title = typeof body.title === "string" && body.title.trim().length > 0
      ? body.title.trim().slice(0, 100)
      : "New Conversation";

    const conversation = await db.conversation.create({
      data: {
        clerkUserId: userId,
        title,
      },
    });

    return NextResponse.json({ conversation }, { status: 201 });
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
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deleteResult = await db.conversation.deleteMany({
      where: { clerkUserId: userId },
    });

    return NextResponse.json({
      success: true,
      count: deleteResult.count,
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
