"use client";

import { Icon } from "@iconify/react";
import { CompanyProfile } from "../data/mockCompanyData";

interface CompanyDetailsProps {
  company: CompanyProfile;
}

export function CompanyDetails({ company }: CompanyDetailsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Specialties */}
      <div className="rounded-lg bg-surface border border-subtle p-6">
        <div className="flex items-center gap-2 mb-4">
          <Icon icon="lucide:target" className="w-5 h-5 text-main-accent" />
          <h2 className="text-xl font-semibold font-title text-main-text">
            Specialties
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {company.specialties.map((specialty, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-main-accent/10 text-main-accent border border-main-accent/20"
            >
              {specialty}
            </span>
          ))}
        </div>
      </div>

      {/* Company Values */}
      <div className="rounded-lg bg-surface border border-subtle p-6">
        <div className="flex items-center gap-2 mb-4">
          <Icon icon="lucide:heart" className="w-5 h-5 text-main-accent" />
          <h2 className="text-xl font-semibold font-title text-main-text">
            Company Values
          </h2>
        </div>
        <ul className="space-y-2">
          {company.values.map((value, index) => (
            <li key={index} className="flex items-start gap-2">
              <Icon
                icon="lucide:check-circle"
                className="w-5 h-5 text-main-accent mt-0.5 flex-shrink-0"
              />
              <span className="text-main-light-text">{value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

