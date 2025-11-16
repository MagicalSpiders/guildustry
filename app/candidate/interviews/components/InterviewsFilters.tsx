import { Icon } from "@iconify/react";

interface InterviewsFiltersProps {
  query: string;
  onQueryChange: (query: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
}

export function InterviewsFilters({
  query,
  onQueryChange,
  statusFilter,
  onStatusFilterChange,
}: InterviewsFiltersProps) {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Icon
            icon="lucide:search"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-main-light-text"
          />
          <input
            type="text"
            placeholder="Search interviews..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent"
        >
          <option value="all">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="rescheduled">Rescheduled</option>
        </select>
      </div>
    </div>
  );
}

