"use client";

import { Icon } from "@iconify/react";

interface ResourcesHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function ResourcesHeader({
  searchQuery,
  onSearchChange,
}: ResourcesHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl sm:text-4xl font-title font-bold text-main-text mb-2">
        Level up your salary potential
      </h1>
      <p className="text-lg text-main-light-text mb-6">
        Explore our learning and preparation hub
      </p>
      <div className="relative max-w-2xl">
        <Icon
          icon="lucide:search"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-main-light-text"
        />
        <input
          type="text"
          placeholder="Search resources, trades, or topics..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent transition-colors"
        />
      </div>
    </div>
  );
}

