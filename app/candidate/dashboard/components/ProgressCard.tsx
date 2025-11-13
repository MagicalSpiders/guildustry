"use client";

import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

type Step = {
  title: string;
  subtitle?: string;
  status: "done" | "pending" | "optional" | "disabled";
  href?: string;
  onClick?: () => void;
};

export function ProgressCard({ steps }: { steps: Step[] }) {
  const router = useRouter();
  const completed = steps.filter((s) => s.status === "done").length;
  const percent = Math.round((completed / steps.length) * 100);

  const handleStepClick = (step: Step) => {
    if (step.status === "disabled") {
      return; // Don't allow navigation if disabled
    }
    if (step.onClick) {
      step.onClick();
    } else if (step.href) {
      router.push(step.href);
    }
  };

  return (
    <section className="rounded-2xl border border-subtle bg-surface shadow-elevated overflow-hidden">
      <div className="px-5 sm:px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-title font-bold">
              Get Started with Guildustry
            </h2>
            <p className="mt-1 text-sm text-main-light-text">
              Complete these steps to unlock all features
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-title font-bold">
              {completed}/{steps.length}
            </div>
            <div className="text-xs text-main-light-text">completed</div>
          </div>
        </div>
        <div className="mt-4 h-2 w-full rounded-full bg-main-bg/40">
          <div
            className="h-2 rounded-full bg-main-accent"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div className="divide-y divide-subtle">
        {steps.map((s) => {
          const isClickable = s.status === "pending" && (s.href || s.onClick);
          const isDisabled = s.status === "disabled";

          return (
            <div
              key={s.title}
              className={`flex items-center gap-4 px-5 sm:px-6 py-5 ${
                isClickable && !isDisabled
                  ? "cursor-pointer hover:bg-light-bg/50 transition-colors"
                  : ""
              } ${isDisabled ? "opacity-50" : ""}`}
              onClick={() => handleStepClick(s)}
            >
              <span className="inline-flex items-center justify-center rounded-full border border-subtle bg-surface w-5 h-5 shrink-0">
                {s.status === "done" && (
                  <Icon
                    icon="lucide:check"
                    className="w-4 h-4 text-main-accent"
                  />
                )}
              </span>
              <div className="flex-1 min-w-0">
                <div
                  className={`font-medium ${
                    s.status === "done" ? "line-through opacity-70" : ""
                  }`}
                >
                  {s.title}
                </div>
                {s.subtitle && (
                  <div className="text-xs text-main-light-text mt-0.5">
                    {s.subtitle}
                  </div>
                )}
              </div>
              {s.status === "pending" && !isDisabled && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStepClick(s);
                  }}
                  className="ml-auto cursor-pointer text-sm font-medium px-3 py-1.5 rounded-lg border border-subtle bg-light-bg hover:border-main-accent hover:text-main-accent transition-colors shrink-0"
                >
                  Start
                </button>
              )}
              {s.status === "disabled" && (
                <span className="ml-auto text-xs text-main-light-text shrink-0">
                  Complete previous step
                </span>
              )}
              {s.status === "optional" && (
                <span className="ml-auto text-[11px] uppercase tracking-wide rounded-full border border-subtle px-2 py-1 text-main-light-text shrink-0">
                  Optional
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
