"use client";

import { Icon } from "@iconify/react";
import { CompanyProfile } from "../data/mockCompanyData";

interface CompanyStatsProps {
  stats: CompanyProfile["stats"];
}

export function CompanyStats({ stats }: CompanyStatsProps) {
  const statItems = [
    {
      label: "Total Employees",
      value: stats.totalEmployees,
      icon: "lucide:users",
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
      borderColor: "border-blue-500/30",
    },
    {
      label: "Active Jobs",
      value: stats.activeJobs,
      icon: "lucide:briefcase",
      color: "text-green-400",
      bgColor: "bg-green-500/20",
      borderColor: "border-green-500/30",
    },
    {
      label: "Total Hires",
      value: stats.totalHires,
      icon: "lucide:user-check",
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
      borderColor: "border-purple-500/30",
    },
    {
      label: "Years in Business",
      value: stats.yearsInBusiness,
      icon: "lucide:calendar",
      color: "text-amber-400",
      bgColor: "bg-amber-500/20",
      borderColor: "border-amber-500/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statItems.map((item, index) => (
        <div
          key={index}
          className={`rounded-lg border p-6 ${item.bgColor} ${item.borderColor}`}
        >
          <div className="flex items-center justify-between mb-4">
            <Icon
              icon={item.icon}
              className={`w-8 h-8 ${item.color}`}
            />
          </div>
          <div className="text-3xl font-bold font-title text-main-text mb-1">
            {item.value}
          </div>
          <p className="text-sm text-main-light-text">{item.label}</p>
        </div>
      ))}
    </div>
  );
}

