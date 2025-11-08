"use client";

import { Icon } from "@iconify/react";

interface CompanyDescriptionProps {
  description: string;
}

export function CompanyDescription({
  description,
}: CompanyDescriptionProps) {
  return (
    <div className="rounded-lg bg-surface border border-subtle p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Icon icon="lucide:file-text" className="w-5 h-5 text-main-accent" />
        <h2 className="text-xl font-semibold font-title text-main-text">
          About Us
        </h2>
      </div>
      <p className="text-main-light-text leading-relaxed">{description}</p>
    </div>
  );
}

