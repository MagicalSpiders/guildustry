import { Icon } from "@iconify/react";

type Interview = { role: string; company: string; date: string };

export function UpcomingInterviews({ item }: { item: Interview }) {
  return (
    <section className="rounded-2xl border border-subtle bg-surface shadow-elevated">
      <div className="px-5 sm:px-6 py-5 border-b border-subtle">
        <h3 className="text-xl font-title font-bold">Upcoming Interviews</h3>
      </div>
      <div className="px-5 sm:px-6 py-5">
        <div className="rounded-xl border border-subtle bg-light-bg px-4 py-4">
          <div className="font-medium">{item.role}</div>
          <div className="text-sm text-main-light-text">{item.company}</div>
          <div className="mt-2 flex items-center gap-2 text-sm text-main-light-text">
            <Icon icon="lucide:calendar" className="w-4 h-4" />
            {item.date}
          </div>
        </div>
      </div>
    </section>
  );
}
