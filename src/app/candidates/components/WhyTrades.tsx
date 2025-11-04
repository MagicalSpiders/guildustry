import { Icon } from "@iconify/react";

const items = [
  {
    icon: "lucide:wallet",
    title: "High-Paying Careers",
    desc: "Earn $50K-$100K+ without college debt. Many trades offer apprenticeships that pay while you learn.",
  },
  {
    icon: "lucide:shield-check",
    title: "Job Security",
    desc: "America faces a massive skilled trades shortage. Your skills will always be in demand.",
  },
  {
    icon: "lucide:route",
    title: "Career Growth",
    desc: "Start as an apprentice, become a journeyman, master your craft, or start your own business.",
  },
  {
    icon: "lucide:handshake",
    title: "Hands-On Work",
    desc: "Build real things with your hands. No cubicle—enjoy the satisfaction of creating something tangible every day.",
  },
];

export function WhyTrades() {
  return (
    <section className="bg-main-bg text-main-text">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-title font-bold text-main-text">
            Why Choose Skilled Trades?
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-main-light-text">
            Real careers with real impact, built on skill, pride, and
            opportunity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.title}
              className="group relative overflow-hidden rounded-2xl border border-subtle bg-surface p-6 hover:shadow-lg transition-shadow"
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

              <span className="inline-flex items-center justify-center rounded-lg bg-main-accent/10 text-main-accent p-3">
                <Icon icon={item.icon} width={44} height={44} />
              </span>
              <h3 className="mt-4 text-xl font-semibold text-main-text">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-main-light-text leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
