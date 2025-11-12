"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/Button";
import { useAuth } from "@/src/components/AuthProvider";
import { supabase } from "@/src/lib/supabase";
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
  const [mounted, setMounted] = useState(false);
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
  const [pendingEmail, setPendingEmail] = useState<string>("");
  const [isResendingEmail, setIsResendingEmail] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Parse URL hash parameters for email confirmation errors/success
  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash;
    if (!hash) return;

    // Parse hash parameters
    const params = new URLSearchParams(hash.substring(1));
    const error = params.get("error");
    const errorCode = params.get("error_code");
    const errorDescription = params.get("error_description");
    const type = params.get("type");

    // Try to get email from localStorage (from previous signup) or form
    const storedEmail =
      typeof window !== "undefined"
        ? localStorage.getItem("pending_email_verification")
        : null;
    if (storedEmail) {
      setPendingEmail(storedEmail);
    }

    // Handle email confirmation errors
    if (error === "access_denied" && errorCode === "otp_expired") {
      setNoticeTitle("Email Verification Link Expired");
      setNoticeDescription(
        "The email verification link has expired or is invalid. Please request a new verification email."
      );
      setNoticeVariant("info");
      setNoticeOpen(true);
      // Clear the hash
      window.history.replaceState(null, "", window.location.pathname);
    } else if (error && errorCode) {
      // Handle other email confirmation errors
      const isEmailError =
        errorCode === "otp_expired" ||
        errorCode === "email_not_confirmed" ||
        errorDescription?.toLowerCase().includes("email") ||
        errorDescription?.toLowerCase().includes("expired") ||
        errorDescription?.toLowerCase().includes("invalid");

      if (isEmailError) {
        setNoticeTitle("Email Verification Required");
        setNoticeDescription(
          errorDescription
            ? decodeURIComponent(errorDescription.replace(/\+/g, " "))
            : "Please verify your email to access your dashboard. Check your inbox for the confirmation link we sent you."
        );
        setNoticeVariant("info");
        setNoticeOpen(true);
        // Clear the hash
        window.history.replaceState(null, "", window.location.pathname);
      }
    } else if (type === "signup" || type === "recovery") {
      // Handle successful email confirmation
      setNoticeTitle("Email Verified Successfully!");
      setNoticeDescription(
        "Your email has been verified. You can now sign in to your account."
      );
      setNoticeVariant("success");
      setNoticeOpen(true);
      // Clear stored email
      if (typeof window !== "undefined") {
        localStorage.removeItem("pending_email_verification");
      }
      setPendingEmail("");
      // Clear the hash
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  // Function to resend confirmation email
  const handleResendEmail = async () => {
    if (!pendingEmail) {
      setNoticeTitle("Email Required");
      setNoticeDescription(
        "Please enter your email address in the form above to resend the confirmation email."
      );
      setNoticeVariant("info");
      setNoticeOpen(true);
      return;
    }

    setIsResendingEmail(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: pendingEmail,
      });

      if (error) throw error;

      setNoticeTitle("Confirmation Email Sent!");
      setNoticeDescription(
        `We've sent a new confirmation email to ${pendingEmail}. Please check your inbox and click the link to verify your email address.`
      );
      setNoticeVariant("success");
      setNoticeOpen(true);
    } catch (error: any) {
      console.error("Resend email error:", error);
      setNoticeTitle("Failed to Resend Email");
      setNoticeDescription(
        error?.message || "Please try again later or contact support."
      );
      setNoticeVariant("error");
      setNoticeOpen(true);
    } finally {
      setIsResendingEmail(false);
    }
  };

  // Default to dark logo until theme is determined to prevent hydration mismatch
  const logoSrc =
    mounted && theme === "light" ? "/logo.webp" : "/darkLogo.webp";

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
      console.log("🔐 Login attempt with role:", data.role);

      if (mode === "signup") {
        // Sign up with Supabase
        await signUp(data.email, data.password, data.role);
        console.log("✅ Sign up successful with role:", data.role);
        // Store email for potential resend
        setPendingEmail(data.email);
        // Store email in localStorage for URL error scenarios
        if (typeof window !== "undefined") {
          localStorage.setItem("pending_email_verification", data.email);
        }
        // Note: Supabase may require email confirmation depending on your settings
        setNoticeTitle("Account Created Successfully!");
        setNoticeDescription(
          `Just one more step! We've sent a confirmation email to ${data.email}. Please check your inbox and click the link to verify your email address.`
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
        console.log("✅ Sign in successful");

        // Get the ACTUAL user role from Supabase (not the form selection)
        const {
          data: { session },
        } = await supabase.auth.getSession();
        // Check user_type first, then fall back to role for backward compatibility
        const actualRole =
          session?.user?.user_metadata?.user_type ||
          session?.user?.user_metadata?.role;
        console.log("🔍 Actual user role from Supabase:", actualRole);

        if (!actualRole) {
          console.error("⚠️ No role found in user metadata");
          router.push("/dashboard");
          return;
        }

        // Show toast on successful login
        setToastMessage("Logged in successfully");
        setToastDescription(undefined);
        setToastVisible(true);

        // Employers go directly to dashboard, candidates get first-login prompt
        console.log("🚀 Routing based on actual role:", actualRole);
        if (actualRole === "employer") {
          // Employers: always go to dashboard
          console.log("➡️ Redirecting to /employer/dashboard");
          router.push("/employer/dashboard");
        } else if (actualRole === "candidate") {
          // Candidates: show profile prompt on first login
          const hasSeenPostLogin =
            typeof window !== "undefined"
              ? localStorage.getItem("has_seen_candidate_post_login") === "1"
              : false;

          if (!hasSeenPostLogin) {
            console.log("ℹ️ First-time candidate - showing profile modal");
            setNoticeTitle("Complete your profile?");
            setNoticeDescription(
              "Would you like to fill your candidate profile now to get better matches?"
            );
            setNoticeVariant("info");
            setNoticeOpen(true);
          } else {
            console.log("➡️ Redirecting to /candidate/dashboard");
            router.push("/candidate/dashboard");
          }
        } else {
          // Fallback
          console.log("⚠️ Unknown role, redirecting to /dashboard");
          router.push("/dashboard");
        }
        return;
      }

      // Show toast on successful signup
      setToastMessage("Logged in successfully");
      setToastDescription(undefined);
      setToastVisible(true);
    } catch (error: any) {
      console.error("Authentication error:", error);

      // Check if error is related to email confirmation
      const errorMessage = error?.message?.toLowerCase() || "";
      const isEmailNotConfirmed =
        errorMessage.includes("email not confirmed") ||
        errorMessage.includes("email_not_confirmed") ||
        errorMessage.includes("email confirmation") ||
        errorMessage.includes("verify your email");

      if (isEmailNotConfirmed) {
        // Store email for resend functionality
        const emailValue = watch("email");
        if (emailValue) {
          setPendingEmail(emailValue);
        }
        setNoticeTitle("Email Verification Required");
        setNoticeDescription(
          "Please verify your email to access your dashboard. Check your inbox for the confirmation link we sent you."
        );
        setNoticeVariant("info");
      } else {
        setNoticeTitle("Authentication failed");
        setNoticeDescription(
          error?.message || "Please try again or reset your password."
        );
        setNoticeVariant("error");
      }
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

            {/* Role Selection - Only show during signup */}
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-medium mb-3 text-main-light-text  ">
                  Sign Up As
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`relative flex items-center justify-center p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                      selectedRole === "candidate"
                        ? "border-main-accent bg-main-accent/10 shadow-sm"
                        : "border-subtle bg-surface hover:border-main-accent/50"
                    }`}
                  >
                    <input
                      type="radio"
                      value="candidate"
                      {...register("role")}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium text-main-text">
                      Candidate
                    </span>
                    {selectedRole === "candidate" && (
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-main-accent" />
                    )}
                  </label>
                  <label
                    className={`relative flex items-center justify-center p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                      selectedRole === "employer"
                        ? "border-main-accent bg-main-accent/10 shadow-sm"
                        : "border-subtle bg-surface hover:border-main-accent/50"
                    }`}
                  >
                    <input
                      type="radio"
                      value="employer"
                      {...register("role")}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium text-main-text">
                      Employer
                    </span>
                    {selectedRole === "employer" && (
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-main-accent" />
                    )}
                  </label>
                </div>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.role.message}
                  </p>
                )}
              </div>
            )}

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
          // Only redirect for profile prompt after successful login
          // Don't redirect for signup confirmation or errors
          if (
            noticeVariant === "info" &&
            noticeTitle === "Complete your profile?" &&
            typeof window !== "undefined"
          ) {
            localStorage.setItem("has_seen_candidate_post_login", "1");
            localStorage.removeItem("suppress_initial_profile_fetch");
            router.push("/candidate/dashboard");
          }
        }}
        primaryAction={
          noticeVariant === "info" && noticeTitle === "Complete your profile?"
            ? {
                label: "Fill Profile Now",
                onClick: () => {
                  setNoticeOpen(false);
                  if (typeof window !== "undefined") {
                    localStorage.setItem("has_seen_candidate_post_login", "1");
                    localStorage.removeItem("suppress_initial_profile_fetch");
                    router.push("/candidate/profile/edit");
                  }
                },
              }
            : noticeVariant === "info" &&
              (noticeTitle === "Email Verification Required" ||
                noticeTitle === "Email Verification Link Expired") &&
              pendingEmail
            ? {
                label: isResendingEmail ? "Sending..." : "Resend Email",
                onClick: handleResendEmail,
                disabled: isResendingEmail,
              }
            : undefined
        }
        secondaryAction={
          noticeVariant === "info" && noticeTitle === "Complete your profile?"
            ? {
                label: "Skip for now",
                onClick: () => {
                  setNoticeOpen(false);
                  if (typeof window !== "undefined") {
                    localStorage.setItem("has_seen_candidate_post_login", "1");
                    localStorage.removeItem("suppress_initial_profile_fetch");
                    router.push("/candidate/dashboard");
                  }
                },
              }
            : noticeVariant === "info" &&
              (noticeTitle === "Email Verification Required" ||
                noticeTitle === "Email Verification Link Expired") &&
              pendingEmail
            ? undefined
            : undefined
        }
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
