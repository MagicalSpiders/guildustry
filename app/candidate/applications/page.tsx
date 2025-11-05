"use client";

import { useMemo, useState } from "react";
import { Stats } from "@/src/app/candidate/applications/components/Stats";
import { Filters } from "@/src/app/candidate/applications/components/Filters";
import { ApplicationCard } from "@/src/app/candidate/applications/components/ApplicationCard";
import { data } from "@/src/app/candidate/applications/data";

const tabs = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "saved", label: "Saved Jobs" },
  { key: "interviews", label: "Interviews" },
  { key: "rejected", label: "Rejected" },
];

export default function CandidateApplicationsPage() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("all");
  const [sort, setSort] = useState<"date" | "title">("date");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = data.filter((a) =>
      !q
        ? true
        : [a.title, a.company, a.location].some((f) => f.toLowerCase().includes(q))
    );
    if (tab !== "all") {
      list = list.filter((a) => a.category === tab);
    }
    list.sort((a, b) => {
      if (sort === "date") return new Date(b.applied).getTime() - new Date(a.applied).getTime();
      return a.title.localeCompare(b.title);
    });
    return list;
  }, [query, tab, sort]);

  const stats = useMemo(() => {
    const total = data.length;
    const interviews = data.filter((d) => d.status === "Interview Scheduled").length;
    const underReview = data.filter((d) => d.status === "Under Review").length;
    const pending = data.filter((d) => d.status === "Pending").length;
    return { total, interviews, underReview, pending };
  }, []);

  return (
    <div className="min-h-screen bg-main-bg text-main-text">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-title font-bold">My Applications</h1>
          <p className="mt-2 text-main-light-text">Track and manage your job applications</p>
        </div>

        <Stats {...stats} />

        <div className="mt-4">
          <Filters
            query={query}
            onQueryChange={setQuery}
            sort={sort}
            onSortChange={setSort}
            tabs={tabs}
            currentTab={tab}
            onTabChange={setTab}
          />
        </div>

        <div className="mt-6 space-y-6">
          {filtered.map((app) => (
            <ApplicationCard key={app.id} app={app} />
          ))}
          {filtered.length === 0 && (
            <div className="rounded-2xl border border-subtle bg-surface p-8 text-center text-main-light-text">
              No applications match your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


