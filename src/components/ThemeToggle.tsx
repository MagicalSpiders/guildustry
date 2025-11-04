"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="p-2 rounded-lg bg-surface border border-subtle">
        <div className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={clsx(
        "p-2 rounded-lg transition-all duration-200",
        "bg-surface border border-subtle",
        "hover:bg-main-accent hover:text-white",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-main-accent"
      )}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    >
      <Icon
        icon={theme === "dark" ? "lucide:sun" : "lucide:moon"}
        className="w-5 h-5"
      />
    </button>
  );
}
