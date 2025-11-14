"use client";

import { useMemo, useState, useEffect } from "react";
import { Stats } from "@/app/candidate/applications/components/Stats";
import { Filters } from "@/app/candidate/applications/components/Filters";
import { ApplicationCard } from "@/app/candidate/applications/components/ApplicationCard";
import { Application } from "@/app/candidate/applications/data";
import { getOwnApplications, ApplicationWithRelations } from "@/src/lib/applicationsFunctions";
import { NoticeModal } from "@/src/components/NoticeModal";

const tabs = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "saved", label: "Saved Jobs" },
  { key: "interviews", label: "Interviews" },
  { key: "rejected", label: "Rejected" },
];

// Map backend status to UI status
const mapStatus = (status: string): Application["status"] => {
  const statusMap: Record<string, Application["status"]> = {
    pending: "Pending",
    underReview: "Under Review",
    shortlisted: "Under Review",
    interviewScheduled: "Interview Scheduled",
    rejected: "Rejected",
  };
  return statusMap[status] || "Pending";
};

// Map status to category
const getCategory = (status: Application["status"]): Application["category"] => {
  if (status === "Interview Scheduled") return "interviews";
  if (status === "Rejected") return "rejected";
  if (status === "Under Review" || status === "Pending") return "active";
  return "all";
};

export default function CandidateApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noticeModal, setNoticeModal] = useState<{
    open: boolean;
    title: string;
    description?: string;
    variant: "success" | "error" | "info";
  }>({
    open: false,
    title: "",
    variant: "info",
  });
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("all");
  const [sort, setSort] = useState<"date" | "title">("date");

  // Fetch applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);

        setNoticeModal({
          open: true,
          title: "Loading Applications...",
          description: "Please wait while we fetch your applications.",
          variant: "info",
        });

        const apps = await getOwnApplications();

        // Transform ApplicationWithRelations to Application format
        const transformedApps: Application[] = apps.map((app) => {
          const submittedDate = new Date(app.submitted_at);
          const formattedDate = submittedDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });

          const job = app.jobs;
          const status = mapStatus(app.status);
          const salary = job
            ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`
            : "N/A";

          return {
            id: app.id,
            title: job?.title || "Unknown Position",
            company: "Unknown Company", // Company name not in current query
            location: job?.location || "Unknown Location",
            salary,
            applied: formattedDate,
            status,
            category: getCategory(status),
            summary: app.cover_letter || undefined,
          };
        });

        setApplications(transformedApps);
        setNoticeModal({ open: false, title: "", variant: "info" });
      } catch (err: any) {
        const errorMessage =
          err.message || "Failed to load applications. Please try again later.";
        setError(errorMessage);
        setNoticeModal({
          open: true,
          title: "Error Loading Applications",
          description: errorMessage,
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = applications.filter((a) =>
      !q
        ? true
        : [a.title, a.company, a.location].some((f) =>
            f.toLowerCase().includes(q)
          )
    );
    if (tab !== "all") {
      list = list.filter((a) => a.category === tab);
    }
    list.sort((a, b) => {
      if (sort === "date")
        return new Date(b.applied).getTime() - new Date(a.applied).getTime();
      return a.title.localeCompare(b.title);
    });
    return list;
  }, [applications, query, tab, sort]);

  const stats = useMemo(() => {
    const total = applications.length;
    const interviews = applications.filter(
      (d) => d.status === "Interview Scheduled"
    ).length;
    const underReview = applications.filter((d) => d.status === "Under Review").length;
    const pending = applications.filter((d) => d.status === "Pending").length;
    return { total, interviews, underReview, pending };
  }, [applications]);

  return (
    <>
      <NoticeModal
        open={noticeModal.open}
        title={noticeModal.title}
        description={noticeModal.description}
        variant={noticeModal.variant}
        onClose={() =>
          setNoticeModal({ open: false, title: "", variant: "info" })
        }
        primaryAction={
          noticeModal.variant === "error"
            ? {
                label: "Retry",
                onClick: () => {
                  setNoticeModal({ open: false, title: "", variant: "info" });
                  window.location.reload();
                },
              }
            : undefined
        }
      />

      <div className="min-h-screen bg-main-bg text-main-text">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-title font-bold">
              My Applications
            </h1>
            <p className="mt-2 text-main-light-text">
              Track and manage your job applications
            </p>
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

          {loading ? (
            <div className="mt-6 text-center py-12">
              <p className="text-main-light-text">Loading applications...</p>
            </div>
          ) : (
            <div className="mt-6 space-y-6">
              {filtered.map((app) => (
                <ApplicationCard key={app.id} app={app} />
              ))}
              {filtered.length === 0 && (
                <div className="rounded-2xl border border-subtle bg-surface p-8 text-center text-main-light-text">
                  {error
                    ? "Failed to load applications. Please try again."
                    : "No applications match your filters."}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
