"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Show as ClerkShow,
  SignInButton as ClerkSignInButton,
  SignUpButton as ClerkSignUpButton,
  UserButton as ClerkUserButton,
  SignOutButton as ClerkSignOutButton,
  useUser as clerkUseUser,
  useAuth as clerkUseAuth,
} from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User as UserIcon, Settings, Sparkles } from "lucide-react";

const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

interface CustomUserSession {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  signedInAt?: string;
}

function getStoredSession(): CustomUserSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("vengpt_user_session");
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

export function SignedIn({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  const [session, setSession] = React.useState<CustomUserSession | null>(null);

  React.useEffect(() => {
    setMounted(true);
    setSession(getStoredSession());

    const handleStorage = () => setSession(getStoredSession());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  if (hasClerk) {
    return <ClerkShow when="signed-in">{children}</ClerkShow>;
  }

  if (!mounted) return null;
  // If no session exists yet, default to dev mode access
  return session !== null || true ? <>{children}</> : null;
}

export function SignedOut({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  const [session, setSession] = React.useState<CustomUserSession | null>(null);

  React.useEffect(() => {
    setMounted(true);
    setSession(getStoredSession());

    const handleStorage = () => setSession(getStoredSession());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  if (hasClerk) {
    return <ClerkShow when="signed-out">{children}</ClerkShow>;
  }

  if (!mounted) return null;
  return session === null ? <>{children}</> : null;
}

export function UserButton(props: any) {
  const router = useRouter();
  const [session, setSession] = React.useState<CustomUserSession | null>(null);

  React.useEffect(() => {
    setSession(getStoredSession());
  }, []);

  if (hasClerk) {
    return <ClerkUserButton {...props} />;
  }

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("vengpt_user_session");
      document.cookie = "vengpt_user_id=; path=/; max-age=0";
      document.cookie = "vengpt_user_email=; path=/; max-age=0";
      document.cookie = "vengpt_user_name=; path=/; max-age=0";
    }
    router.push("/sign-in");
    router.refresh();
  };

  const displayName = session?.name || "Developer";
  const displayEmail = session?.email || "developer@vengpt.ai";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="h-7 w-7 rounded-full bg-gradient-to-tr from-[#10a37f] to-emerald-400 text-white font-bold text-xs flex items-center justify-center hover:opacity-90 transition-opacity shadow-xs cursor-pointer select-none"
          title={displayName}
          aria-label="User Account Menu"
        >
          {initial}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-1 shadow-lg">
        <DropdownMenuLabel className="font-normal px-2 py-1.5">
          <div className="flex flex-col space-y-0.5">
            <p className="text-xs font-semibold text-foreground truncate">{displayName}</p>
            <p className="text-[11px] text-muted-foreground truncate">{displayEmail}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuItem asChild>
          <Link href="/chat" className="flex items-center gap-2 text-xs cursor-pointer">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>New Chat</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleSignOut}
          className="flex items-center gap-2 text-xs text-destructive focus:text-destructive cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SignInButton({ children, mode, ...props }: any) {
  if (hasClerk) {
    return <ClerkSignInButton mode={mode} {...props}>{children}</ClerkSignInButton>;
  }

  return (
    <Link href="/sign-in" className="inline-block">
      {children}
    </Link>
  );
}

export function SignUpButton({ children, mode, ...props }: any) {
  if (hasClerk) {
    return <ClerkSignUpButton mode={mode} {...props}>{children}</ClerkSignUpButton>;
  }

  return (
    <Link href="/sign-up" className="inline-block">
      {children}
    </Link>
  );
}

export function SignOutButton({ children, ...props }: any) {
  const router = useRouter();

  if (hasClerk) {
    return <ClerkSignOutButton {...props}>{children}</ClerkSignOutButton>;
  }

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("vengpt_user_session");
      document.cookie = "vengpt_user_id=; path=/; max-age=0";
      document.cookie = "vengpt_user_email=; path=/; max-age=0";
      document.cookie = "vengpt_user_name=; path=/; max-age=0";
    }
    router.push("/sign-in");
    router.refresh();
  };

  return (
    <span onClick={handleSignOut} className="cursor-pointer">
      {children}
    </span>
  );
}

export function useUser(): any {
  const [session, setSession] = React.useState<CustomUserSession | null>(null);

  React.useEffect(() => {
    setSession(getStoredSession());
  }, []);

  if (hasClerk) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return clerkUseUser();
  }

  return {
    isLoaded: true,
    isSignedIn: Boolean(session),
    user: {
      id: session?.id || "dev_user_local",
      fullName: session?.name || "Local Developer",
      firstName: session?.name?.split(" ")[0] || "Developer",
      primaryEmailAddress: { emailAddress: session?.email || "developer@local.dev" },
    },
  };
}

export function useAuth(): any {
  const [session, setSession] = React.useState<CustomUserSession | null>(null);

  React.useEffect(() => {
    setSession(getStoredSession());
  }, []);

  if (hasClerk) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return clerkUseAuth();
  }

  return {
    isLoaded: true,
    isSignedIn: Boolean(session),
    userId: session?.id || "dev_user_local",
  };
}
