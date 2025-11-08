"use client";

import { Icon } from "@iconify/react";

interface StatCardProps {
  label: string;
  value: string;
  icon: string;
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="rounded-lg bg-surface border border-subtle p-6">
      <div className="flex items-center justify-between mb-2">
        <Icon icon={icon} className="w-6 h-6 text-main-light-text" />
      </div>
      <div className="text-3xl font-bold font-title text-main-text mb-1">
        {value}
      </div>
      <p className="text-sm text-main-light-text">{label}</p>
    </div>
  );
}

interface JobsStatsProps {
  totalJobs: number;
  highMatchJobs: number;
  appliedJobs: number;
  newJobs: number;
}

export function JobsStats({
  totalJobs,
  highMatchJobs,
  appliedJobs,
  newJobs,
}: JobsStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard label="Total Jobs" value={totalJobs.toString()} icon="lucide:briefcase" />
      <StatCard
        label="High Match (90%+)"
        value={highMatchJobs.toString()}
        icon="lucide:target"
      />
      <StatCard
        label="Applied"
        value={appliedJobs.toString()}
        icon="lucide:check-circle"
      />
      <StatCard label="New This Week" value={newJobs.toString()} icon="lucide:sparkles" />
    </div>
  );
}

