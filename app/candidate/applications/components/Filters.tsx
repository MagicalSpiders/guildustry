import { Icon } from "@iconify/react";

export function Filters({
  query,
  onQueryChange,
  sort,
  onSortChange,
  tabs,
  currentTab,
  onTabChange,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  sort: "date" | "title";
  onSortChange: (v: "date" | "title") => void;
  tabs: { key: string; label: string }[];
  currentTab: string;
  onTabChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Icon icon="lucide:search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-main-light-text" />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search by company, position, or location..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-subtle bg-light-bg text-main-text"
          />
        </div>
        <div>
          <label className="sr-only">Sort</label>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as any)}
            className="px-3 py-2 rounded-lg border border-subtle bg-light-bg text-main-text"
          >
            <option value="date">Sort by: Date</option>
            <option value="title">Sort by: Title</option>
          </select>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => onTabChange(t.key)}
            className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
              currentTab === t.key
                ? "border-main-accent text-main-accent"
                : "border-subtle text-main-light-text hover:text-main-text"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}


