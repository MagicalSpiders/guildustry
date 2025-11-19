"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { getAdminDashboardStats } from "@/src/lib/adminFunctions";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<{
    totalCandidates: number;
    totalEmployers: number;
    totalJobs: number;
    pendingJobs: number;
    openJobs: number;
    totalApplications: number;
    pendingApplications: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const data = await getAdminDashboardStats();
        setStats(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center text-main-light-text">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-500">
          Error: {error}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Candidates",
      value: stats?.totalCandidates || 0,
      icon: "lucide:user",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Total Employers",
      value: stats?.totalEmployers || 0,
      icon: "lucide:building",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Total Jobs",
      value: stats?.totalJobs || 0,
      icon: "lucide:briefcase",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Pending Jobs",
      value: stats?.pendingJobs || 0,
      icon: "lucide:clock",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Open Jobs",
      value: stats?.openJobs || 0,
      icon: "lucide:check-circle",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Total Applications",
      value: stats?.totalApplications || 0,
      icon: "lucide:file-text",
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
    },
    {
      title: "Pending Applications",
      value: stats?.pendingApplications || 0,
      icon: "lucide:alert-circle",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-title font-bold text-main-text">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-lg text-main-light-text">
          Overview of platform statistics and activity
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-subtle bg-surface p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-main-light-text">{card.title}</p>
                <p className="mt-2 text-3xl font-title font-bold text-main-text">
                  {card.value.toLocaleString()}
                </p>
              </div>
              <div className={`rounded-lg ${card.bgColor} p-3`}>
                <Icon icon={card.icon} className={`h-6 w-6 ${card.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-subtle bg-surface p-6">
        <h2 className="text-xl font-title font-semibold text-main-text mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            href="/admin/users"
            className="flex items-center gap-3 p-4 rounded-lg border border-subtle bg-light-bg hover:bg-surface transition-colors"
          >
            <Icon icon="lucide:users" className="h-5 w-5 text-main-accent" />
            <span className="text-main-text font-medium">Manage Users</span>
          </a>
          <a
            href="/admin/jobs"
            className="flex items-center gap-3 p-4 rounded-lg border border-subtle bg-light-bg hover:bg-surface transition-colors"
          >
            <Icon icon="lucide:briefcase" className="h-5 w-5 text-main-accent" />
            <span className="text-main-text font-medium">Review Jobs</span>
          </a>
          <a
            href="/admin/content"
            className="flex items-center gap-3 p-4 rounded-lg border border-subtle bg-light-bg hover:bg-surface transition-colors"
          >
            <Icon icon="lucide:file-edit" className="h-5 w-5 text-main-accent" />
            <span className="text-main-text font-medium">Manage Content</span>
          </a>
        </div>
      </div>
    </div>
  );
}

