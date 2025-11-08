"use client";

import { Icon } from "@iconify/react";
import { CompanyProfile } from "../data/mockCompanyData";

interface CompanyBenefitsProps {
  benefits: CompanyProfile["benefits"];
}

export function CompanyBenefits({ benefits }: CompanyBenefitsProps) {
  return (
    <div className="rounded-lg bg-surface border border-subtle p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Icon icon="lucide:gift" className="w-5 h-5 text-main-accent" />
        <h2 className="text-xl font-semibold font-title text-main-text">
          Benefits & Perks
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-start gap-2">
            <Icon
              icon="lucide:check"
              className="w-5 h-5 text-main-accent mt-0.5 flex-shrink-0"
            />
            <span className="text-main-light-text">{benefit}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

