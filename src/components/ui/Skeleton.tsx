"use client";

import { cn } from "@/src/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: "default" | "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  animate?: boolean;
}

export function Skeleton({
  className,
  variant = "default",
  width,
  height,
  animate = true,
  ...props
}: SkeletonProps) {
  const baseClasses = "bg-light-bg rounded";
  const variantClasses = {
    default: "rounded",
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-none",
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height) style.height = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animate && "animate-skeleton",
        className
      )}
      style={style}
      {...props}
    />
  );
}

// Pre-built skeleton components for common use cases
export function SkeletonText({
  lines = 1,
  className,
  ...props
}: {
  lines?: number;
  className?: string;
} & Omit<SkeletonProps, "variant" | "width" | "height">) {
  if (lines === 1) {
    return (
      <Skeleton
        variant="text"
        height="1rem"
        className={cn("w-full", className)}
        {...props}
      />
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          height="1rem"
          className={cn(
            "w-full",
            i === lines - 1 && "w-3/4" // Last line is shorter
          )}
          {...props}
        />
      ))}
    </div>
  );
}

export function SkeletonAvatar({
  size = 40,
  className,
  ...props
}: {
  size?: number;
  className?: string;
} & Omit<SkeletonProps, "variant" | "width" | "height">) {
  return (
    <Skeleton
      variant="circular"
      width={size}
      height={size}
      className={className}
      {...props}
    />
  );
}

export function SkeletonButton({
  className,
  ...props
}: {
  className?: string;
} & Omit<SkeletonProps, "variant" | "width" | "height">) {
  return (
    <Skeleton
      variant="rectangular"
      height="2.5rem"
      className={cn("w-24", className)}
      {...props}
    />
  );
}

export function SkeletonCard({
  className,
  ...props
}: {
  className?: string;
} & Omit<SkeletonProps, "variant" | "width" | "height">) {
  return (
    <div
      className={cn(
        "bg-surface border border-subtle rounded-lg p-6 space-y-4",
        className
      )}
      {...props}
    >
      <Skeleton height="1.5rem" className="w-3/4" />
      <SkeletonText lines={3} />
      <div className="flex gap-2">
        <SkeletonButton />
        <SkeletonButton className="w-20" />
      </div>
    </div>
  );
}

