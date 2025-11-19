"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { getApplicationStats } from "@/src/lib/adminFunctions";

export default function AdminApplicationsPage() {
  const [stats, setStats] = useState<{
    total: number;
    pending: number;
    reviewed: number;
    accepted: number;
    rejected: number;
    interviewScheduled: number;
    byTrade: Array<{ trade: string; count: number }>;
    byStatus: Array<{ status: string; count: number }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      setLoading(true);
      setError(null);
      const data = await getApplicationStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center text-main-light-text">Loading statistics...</div>
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

  const overviewCards = [
    {
      title: "Total Applications",
      value: stats?.total || 0,
      icon: "lucide:file-text",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Pending Review",
      value: stats?.pending || 0,
      icon: "lucide:clock",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Reviewed",
      value: stats?.reviewed || 0,
      icon: "lucide:eye",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Accepted",
      value: stats?.accepted || 0,
      icon: "lucide:check-circle",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Rejected",
      value: stats?.rejected || 0,
      icon: "lucide:x-circle",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      title: "Interview Scheduled",
      value: stats?.interviewScheduled || 0,
      icon: "lucide:calendar",
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-title font-bold text-main-text">
          Application Tracking
        </h1>
        <p className="mt-2 text-lg text-main-light-text">
          System-wide statistics on candidate application flows
        </p>
      </div>

      {/* Overview Stats */}
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {overviewCards.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-subtle bg-surface p-6"
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications by Trade */}
        <div className="rounded-2xl border border-subtle bg-surface p-6">
          <h2 className="text-xl font-title font-semibold text-main-text mb-4">
            Applications by Trade
          </h2>
          {stats && stats.byTrade.length > 0 ? (
            <div className="space-y-3">
              {stats.byTrade
                .sort((a, b) => b.count - a.count)
                .map((item) => (
                  <div key={item.trade} className="flex items-center justify-between">
                    <span className="text-main-text font-medium">{item.trade}</span>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-32 rounded-full bg-light-bg overflow-hidden">
                        <div
                          className="h-full bg-main-accent rounded-full"
                          style={{
                            width: `${(item.count / stats.total) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-main-light-text text-sm w-12 text-right">
                        {item.count}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-main-light-text">No data available</p>
          )}
        </div>

        {/* Applications by Status */}
        <div className="rounded-2xl border border-subtle bg-surface p-6">
          <h2 className="text-xl font-title font-semibold text-main-text mb-4">
            Applications by Status
          </h2>
          {stats && stats.byStatus.length > 0 ? (
            <div className="space-y-3">
              {stats.byStatus
                .sort((a, b) => b.count - a.count)
                .map((item) => (
                  <div key={item.status} className="flex items-center justify-between">
                    <span className="text-main-text font-medium capitalize">
                      {item.status.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-32 rounded-full bg-light-bg overflow-hidden">
                        <div
                          className="h-full bg-main-accent rounded-full"
                          style={{
                            width: `${(item.count / stats.total) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-main-light-text text-sm w-12 text-right">
                        {item.count}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-main-light-text">No data available</p>
          )}
        </div>
      </div>
    </div>
  );
}

