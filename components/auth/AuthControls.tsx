"use client";

import * as React from "react";
import {
  Show as ClerkShow,
  SignInButton as ClerkSignInButton,
  SignUpButton as ClerkSignUpButton,
  UserButton as ClerkUserButton,
  SignOutButton as ClerkSignOutButton,
  useUser as clerkUseUser,
  useAuth as clerkUseAuth,
} from "@clerk/nextjs";

const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export function SignedIn({ children }: { children: React.ReactNode }) {
  if (!hasClerk) {
    return <>{children}</>;
  }
  return <ClerkShow when="signed-in">{children}</ClerkShow>;
}

export function SignedOut({ children }: { children: React.ReactNode }) {
  if (!hasClerk) {
    return null;
  }
  return <ClerkShow when="signed-out">{children}</ClerkShow>;
}

export function UserButton(props: any) {
  if (!hasClerk) {
    return (
      <div
        className="h-7 w-7 rounded-full bg-primary/10 border border-border flex items-center justify-center text-xs font-semibold text-primary"
        title="Local Dev Mode (Add Clerk keys to .env)"
      >
        D
      </div>
    );
  }
  return <ClerkUserButton {...props} />;
}

export function SignInButton({ children, ...props }: any) {
  if (!hasClerk) {
    return <>{children}</>;
  }
  return <ClerkSignInButton {...props}>{children}</ClerkSignInButton>;
}

export function SignUpButton({ children, ...props }: any) {
  if (!hasClerk) {
    return <>{children}</>;
  }
  return <ClerkSignUpButton {...props}>{children}</ClerkSignUpButton>;
}

export function SignOutButton({ children, ...props }: any) {
  if (!hasClerk) {
    return <>{children}</>;
  }
  return <ClerkSignOutButton {...props}>{children}</ClerkSignOutButton>;
}

export function useUser(): any {
  if (!hasClerk) {
    return {
      isLoaded: true,
      isSignedIn: true,
      user: {
        id: "dev_user_local",
        fullName: "Local Developer",
        firstName: "Developer",
        primaryEmailAddress: { emailAddress: "developer@local.dev" },
      },
    };
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return clerkUseUser();
}

export function useAuth(): any {
  if (!hasClerk) {
    return {
      isLoaded: true,
      isSignedIn: true,
      userId: "dev_user_local",
    };
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return clerkUseAuth();
}
