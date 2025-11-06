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

export function ApplicantsStats({
  total,
  new: newCount,
  interviews,
  shortlisted,
}: {
  total: number;
  new: number;
  interviews: number;
  shortlisted: number;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard label="Total Applicants" value={total.toString()} icon="lucide:users" />
      <StatCard label="New" value={newCount.toString()} icon="lucide:user-plus" />
      <StatCard label="Interviews" value={interviews.toString()} icon="lucide:calendar" />
      <StatCard label="Shortlisted" value={shortlisted.toString()} icon="lucide:star" />
    </div>
  );
}

