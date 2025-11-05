import type { Metadata } from "next";
import { EmployerHero } from "@/src/app/employer/dashboard/components/EmployerHero";

export const metadata: Metadata = {
  title: "Employer Dashboard – Guildustry",
  description: "Welcome back. Manage your hiring activity.",
};

export default function EmployerDashboardPage() {
  return (
    <div className="min-h-screen bg-main-bg text-main-text">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
        <EmployerHero companyName="ABC Construction" />
      </div>
    </div>
  );
}

