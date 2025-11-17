"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Icon } from "@iconify/react";
import { Button } from "@/src/components/Button";
import { useAuth } from "@/src/components/AuthProvider";
import { NoticeModal } from "@/src/components/NoticeModal";
import { PageSkeleton } from "@/src/components/ui/PageSkeleton";
import Image from "next/image";
import { useTheme } from "next-themes";
import Link from "next/link";

const updatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;

function UpdatePasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updatePassword, user, loading: authLoading } = useAuth();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeDescription, setNoticeDescription] = useState("");
  const [noticeVariant, setNoticeVariant] = useState<
    "success" | "error" | "info"
  >("info");
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check for password reset token in URL
  useEffect(() => {
    if (typeof window === "undefined" || authLoading) return;

    const hash = window.location.hash;

    // Parse hash parameters (Supabase sends recovery tokens in hash)
    let hashParams: URLSearchParams | null = null;
    if (hash) {
      try {
        hashParams = new URLSearchParams(hash.substring(1));
      } catch (e) {
        console.error("[Flow] Error parsing hash:", e);
      }
    }

    const error = searchParams.get("error") || hashParams?.get("error");
    const errorCode =
      searchParams.get("error_code") || hashParams?.get("error_code");
    const errorDescription =
      searchParams.get("error_description") ||
      hashParams?.get("error_description");
    const type = searchParams.get("type") || hashParams?.get("type");

    // Check if there's an error in the URL
    if (error || errorCode) {
      const isTokenError =
        errorCode === "invalid_token" ||
        errorCode === "token_expired" ||
        errorCode === "otp_expired" ||
        errorDescription?.toLowerCase().includes("token") ||
        errorDescription?.toLowerCase().includes("expired") ||
        errorDescription?.toLowerCase().includes("invalid");

      if (isTokenError) {
        setIsValidToken(false);
        setNoticeTitle("Invalid or Expired Reset Link");
        setNoticeDescription(
          "The password reset link has expired or is invalid. Please request a new password reset link."
        );
        setNoticeVariant("error");
        setNoticeOpen(true);
        // Clear the hash
        window.history.replaceState(null, "", window.location.pathname);
      }
    } else if (type === "recovery" || hash?.includes("type=recovery")) {
      // Valid recovery link - Supabase will set the session automatically
      setIsValidToken(true);
      // Clear the hash after processing
      if (hash) {
        window.history.replaceState(null, "", window.location.pathname);
      }
    } else if (!user && !hash) {
      // No user session and no recovery token in hash - invalid state
      setIsValidToken(false);
      setNoticeTitle("Invalid Reset Link");
      setNoticeDescription(
        "The password reset link is invalid. Please request a new password reset link."
      );
      setNoticeVariant("error");
      setNoticeOpen(true);
    } else if (user) {
      // User has a session (from recovery link) - valid
      setIsValidToken(true);
    }
  }, [searchParams, authLoading, user]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: UpdatePasswordFormData) => {
    try {
      setIsSubmitting(true);
      setNoticeOpen(false);

      await updatePassword(data.password);

      setNoticeTitle("Password Updated Successfully!");
      setNoticeDescription(
        "Your password has been updated. You will be redirected to sign in."
      );
      setNoticeVariant("success");
      setNoticeOpen(true);

      // Redirect to sign in after a delay
      setTimeout(() => {
        router.push("/auth/sign-in");
      }, 2000);
    } catch (error: any) {
      console.error("[Flow] Password update error:", error.message);
      setNoticeTitle("Failed to Update Password");
      setNoticeDescription(
        error?.message || "Please try again or request a new reset link."
      );
      setNoticeVariant("error");
      setNoticeOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Default to dark logo until theme is determined
  const logoSrc =
    mounted && theme === "light" ? "/logo.webp" : "/darkLogo.webp";

  if (authLoading || isValidToken === null) {
    return <PageSkeleton variant="form" />;
  }

  if (isValidToken === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-grid bg-surface/60 text-main-text px-4 py-12">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-grid opacity-30" />
        </div>
        <div className="relative w-full max-w-lg z-10">
          <div className="rounded-2xl border border-subtle bg-surface p-8 shadow-elevated text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Image src={logoSrc} alt="Guildustry" width={40} height={40} />
              <span className="text-2xl font-bold text-main-text font-display">
                Guildustry
              </span>
            </div>
            <Icon
              icon="lucide:alert-triangle"
              className="w-16 h-16 text-red-500 mx-auto mb-4"
            />
            <h1 className="text-2xl font-title font-bold mb-2 text-main-text">
              Invalid Reset Link
            </h1>
            <p className="text-main-light-text mb-6">
              The password reset link has expired or is invalid. Please request
              a new password reset link.
            </p>
            <Link href="/auth/sign-in">
              <Button variant="accent" className="w-full">
                Back to Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-grid bg-surface/60 text-main-text px-4 py-12">
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
            Update Your Password
          </h1>
          <p className="text-center text-sm text-main-light-text mb-8">
            Enter your new password below.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* New Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2 text-main-light-text"
              >
                New Password
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
                placeholder="Enter new password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
              <p className="mt-1 text-xs text-main-light-text">
                Must be at least 8 characters with uppercase, lowercase, and a
                number
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-2 text-main-light-text"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                {...register("confirmPassword")}
                className={`w-full px-4 py-3 rounded-lg border bg-light-bg text-main-text focus:outline-none focus:ring-2 transition-colors ${
                  errors.confirmPassword
                    ? "border-red-500 focus:ring-red-500"
                    : "border-subtle focus:ring-main-accent"
                }`}
                placeholder="Confirm new password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="accent"
              size="md"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating Password..." : "Update Password"}
            </Button>
          </form>

          {/* Return to Sign In */}
          <div className="mt-6 text-center">
            <Link
              href="/auth/sign-in"
              className="inline-flex items-center gap-2 text-sm text-main-light-text hover:text-main-accent transition-colors"
            >
              <Icon icon="lucide:arrow-left" className="w-4 h-4" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Notice Modal */}
      <NoticeModal
        open={noticeOpen}
        title={noticeTitle}
        description={noticeDescription}
        variant={noticeVariant}
        onClose={() => {
          setNoticeOpen(false);
          if (noticeVariant === "success") {
            router.push("/auth/sign-in");
          }
        }}
        primaryAction={
          noticeVariant === "error" &&
          noticeTitle.includes("Invalid") &&
          noticeTitle.includes("Reset Link")
            ? {
                label: "Request New Link",
                onClick: () => {
                  setNoticeOpen(false);
                  router.push("/auth/sign-in");
                },
              }
            : noticeVariant === "success"
            ? {
                label: "Sign In",
                onClick: () => {
                  setNoticeOpen(false);
                  router.push("/auth/sign-in");
                },
              }
            : undefined
        }
      />
    </div>
  );
}

export default function UpdatePasswordPage() {
  return (
    <Suspense fallback={<PageSkeleton variant="form" />}>
      <UpdatePasswordContent />
    </Suspense>
  );
}
