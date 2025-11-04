const trades = [
  "Electrician",
  "Plumber",
  "HVAC Technician",
  "Welder",
  "Carpenter",
  "Pipefitter",
  "Heavy Equipment Operator",
  "Diesel Mechanic",
  "Industrial Maintenance",
  "CNC Machinist",
  "Ironworker",
  "Sheet Metal Worker",
  "Robotics & Automation",
];

export function InDemandTrades() {
  return (
    <section className="bg-white text-neutral-900 dark:bg-main-bg dark:text-main-text">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-title font-bold text-neutral-900 dark:text-main-text">In-Demand Trades</h2>
          <p className="mt-3 max-w-2xl mx-auto text-neutral-600 dark:text-main-light-text">
            Explore career paths with strong demand and competitive pay
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {trades.map((trade) => (
            <button
              key={trade}
              className="group relative overflow-hidden rounded-xl border border-subtle bg-white dark:bg-surface px-6 py-4 text-center font-medium text-neutral-800 dark:text-main-text hover:border-main-accent hover:shadow-md transition-all"
            >
              <span>{trade}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

