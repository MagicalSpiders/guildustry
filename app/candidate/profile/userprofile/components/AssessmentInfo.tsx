import { Icon } from "@iconify/react";
import type { UserProfile } from "@/src/lib/database.types";

interface AssessmentInfoProps {
  data: UserProfile;
}

export function AssessmentInfo({ data }: AssessmentInfoProps) {
  const hasData = (data as any).priority_choice || (data as any).shape_choice;

  if (!hasData) {
    return (
      <div className="rounded-2xl border border-subtle bg-surface p-6 shadow-elevated">
        <h2 className="text-xl font-title font-bold mb-4 flex items-center gap-2">
          <Icon icon="lucide:clipboard-check" className="w-5 h-5 text-main-accent" />
          Assessment
        </h2>
        <p className="text-sm text-main-light-text">No assessment answers available.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-subtle bg-surface p-6 shadow-elevated">
      <h2 className="text-xl font-title font-bold mb-6 flex items-center gap-2">
        <Icon icon="lucide:clipboard-check" className="w-5 h-5 text-main-accent" />
        Assessment
      </h2>
      <div className="space-y-6">
        {(data as any).priority_choice && (
          <div>
            <p className="text-sm font-medium text-main-text mb-3">
              1) On a high-stakes project, what's your priority?
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-subtle bg-light-bg">
              <Icon icon="lucide:check-circle" className="w-4 h-4 text-main-accent" />
              <span className="text-sm text-main-text">{(data as any).priority_choice}</span>
            </div>
          </div>
        )}

        {(data as any).shape_choice && (
          <div>
            <p className="text-sm font-medium text-main-text mb-3">
              2) Which 3D shape results from rotating this 2D profile?
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-subtle bg-light-bg">
              <Icon icon="lucide:check-circle" className="w-4 h-4 text-main-accent" />
              <span className="text-sm text-main-text">{(data as any).shape_choice}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
