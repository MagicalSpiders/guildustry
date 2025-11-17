"use client";

interface ApplicantsTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  counts: {
    all: number;
    pending: number;
    reviewed: number;
    accepted: number;
    rejected: number;
    withdrawn: number;
  };
}

export function ApplicantsTabs({ activeTab, onTabChange, counts }: ApplicantsTabsProps) {
  const tabs = [
    { id: "all", label: "All", count: counts.all },
    { id: "pending", label: "Pending", count: counts.pending },
    { id: "reviewed", label: "Reviewed", count: counts.reviewed },
    { id: "accepted", label: "Accepted", count: counts.accepted },
    { id: "rejected", label: "Rejected", count: counts.rejected },
    { id: "withdrawn", label: "Withdrawn", count: counts.withdrawn },
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

