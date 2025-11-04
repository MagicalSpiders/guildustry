"use client";

import React, { forwardRef } from "react";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "accent" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: string;
  iconPosition?: "left" | "right";
  asChild?: boolean;
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "accent",
      size = "md",
      icon,
      iconPosition = "right",
      asChild = false,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "flex gap-2 items-center justify-center gap-2 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-main-accent disabled:opacity-50 disabled:cursor-not-allowed";

    const variantClasses = {
      accent:
        "bg-main-accent text-white hover:bg-[#f59f0ac5] shadow-sm hover:shadow-md",
      outline:
        "border border-main-accent text-main-accent bg-transparent hover:bg-[#f59f0a] hover:text-white",
      ghost: "text-main-text hover:bg-surface border border-subtle",
    };

    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm rounded-md",
      md: "px-4 py-2 text-base rounded-lg",
      lg: "px-6 py-3 text-lg rounded-xl",
    };

    const classes = clsx(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className
    );

    if (asChild) {
      // If asChild is true, clone the child element and add our classes
      const child = children as React.ReactElement;
      return React.cloneElement(child, {
        className: clsx(classes, child.props?.className),
        ...props,
      });
    }

    return (
      <button ref={ref} className={classes} disabled={disabled} {...props}>
        {icon && iconPosition === "left" && (
          <Icon icon={icon} className="w-5 h-5" />
        )}
        {children}
        {icon && iconPosition === "right" && (
          <Icon icon={icon} className="w-5 h-5" />
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
