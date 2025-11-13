import { Icon } from "@iconify/react";

type Stat = { title: string; value: string; icon: string };

export function TopStats({ stats }: { stats: Stat[] }) {
  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((card) => (
        <div
          key={card.title}
          className="rounded-2xl border border-subtle bg-surface p-5 shadow-elevated"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-main-light-text">{card.title}</div>
              <div className="mt-3 text-3xl font-title font-bold">
                {card.value}
              </div>
            </div>
            <span className="inline-flex items-center justify-center rounded-lg bg-main-accent/10 text-main-accent p-2">
              <Icon icon={card.icon} className="w-5 h-5" />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
