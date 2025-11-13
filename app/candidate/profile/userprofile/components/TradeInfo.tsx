import { Icon } from "@iconify/react";
import type { ProfileFormValues } from "@/src/app/profile/schema";

interface TradeInfoProps {
  data: ProfileFormValues;
}

const tradeLabels: Record<string, string> = {
  electrician: "Electrician",
  plumber: "Plumber",
  welder: "Welder",
  hvac: "HVAC Technician",
};

const shiftLabels: Record<string, string> = {
  day: "Day Shift",
  night: "Night Shift",
  any: "Any Shift",
};

export function TradeInfo({ data }: TradeInfoProps) {
  const hasData =
    data.primary_trade ||
    data.years_of_experience > 0 ||
    data.shift_preference ||
    data.has_valid_licence;

  if (!hasData) {
    return (
      <div className="rounded-2xl border border-subtle bg-surface p-6 shadow-elevated">
        <h2 className="text-xl font-title font-bold mb-4 flex items-center gap-2">
          <Icon icon="lucide:briefcase" className="w-5 h-5 text-main-accent" />
          Trade & Experience
        </h2>
        <p className="text-sm text-main-light-text">
          No trade information available.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-subtle bg-surface p-6 shadow-elevated">
      <h2 className="text-xl font-title font-bold mb-6 flex items-center gap-2">
        <Icon icon="lucide:briefcase" className="w-5 h-5 text-main-accent" />
        Trade & Experience
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.primary_trade && (
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <div className="inline-flex items-center justify-center rounded-lg bg-main-accent/10 text-main-accent p-2">
                <Icon icon="lucide:hammer" className="w-4 h-4" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-main-light-text mb-1">
                Primary Trade
              </p>
              <p className="text-sm font-medium text-main-text">
                {tradeLabels[data.primary_trade] || data.primary_trade}
              </p>
            </div>
          </div>
        )}

        {data.years_of_experience > 0 && (
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <div className="inline-flex items-center justify-center rounded-lg bg-main-accent/10 text-main-accent p-2">
                <Icon icon="lucide:calendar" className="w-4 h-4" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-main-light-text mb-1">
                Years of Experience
              </p>
              <p className="text-sm font-medium text-main-text">
                {data.years_of_experience}{" "}
                {data.years_of_experience === 1 ? "year" : "years"}
              </p>
            </div>
          </div>
        )}

        {data.shift_preference && (
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <div className="inline-flex items-center justify-center rounded-lg bg-main-accent/10 text-main-accent p-2">
                <Icon icon="lucide:clock" className="w-4 h-4" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-main-light-text mb-1">
                Shift Preference
              </p>
              <p className="text-sm font-medium text-main-text">
                {shiftLabels[data.shift_preference] || data.shift_preference}
              </p>
            </div>
          </div>
        )}

        {data.has_valid_licence && (
          <div className="flex items-start gap-3 sm:col-span-2">
            <div className="flex-shrink-0 mt-1">
              <div className="inline-flex items-center justify-center rounded-lg bg-main-accent/10 text-main-accent p-2">
                <Icon icon="lucide:badge-check" className="w-4 h-4" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-main-light-text mb-1">
                Certifications
              </p>
              <p className="text-sm font-medium text-main-text">
                Licensed & Certified
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
