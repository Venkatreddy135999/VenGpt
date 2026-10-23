import { ChatGPTAuthCard } from "@/components/auth/ChatGPTAuthCard";

export const dynamic = "force-dynamic";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <ChatGPTAuthCard mode="signin" />
    </div>
  );
}
