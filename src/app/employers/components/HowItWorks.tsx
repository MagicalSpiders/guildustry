import { Icon } from "@iconify/react";

const steps = [
  {
    icon: "lucide:user-plus",
    title: "Create Your Account",
    desc: "Sign up in minutes. No complicated setup required.",
  },
  {
    icon: "lucide:briefcase",
    title: "Post Your Jobs",
    desc: "List openings with detailed requirements and benefits.",
  },
  {
    icon: "lucide:users",
    title: "Review Applicants",
    desc: "Access candidate profiles, skills, and experience.",
  },
  {
    icon: "lucide:zap",
    title: "Hire Faster",
    desc: "Connect directly with qualified candidates and fill positions.",
  },
];

export function HowItWorks() {
  return (
    <section className="relative bg-grid bg-white/60 text-neutral-900 dark:bg-main-bg dark:text-main-text">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid opacity-30" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-title font-bold text-neutral-900 dark:text-main-text">
            How It Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div
              key={step.title}
              className="group relative overflow-hidden rounded-2xl border border-subtle bg-white dark:bg-surface p-6"
            >
              {/* Step number badge */}
              <div className="absolute top-4 right-4 inline-flex items-center justify-center rounded-full bg-main-accent text-white text-xl font-bold w-8 h-8">
                {idx + 1}
              </div>

              {/* Icon */}
              <span className="inline-flex items-center justify-center rounded-lg bg-main-accent/10 text-main-accent p-3">
                <Icon icon={step.icon} width={44} height={44} />
              </span>

              {/* Title */}
              <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-main-text">
                {step.title}
              </h3>

              {/* Description */}
              <p className="mt-2 text-sm text-neutral-600 dark:text-main-light-text leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
