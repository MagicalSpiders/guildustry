import { Icon } from "@iconify/react";

type Action = { icon: string; label: string };

export function QuickActions({ actions }: { actions: Action[] }) {
  return (
    <section className="rounded-2xl border border-subtle bg-surface shadow-elevated">
      <div className="px-5 sm:px-6 py-5 border-b border-subtle">
        <h3 className="text-xl font-title font-bold">Quick Actions</h3>
      </div>
      <div className="px-5 sm:px-6 py-3 space-y-3">
        {actions.map((action) => (
          <button
            key={action.label}
            className="w-full flex items-center gap-3 rounded-xl border border-subtle bg-light-bg px-4 py-3 text-left hover:border-main-accent hover:text-main-accent transition-colors"
          >
            <Icon icon={action.icon} className="w-4 h-4" />
            <span className="text-sm font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}


