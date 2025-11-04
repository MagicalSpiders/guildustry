import { Icon } from "@iconify/react";

const supportCategories = [
  {
    icon: "lucide:message-circle",
    title: "General Support",
    desc: "Questions about using the platform or technical assistance",
  },
  {
    icon: "lucide:user-round",
    title: "Candidate Support",
    desc: "Help with profile creation, applications, or career guidance",
  },
  {
    icon: "lucide:building-2",
    title: "Employer Support",
    desc: "Assistance with job postings, pricing, or account management",
  },
  {
    icon: "lucide:mail",
    title: "Partnership Inquiries",
    desc: "Community colleges, trade schools, high schools, certification platforms, and workforce development organizations—let's connect talent to opportunity together",
  },
];

export function HowCanWeHelp() {
  return (
    <section className="bg-white text-neutral-900 dark:bg-main-bg dark:text-main-text">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-title font-bold text-neutral-900 dark:text-main-text">How Can We Help?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {supportCategories.map((category) => (
            <div
              key={category.title}
              className="group relative overflow-hidden rounded-2xl border border-subtle bg-surface p-6 hover:shadow-lg transition-shadow"
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

              <span className="inline-flex items-center justify-center rounded-lg bg-main-accent/10 text-main-accent p-3 mb-4">
                <Icon icon={category.icon} width={40} height={40} />
              </span>
              <h3 className="text-xl font-semibold mb-2 text-neutral-900 dark:text-main-text">{category.title}</h3>
              <p className="text-sm text-neutral-600 dark:text-main-light-text leading-relaxed">
                {category.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
