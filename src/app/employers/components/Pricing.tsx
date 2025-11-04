import { Icon } from "@iconify/react";
import Link from "next/link";
import { Button } from "@/src/components/Button";

const plans = [
  {
    name: "Starter",
    price: "$199",
    period: "per month",
    features: [
      "Post up to 5 job openings",
      "Basic applicant tracking",
      "Email support",
      "30-day job visibility",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Professional",
    price: "$399",
    period: "per month",
    features: [
      "Unlimited job postings",
      "Advanced applicant tracking",
      "Priority support",
      "Analytics & reporting",
      "Featured job listings",
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    features: [
      "Everything in Professional",
      "Dedicated account manager",
      "Custom integrations",
      "Volume hiring tools",
      "White-label options",
    ],
    cta: "Get Started",
    popular: false,
  },
];

export function Pricing() {
  return (
    <section className="bg-white text-neutral-900 dark:bg-main-bg dark:text-main-text">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-title font-bold text-neutral-900 dark:text-main-text">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-3 text-neutral-600 dark:text-main-light-text">
            Choose the plan that fits your hiring needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative overflow-hidden rounded-2xl border p-6 flex flex-col ${
                plan.popular
                  ? "border-main-accent bg-white dark:bg-surface shadow-lg"
                  : "border-subtle bg-white dark:bg-surface"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-4 right-4 inline-flex items-center rounded-full bg-main-accent px-3 py-1 text-xs font-medium text-white">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-main-text">
                  {plan.name}
                </h3>
                <div className="mt-2 flex items-baseline justify-center">
                  <span className="text-4xl font-bold font-title text-neutral-900 dark:text-main-text">
                    {plan.price}
                  </span>
                  <span className="ml-2 text-sm text-neutral-500 dark:text-neutral-400">
                    / {plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-6 flex-grow">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-neutral-700 dark:text-main-light-text"
                  >
                    <Icon
                      icon="lucide:check"
                      className="w-4 h-4 text-main-accent"
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.popular ? "accent" : "outline"}
                size="lg"
                className="w-full mt-auto"
                asChild
              >
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center text-inherit"
                >
                  {plan.cta}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
