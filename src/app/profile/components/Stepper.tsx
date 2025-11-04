type Step = { id: string; title: string };

export function Stepper({ steps, current }: { steps: Step[]; current: number }) {
  return (
    <ol className="flex items-center gap-4">
      {steps.map((step, idx) => {
        const active = idx === current;
        const done = idx < current;
        return (
          <li key={step.id} className="flex items-center gap-2">
            <span
              className={`flex items-center justify-center rounded-full w-7 h-7 border text-sm font-semibold ${
                done
                  ? "bg-main-accent text-main-bg border-main-accent"
                  : active
                  ? "border-main-accent text-main-accent"
                  : "border-subtle text-main-light-text"
              }`}
            >
              {done ? "✓" : idx + 1}
            </span>
            <span className={`text-sm ${active ? "text-main-text" : "text-main-light-text"}`}>
              {step.title}
            </span>
            {idx < steps.length - 1 && (
              <span className="mx-3 h-px w-8 bg-subtle hidden sm:block" />
            )}
          </li>
        );
      })}
    </ol>
  );
}


