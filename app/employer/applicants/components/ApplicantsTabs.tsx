"use client";

interface ApplicantsTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  counts: {
    all: number;
    new: number;
    underReview: number;
    shortlisted: number;
    interviews: number;
  };
}

export function ApplicantsTabs({ activeTab, onTabChange, counts }: ApplicantsTabsProps) {
  const tabs = [
    { id: "all", label: "All", count: counts.all },
    { id: "new", label: "New", count: counts.new },
    { id: "underReview", label: "Under Review", count: counts.underReview },
    { id: "shortlisted", label: "Shortlisted", count: counts.shortlisted },
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

