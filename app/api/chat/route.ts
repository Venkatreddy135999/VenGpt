import { NextRequest, NextResponse } from "next/server";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { db } from "@/lib/db";
import { getAuthUserId } from "@/lib/auth";
import { DEFAULT_SYSTEM_PROMPT, cleanTitleFromMessage } from "@/lib/ai";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to send messages." },
        { status: 401 }
      );
    }

    // 2. Check OpenAI API Key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error:
            "OpenAI API key is missing. Please configure OPENAI_API_KEY in your .env file to enable AI generation.",
        },
        { status: 500 }
      );
    }

    // 3. Parse and validate request
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
    }

    const { conversationId, messages, model, temperature } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "At least one message is required." },
        { status: 400 }
      );
    }

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || typeof lastMessage.content !== "string" || !lastMessage.content.trim()) {
      return NextResponse.json(
        { error: "Message content cannot be empty." },
        { status: 400 }
      );
    }

    // 4. Resolve or create conversation
    let conversation;
    if (conversationId) {
      conversation = await db.conversation.findUnique({
        where: { id: conversationId },
      });

      if (!conversation) {
        return NextResponse.json(
          { error: "Conversation not found." },
          { status: 404 }
        );
      }

      if (conversation.clerkUserId !== userId) {
        return NextResponse.json(
          { error: "Forbidden: You do not have access to this conversation." },
          { status: 403 }
        );
      }
    } else {
      // Auto-generate title from first user message
      const title = cleanTitleFromMessage(lastMessage.content);
      conversation = await db.conversation.create({
        data: {
          clerkUserId: userId,
          title,
        },
      });
    }

    // 5. Save the user message to database
    try {
      await db.message.create({
        data: {
          conversationId: conversation.id,
          role: "user",
          content: lastMessage.content.trim(),
        },
      });
    } catch (dbErr) {
      console.error("Failed to persist user message:", dbErr);
      // We log but continue streaming so the user isn't blocked if DB has a transient issue
    }

    // 6. Format messages for OpenAI
    const formattedMessages = messages
      .filter((m: { role?: string; content?: string }) => m.role && m.content)
      .map((m: { role: string; content: string }) => ({
        role: (m.role === "assistant" || m.role === "user" ? m.role : "user") as "user" | "assistant",
        content: m.content,
      }));

    // 7. Stream text response via Vercel AI SDK
    const modelName = model || process.env.OPENAI_MODEL || "gpt-4o-mini";
    const parsedTemp = typeof temperature === "number" ? Math.min(Math.max(temperature, 0), 2) : 0.7;

    const result = streamText({
      model: openai(modelName),
      system: DEFAULT_SYSTEM_PROMPT,
      messages: formattedMessages,
      temperature: parsedTemp,
      async onFinish({ text }) {
        if (text && text.trim().length > 0) {
          try {
            await db.message.create({
              data: {
                conversationId: conversation.id,
                role: "assistant",
                content: text,
              },
            });

            await db.conversation.update({
              where: { id: conversation.id },
              data: { updatedAt: new Date() },
            });
          } catch (saveErr) {
            console.error("Failed to save assistant message:", saveErr);
          }
        }
      },
    });

    const response = result.toTextStreamResponse();
    // Pass conversation metadata back in headers
    response.headers.set("X-Conversation-Id", conversation.id);
    response.headers.set("X-Conversation-Title", encodeURIComponent(conversation.title));

    return response;
  } catch (error: any) {
    console.error("Chat API route error:", error);

    let message = "An unexpected error occurred while communicating with the AI service.";
    let status = 500;

    if (error?.status === 401 || error?.message?.includes("API key")) {
      message = "Invalid or expired OpenAI API key. Please check your credentials.";
      status = 401;
    } else if (error?.status === 429 || error?.message?.includes("rate limit")) {
      message = "Rate limit reached. Please wait a few moments before trying again.";
      status = 429;
    } else if (error?.message?.includes("quota")) {
      message = "OpenAI quota limit reached. Please review your billing account.";
      status = 402;
    }

    return NextResponse.json({ error: message }, { status });
  }
}
