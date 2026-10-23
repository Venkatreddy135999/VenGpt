import { auth as clerkAuth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";

/**
 * Returns the authenticated Clerk user ID, custom session cookie ID,
 * or a local development user ID if Clerk keys are not yet configured.
 */
export async function getAuthUserId(): Promise<string | null> {
  const hasClerkKeys =
    Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) &&
    Boolean(process.env.CLERK_SECRET_KEY);

  if (hasClerkKeys) {
    try {
      const { userId } = await clerkAuth();
      if (userId) return userId;
    } catch (err) {
      console.error("Error retrieving Clerk user:", err);
    }
  }

  // Check custom session cookie
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("vengpt_user_id");
    if (sessionCookie?.value) {
      return sessionCookie.value;
    }
  } catch {}

  // Development mode fallback
  return "dev_user_local";
}
