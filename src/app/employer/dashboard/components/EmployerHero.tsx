"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Button } from "@/src/components/Button";
import { PostJobModal } from "./PostJobModal";

interface SummaryCardProps {
  title: string;
  value: string;
  description: string;
  icon: string;
  badge?: string;
  showNotificationDot?: boolean;
}

function SummaryCard({
  title,
  value,
  description,
  icon,
  badge,
  showNotificationDot = false,
}: SummaryCardProps) {
  return (
    <div className="rounded-lg bg-surface border border-subtle p-6 relative flex flex-col hover:shadow-lg transition-all cursor-pointer hover:border-main-accent/50">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-main-light-text mb-2">
            {title}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-title text-main-text">
              {value}
            </span>
            {badge && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white">
                {badge}
              </span>
            )}
          </div>
        </div>
        <div className="relative ml-2">
          <Icon icon={icon} className="w-6 h-6 text-main-light-text" />
          {showNotificationDot && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-surface"></span>
          )}
        </div>
      </div>
      <p className="text-sm text-main-light-text mt-auto">{description}</p>
    </div>
  );
}

export function EmployerHero({ companyName = "ABC Construction" }: { companyName?: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="mb-8">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-title font-bold text-main-text mb-2">
            Welcome back, {companyName}!
          </h1>
          <p className="text-lg text-main-light-text">
            Here's an overview of your hiring activity
          </p>
        </div>
        <Button
          variant="accent"
          size="lg"
          icon="lucide:plus"
          iconPosition="left"
          onClick={() => setIsModalOpen(true)}
        >
          Post New Job
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/employer/jobs">
          <SummaryCard
            title="Active Jobs"
            value="5"
            description="Currently hiring"
            icon="lucide:briefcase"
          />
        </Link>
        <SummaryCard
          title="Total Applicants"
          value="42"
          description="Across all jobs"
          icon="lucide:users"
        />
        <SummaryCard
          title="Interviews"
          value="8"
          description="Scheduled this month"
          icon="lucide:calendar"
        />
        <SummaryCard
          title="Notifications"
          value="3"
          description="New updates"
          icon="lucide:bell"
          badge="NEW"
          showNotificationDot={true}
        />
      </div>

      <PostJobModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

