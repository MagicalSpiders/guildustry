"use client";

import { useState, useEffect, useMemo } from "react";
import { EmployerHero } from "@/app/employer/dashboard/components/EmployerHero";
import { RecentJobPostings } from "@/app/employer/dashboard/components/RecentJobPostings";
import { RecentApplicants } from "@/app/employer/dashboard/components/RecentApplicants";
import { getOwnJobs, Job } from "@/src/lib/jobsFunctions";
import {
  getApplicationsForEmployer,
  ApplicationWithRelations,
} from "@/src/lib/applicationsFunctions";
import {
  getInterviewsForEmployer,
  InterviewWithRelations,
} from "@/src/lib/interviewsFunctions";
import { getUnreadNotifications } from "@/src/lib/notificationsFunctions";
import type { Notification } from "@/src/lib/database.types";
import { useAuth } from "@/src/components/AuthProvider";
import { PageSkeleton } from "@/src/components/ui/PageSkeleton";

// Map backend application status to UI status
const mapApplicationStatus = (
  status: string
):
  | "new"
  | "underReview"
  | "interviewScheduled"
  | "shortlisted"
  | "rejected" => {
  const statusMap: Record<
    string,
    "new" | "underReview" | "interviewScheduled" | "shortlisted" | "rejected"
  > = {
    pending: "new",
    underReview: "underReview",
    shortlisted: "shortlisted",
    interviewScheduled: "interviewScheduled",
    rejected: "rejected",
  };
  return statusMap[status] || "new";
};

// Format date to relative time (e.g., "2 days ago")
const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return "Today";
  } else if (diffInDays === 1) {
    return "Yesterday";
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
};

export default function EmployerDashboardPage() {
  const { user, company, loading: authLoading } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<ApplicationWithRelations[]>(
    []
  );
  const [interviews, setInterviews] = useState<InterviewWithRelations[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch jobs, applications, interviews, and notifications
  useEffect(() => {
    const fetchData = async () => {
      if (authLoading) return;

      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch all data in parallel
        const [jobsData, applicationsData, interviewsData, notificationsData] =
          await Promise.all([
            getOwnJobs(),
            getApplicationsForEmployer(),
            getInterviewsForEmployer(),
            getUnreadNotifications(),
          ]);

        setJobs(jobsData);
        setApplications(applicationsData);
        // Store interviews and notifications for calculations
        setInterviews(interviewsData);
        setNotifications(notificationsData);
      } catch (err: any) {
        console.error("Failed to fetch dashboard data:", err);
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading]);

  // Transform jobs for RecentJobPostings component
  const transformedJobs = useMemo(() => {
    // Get applicant counts per job
    const applicantCounts = new Map<string, number>();
    applications.forEach((app) => {
      const count = applicantCounts.get(app.job_id) || 0;
      applicantCounts.set(app.job_id, count + 1);
    });

    // Sort by posted_date (most recent first) and take top 3
    const sortedJobs = [...jobs]
      .sort((a, b) => {
        const dateA = new Date(a.posted_date).getTime();
        const dateB = new Date(b.posted_date).getTime();
        return dateB - dateA;
      })
      .slice(0, 3);

    return sortedJobs.map((job) => ({
      id: job.id,
      title: job.title,
      location: job.location,
      postedDate: formatRelativeDate(job.posted_date),
      applicantsCount: applicantCounts.get(job.id) || 0,
      status:
        job.status === "open"
          ? ("active" as const)
          : job.status === "closed"
          ? ("closed" as const)
          : null,
    }));
  }, [jobs, applications]);

  // Transform applications for RecentApplicants component
  const transformedApplicants = useMemo(() => {
    // Sort by submitted_at (most recent first) and take top 3
    const sortedApplications = [...applications]
      .sort((a, b) => {
        const dateA = new Date(a.submitted_at).getTime();
        const dateB = new Date(b.submitted_at).getTime();
        return dateB - dateA;
      })
      .slice(0, 3);

    return sortedApplications.map((app) => ({
      id: app.id,
      name: app.candidate_profile?.fullname || "Unknown Candidate",
      position: app.jobs?.title || "Unknown Position",
      experience: app.candidate_profile?.years_of_experience
        ? `${app.candidate_profile.years_of_experience} ${
            app.candidate_profile.years_of_experience === 1 ? "year" : "years"
          }`
        : "Experience not specified",
      status: mapApplicationStatus(app.status),
    }));
  }, [applications]);

  // Calculate summary card statistics
  const summaryStats = useMemo(() => {
    // Active jobs count (status === "open")
    const activeJobsCount = jobs.filter((job) => job.status === "open").length;

    // Total applicants count
    const totalApplicantsCount = applications.length;

    // Interviews scheduled this month (including future ones)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59
    );
    const interviewsThisMonth = interviews.filter((interview) => {
      const interviewDate = new Date(interview.interview_date);
      return (
        interviewDate >= startOfMonth &&
        interviewDate <= endOfMonth &&
        interview.status === "scheduled"
      );
    });
    const interviewsThisMonthCount = interviewsThisMonth.length;

    // Unread notifications count
    const unreadNotificationsCount = notifications.length;

    return {
      activeJobsCount,
      totalApplicantsCount,
      interviewsThisMonthCount,
      unreadNotificationsCount,
    };
  }, [jobs, applications, interviews, notifications]);

  if (authLoading || loading) {
    return <PageSkeleton variant="dashboard" />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-main-bg text-main-text flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-main-accent text-white rounded-lg hover:bg-[#f59f0ac5] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-main-bg text-main-text">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
        <EmployerHero
          companyName={company?.name || "Your Company"}
          activeJobsCount={summaryStats.activeJobsCount}
          totalApplicantsCount={summaryStats.totalApplicantsCount}
          interviewsThisMonthCount={summaryStats.interviewsThisMonthCount}
          unreadNotificationsCount={summaryStats.unreadNotificationsCount}
        />

        {/* Recent Job Postings and Recent Applicants */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <RecentJobPostings jobs={transformedJobs} />
          <RecentApplicants applicants={transformedApplicants} />
        </div>
      </div>
    </div>
  );
}
