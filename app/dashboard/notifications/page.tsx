import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications - Guildustry",
  description: "View your notifications",
};

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-main-bg text-main-text">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl sm:text-4xl font-title font-bold mb-6">Notifications</h1>
        <p className="text-main-light-text text-lg">
          View your notifications. This is a placeholder page.
        </p>
      </div>
    </div>
  );
}

