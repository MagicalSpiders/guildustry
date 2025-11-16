import { Icon } from "@iconify/react";
import type { InterviewWithRelations } from "@/src/lib/interviewsFunctions";

interface InterviewCardProps {
  interview: InterviewWithRelations;
}

export function InterviewCard({ interview }: InterviewCardProps) {
  const interviewDate = new Date(interview.interview_date);
  const formattedDate = interviewDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = interviewDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  const isUpcoming = interviewDate > new Date();
  const isPast = interviewDate < new Date();

  const statusColors: Record<string, string> = {
    scheduled: "border-main-accent text-main-accent",
    completed: "border-green-400 text-green-400",
    cancelled: "border-red-400 text-red-400",
    rescheduled: "border-orange-400 text-orange-400",
  };

  const typeLabels: Record<string, string> = {
    phone: "Phone Interview",
    "in-person": "In-Person Interview",
    video: "Video Interview",
  };

  return (
    <section className="rounded-2xl border border-subtle bg-surface shadow-elevated">
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-xl font-title font-bold">
              {interview.applications?.jobs?.title || "Interview"}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-main-light-text">
              <span className="inline-flex items-center gap-1">
                <Icon icon="lucide:calendar" className="w-4 h-4" />
                {formattedDate} at {formattedTime}
              </span>
              <span className="inline-flex items-center gap-1">
                <Icon icon="lucide:phone" className="w-4 h-4" />
                {typeLabels[interview.type] || interview.type}
              </span>
              {interview.location && (
                <span className="inline-flex items-center gap-1">
                  <Icon icon="lucide:map-pin" className="w-4 h-4" />
                  {interview.location}
                </span>
              )}
            </div>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium border ${
              statusColors[interview.status] || "border-subtle text-main-light-text"
            }`}
          >
            {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
          </span>
        </div>

        {interview.notes && (
          <div className="mt-4 rounded-xl border border-subtle bg-light-bg px-4 py-3">
            <p className="text-sm text-main-light-text">
              <strong className="text-main-text">Notes: </strong>
              {interview.notes}
            </p>
          </div>
        )}

        {interview.interviewers && interview.interviewers.length > 0 && (
          <div className="mt-4 text-sm text-main-light-text">
            <strong className="text-main-text">Interviewers: </strong>
            {interview.interviewers.length} interviewer(s)
          </div>
        )}

        {isUpcoming && interview.status === "scheduled" && (
          <div className="mt-4 rounded-xl border border-main-accent/20 bg-main-accent/5 px-4 py-3 text-sm">
            <Icon
              icon="lucide:clock"
              className="w-4 h-4 inline-block mr-2 text-main-accent"
            />
            <span className="text-main-accent font-medium">
              Upcoming Interview
            </span>
          </div>
        )}

        {isPast && interview.status === "scheduled" && (
          <div className="mt-4 rounded-xl border border-orange-400/20 bg-orange-400/5 px-4 py-3 text-sm">
            <Icon
              icon="lucide:alert-circle"
              className="w-4 h-4 inline-block mr-2 text-orange-400"
            />
            <span className="text-orange-400 font-medium">
              This interview has passed
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

