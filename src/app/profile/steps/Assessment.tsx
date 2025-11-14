import { useFormContext } from "react-hook-form";

export function AssessmentStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2 text-main-text">
          1) On a high-stakes project, what's your priority?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer transition-colors ${
              errors.priority_choice
                ? "border-red-500"
                : "border-subtle bg-light-bg hover:border-main-accent/50"
            }`}
          >
            <input
              type="radio"
              value="Safety first"
              {...register("priority_choice")}
              className="text-main-accent"
            />
            <span className="text-sm text-main-text">Safety first</span>
          </label>
          <label
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer transition-colors ${
              errors.priority_choice
                ? "border-red-500"
                : "border-subtle bg-light-bg hover:border-main-accent/50"
            }`}
          >
            <input
              type="radio"
              value="Deliver on time"
              {...register("priority_choice")}
              className="text-main-accent"
            />
            <span className="text-sm text-main-text">Deliver on time</span>
          </label>
          <label
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer transition-colors ${
              errors.priority_choice
                ? "border-red-500"
                : "border-subtle bg-light-bg hover:border-main-accent/50"
            }`}
          >
            <input
              type="radio"
              value="Control costs"
              {...register("priority_choice")}
              className="text-main-accent"
            />
            <span className="text-sm text-main-text">Control costs</span>
          </label>
        </div>
        {errors.priority_choice && (
          <p className="mt-1 text-sm text-red-500">
            {errors.priority_choice.message as string}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-main-text">
          2) Which 3D shape results from rotating this 2D profile?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer transition-colors ${
              errors.shape_choice
                ? "border-red-500"
                : "border-subtle bg-light-bg hover:border-main-accent/50"
            }`}
          >
            <input
              type="radio"
              value="Cylinder"
              {...register("shape_choice")}
              className="text-main-accent"
            />
            <span className="text-sm text-main-text">Cylinder</span>
          </label>
          <label
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer transition-colors ${
              errors.shape_choice
                ? "border-red-500"
                : "border-subtle bg-light-bg hover:border-main-accent/50"
            }`}
          >
            <input
              type="radio"
              value="Sphere"
              {...register("shape_choice")}
              className="text-main-accent"
            />
            <span className="text-sm text-main-text">Sphere</span>
          </label>
          <label
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer transition-colors ${
              errors.shape_choice
                ? "border-red-500"
                : "border-subtle bg-light-bg hover:border-main-accent/50"
            }`}
          >
            <input
              type="radio"
              value="Torus"
              {...register("shape_choice")}
              className="text-main-accent"
            />
            <span className="text-sm text-main-text">Torus</span>
          </label>
        </div>
        {errors.shape_choice && (
          <p className="mt-1 text-sm text-red-500">
            {errors.shape_choice.message as string}
          </p>
        )}
      </div>
    </div>
  );
}
