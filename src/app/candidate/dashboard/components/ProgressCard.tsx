import { Icon } from "@iconify/react";

type Step = {
  title: string;
  subtitle?: string;
  status: "done" | "pending" | "optional";
};

export function ProgressCard({ steps }: { steps: Step[] }) {
  const completed = steps.filter((s) => s.status === "done").length;
  const percent = Math.round((completed / steps.length) * 100);

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
        {steps.map((s) => (
          <div
            key={s.title}
            className="flex items-center gap-4 px-5 sm:px-6 py-5"
          >
            <span className="inline-flex items-center justify-center rounded-full border border-subtle bg-surface w-5 h-5">
              {s.status === "done" && (
                <Icon
                  icon="lucide:check"
                  className="w-4 h-4 text-main-accent"
                />
              )}
            </span>
            <div className="flex-1">
              <div
                className={`font-medium ${
                  s.status === "done" ? "line-through opacity-70" : ""
                }`}
              >
                {s.title}
              </div>
            </div>
            {s.status === "pending" && (
              <button className="ml-auto text-sm font-medium px-3 py-1.5 rounded-lg border border-subtle bg-light-bg hover:border-main-accent hover:text-main-accent transition-colors">
                Start
              </button>
            )}
            {s.status === "optional" && (
              <span className="mr-3 text-[11px] uppercase tracking-wide rounded-full border border-subtle px-2 py-1 text-main-light-text">
                Optional
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
