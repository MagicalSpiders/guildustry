type Application = {
  title: string;
  company: string;
  date: string;
  badge?: { label: string; tone: "accent" | "neutral" };
};

export function RecentApplications({ items }: { items: Application[] }) {
  return (
    <section className="lg:col-span-2 rounded-2xl border border-subtle bg-surface shadow-elevated flex flex-col">
      <div className="px-5 sm:px-6 py-5 border-b border-subtle">
        <h3 className="text-xl font-title font-bold">Recent Applications</h3>
        <p className="text-sm text-main-light-text">
          Track the status of your recent job applications
        </p>
      </div>

      <div className="divide-y divide-subtle flex flex-col flex-1">
        {items.map((app) => (
          <div key={app.title} className="px-5 sm:px-6 py-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-semibold">{app.title}</div>
                <div className="text-sm text-main-light-text">
                  {app.company}
                </div>
                <div className="text-xs text-main-light-text opacity-70">
                  {app.date}
                </div>
              </div>
              {app.badge && (
                <span
                  className={`ml-auto text-xs rounded-full px-3 py-1 border ${
                    app.badge.tone === "accent"
                      ? "border-main-accent text-main-accent"
                      : "border-subtle text-main-light-text"
                  }`}
                >
                  {app.badge.label}
                </span>
              )}
            </div>
          </div>
        ))}

        <div className="px-5 self-end sm:px-6 py-4 mt-auto">
          <a
            href="/candidate/applications"
            className="block w-full text-center text-sm font-medium px-4 py-2 rounded-lg border border-subtle bg-light-bg hover:border-main-accent hover:text-main-accent transition-colors"
          >
            View All Applications
          </a>
        </div>
      </div>
    </section>
  );
}
