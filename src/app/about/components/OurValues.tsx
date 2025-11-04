import { Icon } from "@iconify/react";

const values = [
  {
    icon: "lucide:heart",
    title: "Dignity",
    desc: "Every skilled trade is valued work that builds America.",
  },
  {
    icon: "lucide:trending-up",
    title: "Opportunity",
    desc: "Connect talent with careers that provide stability and growth.",
  },
  {
    icon: "lucide:users",
    title: "Community",
    desc: "Unite candidates, employers, and supporters in shared purpose.",
  },
];

export function OurValues() {
  return (
    <section className="relative bg-grid bg-white/60 text-neutral-900 dark:bg-main-bg dark:text-main-text">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid opacity-30" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-title font-bold text-neutral-900 dark:text-main-text">Our Values</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {values.map((value) => (
            <div
              key={value.title}
              className="group relative overflow-hidden rounded-2xl border border-subtle bg-white dark:bg-surface p-8 text-center"
            >
              {/* Decorative corner svg */}
              <svg
                className="absolute -right-6 -top-6 h-20 w-20 opacity-10 text-main-accent"
                viewBox="0 0 100 100"
                fill="none"
              >
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" />
                <path d="M30 60 L48 42 L62 56 L78 38" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>

              <span className="inline-flex items-center justify-center rounded-lg bg-main-accent/10 text-main-accent p-4 mb-4">
                <Icon icon={value.icon} width={48} height={48} />
              </span>
              <h3 className="text-xl font-semibold mb-3 text-neutral-900 dark:text-main-text">{value.title}</h3>
              <p className="text-sm text-neutral-600 dark:text-main-light-text leading-relaxed">
                {value.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
