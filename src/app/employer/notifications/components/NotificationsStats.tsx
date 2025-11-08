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

export function NotificationsStats({
  total,
  unread,
  applications,
  interviews,
}: {
  total: number;
  unread: number;
  applications: number;
  interviews: number;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard label="Total" value={total.toString()} icon="lucide:bell" />
      <StatCard label="Unread" value={unread.toString()} icon="lucide:mail" />
      <StatCard label="Applications" value={applications.toString()} icon="lucide:user-plus" />
      <StatCard label="Interviews" value={interviews.toString()} icon="lucide:calendar" />
    </div>
  );
}

