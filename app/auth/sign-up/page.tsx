import type { Metadata } from "next";
import { AuthForm } from "@/src/app/auth/components/AuthForm";

export const metadata: Metadata = {
  title: "Sign Up - Guildustry",
  description: "Create your Guildustry account and get started.",
};

export default function SignUpPage() {
  return <AuthForm initialMode="signup" />;
}
