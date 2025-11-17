"use client";

import { Icon } from "@iconify/react";

interface PreferencesStepProps {
  setValue: any;
  watch: any;
}

export function PreferencesStep({ setValue, watch }: PreferencesStepProps) {
  const defaultPreferences = {
    technicalSkills: 30,
    experienceLevel: 15,
    trainabilityAlignment: 15,
    softSkillsCulture: 20,
    schedulePayFit: 10,
    proximityAvailability: 10,
  };

  const preferences =
    (watch("preferences") as Record<string, number>) || defaultPreferences;

  const handleSliderChange = (key: string, value: number) => {
    setValue("preferences", { ...preferences, [key]: value });
  };

  const total = Object.values(preferences).reduce(
    (sum: number, val: number) => sum + val,
    0
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-title font-semibold text-main-text">
          Scoring & Matching Preferences
        </h3>
        <p className="text-main-light-text mt-1">
          Rank the importance of each factor (must total 100%)
        </p>
      </div>

      <div className="space-y-8">
        {Object.entries(preferences).map(([key, value]) => {
          const labels = {
            technicalSkills: "Technical Skills",
            experienceLevel: "Experience Level",
            trainabilityAlignment: "Trainability Alignment",
            softSkillsCulture: "Soft Skills & Culture",
            schedulePayFit: "Schedule & Pay Fit",
            proximityAvailability: "Proximity & Availability",
          };

          return (
            <div key={key} className="relative">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-main-text">
                  {labels[key as keyof typeof labels]}
                </label>
                <span className="text-sm font-semibold text-main-accent min-w-14 text-right">
                  {value}%
                </span>
              </div>
              <div className="relative h-3 bg-subtle rounded-full">
                {/* Filled track - accent color */}
                <div
                  className="absolute h-full bg-main-accent rounded-full transition-all duration-200"
                  style={{ width: `${value}%` }}
                />
                {/* Invisible input for interaction */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={value}
                  onChange={(e) =>
                    handleSliderChange(key, parseInt(e.target.value))
                  }
                  className="absolute inset-0 w-full h-3 opacity-0 cursor-pointer z-10"
                />
                {/* Circular marker */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-main-accent shadow-md border-2 border-surface transition-all duration-200 hover:scale-110"
                  style={{ left: `calc(${value}% - 12px)` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <span
          className={`text-sm font-medium ${
            total === 100 ? "text-green-500" : "text-red-500"
          }`}
        >
          Total: {total}%{" "}
          {total === 100 && (
            <Icon icon="lucide:check" className="inline w-4 h-4 ml-1" />
          )}
        </span>
      </div>
    </div>
  );
}

