"use client";

import { Icon } from "@iconify/react";
import { Button } from "@/src/components/Button";
import { Certification } from "../data/certifications";

interface CertificationCardProps {
  certification: Certification;
}

function CertificationCard({ certification }: CertificationCardProps) {
  return (
    <div className="rounded-lg bg-surface border border-subtle p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <Icon
          icon="lucide:graduation-cap"
          className="w-6 h-6 text-main-accent"
        />
        <h3 className="text-xl font-bold font-title text-main-text">
          {certification.title}
        </h3>
      </div>

      <div className="flex items-center gap-2 text-main-light-text mb-6">
        <Icon icon="lucide:map-pin" className="w-4 h-4" />
        <span className="text-sm">{certification.location}</span>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <p className="text-sm font-semibold text-main-text mb-2">
            Programs Offered:
          </p>
          <div className="flex flex-wrap gap-2">
            {certification.programs.map((program, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-light-bg border border-subtle text-main-text"
              >
                {program}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-main-text mb-1">Duration:</p>
          <p className="text-sm text-main-light-text">
            {certification.duration}
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-main-text mb-1">Format:</p>
          <p className="text-sm text-main-light-text">{certification.format}</p>
        </div>
      </div>

      <Button variant="accent" size="md" className="w-full">
        <Icon icon="lucide:external-link" className="w-5 h-5 mr-2" />
        Enroll Now
      </Button>
    </div>
  );
}

interface CertificationsTabProps {
  certifications: Certification[];
}

export function CertificationsTab({ certifications }: CertificationsTabProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-title font-bold text-main-text mb-2">
          Trade Schools & Certification Programs
        </h2>
        <p className="text-lg text-main-light-text">
          Pursue deeper learning with our trusted partners. When you enroll
          through Guildustry, you support our platform while advancing your
          career.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications.map((certification) => (
          <CertificationCard
            key={certification.id}
            certification={certification}
          />
        ))}
      </div>

      <div className="mt-8 p-4 rounded-lg bg-light-bg border border-subtle">
        <p className="text-sm text-main-light-text">
          When you enroll through our partner links, you help us continue
          providing free resources to candidates like you. Your enrollment
          supports the Guildustry community.
        </p>
      </div>
    </div>
  );
}
