"use client";

import { Icon } from "@iconify/react";
import { Button } from "@/src/components/Button";
import { CompanyProfile } from "../data/mockCompanyData";

interface CompanyHeaderProps {
  company: CompanyProfile;
  onEdit: () => void;
}

export function CompanyHeader({ company, onEdit }: CompanyHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="inline-flex items-center justify-center rounded-lg bg-main-accent/10 text-main-accent p-3">
              <Icon icon="lucide:building-2" className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-title font-bold text-main-text">
                {company.companyName}
              </h1>
              <p className="text-lg text-main-light-text mt-1">
                {company.industry}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex items-center gap-3 rounded-lg bg-surface border border-subtle p-4">
          <Icon icon="lucide:map-pin" className="w-5 h-5 text-main-accent" />
          <div>
            <p className="text-xs text-main-light-text">Location</p>
            <p className="text-sm font-medium text-main-text">
              {company.headquarters}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg bg-surface border border-subtle p-4">
          <Icon icon="lucide:calendar" className="w-5 h-5 text-main-accent" />
          <div>
            <p className="text-xs text-main-light-text">Founded</p>
            <p className="text-sm font-medium text-main-text">
              {company.founded}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg bg-surface border border-subtle p-4">
          <Icon icon="lucide:users" className="w-5 h-5 text-main-accent" />
          <div>
            <p className="text-xs text-main-light-text">Company Size</p>
            <p className="text-sm font-medium text-main-text">{company.size}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg bg-surface border border-subtle p-4">
          <Icon icon="lucide:globe" className="w-5 h-5 text-main-accent" />
          <div>
            <p className="text-xs text-main-light-text">Website</p>
            <a
              href={`https://${company.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-main-accent hover:underline"
            >
              {company.website}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
