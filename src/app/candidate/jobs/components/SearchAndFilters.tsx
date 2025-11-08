"use client";

import { Icon } from "@iconify/react";

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: {
    trade: string;
    location: string;
    salary: string;
    type: string;
  };
  onFilterChange: (filter: string, value: string) => void;
}

export function SearchAndFilters({
  searchQuery,
  onSearchChange,
  filters,
  onFilterChange,
}: SearchAndFiltersProps) {
  const filterOptions = {
    trade: [
      "All Trades",
      "Electrical",
      "Plumbing",
      "HVAC",
      "Carpentry",
      "Welding",
    ],
    location: [
      "All Locations",
      "New York, NY",
      "Brooklyn, NY",
      "Manhattan, NY",
      "Queens, NY",
    ],
    salary: [
      "All Salaries",
      "$40k - $60k",
      "$60k - $80k",
      "$80k - $100k",
      "$100k+",
    ],
    type: ["All Types", "Full-time", "Part-time", "Contract", "Temporary"],
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Search Bar */}
      <div className="relative">
        <Icon
          icon="lucide:search"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-main-light-text"
        />
        <input
          type="text"
          placeholder="Search by job title, company, or location..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent transition-colors"
        />
      </div>

      {/* Filter Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(filterOptions).map(([key, options]) => (
          <div key={key} className="relative">
            <select
              value={filters[key as keyof typeof filters]}
              onChange={(e) => onFilterChange(key, e.target.value)}
              className="w-full pl-4 pr-10 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent transition-colors appearance-none cursor-pointer"
            >
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <Icon
              icon="lucide:chevron-down"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-main-light-text pointer-events-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

