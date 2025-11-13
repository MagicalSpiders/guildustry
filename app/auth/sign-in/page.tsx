import type { Metadata } from "next";
import { AuthForm } from "@/app/auth/components/AuthForm";

export const metadata: Metadata = {
  title: "Sign In - Guildustry",
  description: "Sign in to your Guildustry account.",
};

export default function SignInPage() {
  return <AuthForm initialMode="login" />;
}
