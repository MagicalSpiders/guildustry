"use client";

interface RoleBasicsStepProps {
  register: any;
  errors?: any;
  setValue?: any;
}

export function RoleBasicsStep({ register, errors, setValue }: RoleBasicsStepProps) {
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
            {...register("title")}
            className={`w-full px-4 py-3 rounded-lg border bg-light-bg text-main-text focus:outline-none focus:ring-2 transition-colors ${
              errors.title
                ? "border-red-500 focus:ring-red-500"
                : "border-subtle focus:ring-main-accent"
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-main-light-text">
            Trade Specialty <span className="text-red-500">*</span>
          </label>
          <select
            {...register("trade_specialty")}
            className={`w-full px-4 py-3 rounded-lg border bg-light-bg text-main-text focus:outline-none focus:ring-2 transition-colors ${
              errors.trade_specialty
                ? "border-red-500 focus:ring-red-500"
                : "border-subtle focus:ring-main-accent"
            }`}
          >
            <option value="">Select specialty</option>
            <option value="Electrical">Electrical</option>
            <option value="Plumbing">Plumbing</option>
            <option value="HVAC">HVAC</option>
            <option value="Carpentry">Carpentry</option>
            <option value="Welding">Welding</option>
          </select>
          {errors.trade_specialty && (
            <p className="mt-1 text-sm text-red-500">
              {errors.trade_specialty.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-main-light-text">
          Location <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g. New York, NY"
          {...register("location")}
          className={`w-full px-4 py-3 rounded-lg border bg-light-bg text-main-text focus:outline-none focus:ring-2 transition-colors ${
            errors.location
              ? "border-red-500 focus:ring-red-500"
              : "border-subtle focus:ring-main-accent"
          }`}
        />
        {errors.location && (
          <p className="mt-1 text-sm text-red-500">{errors.location.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-main-light-text">
            Employment Type <span className="text-red-500">*</span>
          </label>
          <select
            {...register("job_type")}
            className={`w-full px-4 py-3 rounded-lg border bg-light-bg text-main-text focus:outline-none focus:ring-2 transition-colors ${
              errors.job_type
                ? "border-red-500 focus:ring-red-500"
                : "border-subtle focus:ring-main-accent"
            }`}
          >
            <option value="">Select type</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="temporary">Temporary</option>
          </select>
          {errors.job_type && (
            <p className="mt-1 text-sm text-red-500">
              {errors.job_type.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-main-light-text">
            Shift Pattern
          </label>
          <select
            {...register("shift_pattern")}
            className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent transition-colors"
          >
            <option value="">Select pattern</option>
            <option value="day">Day Shift</option>
            <option value="night">Night Shift</option>
            <option value="rotating">Rotating</option>
            <option value="flexible">Flexible</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-main-light-text">
            Minimum Salary ($) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            placeholder="e.g. 50000"
            {...register("salary_min", { valueAsNumber: true })}
            className={`w-full px-4 py-3 rounded-lg border bg-light-bg text-main-text focus:outline-none focus:ring-2 transition-colors ${
              errors.salary_min
                ? "border-red-500 focus:ring-red-500"
                : "border-subtle focus:ring-main-accent"
            }`}
          />
          {errors.salary_min && (
            <p className="mt-1 text-sm text-red-500">
              {errors.salary_min.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-main-light-text">
            Maximum Salary ($) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            placeholder="e.g. 80000"
            {...register("salary_max", { valueAsNumber: true })}
            className={`w-full px-4 py-3 rounded-lg border bg-light-bg text-main-text focus:outline-none focus:ring-2 transition-colors ${
              errors.salary_max
                ? "border-red-500 focus:ring-red-500"
                : "border-subtle focus:ring-main-accent"
            }`}
          />
          {errors.salary_max && (
            <p className="mt-1 text-sm text-red-500">
              {errors.salary_max.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-main-light-text">
          Start Date
        </label>
        <input
          type="date"
          {...register("start_date")}
          className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent transition-colors"
        />
      </div>
    </div>
  );
}

