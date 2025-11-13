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

export function JobsStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard label="Active Posts" value="2" icon="lucide:briefcase" />
      <StatCard label="Total Applicants" value="20" icon="lucide:users" />
      <StatCard label="Total Views" value="434" icon="lucide:eye" />
      <StatCard label="Available Jobs" value="5" icon="lucide:check-circle" />
    </div>
  );
}

