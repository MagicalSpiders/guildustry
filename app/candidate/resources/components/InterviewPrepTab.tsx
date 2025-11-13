"use client";

import { Icon } from "@iconify/react";
import { Button } from "@/src/components/Button";
import { InterviewPrep } from "../data/interviewPrep";

interface InterviewPrepCardProps {
  prep: InterviewPrep;
}

function InterviewPrepCard({ prep }: InterviewPrepCardProps) {
  return (
    <div className="rounded-lg bg-surface border border-subtle p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="inline-flex items-center justify-center rounded-lg bg-main-accent/10 text-main-accent p-3">
          <Icon icon={prep.icon} className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-main-text">
          {prep.title}
        </h3>
      </div>

      <p className="text-sm text-main-light-text mb-4 leading-relaxed">
        {prep.description}
      </p>

      <ul className="space-y-2 mb-6">
        {prep.topics.map((topic, index) => (
          <li key={index} className="flex items-start gap-2">
            <Icon
              icon="lucide:check"
              className="w-4 h-4 text-main-accent mt-0.5 flex-shrink-0"
            />
            <span className="text-sm text-main-light-text">{topic}</span>
          </li>
        ))}
      </ul>

      <Button variant="accent" size="sm" className="w-full">
        {prep.buttonText}
      </Button>
    </div>
  );
}

interface InterviewPrepTabProps {
  interviewPrep: InterviewPrep[];
}

export function InterviewPrepTab({
  interviewPrep,
}: InterviewPrepTabProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-title font-bold text-main-text mb-2">
          Interview Preparation
        </h2>
        <p className="text-lg text-main-light-text">
          Get ready to impress employers with these interview resources.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {interviewPrep.map((prep) => (
          <InterviewPrepCard key={prep.id} prep={prep} />
        ))}
      </div>
    </div>
  );
}

