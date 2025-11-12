"use client";

import { Skeleton, SkeletonText, SkeletonCard } from "./Skeleton";

interface PageSkeletonProps {
  variant?: "default" | "profile" | "dashboard" | "form";
  className?: string;
}

export function PageSkeleton({
  variant = "default",
  className,
}: PageSkeletonProps) {
  if (variant === "profile") {
    return <ProfilePageSkeleton className={className} />;
  }

  if (variant === "dashboard") {
    return <DashboardPageSkeleton className={className} />;
  }

  if (variant === "form") {
    return <FormPageSkeleton className={className} />;
  }

  return <DefaultPageSkeleton className={className} />;
}

function DefaultPageSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={`min-h-screen bg-main-bg flex items-center justify-center ${className || ""}`}
    >
      <div className="w-full max-w-md space-y-4">
        <Skeleton height="2rem" className="w-3/4 mx-auto" />
        <SkeletonText lines={2} className="mx-auto" />
        <div className="flex justify-center gap-2">
          <Skeleton height="2.5rem" className="w-24" />
          <Skeleton height="2.5rem" className="w-24" />
        </div>
      </div>
    </div>
  );
}

function ProfilePageSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={`min-h-screen bg-main-bg text-main-text ${className || ""}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <Skeleton height="3rem" className="w-64" />
          <SkeletonText lines={2} className="max-w-2xl" />
        </div>

        {/* Profile Card */}
        <div className="bg-surface border border-subtle rounded-2xl p-8 space-y-6">
          {/* Avatar and Name */}
          <div className="flex items-center gap-4">
            <Skeleton variant="circular" width={80} height={80} />
            <div className="space-y-2 flex-1">
              <Skeleton height="1.5rem" className="w-48" />
              <Skeleton height="1rem" className="w-32" />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-light-bg border border-subtle rounded-lg p-4 space-y-2"
              >
                <Skeleton height="0.875rem" className="w-20" />
                <Skeleton height="1.5rem" className="w-16" />
              </div>
            ))}
          </div>

          {/* Sections */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton height="1.25rem" className="w-32" />
              <SkeletonText lines={3} />
            </div>
            <div className="space-y-2">
              <Skeleton height="1.25rem" className="w-32" />
              <SkeletonText lines={2} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardPageSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={`min-h-screen bg-main-bg text-main-text ${className || ""}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <Skeleton height="3rem" className="w-64" />
          <SkeletonText lines={1} className="max-w-2xl" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-surface border border-subtle rounded-lg p-6 space-y-2"
            >
              <Skeleton height="0.875rem" className="w-24" />
              <Skeleton height="2rem" className="w-20" />
            </div>
          ))}
        </div>

        {/* Content Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FormPageSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={`min-h-screen bg-main-bg text-main-text ${className || ""}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <Skeleton height="3rem" className="w-64" />
            <SkeletonText lines={2} className="max-w-2xl" />
          </div>

          {/* Form Card */}
          <div className="bg-surface border border-subtle rounded-2xl p-8 space-y-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton height="1rem" className="w-32" />
                <Skeleton height="2.5rem" className="w-full" />
              </div>
            ))}
            <div className="flex justify-end gap-3 pt-4">
              <Skeleton height="2.5rem" className="w-24" />
              <Skeleton height="2.5rem" className="w-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

