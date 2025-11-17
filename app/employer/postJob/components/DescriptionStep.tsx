"use client";

interface DescriptionStepProps {
  register: any;
  errors?: any;
}

export function DescriptionStep({ register, errors }: DescriptionStepProps) {
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
          {...register("description")}
          className={`w-full px-4 py-3 rounded-lg border bg-light-bg text-main-text focus:outline-none focus:ring-2 transition-colors resize-none ${
            errors.description
              ? "border-red-500 focus:ring-red-500"
              : "border-subtle focus:ring-main-accent"
          }`}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">
            {errors.description.message}
          </p>
        )}
        <p className="text-xs text-main-light-text mt-2">
          Provide a detailed description of the position
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-main-light-text">
          Additional Requirements (Optional)
        </label>
        <textarea
          rows={6}
          placeholder="List any additional requirements, expectations, or notes..."
          {...register("requirements")}
          className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent transition-colors resize-none"
        />
      </div>
    </div>
  );
}

