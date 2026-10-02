import { auth as clerkAuth } from "@clerk/nextjs/server";

/**
 * Returns the authenticated Clerk user ID, or a local development user ID
 * if Clerk keys are not yet configured in .env.
 */
export async function getAuthUserId(): Promise<string | null> {
  const hasClerkKeys =
    Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) &&
    Boolean(process.env.CLERK_SECRET_KEY);

  if (!hasClerkKeys) {
    // Development mode fallback when Clerk keys are yet to be supplied
    return "dev_user_local";
  }

  try {
    const { userId } = await clerkAuth();
    return userId;
  } catch (err) {
    console.error("Error retrieving Clerk user:", err);
    return null;
  }
}
