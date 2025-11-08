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
  const { login } = useAuth();
  const router = useRouter();
  const { theme } = useTheme();
  const logoSrc = theme === "light" ? "/logo.webp" : "/darkLogo.webp";

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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Login with any credentials (for testing)
      login(data.role);

      // Redirect to dashboard based on role
      const destination =
        data.role === "candidate"
          ? "/candidate/dashboard"
          : data.role === "employer"
          ? "/employer/dashboard"
          : "/dashboard";
      router.push(destination);
    } catch (error) {
      console.error("Authentication error:", error);
      // Handle error
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
            Prototype authentication (any credentials work).
          </p>

          {/* Tab switcher */}
          <div className="flex gap-2 mb-6 p-1 rounded-lg bg-surface border border-subtle">
            <button
              type="button"
              onClick={() => handleModeChange("login")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
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
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
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
    </div>
  );
}
