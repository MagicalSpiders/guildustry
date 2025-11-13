"use client";

interface ResourcesTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function ResourcesTabs({
  activeTab,
  onTabChange,
}: ResourcesTabsProps) {
  const tabs = [
    { id: "trade101", label: "Trade 101" },
    { id: "certifications", label: "Certifications" },
    { id: "resources", label: "Resources" },
    { id: "interviewPrep", label: "Interview Prep" },
  ];

  return (
    <div className="flex gap-2 mb-8 border-b border-subtle overflow-x-auto">
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
          {tab.label}
        </button>
      ))}
    </div>
  );
}

