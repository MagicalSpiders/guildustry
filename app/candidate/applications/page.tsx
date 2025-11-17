"use client";

import { useMemo, useState, useEffect } from "react";
import { Stats } from "@/app/candidate/applications/components/Stats";
import { Filters } from "@/app/candidate/applications/components/Filters";
import { ApplicationCard } from "@/app/candidate/applications/components/ApplicationCard";
import { Application } from "@/app/candidate/applications/data";
import { getOwnApplications, ApplicationWithRelations } from "@/src/lib/applicationsFunctions";
import { getInterviewsForCandidate, InterviewWithRelations } from "@/src/lib/interviewsFunctions";
import { NoticeModal } from "@/src/components/NoticeModal";

const tabs = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "saved", label: "Saved Jobs" },
  { key: "interviews", label: "Interviews" },
  { key: "rejected", label: "Rejected" },
];

// Map backend status to UI status
const mapStatus = (status: string | null): Application["status"] => {
  const statusMap: Record<string, Application["status"]> = {
    accepted: "accepted",
    reviewed: "reviewed",
    pending: "pending",
    rejected: "rejected",
    withdrawn: "withdrawn",
  };
  return statusMap[status || "pending"] || "pending";
};

// Map status and interview to category
const getCategory = (status: Application["status"], hasInterview: boolean): Application["category"] => {
  if (hasInterview) return "interviews";
  if (status === "rejected" || status === "withdrawn") return "rejected";
  if (status === "reviewed" || status === "pending" || status === "accepted") return "active";
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

        // Fetch applications and interviews in parallel
        const [apps, interviews] = await Promise.all([
          getOwnApplications(),
          getInterviewsForCandidate(),
        ]);

        // Create a map of application IDs to interviews for quick lookup
        const interviewMap = new Map<string, InterviewWithRelations>();
        interviews.forEach(interview => {
          if (interview.applications?.id) {
            interviewMap.set(interview.applications.id, interview);
          }
        });

        // Transform ApplicationWithRelations to Application format
        const transformedApps: Application[] = apps.map((app) => {
          const submittedDate = new Date(app.submitted_at);
          const formattedDate = submittedDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });

          const job = app.jobs;
          const interview = interviewMap.get(app.id);

          // Use the actual status from backend
          const status = mapStatus(app.status);
          const salary = job
            ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`
            : "N/A";

          let interviewData;
          if (interview) {
            interviewData = {
              id: interview.id,
              date: new Date(interview.interview_date).toLocaleString(),
              type: interview.type,
              location: interview.location || undefined,
              notes: interview.notes || undefined,
            };
          }

          return {
            id: app.id,
            title: job?.title || "Unknown Position",
            company: "Unknown Company", // Company name not in current query
            location: job?.location || "Unknown Location",
            salary,
            applied: formattedDate,
            status,
            category: getCategory(status, !!interview),
            summary: app.cover_letter || undefined,
            interview: interviewData,
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
    const interviews = applications.filter((d) => !!d.interview).length;
    const reviewed = applications.filter((d) => d.status === "reviewed").length;
    const pending = applications.filter((d) => d.status === "pending").length;
    return { total, interviews, reviewed, pending };
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
