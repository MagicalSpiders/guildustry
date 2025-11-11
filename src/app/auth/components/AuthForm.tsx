"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/Button";
import { useAuth } from "@/src/components/AuthProvider";
import Image from "next/image";
import { useTheme } from "next-themes";
import { NoticeModal } from "@/src/components/NoticeModal";
import { Toast } from "@/src/app/employer/notifications/components/Toast";

type AuthMode = "login" | "signup";

interface AuthFormProps {
  initialMode?: AuthMode;
}

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["candidate", "employer"]),
});

const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  role: z.enum(["candidate", "employer"]),
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;
type FormData = LoginFormData | SignupFormData;

export function AuthForm({ initialMode = "login" }: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const { signIn, signUp } = useAuth();
  const router = useRouter();
  const { theme } = useTheme();
  const logoSrc = theme === "light" ? "/logo.webp" : "/darkLogo.webp";
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeDescription, setNoticeDescription] = useState("");
  const [noticeVariant, setNoticeVariant] = useState<
    "success" | "error" | "info"
  >("info");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("Logged in successfully");
  const [toastDescription, setToastDescription] = useState<string | undefined>(
    undefined
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(mode === "login" ? loginSchema : signupSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "candidate",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: FormData) => {
    try {
      if (mode === "signup") {
        // Sign up with Supabase
        await signUp(data.email, data.password, data.role);
        // Note: Supabase may require email confirmation depending on your settings
        setNoticeTitle("Account created");
        setNoticeDescription(
          "Please check your email to verify your account before signing in."
        );
        setNoticeVariant("success");
        setNoticeOpen(true);
      } else {
        // Sign in with Supabase
        // Suppress initial profile fetch for first-login candidate flow
        if (typeof window !== "undefined") {
          localStorage.setItem("suppress_initial_profile_fetch", "1");
        }
        await signIn(data.email, data.password);
      }

      // Show toast on successful login
      setToastMessage("Logged in successfully");
      setToastDescription(undefined);
      setToastVisible(true);

      // Candidate first-login flow: show modal prompt to fill profile
      const hasSeenPostLogin =
        typeof window !== "undefined"
          ? localStorage.getItem("has_seen_candidate_post_login") === "1"
          : false;
      if (data.role === "candidate" && !hasSeenPostLogin) {
        setNoticeTitle("Complete your profile?");
        setNoticeDescription(
          "Would you like to fill your candidate profile now to get better matches?"
        );
        setNoticeVariant("info");
        setNoticeOpen(true);
      } else {
        // Non-candidate or repeat login: go to appropriate dashboard
        const destination =
          data.role === "candidate"
            ? "/candidate/dashboard"
            : data.role === "employer"
            ? "/employer/dashboard"
            : "/dashboard";
        router.push(destination);
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      setNoticeTitle("Authentication failed");
      setNoticeDescription(
        error?.message || "Please try again or reset your password."
      );
      setNoticeVariant("error");
      setNoticeOpen(true);
    }
  };

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
    reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-grid bg-surface/60 text-neutral-900 dark:bg-main-bg dark:text-main-text px-4 py-12">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid opacity-30" />
      </div>
      <div className="relative w-full max-w-lg z-10">
        <div className="rounded-2xl border border-subtle bg-surface p-8 shadow-elevated">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <Image src={logoSrc} alt="Guildustry" width={40} height={40} />
            <span className="text-2xl font-bold text-main-text font-display">
              Guildustry
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-title font-bold text-center mb-2 text-main-text">
            Welcome to Guildustry
          </h1>
          <p className="text-center text-sm text-main-light-text mb-8">
            {mode === "login"
              ? "Sign in to your account to continue."
              : "Create an account to get started."}
          </p>

          {/* Tab switcher */}
          <div className="flex gap-2 mb-6 p-1 rounded-lg bg-surface border border-subtle">
            <button
              type="button"
              onClick={() => handleModeChange("login")}
              className={`flex-1 cursor-pointer py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                mode === "login"
                  ? "text-main-text bg-light-bg shadow-sm"
                  : "text-main-light-text hover:text-main-text"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => handleModeChange("signup")}
              className={`flex-1 cursor-pointer py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                mode === "signup"
                  ? "text-main-text bg-light-bg shadow-sm"
                  : "text-main-light-text hover:text-main-text"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2 text-main-light-text"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register("email")}
                className={`w-full px-4 py-3 rounded-lg border bg-light-bg text-main-text focus:outline-none focus:ring-2 transition-colors ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-subtle focus:ring-main-accent"
                }`}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2 text-main-light-text"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                {...register("password")}
                className={`w-full px-4 py-3 rounded-lg border bg-light-bg text-main-text focus:outline-none focus:ring-2 transition-colors ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-subtle focus:ring-main-accent"
                }`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium mb-3 text-neutral-700 dark:text-main-light-text">
                {mode === "login" ? "Login As" : "Sign Up As"}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedRole === "candidate"
                      ? "border-main-accent bg-main-accent/10"
                      : "border-subtle bg-surface hover:border-main-accent/50"
                  }`}
                >
                  <input
                    type="radio"
                    value="candidate"
                    {...register("role")}
                    className="w-4 h-4 text-main-accent focus:ring-main-accent"
                  />
                  <span className="text-sm font-medium text-main-text">
                    Candidate
                  </span>
                </label>
                <label
                  className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedRole === "employer"
                      ? "border-main-accent bg-main-accent/10"
                      : "border-subtle bg-surface hover:border-main-accent/50"
                  }`}
                >
                  <input
                    type="radio"
                    value="employer"
                    {...register("role")}
                    className="w-4 h-4 text-main-accent focus:ring-main-accent"
                  />
                  <span className="text-sm font-medium text-main-text">
                    Employer
                  </span>
                </label>
              </div>
              {errors.role && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="accent"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Processing..."
                : mode === "login"
                ? "Login"
                : "Sign Up"}
            </Button>
          </form>

          {/* Return to Home */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-main-light-text hover:text-main-accent transition-colors"
            >
              <Icon icon="lucide:home" className="w-4 h-4" />
              Return To Home
            </Link>
          </div>
        </div>
      </div>
      <NoticeModal
        open={noticeOpen}
        title={noticeTitle}
        description={noticeDescription}
        variant={noticeVariant}
        onClose={() => {
          setNoticeOpen(false);
          // Treat close as skip for now if it's the first-login prompt
          if (typeof window !== "undefined") {
            if (!localStorage.getItem("has_seen_candidate_post_login")) {
              localStorage.setItem("has_seen_candidate_post_login", "1");
              localStorage.removeItem("suppress_initial_profile_fetch");
            }
          }
          router.push("/candidate/dashboard");
        }}
        primaryAction={{
          label: "Fill Profile Now",
          onClick: () => {
            setNoticeOpen(false);
            if (typeof window !== "undefined") {
              localStorage.setItem("has_seen_candidate_post_login", "1");
              localStorage.removeItem("suppress_initial_profile_fetch");
            }
            router.push("/candidate/profile/edit");
          },
        }}
        secondaryAction={{
          label: "Skip for now",
          onClick: () => {
            setNoticeOpen(false);
            if (typeof window !== "undefined") {
              localStorage.setItem("has_seen_candidate_post_login", "1");
              localStorage.removeItem("suppress_initial_profile_fetch");
            }
            router.push("/candidate/dashboard");
          },
        }}
      />
      <Toast
        message={toastMessage}
        description={toastDescription}
        type="success"
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
        duration={2500}
      />
    </div>
  );
}

// Render the notice modal at the root of this component
// Placed after the main return to avoid interfering with layout flow
export function AuthFormWithNotice(props: AuthFormProps) {
  return (
    <>
      <AuthForm {...props} />
      {/* The NoticeModal is managed inside AuthForm via state */}
    </>
  );
}
