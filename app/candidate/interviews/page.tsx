"use client";

import { useState, useMemo, useEffect } from "react";
import { InterviewsHeader } from "@/app/candidate/interviews/components/InterviewsHeader";
import { InterviewsStats } from "@/app/candidate/interviews/components/InterviewsStats";
import { InterviewsFilters } from "@/app/candidate/interviews/components/InterviewsFilters";
import { InterviewCard } from "@/app/candidate/interviews/components/InterviewCard";
import {
  getInterviewsForCandidate,
  getInterviewStats,
  type InterviewWithRelations,
} from "@/src/lib/interviewsFunctions";
import { NoticeModal } from "@/src/components/NoticeModal";

export default function CandidateInterviewsPage() {
  const [interviews, setInterviews] = useState<InterviewWithRelations[]>([]);
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
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch interviews on mount
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true);
        setError(null);

        setNoticeModal({
          open: true,
          title: "Loading Interviews...",
          description: "Please wait while we fetch your interviews.",
          variant: "info",
        });

        const fetchedInterviews = await getInterviewsForCandidate();
        setInterviews(fetchedInterviews);

        setNoticeModal({ open: false, title: "", variant: "info" });
      } catch (err: any) {
        const errorMessage =
          err.message || "Failed to load interviews. Please try again later.";
        setError(errorMessage);
        setNoticeModal({
          open: true,
          title: "Error Loading Interviews",
          description: errorMessage,
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  // Filter interviews
  const filteredInterviews = useMemo(() => {
    let filtered = [...interviews];

    // Search filter
    if (query.trim()) {
      const searchQuery = query.toLowerCase();
      filtered = filtered.filter((interview) => {
        const jobTitle =
          interview.applications?.jobs?.title?.toLowerCase() || "";
        return jobTitle.includes(searchQuery);
      });
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (interview) => interview.status === statusFilter
      );
    }

    // Sort by date (upcoming first)
    filtered.sort((a, b) => {
      const dateA = new Date(a.interview_date).getTime();
      const dateB = new Date(b.interview_date).getTime();
      return dateA - dateB;
    });

    return filtered;
  }, [interviews, query, statusFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    const now = new Date();
    return {
      total: interviews.length,
      upcoming: interviews.filter(
        (i) =>
          i.status === "scheduled" && new Date(i.interview_date) > now
      ).length,
      completed: interviews.filter((i) => i.status === "completed").length,
      scheduled: interviews.filter((i) => i.status === "scheduled").length,
    };
  }, [interviews]);

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
          <InterviewsHeader />
          <InterviewsStats {...stats} />

          <InterviewsFilters
            query={query}
            onQueryChange={setQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />

          {loading ? (
            <div className="text-center py-12">
              <p className="text-main-light-text">Loading interviews...</p>
            </div>
          ) : filteredInterviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-main-light-text">
                {error
                  ? "Failed to load interviews. Please try again."
                  : "No interviews found."}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredInterviews.map((interview) => (
                <InterviewCard key={interview.id} interview={interview} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

