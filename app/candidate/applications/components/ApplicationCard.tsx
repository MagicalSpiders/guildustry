import { Icon } from "@iconify/react";
import type { Application } from "@/app/candidate/applications/data";

export function ApplicationCard({ app }: { app: Application }) {
  return (
    <section className="rounded-2xl border border-subtle bg-surface shadow-elevated">
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-title font-bold">{app.title}</h3>
            <div className="text-main-light-text">{app.company}</div>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-main-light-text">
              <span className="inline-flex items-center gap-1">
                <Icon icon="lucide:map-pin" className="w-4 h-4" />{" "}
                {app.location}
              </span>
              <span className="inline-flex items-center gap-1">
                <Icon icon="lucide:dollar-sign" className="w-4 h-4" />{" "}
                {app.salary}
              </span>
              <span className="inline-flex items-center gap-1">
                <Icon icon="lucide:calendar" className="w-4 h-4" /> Applied{" "}
                {app.applied}
              </span>
            </div>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium border ${
              app.status === "Interview Scheduled"
                ? "border-main-accent text-main-accent"
                : app.status === "Rejected"
                ? "border-red-400 text-red-400"
                : "border-subtle text-main-light-text"
            }`}
          >
            {app.status}
          </span>
        </div>

        {app.summary && (
          <p className="mt-4 text-main-light-text">{app.summary}</p>
        )}

        {app.status === "Interview Scheduled" && (
          <div className="mt-4 rounded-xl border border-subtle bg-light-bg px-4 py-3 text-sm">
            <Icon
              icon="lucide:calendar"
              className="w-4 h-4 inline-block mr-2"
            />{" "}
            2025-10-18 at 10:00 AM
          </div>
        )}

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-subtle bg-light-bg px-4 py-2 text-sm hover:border-main-accent hover:text-main-accent">
            <Icon icon="lucide:eye" className="w-4 h-4" /> View Details
          </button>
          <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-subtle bg-light-bg px-4 py-2 text-sm hover:border-main-accent hover:text-main-accent">
            <Icon icon="lucide:message-square" className="w-4 h-4" /> Contact
            Employer
          </button>
        </div>

        <div className="mt-3 text-xs text-main-light-text">
          Last update: 2025-10-14
        </div>
      </div>
    </section>
  );
}
