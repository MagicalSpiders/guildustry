import { Icon } from "@iconify/react";

type Pair = { myth: string; reality: string };

const pairs: Pair[] = [
  {
    myth: "You need a college degree to succeed",
    reality:
      "Skilled trades offer stable, high-paying careers without the burden of student debt. Many electricians and welders out-earn college graduates.",
  },
  {
    myth: "Trades are just manual labor",
    reality:
      "Modern trades require technical expertise, problem-solving, and advanced technology. You're building the future, not just swinging a hammer.",
  },
  {
    myth: "Factories are dark, dirty places",
    reality:
      "Modern manufacturing facilities are clean, bright, and high-tech. These are buzzing innovation hubs filled with advanced equipment and skilled professionals.",
  },
  {
    myth: "There's no room for advancement",
    reality:
      "Start as an apprentice, become a master tradesperson, or launch your own contracting business. The ceiling is yours to define.",
  },
];

export function MythBusting() {
  return (
    <section className="relative bg-grid bg-white/60 text-neutral-900 dark:bg-main-bg dark:text-main-text">
      {/* Grid background like hero */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid opacity-30" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-title font-bold text-neutral-900 dark:text-main-text">
            Busting the College-First Myth
          </h2>
          <p className="mt-3 max-w-3xl mx-auto text-neutral-600 dark:text-main-light-text">
            For too long, society has pushed one path: four-year college or
            bust. It's time to challenge that narrative.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pairs.map((p, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-subtle bg-white dark:bg-surface p-6"
            >
              {/* Myth */}
              <div className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center rounded-full bg-red-500/10 text-red-600 dark:text-red-400 p-1.5">
                  <Icon icon="lucide:x" className="w-4 h-4" />
                </span>
                <div>
                  <div className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                    Myth
                  </div>
                  <p className="font-medium text-neutral-800 dark:text-main-text">
                    {p.myth}
                  </p>
                </div>
              </div>

              <div className="my-4 h-px bg-gradient-to-r from-transparent via-subtle to-transparent" />

              {/* Reality */}
              <div className="flex items-start gap-3">
                <span className="mt-1 inline-flex items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-1.5">
                  <Icon icon="lucide:check" className="w-4 h-4" />
                </span>
                <div>
                  <div className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                    Reality
                  </div>
                  <p className="text-neutral-700 dark:text-main-light-text leading-relaxed">
                    {p.reality}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
