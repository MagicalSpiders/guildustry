"use client";

interface JobsTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  counts: {
    all: number;
    myPosts: number;
    available: number;
    active: number;
    drafts: number;
  };
}

export function JobsTabs({ activeTab, onTabChange, counts }: JobsTabsProps) {
  const tabs = [
    { id: "all", label: "All", count: counts.all },
    { id: "myPosts", label: "My Posts", count: counts.myPosts },
    { id: "available", label: "Available", count: counts.available },
    { id: "active", label: "Active", count: counts.active },
    { id: "drafts", label: "Drafts", count: counts.drafts },
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

