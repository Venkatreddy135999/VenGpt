# AI Assistant — Production AI Chatbot Web Application

A modern, high-performance, production-ready AI chatbot web application built with Next.js App Router, React 19, TypeScript, Tailwind CSS, shadcn/ui, Vercel AI SDK, OpenAI, PostgreSQL with Prisma ORM, and Clerk authentication.

---

## 1. Project Overview

**AI Assistant** is an intelligent conversational platform offering a ChatGPT-style interface with original, modern UI design. It supports:

* **Real-time streaming responses**: Progressive token-by-token generation with typing indicator and instant abort/stop controls.
* **Multi-Model Intelligence**: Dropdown selector supporting leading AI models across providers:
  * **OpenAI**: GPT-4o, GPT-4o Mini, OpenAI o1, OpenAI o3-mini
  * **DeepSeek**: DeepSeek R1 (Reasoning), DeepSeek V3, DeepSeek Coder
  * **xAI**: Grok-2, Grok-2 Mini
  * **Anthropic**: Claude 3.5 Sonnet, Claude 3.5 Haiku
  * **Google**: Gemini 2.0 Flash, Gemini 1.5 Pro
  * **Open Source / Astra**: Llama 3.3 70B, Mistral Large
* **Curated Prompt Dataset & Library (300+ Prompts)**: Ingested community dataset (`prompts.csv`) with full modal browser categorized into Coding & Engineering, Writing & Content, Business & Career, Reasoning & Learning, Roleplay & Personas, and Creative & Lifestyle.
* **Knowledge Base & RAG Grounding**: Integrated domain knowledge base (`data/knowledge-base.json`) automatically augmenting prompts with factual context for Next.js, Prisma, RAG architecture, System Design, and more.
* **Markdown & Code Syntax Highlighting**: Fenced code blocks with language labels, one-click copy buttons, tables, blockquotes, lists, and headers.
* **Full conversation history**: Automatic title generation based on initial prompts, searchable conversation threads, inline renaming, and safe deletion confirmation.
* **Regeneration & Response Copy**: One-click regeneration of previous assistant replies and clipboard copying.
* **Theme Customization**: Seamless Light, Dark, and System modes persisted via `next-themes`.
* **AI Model Selection & Temperature Tuning**: Switch models and adjust creativity sliders in the Settings dialog.
* **Data Management**: Bulk clear conversation history with a double-confirmation modal.
* **Secure Authentication**: Clerk-powered sign-up, sign-in, user avatar controls, and isolated per-user conversation data.
* **Responsive Design**: Adapts effortlessly across mobile, tablet, and desktop with an accessible slide-out navigation drawer.

---

## 2. Technologies Used

