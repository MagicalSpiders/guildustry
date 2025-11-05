"use client";

import { useState } from "react";
import { Button } from "@/src/components/Button";
import { PostJobModal } from "@/src/app/employer/dashboard/components/PostJobModal";

export function JobsHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-title font-bold text-main-text mb-2">
          Jobs
        </h1>
        <p className="text-lg text-main-light-text">
          Manage your postings and explore opportunities
        </p>
      </div>
      <Button
        variant="accent"
        size="lg"
        icon="lucide:plus"
        iconPosition="left"
        onClick={() => setIsModalOpen(true)}
      >
        Post New Job
      </Button>
      <PostJobModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

