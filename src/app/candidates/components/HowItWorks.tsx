import { Icon } from "@iconify/react";

const steps = [
  {
    icon: "lucide:user-plus",
    title: "Create Your Profile - FREE",
    desc: "Showcase your skills, certifications, and experience. Always free for candidates and takes just minutes.",
  },
  {
    icon: "lucide:search",
    title: "Browse Opportunities",
    desc: "Access vetted job openings from employers actively seeking skilled trades professionals.",
  },
  {
    icon: "lucide:send",
    title: "Apply with Confidence",
    desc: "Connect directly with hiring managers. No degree required. Your skills speak for themselves.",
  },
  {
    icon: "lucide:trending-up",
    title: "Build Your Career",
    desc: "Access training resources, upskilling opportunities, and career guidance as you grow.",
  },
];

export function HowItWorks() {
  return (
    <section className="relative bg-grid bg-surface/60 text-main-text">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid opacity-30" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-title font-bold text-main-text">
            How Guildustry Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div
              key={step.title}
              className="group relative overflow-hidden rounded-2xl border border-subtle bg-surface p-6"
            >
              {/* Step number badge */}
              <div className="absolute top-4 right-4 inline-flex items-center justify-center rounded-full bg-main-accent/10 text-main-accent text-xl font-bold w-7 h-7">
                {idx + 1}
              </div>

              {/* Icon */}
              <span className="inline-flex items-center justify-center rounded-lg bg-main-accent/10 text-main-accent p-3">
                <Icon icon={step.icon} width={44} height={44} />
              </span>

              {/* Title */}
              <h3 className="mt-4 text-lg font-semibold text-main-text">
                {step.title}
              </h3>

              {/* Description */}
              <p className="mt-2 text-sm text-main-light-text leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
