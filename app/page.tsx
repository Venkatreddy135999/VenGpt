import Link from "next/link";
import {
  Bot,
  Sparkles,
  Zap,
  History,
  Shield,
  Code2,
  ArrowRight,
  SunMoon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@/components/auth/AuthControls";
import { getAuthUserId } from "@/lib/auth";

export default async function LandingPage() {
  const userId = await getAuthUserId();
  const isAuthenticated = Boolean(userId);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors">
      {/* Navigation Bar */}
      <header className="h-16 border-b border-border px-4 sm:px-8 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-30">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-base">
          <div className="h-8 w-8 rounded-xl bg-foreground text-background flex items-center justify-center shadow-xs">
            <Bot className="h-5 w-5" />
          </div>
          <span>AI Assistant</span>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <SignedIn>
            <Link href="/chat">
              <Button size="sm" className="gap-1.5 text-xs">
                <span>Go to Chat</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
            <UserButton />
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm" className="text-xs">
                Sign In
              </Button>
            </SignInButton>
            <Link href="/chat">
              <Button size="sm" className="gap-1.5 text-xs shadow-xs">
                <span>Get Started</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </SignedOut>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16 sm:py-24 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border border-border bg-muted/60 text-muted-foreground mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>Production-Ready AI Chatbot Experience</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground max-w-3xl leading-[1.15] mb-6">
          Conversations powered by intelligence and speed
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mb-10 leading-relaxed">
          Experience ultra-responsive streaming AI responses, seamless conversation history,
          rich markdown formatting with syntax-highlighted code, and secure cloud sync.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
          <Link href="/chat" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto gap-2 text-sm font-semibold h-12 px-8 shadow-sm">
              <span>{isAuthenticated ? "Open Workspace" : "Get Started Free"}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          {!isAuthenticated && (
            <SignInButton mode="modal">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-sm font-medium h-12 px-6"
              >
                Sign In to Account
              </Button>
            </SignInButton>
          )}
        </div>

        {/* Hero Interactive Preview Mock */}
        <div className="w-full mt-14 max-w-3xl rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-xl text-left">
          <div className="flex items-center justify-between pb-4 border-b border-border/80">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-amber-400" />
              <div className="h-3 w-3 rounded-full bg-emerald-400" />
            </div>
            <div className="text-[11px] font-mono text-muted-foreground">
              ai-assistant.preview
            </div>
            <div className="w-12" />
          </div>

          <div className="py-4 space-y-4">
            <div className="flex justify-end">
              <div className="rounded-2xl rounded-tr-xs px-4 py-2.5 bg-foreground text-background text-xs sm:text-sm font-normal max-w-[85%]">
                Explain quantum computing in simple terms.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-7 w-7 rounded-lg bg-primary/10 border border-border flex items-center justify-center shrink-0 text-primary">
                <Bot className="h-3.5 w-3.5" />
              </div>
              <div className="text-xs sm:text-sm text-foreground space-y-2 leading-relaxed">
                <p>
                  Think of a traditional computer like a light switch: it is either <strong>OFF (0)</strong> or <strong>ON (1)</strong>.
                </p>
                <p>
                  A <strong>quantum computer</strong> uses qubits, which can be both 0 and 1 at the same time thanks to <em>superposition</em>. This allows it to explore millions of possible solutions simultaneously!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="py-16 px-4 sm:px-8 border-t border-border bg-muted/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
              Built for speed, clarity, and precision
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Everything you need for a modern, production-grade conversational experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl border border-border bg-card shadow-xs flex flex-col justify-between">
              <div className="p-2.5 rounded-xl bg-primary/10 w-fit text-primary mb-4">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-base mb-1.5">Fast Streaming</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Real-time progressive token streaming powered by the Vercel AI SDK. Stop and regenerate whenever needed.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl border border-border bg-card shadow-xs flex flex-col justify-between">
              <div className="p-2.5 rounded-xl bg-primary/10 w-fit text-primary mb-4">
                <History className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-base mb-1.5">Conversation History</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Automatically generated titles, searchable past threads, inline renaming, and safe deletion confirmation.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl border border-border bg-card shadow-xs flex flex-col justify-between">
              <div className="p-2.5 rounded-xl bg-primary/10 w-fit text-primary mb-4">
                <Code2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-base mb-1.5">Code & Markdown</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Syntax-highlighted code blocks, language badges, copy to clipboard, tables, blockquotes, and lists.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-2xl border border-border bg-card shadow-xs flex flex-col justify-between">
              <div className="p-2.5 rounded-xl bg-primary/10 w-fit text-primary mb-4">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-base mb-1.5">Clerk Authentication</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Robust user sign-up, sign-in, and account protection. Conversations are strictly isolated per user.
                </p>
              </div>
            </div>

            {/* Card 5 */}
            <div className="p-6 rounded-2xl border border-border bg-card shadow-xs flex flex-col justify-between">
              <div className="p-2.5 rounded-xl bg-primary/10 w-fit text-primary mb-4">
                <SunMoon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-base mb-1.5">Light & Dark Modes</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Seamless theme switching between light, dark, and system preference with persistent local storage.
                </p>
              </div>
            </div>

            {/* Card 6 */}
            <div className="p-6 rounded-2xl border border-border bg-card shadow-xs flex flex-col justify-between">
              <div className="p-2.5 rounded-xl bg-primary/10 w-fit text-primary mb-4">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-base mb-1.5">Model Customization</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Switch between GPT-4o Mini, GPT-4o, and adjust temperature parameters in an intuitive Settings modal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 sm:px-8 text-center text-xs text-muted-foreground">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            <span className="font-semibold text-foreground">AI Assistant</span>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/chat" className="hover:text-foreground transition-colors">
              Chat Dashboard
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Deploy on Vercel
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
