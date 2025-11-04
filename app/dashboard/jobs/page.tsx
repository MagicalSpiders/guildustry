import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jobs - Guildustry",
  description: "Browse and manage job listings",
};

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-main-bg text-main-text">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl sm:text-4xl font-title font-bold mb-6">Jobs</h1>
        <p className="text-main-light-text text-lg">
          Browse and manage job listings. This is a placeholder page.
        </p>
      </div>
    </div>
  );
}

