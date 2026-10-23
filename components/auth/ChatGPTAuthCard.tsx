"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Eye, EyeOff, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatGPTAuthCardProps {
  mode: "signin" | "signup";
}

export function ChatGPTAuthCard({ mode }: ChatGPTAuthCardProps) {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const isSignUp = mode === "signup";

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Create session
      const username = email.split("@")[0] || "User";
      const userObj = {
        id: `user_${Date.now()}`,
        email: email.trim(),
        name: username.charAt(0).toUpperCase() + username.slice(1),
        avatar: "",
        signedInAt: new Date().toISOString(),
      };

      if (typeof window !== "undefined") {
        localStorage.setItem("vengpt_user_session", JSON.stringify(userObj));
        document.cookie = `vengpt_user_id=${userObj.id}; path=/; max-age=2592000; SameSite=Lax`;
        document.cookie = `vengpt_user_email=${encodeURIComponent(userObj.email)}; path=/; max-age=2592000; SameSite=Lax`;
        document.cookie = `vengpt_user_name=${encodeURIComponent(userObj.name)}; path=/; max-age=2592000; SameSite=Lax`;
      }

      await new Promise((r) => setTimeout(r, 600));
      router.push("/chat");
      router.refresh();
    } catch {
      setErrorMessage("Failed to authenticate. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (provider: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    const userObj = {
      id: `user_${provider.toLowerCase()}_${Date.now()}`,
      email: `${provider.toLowerCase()}.user@vengpt.ai`,
      name: `${provider} User`,
      avatar: "",
      provider,
      signedInAt: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("vengpt_user_session", JSON.stringify(userObj));
      document.cookie = `vengpt_user_id=${userObj.id}; path=/; max-age=2592000; SameSite=Lax`;
      document.cookie = `vengpt_user_email=${encodeURIComponent(userObj.email)}; path=/; max-age=2592000; SameSite=Lax`;
      document.cookie = `vengpt_user_name=${encodeURIComponent(userObj.name)}; path=/; max-age=2592000; SameSite=Lax`;
    }

    await new Promise((r) => setTimeout(r, 500));
    router.push("/chat");
    router.refresh();
  };

  const handleGuestAccess = () => {
    const guestUser = {
      id: "guest_user",
      email: "guest@vengpt.ai",
      name: "Guest Explorer",
      avatar: "",
      signedInAt: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("vengpt_user_session", JSON.stringify(guestUser));
      document.cookie = `vengpt_user_id=guest_user; path=/; max-age=2592000; SameSite=Lax`;
      document.cookie = `vengpt_user_email=guest@vengpt.ai; path=/; max-age=2592000; SameSite=Lax`;
      document.cookie = `vengpt_user_name=Guest; path=/; max-age=2592000; SameSite=Lax`;
    }

    router.push("/chat");
    router.refresh();
  };

  return (
    <div className="w-full max-w-[400px] mx-auto p-4 sm:p-6 flex flex-col items-center">
      {/* ChatGPT / VenGPT Logo */}
      <Link href="/" className="mb-6 flex items-center justify-center group" aria-label="VenGPT Home">
        <div className="h-10 w-10 rounded-2xl bg-foreground text-background flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
          <Sparkles className="h-5 w-5" />
        </div>
      </Link>

      {/* Main Title */}
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground text-center mb-2">
        {isSignUp ? "Create your account" : "Welcome back"}
      </h1>

      <p className="text-xs sm:text-sm text-muted-foreground text-center mb-6 max-w-xs">
        {isSignUp
          ? "Sign up to start chatting, generating images, and building with VenGPT."
          : "Log in with your credentials or social provider to continue."}
      </p>

      {/* Error Message */}
      {errorMessage && (
        <div className="w-full mb-4 p-2.5 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-xs text-center">
          {errorMessage}
        </div>
      )}

      {/* Auth Form */}
      <form onSubmit={handleContinue} className="w-full space-y-3.5">
        <div className="space-y-1">
          <label className="text-xs font-medium text-foreground px-1" htmlFor="email-input">
            Email address
          </label>
          <input
            id="email-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
            disabled={isLoading}
            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-[#10a37f] focus:border-transparent transition-all shadow-xs"
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs font-medium text-foreground" htmlFor="password-input">
              Password
            </label>
            {!isSignUp && (
              <span className="text-[11px] text-[#10a37f] hover:underline cursor-pointer select-none">
                Forgot password?
              </span>
            )}
          </div>
          <div className="relative">
            <input
              id="password-input"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isSignUp ? "Create a password (min. 8 characters)" : "Enter your password"}
              disabled={isLoading}
              className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-[#10a37f] focus:border-transparent transition-all shadow-xs"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* ChatGPT Emerald Continue Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-xl font-medium text-sm text-white bg-[#10a37f] hover:bg-[#0e8c6d] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Continuing...</span>
            </>
          ) : (
            <span>Continue</span>
          )}
        </button>
      </form>

      {/* Switch Mode Link */}
      <div className="mt-4 text-xs text-center text-foreground">
        {isSignUp ? (
          <span>
            Already have an account?{" "}
            <Link href="/sign-in" className="text-[#10a37f] hover:underline font-medium">
              Log in
            </Link>
          </span>
        ) : (
          <span>
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-[#10a37f] hover:underline font-medium">
              Sign up
            </Link>
          </span>
        )}
      </div>

      {/* OR Divider */}
      <div className="w-full flex items-center my-6">
        <div className="flex-1 border-t border-border" />
        <span className="px-3 text-[11px] font-semibold uppercase text-muted-foreground tracking-wider">
          OR
        </span>
        <div className="flex-1 border-t border-border" />
      </div>

      {/* ChatGPT-Style Social Provider Buttons */}
      <div className="w-full space-y-2.5">
        {/* Google */}
        <button
          type="button"
          onClick={() => handleSocialAuth("Google")}
          disabled={isLoading}
          className="w-full py-2.5 px-3.5 rounded-xl border border-border bg-background hover:bg-muted/70 text-foreground text-xs sm:text-sm font-medium flex items-center justify-start gap-3 transition-colors cursor-pointer shadow-2xs group"
        >
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span className="flex-1 text-left">Continue with Google</span>
        </button>

        {/* Microsoft */}
        <button
          type="button"
          onClick={() => handleSocialAuth("Microsoft")}
          disabled={isLoading}
          className="w-full py-2.5 px-3.5 rounded-xl border border-border bg-background hover:bg-muted/70 text-foreground text-xs sm:text-sm font-medium flex items-center justify-start gap-3 transition-colors cursor-pointer shadow-2xs group"
        >
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 21 21">
            <rect x="1" y="1" width="9" height="9" fill="#f25022" />
            <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
            <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
            <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
          </svg>
          <span className="flex-1 text-left">Continue with Microsoft Account</span>
        </button>

        {/* Apple */}
        <button
          type="button"
          onClick={() => handleSocialAuth("Apple")}
          disabled={isLoading}
          className="w-full py-2.5 px-3.5 rounded-xl border border-border bg-background hover:bg-muted/70 text-foreground text-xs sm:text-sm font-medium flex items-center justify-start gap-3 transition-colors cursor-pointer shadow-2xs group"
        >
          <svg className="h-4 w-4 shrink-0 fill-current" viewBox="0 0 24 24">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.72-.93 2.74 1 .08 2.02-.49 2.64-1.24z" />
          </svg>
          <span className="flex-1 text-left">Continue with Apple</span>
        </button>

        {/* GitHub */}
        <button
          type="button"
          onClick={() => handleSocialAuth("GitHub")}
          disabled={isLoading}
          className="w-full py-2.5 px-3.5 rounded-xl border border-border bg-background hover:bg-muted/70 text-foreground text-xs sm:text-sm font-medium flex items-center justify-start gap-3 transition-colors cursor-pointer shadow-2xs group"
        >
          <svg className="h-4 w-4 shrink-0 fill-current" viewBox="0 0 24 24">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          <span className="flex-1 text-left">Continue with GitHub</span>
        </button>

        {/* Guest Access Button */}
        <button
          type="button"
          onClick={handleGuestAccess}
          disabled={isLoading}
          className="w-full py-2 px-3 rounded-xl border border-dashed border-border/80 hover:bg-muted/40 text-muted-foreground hover:text-foreground text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer mt-1"
        >
          <span>Continue as Guest (Instant Access)</span>
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      {/* Footer Legal */}
      <footer className="mt-8 text-[11px] text-muted-foreground text-center space-x-2">
        <span className="hover:underline cursor-pointer">Terms of Use</span>
        <span>|</span>
        <span className="hover:underline cursor-pointer">Privacy Policy</span>
      </footer>
    </div>
  );
}