* **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack, React Server Components)
* **UI & Styling**: React 19, [Tailwind CSS](https://tailwindcss.com/), Radix UI Primitives, Lucide React Icons
* **AI Engine**: [Vercel AI SDK](https://sdk.vercel.ai/) (`ai`, `@ai-sdk/openai`, `@ai-sdk/react`)
* **LLM Provider**: OpenAI (`gpt-4o-mini`, `gpt-4o`, `gpt-4-turbo`)
* **Database & ORM**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)
* **Authentication**: [Clerk](https://clerk.com/) (`@clerk/nextjs`)
* **Theme Management**: `next-themes`
* **Markdown Parsing**: `react-markdown`, `remark-gfm`

---

## 3. Project Structure

```text
ai-assistant/
├── app/
│   ├── page.tsx                                  # Modern landing page with hero & feature cards
│   ├── layout.tsx                                # Root layout with theme & auth providers
│   ├── globals.css                               # Tailwind v4 theme variables & prose typography
│   ├── chat/
│   │   ├── page.tsx                              # New chat session entrypoint
│   │   └── [conversationId]/
│   │       └── page.tsx                          # Server-rendered thread with persisted history
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts                          # Streaming chat endpoint with AI SDK & DB save
│   │   └── conversations/
│   │       ├── route.ts                          # List, create, and bulk delete conversations
│   │       └── [conversationId]/
│   │           └── route.ts                      # Get, rename, and delete individual conversation
│   ├── sign-in/[[...sign-in]]/page.tsx           # Clerk Sign-In route
│   └── sign-up/[[...sign-up]]/page.tsx           # Clerk Sign-Up route
├── components/
│   ├── auth/
│   │   └── AuthControls.tsx                      # Clerk auth button & guard wrappers
│   ├── chat/
│   │   ├── ChatAppShell.tsx                      # State coordinator for sidebar & chat
│   │   ├── ChatContainer.tsx                     # Message stream, stop, regenerate, error states
│   │   ├── ChatHeader.tsx                        # Header with title, model badge, mobile trigger
│   │   ├── MessageList.tsx                       # Auto-scrolling message list
│   │   ├── MessageBubble.tsx                     # Markdown bubbles with copy & regenerate
│   │   ├── MessageInput.tsx                      # Multiline auto-expanding textarea & buttons
│   │   ├── TypingIndicator.tsx                   # Animated thinking indicator
│   │   ├── EmptyChat.tsx                         # Suggested prompt cards
│   │   └── CodeBlock.tsx                         # Code block with language tag & copy action
│   ├── sidebar/
│   │   ├── Sidebar.tsx                           # Desktop sidebar & mobile drawer
│   │   ├── ConversationList.tsx                  # Search filter & delete dialog
│   │   └── ConversationItem.tsx                  # Inline rename & dropdown actions
│   ├── settings/
│   │   └── SettingsDialog.tsx                    # Appearance, AI model, data deletion, account
│   └── ui/
│       ├── button.tsx                            # CVA button component
│       ├── dialog.tsx                            # Radix dialog modal
│       ├── dropdown-menu.tsx                     # Radix dropdown menu
│       ├── theme-toggle.tsx                      # Light / Dark / System dropdown
│       └── theme-provider.tsx                    # Next-themes wrapper
├── lib/
│   ├── db.ts                                     # PrismaClient singleton instance
│   ├── ai.ts                                     # System prompt, model lists, title generator
│   ├── auth.ts                                   # Clerk server-side user helper
│   └── utils.ts                                  # Class name merger & date formatter
├── prisma/
│   ├── schema.prisma                             # Conversation & Message data models
│   └── migrations/
│       └── 20261002000000_init/
│           └── migration.sql                     # Production PostgreSQL migration SQL
├── proxy.ts                                      # Next.js route protection proxy
├── .env.example                                  # Template for required environment variables
└── README.md
```

---

## 4. Requirements

* **Node.js**: v18.18.0 or later (v20+ recommended)
* **npm** / **pnpm** / **yarn**
* **PostgreSQL** database (Local PostgreSQL 14+, Neon, Supabase, AWS RDS, or Vercel Postgres)
* **OpenAI API Key**: Obtain from [OpenAI Platform](https://platform.openai.com/api-keys)
* **Clerk Account**: Free account at [Clerk Dashboard](https://dashboard.clerk.com/)

---

## 5. Installation

Clone or navigate to the repository directory:

```bash
cd ai-assistant
npm install
```

---

## 6. Environment Variable Setup

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Update the values in `.env`:

```env
# PostgreSQL Connection URL
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/ai_assistant?schema=public"

# OpenAI API Configuration
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-4o-mini"

# Clerk Authentication Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Clerk Redirection URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/chat"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/chat"
```

---

## 7. PostgreSQL & Prisma Setup

### A. Create the Database

If using local PostgreSQL:

```bash
# Using psql
createdb -U postgres ai_assistant
```

Or connect to any cloud PostgreSQL provider (Neon, Supabase, Railway, Vercel Postgres) and copy the provided connection URL into `DATABASE_URL`.

### B. Generate Prisma Client

Generate the type-safe Prisma client:

```bash
npx prisma generate
```

### C. Run Database Migrations

Apply database migrations to create the `Conversation` and `Message` tables:

```bash
npx prisma migrate dev --name init
```

For production deployment:

```bash
npx prisma migrate deploy
```

---

## 8. Clerk Authentication Setup

1. Create a free account at [https://dashboard.clerk.com](https://dashboard.clerk.com).
2. Create an application (e.g. `AI Assistant`).
3. Under **Configure** > **API Keys**, copy:
   * **Publishable key** -> `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   * **Secret key** -> `CLERK_SECRET_KEY`
4. Under **Paths**, configure:
   * Sign-in path: `/sign-in`
   * Sign-up path: `/sign-up`
   * After sign-in: `/chat`
   * After sign-up: `/chat`

---

## 9. OpenAI API Setup

1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys).
2. Create a new secret key.
3. Paste the key into `OPENAI_API_KEY` in your `.env` file.
4. Set your default model in `OPENAI_MODEL` (e.g. `gpt-4o-mini` or `gpt-4o`).

> **Security Note**: The `OPENAI_API_KEY` is exclusively consumed on the server inside `app/api/chat/route.ts` and is never transmitted to the browser client.

---

## 10. Local Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser:
* Landing Page: `http://localhost:3000/`
* Chat Dashboard: `http://localhost:3000/chat`
* Sign In: `http://localhost:3000/sign-in`
* Sign Up: `http://localhost:3000/sign-up`

---

## 11. Production Build & Verification

To verify that the application compiles and types check with 0 errors:

```bash
# Run TypeScript type check
npx tsc --noEmit

# Create optimized production build
npm run build

# Start production server
npm run start
```

---

## 12. Vercel Deployment Instructions

Deploying AI Assistant to Vercel takes just a few clicks:

1. **Push your code to GitHub / GitLab / Bitbucket**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of production AI Assistant"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import into Vercel**:
   * Navigate to [vercel.com/new](https://vercel.com/new).
   * Select your repository and click **Import**.

3. **Configure Environment Variables**:
   Add the following in Vercel's Environment Variables settings:
   * `DATABASE_URL`: Your production PostgreSQL connection string (e.g. from Neon, Supabase, or Vercel Postgres).
   * `OPENAI_API_KEY`: Your OpenAI API key.
   * `OPENAI_MODEL`: `gpt-4o-mini`
   * `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key.
   * `CLERK_SECRET_KEY`: Your Clerk secret key.

4. **Build & Development Settings**:
   * Framework Preset: **Next.js**
   * Build Command: `npx prisma generate && next build`
   * Output Directory: `.next`

5. **Deploy**:
   * Click **Deploy**. Vercel will build the project and provision serverless functions.
   * Apply database migrations to your production database using:
     ```bash
     npx prisma migrate deploy
     ```

---

## 13. Security & Best Practices Implemented

* **Strict Route Protection**: Clerk proxy protects all `/chat` routes and `/api` endpoints against unauthenticated access.
* **Database Ownership Verification**: Every query for fetching, updating, or deleting conversations strictly checks that `conversation.clerkUserId === currentUserId`. Users cannot view or mutate another user's threads.
* **Server-Only Secrets**: `OPENAI_API_KEY` and `CLERK_SECRET_KEY` are strictly server-side and never exposed to the client bundle.
* **Input Validation & Sanitization**: Request bodies are parsed, validated, and sanitized. Empty prompts are rejected.
* **Graceful Error Handling**: API errors (rate limits, quota limits, database connection drops) are translated into user-friendly messages without exposing internal stack traces.

---

## 14. License

This project is licensed under the MIT License.
