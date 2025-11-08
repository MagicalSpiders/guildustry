import type { Metadata } from "next";
import { EmployerHero } from "@/src/app/employer/dashboard/components/EmployerHero";
import { RecentJobPostings } from "@/src/app/employer/dashboard/components/RecentJobPostings";
import { RecentApplicants } from "@/src/app/employer/dashboard/components/RecentApplicants";

export const metadata: Metadata = {
  title: "Employer Dashboard – Guildustry",
  description: "Welcome back. Manage your hiring activity.",
};

// Mock data - replace with API call
const recentJobs = [
  {
    id: "1",
    title: "Licensed Electrician",
    location: "New York, NY",
    postedDate: "2025-10-10",
    applicantsCount: 12,
    status: "active" as const,
  },
  {
    id: "2",
    title: "Master Plumber",
    location: "Brooklyn, NY",
    postedDate: "2025-10-08",
    applicantsCount: 8,
    status: "active" as const,
  },
  {
    id: "3",
    title: "HVAC Technician",
    location: "Queens, NY",
    postedDate: "2025-10-05",
    applicantsCount: 15,
    status: "active" as const,
  },
];

const recentApplicants = [
  {
    id: "1",
    name: "John Smith",
    position: "Licensed Electrician",
    experience: "5 years",
    status: "interviewScheduled" as const,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    position: "Master Plumber",
    experience: "8 years",
    status: "underReview" as const,
  },
  {
    id: "3",
    name: "Mike Davis",
    position: "HVAC Technician",
    experience: "3 years",
    status: "new" as const,
  },
];

export default function EmployerDashboardPage() {
  return (
    <div className="min-h-screen bg-main-bg text-main-text">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
        <EmployerHero companyName="ABC Construction" />

        {/* Recent Job Postings and Recent Applicants */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <RecentJobPostings jobs={recentJobs} />
          <RecentApplicants applicants={recentApplicants} />
        </div>
      </div>
    </div>
  );
}
