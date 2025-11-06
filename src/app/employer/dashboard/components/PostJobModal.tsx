"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/src/components/Button";

interface PostJobModalProps {
  open: boolean;
  onClose: () => void;
}

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

function Stepper({ currentStep, totalSteps, stepTitles }: StepperProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          const isLast = stepNumber === totalSteps;

          return (
            <div key={stepNumber} className="flex items-center flex-1">
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
                    {stepTitles[index]}
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

export function PostJobModal({ open, onClose }: PostJobModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const totalSteps = 4;
  const stepTitles = [
    "Role Basics",
    "Requirements",
    "Preferences",
    "Description",
  ];

  // Handle closing animation
  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onClose();
      setIsAnimating(false);
    }, 200); // Match transition duration
  };

  if (!open && !isAnimating) return null;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log("Job posted!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${
            open && !isAnimating ? "opacity-100" : "opacity-0"
          }`}
          onClick={handleClose}
        />

        {/* Modal */}
        <div
          className={`relative w-full max-w-4xl bg-surface rounded-2xl shadow-2xl border border-subtle max-h-[90vh] overflow-hidden transition-all duration-200 ${
            open && !isAnimating
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-4"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-subtle">
            <div>
              <h2 className="text-2xl font-title font-bold text-main-text">
                Post a New Job
              </h2>
              <p className="text-main-light-text mt-1">
                Fill out the details below to create a new job posting. All
                postings require admin approval before going live.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-light-bg rounded-lg transition-colors"
            >
              <Icon icon="lucide:x" className="w-5 h-5 text-main-light-text" />
            </button>
          </div>

          {/* Admin Notice */}
          <div className="mx-6 mt-2 p-4 bg-main-accent/10 border border-main-accent/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Icon
                icon="lucide:info"
                className="w-5 h-5 text-main-accent mt-0.5"
              />
              <p className="text-sm text-main-text">
                Your job posting will be reviewed by our admin team before it
                appears on the job board. This typically takes 24-48 hours.
              </p>
            </div>
          </div>

          {/* Stepper */}
          <div className="px-6 pt-2">
            <Stepper
              currentStep={currentStep}
              totalSteps={totalSteps}
              stepTitles={stepTitles}
            />
          </div>

          {/* Content */}
          <div className="px-6 pb-6 overflow-y-auto max-h-[50vh]">
            {currentStep === 1 && <RoleBasicsStep />}
            {currentStep === 2 && <RequirementsStep />}
            {currentStep === 3 && <PreferencesStep />}
            {currentStep === 4 && <DescriptionStep />}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t border-subtle bg-light-bg/50">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              Previous
            </Button>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              {currentStep === totalSteps ? (
                <Button variant="accent" onClick={handleSubmit}>
                  Post Job
                </Button>
              ) : (
                <Button variant="accent" onClick={handleNext}>
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step Components
function RoleBasicsStep() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-title font-semibold text-main-text">
        Role Basics
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-main-light-text">
            Job Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Licensed Electrician"
            className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-main-light-text">
            Trade Specialty <span className="text-red-500">*</span>
          </label>
          <select className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent transition-colors">
            <option>Select specialty</option>
            <option>Electrical</option>
            <option>Plumbing</option>
            <option>HVAC</option>
            <option>Carpentry</option>
            <option>Welding</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-main-light-text">
          Location <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g. New York, NY"
          className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-main-light-text">
            Employment Type <span className="text-red-500">*</span>
          </label>
          <select className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent transition-colors">
            <option>Select type</option>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Contract</option>
            <option>Temporary</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-main-light-text">
            Shift Pattern <span className="text-red-500">*</span>
          </label>
          <select className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent transition-colors">
            <option>Select pattern</option>
            <option>Day Shift</option>
            <option>Night Shift</option>
            <option>Rotating</option>
            <option>Flexible</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-main-light-text">
          Start Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent transition-colors"
        />
      </div>
    </div>
  );
}

function RequirementsStep() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-title font-semibold text-main-text">
        Requirements
      </h3>

      <div>
        <label className="block text-sm font-medium mb-3 text-main-light-text">
          Required Certifications/Licenses
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            "OSHA 10-Hour Safety",
            "OSHA 30-Hour Safety",
            "EPA 608 Certification",
            "Journeyman Electrician License",
            "Master Electrician License",
            "Journeyman Plumber License",
            "Master Plumber License",
            "HVAC Excellence Certification",
            "NATE Certification",
            "Welding Certification (AWS)",
            "Forklift Operator Certification",
            "CPR/First Aid",
            "Crane Operator Certification",
            "Confined Space Entry",
            "Scaffold User/Builder",
            "Other",
          ].map((cert) => (
            <label
              key={cert}
              className="flex items-center gap-2 p-2 hover:bg-light-bg rounded-lg cursor-pointer"
            >
              <input
                type="checkbox"
                className="w-4 h-4 text-main-accent focus:ring-main-accent rounded"
              />
              <span className="text-sm text-main-text">{cert}</span>
            </label>
          ))}
        </div>
        <p className="text-xs text-main-light-text mt-2">
          Select all certifications/licenses required for this position
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-3 text-main-light-text">
          Priority Skills
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            "Blueprint Reading",
            "Electrical Troubleshooting",
            "Circuit Installation",
            "PLC Programming",
            "Pipe Installation",
            "Welding",
            "HVAC Installation",
            "HVAC Repair",
            "Carpentry",
            "Concrete Work",
            "Equipment Operation",
            "Safety Compliance",
            "Project Management",
          ].map((skill) => (
            <label
              key={skill}
              className="flex items-center gap-2 p-2 hover:bg-light-bg rounded-lg cursor-pointer"
            >
              <input
                type="checkbox"
                className="w-4 h-4 text-main-accent focus:ring-main-accent rounded"
              />
              <span className="text-sm text-main-text">{skill}</span>
            </label>
          ))}
        </div>
        <p className="text-xs text-main-light-text mt-2">
          Select skills that are most important for this position
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-main-light-text">
            Minimum Education Level <span className="text-red-500">*</span>
          </label>
          <select className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent transition-colors">
            <option>Select minimum education</option>
            <option>High School Diploma/GED</option>
            <option>Trade School Certificate</option>
            <option>Associate Degree</option>
            <option>Bachelor's Degree</option>
            <option>No formal education required</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-3 text-main-light-text">
            Travel/Transportation Requirements{" "}
            <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {[
              "Driver's license & own vehicle required",
              "Driver's license & own vehicle preferred",
              "Not required",
            ].map((option) => (
              <label key={option} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="transportation"
                  className="w-4 h-4 text-main-accent focus:ring-main-accent"
                />
                <span className="text-sm text-main-text">{option}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PreferencesStep() {
  const [preferences, setPreferences] = useState({
    technicalSkills: 30,
    experienceLevel: 15,
    trainabilityAlignment: 15,
    softSkillsCulture: 20,
    schedulePayFit: 10,
    proximityAvailability: 10,
  });

  const handleSliderChange = (key: string, value: number) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const total = Object.values(preferences).reduce((sum, val) => sum + val, 0);

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

function DescriptionStep() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-title font-semibold text-main-text">
        Job Description
      </h3>

      <div>
        <label className="block text-sm font-medium mb-2 text-main-light-text">
          Job Description <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={12}
          placeholder="Describe the role, responsibilities, and work environment..."
          className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent transition-colors resize-none"
        />
        <p className="text-xs text-main-light-text mt-2">
          Provide a detailed description of the position
        </p>
      </div>
    </div>
  );
}
