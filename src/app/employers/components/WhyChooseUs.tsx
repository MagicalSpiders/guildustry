import { Icon } from "@iconify/react";

const benefits = [
  {
    icon: "lucide:users",
    title: "Access Qualified Talent",
    desc: "Connect with pre-screened candidates who have the skills and motivation to excel.",
  },
  {
    icon: "lucide:clock",
    title: "Fill Positions Faster",
    desc: "Reduce time-to-hire with streamlined application and communication tools.",
  },
  {
    icon: "lucide:dollar-sign",
    title: "Reduce Hiring Costs",
    desc: "Lower recruitment expenses with targeted access to skilled trades professionals.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="relative bg-grid bg-surface/60 text-main-text">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid opacity-30" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-title font-bold text-main-text">
            Why Employers Choose Guildustry
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="group relative overflow-hidden rounded-2xl border border-subtle bg-surface p-8 text-center"
            >
              {/* Decorative corner svg */}
              <svg
                className="absolute -right-6 -top-6 h-20 w-20 opacity-10 text-main-accent"
                viewBox="0 0 100 100"
                fill="none"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M30 60 L48 42 L62 56 L78 38"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>

              <span className="inline-flex items-center justify-center rounded-lg bg-main-accent/10 text-main-accent p-4 mb-4">
                <Icon icon={benefit.icon} width={48} height={48} />
              </span>
              <h3 className="text-xl font-semibold mb-3 text-main-text">
                {benefit.title}
              </h3>
              <p className="text-sm text-main-light-text leading-relaxed">
                {benefit.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
