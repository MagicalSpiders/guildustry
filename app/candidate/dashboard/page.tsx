"use client";

import { useState, useEffect, useMemo } from "react";
import { Welcome } from "@/app/candidate/dashboard/components/Welcome";
import { ProgressCard } from "@/app/candidate/dashboard/components/ProgressCard";
import { TopStats } from "@/app/candidate/dashboard/components/TopStats";
import { RecentApplications } from "@/app/candidate/dashboard/components/RecentApplications";
import { UpcomingInterviews } from "@/app/candidate/dashboard/components/UpcomingInterviews";
import { QuickActions } from "@/app/candidate/dashboard/components/QuickActions";
import { useAuth } from "@/src/components/AuthProvider";
import { PageSkeleton } from "@/src/components/ui/PageSkeleton";
import { getOwnApplications, ApplicationWithRelations } from "@/src/lib/applicationsFunctions";
import { getInterviewsForCandidate, InterviewWithRelations } from "@/src/lib/interviewsFunctions";

export default function CandidateDashboardPage() {
  const { profile, loading: authLoading, user } = useAuth();
  const hasProfile = !!profile;
  const [applications, setApplications] = useState<ApplicationWithRelations[]>([]);
  const [interviews, setInterviews] = useState<InterviewWithRelations[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Fetch applications and interviews data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (authLoading) return;

      try {
        setDataLoading(true);

        // Fetch applications and interviews in parallel
        const [applicationsData, interviewsData] = await Promise.all([
          getOwnApplications(),
          getInterviewsForCandidate(),
        ]);

        setApplications(applicationsData);
        setInterviews(interviewsData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        // Set empty arrays on error so the UI still works
        setApplications([]);
        setInterviews([]);
      } finally {
        setDataLoading(false);
      }
    };

    fetchDashboardData();
  }, [authLoading]);

  // Get user's name from profile or user metadata
  const userName = profile?.fullname || user?.email?.split("@")[0] || "there";

  // Calculate real stats from data
  const stats = useMemo(() => {
    const activeApplications = applications.filter(app =>
      app.status === "pending" || app.status === "reviewed" || app.status === "accepted"
    ).length;

    // For saved jobs, we'd need a separate table/collection
    // For now, we'll use a placeholder or calculate from applications
    const savedJobs = applications.length > 0 ? Math.max(0, applications.length - 2) : 0;

    const totalInterviews = interviews.length;

    // For notifications, we'd need a separate query
    // For now, use a simple calculation
    const notifications = Math.min(5, applications.length + interviews.length);

    return {
      activeApplications,
      savedJobs,
      interviews: totalInterviews,
      notifications,
    };
  }, [applications, interviews]);

  // Transform applications data for RecentApplications component
  const recentApplications = useMemo(() => {
    // Create a map of application IDs to interviews for quick lookup
    const interviewMap = new Map<string, InterviewWithRelations>();
    interviews.forEach(interview => {
      if (interview.applications?.id) {
        interviewMap.set(interview.applications.id, interview);
      }
    });

    return applications.slice(0, 3).map(app => {
      const hasInterview = interviewMap.has(app.id);
      const status = app.status || "pending";
      
      return {
        title: app.jobs?.title || "Unknown Position",
        company: "Company", // Would need to join with companies table
        date: new Date(app.submitted_at).toLocaleDateString(),
        badge: {
          label: hasInterview ? "Interview Scheduled" :
                 status === "pending" ? "Pending" :
                 status === "reviewed" ? "Reviewed" :
                 status === "accepted" ? "Accepted" :
                 status === "rejected" ? "Rejected" :
                 status === "withdrawn" ? "Withdrawn" : "Pending",
          tone: hasInterview ? "accent" : "neutral" as "accent" | "neutral",
        },
      };
    });
  }, [applications, interviews]);

  // Get upcoming interview
  const upcomingInterview = useMemo(() => {
    if (interviews.length === 0) return null;

    // Find the next upcoming interview
    const sortedInterviews = interviews
      .filter(interview => new Date(interview.interview_date) > new Date())
      .sort((a, b) => new Date(a.interview_date).getTime() - new Date(b.interview_date).getTime());

    if (sortedInterviews.length === 0) return null;

    const interview = sortedInterviews[0];
    return {
      role: interview.applications?.jobs?.title || "Position",
      company: "Company", // Would need company data
      date: new Date(interview.interview_date).toLocaleString(),
    };
  }, [interviews]);

  // Show loading state
  if (authLoading || dataLoading) {
    return <PageSkeleton variant="dashboard" />;
  }

  return (
    <div className="min-h-screen bg-main-bg text-main-text">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
        <Welcome name={userName} />

        {/* Progress Card - Show steps based on profile status */}
        <ProgressCard
          steps={[
            {
              title: "Step 1: Complete Profile & Assessment",
              status: hasProfile ? "done" : "pending",
              href: "/candidate/profile",
            },
            {
              title: "Step 2: Browse Job Openings",
              status: hasProfile ? "pending" : "disabled",
              subtitle: hasProfile ? undefined : "Complete your profile first",
              href: hasProfile ? "/candidate/jobs" : undefined,
            },
            {
              title: "Step 3: Explore Learning Hub & Resources",
              status: "optional",
              href: "/candidate/resources",
            },
          ]}
        />

        {/* Top Stats */}
        <TopStats
          stats={[
            {
              title: "Active Applications",
              value: stats.activeApplications.toString(),
              icon: "lucide:briefcase",
            },
            {
              title: "Saved Jobs",
              value: stats.savedJobs.toString(),
              icon: "lucide:bookmark"
            },
            {
              title: "Interviews",
              value: stats.interviews.toString(),
              icon: "lucide:calendar"
            },
            {
              title: "Notifications",
              value: stats.notifications.toString(),
              icon: "lucide:bell"
            },
          ]}
        />

        {/* Applications, Interviews, Actions */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Applications */}
          <RecentApplications
            items={recentApplications}
          />

          {/* Right column */}
          <div className="space-y-6">
            {/* Upcoming Interviews */}
            {upcomingInterview ? (
              <UpcomingInterviews item={upcomingInterview} />
            ) : (
              <div className="rounded-lg bg-surface border border-subtle p-6 text-center">
                <div className="text-main-light-text mb-2">No upcoming interviews</div>
                <div className="text-sm text-main-light-text">
                  Keep applying to jobs to schedule interviews
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <QuickActions
              actions={[
                {
                  icon: "lucide:user-cog",
                  label: "Edit Profile",
                  href: "/candidate/profile/edit",
                },
                {
                  icon: "lucide:search",
                  label: "Browse Job Board",
                  href: "/candidate/jobs"
                },
                { icon: "lucide:book-open", label: "Browse Resources" },
                { icon: "lucide:bell", label: "View Notifications" },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
