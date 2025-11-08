"use client";

import { Icon } from "@iconify/react";
import { Button } from "@/src/components/Button";
import { Resource } from "../data/resources";

interface ResourceCardProps {
  resource: Resource;
}

function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <div className="rounded-lg bg-surface border border-subtle p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4 mb-4">
        <div className="inline-flex items-center justify-center rounded-lg bg-main-accent/10 text-main-accent p-3">
          <Icon icon="lucide:file-text" className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-main-text mb-2">
            {resource.title}
          </h3>
          <p className="text-sm text-main-light-text leading-relaxed">
            {resource.description}
          </p>
        </div>
      </div>

      <Button variant="outline" size="sm" className="w-full">
        <Icon icon="lucide:download" className="w-4 h-4 mr-2" />
        {resource.buttonText}
      </Button>
    </div>
  );
}

interface ResourcesTabProps {
  resources: Resource[];
}

export function ResourcesTab({ resources }: ResourcesTabProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-title font-bold text-main-text mb-2">
          Resume Templates & Career Resources
        </h2>
        <p className="text-lg text-main-light-text">
          Download professional templates and guides to help you stand out.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    </div>
  );
}

