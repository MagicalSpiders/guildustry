interface InterviewsStatsProps {
  total: number;
  upcoming: number;
  completed: number;
  scheduled: number;
}

export function InterviewsStats({
  total,
  upcoming,
  completed,
  scheduled,
}: InterviewsStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="rounded-2xl border border-subtle bg-surface p-5">
        <div className="text-2xl font-bold text-main-text">{total}</div>
        <div className="text-sm text-main-light-text mt-1">Total Interviews</div>
      </div>
      <div className="rounded-2xl border border-subtle bg-surface p-5">
        <div className="text-2xl font-bold text-main-accent">{upcoming}</div>
        <div className="text-sm text-main-light-text mt-1">Upcoming</div>
      </div>
      <div className="rounded-2xl border border-subtle bg-surface p-5">
        <div className="text-2xl font-bold text-green-400">{completed}</div>
        <div className="text-sm text-main-light-text mt-1">Completed</div>
      </div>
      <div className="rounded-2xl border border-subtle bg-surface p-5">
        <div className="text-2xl font-bold text-orange-400">{scheduled}</div>
        <div className="text-sm text-main-light-text mt-1">Scheduled</div>
      </div>
    </div>
  );
}

