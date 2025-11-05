import type { Metadata } from "next";
import { Icon } from "@iconify/react";
import { Welcome } from "@/src/app/candidate/dashboard/components/Welcome";
import { ProgressCard } from "@/src/app/candidate/dashboard/components/ProgressCard";
import { TopStats } from "@/src/app/candidate/dashboard/components/TopStats";
import { RecentApplications } from "@/src/app/candidate/dashboard/components/RecentApplications";
import { UpcomingInterviews } from "@/src/app/candidate/dashboard/components/UpcomingInterviews";
import { QuickActions } from "@/src/app/candidate/dashboard/components/QuickActions";

export const metadata: Metadata = {
  title: "Candidate Dashboard – Guildustry",
  description: "Welcome back. Continue your job search journey.",
};

export default function CandidateDashboardPage() {
  return (
    <div className="min-h-screen bg-main-bg text-main-text">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
        <Welcome name="John" />

        {/* Progress Card */}
        <ProgressCard
          steps={[
            {
              title: "Step 1: Complete Profile & Assessment",
              status: "pending",
            },
            { title: "Step 2: Browse Job Openings", status: "pending" },
            {
              title: "Step 3: Explore Learning Hub & Resources",
              status: "optional",
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
