"use client";

import { Welcome } from "@/app/candidate/dashboard/components/Welcome";
import { ProgressCard } from "@/app/candidate/dashboard/components/ProgressCard";
import { TopStats } from "@/app/candidate/dashboard/components/TopStats";
import { RecentApplications } from "@/app/candidate/dashboard/components/RecentApplications";
import { UpcomingInterviews } from "@/app/candidate/dashboard/components/UpcomingInterviews";
import { QuickActions } from "@/app/candidate/dashboard/components/QuickActions";
import { useAuth } from "@/src/components/AuthProvider";
import { PageSkeleton } from "@/src/components/ui/PageSkeleton";

export default function CandidateDashboardPage() {
  const { profile, loading, user } = useAuth();
  const hasProfile = !!profile;

  // Show loading state
  if (loading) {
    return <PageSkeleton variant="dashboard" />;
  }

  // Get user's name from profile or user metadata
  const userName = profile?.fullname || user?.email?.split("@")[0] || "there";

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
              value: "3",
              icon: "lucide:briefcase",
            },
            { title: "Saved Jobs", value: "7", icon: "lucide:bookmark" },
            { title: "Interviews", value: "1", icon: "lucide:calendar" },
            { title: "Notifications", value: "2", icon: "lucide:bell" },
          ]}
        />

        {/* Applications, Interviews, Actions */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Applications */}
          <RecentApplications
            items={[
              {
                title: "Electrician",
                company: "ABC Construction",
                date: "2025-10-12",
                badge: { label: "Interview Scheduled", tone: "accent" },
              },
              {
                title: "Plumber",
                company: "BuildCo Inc",
                date: "2025-10-10",
                badge: { label: "Under Review", tone: "neutral" },
              },
              {
                title: "HVAC Technician",
                company: "TradePro Services",
                date: "2025-10-08",
                badge: { label: "Applied", tone: "neutral" },
              },
            ]}
          />

          {/* Right column */}
          <div className="space-y-6">
            {/* Upcoming Interviews */}
            <UpcomingInterviews
              item={{
                role: "Electrician",
                company: "ABC Construction",
                date: "2025-10-18 at 10:00 AM",
              }}
            />

            {/* Quick Actions */}
            <QuickActions
              actions={[
                {
                  icon: "lucide:user-cog",
                  label: "Edit Profile",
                  href: "/profile/edit",
                },
                { icon: "lucide:book-open", label: "Browse Resources" },
                { icon: "lucide:bell", label: "View Notifications" },
                { icon: "lucide:search", label: "Browse Job Board" },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
