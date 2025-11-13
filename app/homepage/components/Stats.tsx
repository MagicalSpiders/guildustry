import { Icon } from "@iconify/react";

export function Stats() {
  return (
    <section className="bg-grid bg-surface/60 text-main-text">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 place-items-center gap-8 sm:grid-cols-3">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center justify-center rounded-lg bg-main-accent/10 text-main-accent p-3">
              <Icon icon="lucide:users" width={65} height={65} />
            </span>
            <div>
              <div className="text-6xl font-extrabold tracking-tight font-title text-main-text">
                10K+
              </div>
              <p className="mt-1 text-sm text-main-light-text">
                Active Candidates
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center justify-center rounded-lg bg-main-accent/10 text-main-accent p-3">
              <Icon icon="lucide:building-2" width={65} height={65} />
            </span>
            <div>
              <div className="text-6xl font-extrabold tracking-tight font-title text-main-text">
                500+
              </div>
              <p className="mt-1 text-sm text-main-light-text">
                Employer Partners
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center justify-center rounded-lg bg-main-accent/10 text-main-accent p-3">
              <Icon icon="lucide:trending-up" width={65} height={65} />
            </span>
            <div>
              <div className="text-6xl font-extrabold tracking-tight font-title text-main-text">
                95%
              </div>
              <p className="mt-1 text-sm text-main-light-text">
                Placement Rate
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
