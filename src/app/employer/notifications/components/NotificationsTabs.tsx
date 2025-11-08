"use client";

interface NotificationsTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  counts: {
    all: number;
    unread: number;
    applications: number;
    interviews: number;
  };
}

export function NotificationsTabs({ activeTab, onTabChange, counts }: NotificationsTabsProps) {
  const tabs = [
    { id: "all", label: "All", count: counts.all },
    { id: "unread", label: "Unread", count: counts.unread },
    { id: "applications", label: "Applications", count: counts.applications },
    { id: "interviews", label: "Interviews", count: counts.interviews },
  ];

  return (
    <div className="flex gap-2 mb-6 border-b border-subtle overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${
            activeTab === tab.id
              ? "border-main-accent text-main-text"
              : "border-transparent text-main-light-text hover:text-main-text"
          }`}
        >
          {tab.label} ({tab.count})
        </button>
      ))}
    </div>
  );
}

