"use client";

import { Icon } from "@iconify/react";

export interface StepperStep {
  id: string;
  title: string;
}

interface StepperProps {
  steps: StepperStep[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className = "" }: StepperProps) {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          const isLast = stepNumber === steps.length;

          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    isCompleted
                      ? "bg-main-accent text-white"
                      : isActive
                      ? "bg-main-accent text-white"
                      : "bg-surface border-2 border-subtle text-main-light-text"
                  }`}
                >
                  {isCompleted ? (
                    <Icon icon="lucide:check" className="w-5 h-5" />
                  ) : (
                    stepNumber
                  )}
                </div>
                <div className="ml-3 min-w-0">
                  <p
                    className={`text-sm font-medium ${
                      isActive ? "text-main-text" : "text-main-light-text"
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div
                  className={`flex-1 h-0.5 mx-4 ${
                    isCompleted ? "bg-main-accent" : "bg-subtle"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}



