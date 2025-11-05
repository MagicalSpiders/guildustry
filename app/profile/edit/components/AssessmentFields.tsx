import { useFormContext } from "react-hook-form";
import type { ProfileFormValues } from "@/src/app/profile/schema";

export function AssessmentFields() {
  const { register } = useFormContext<ProfileFormValues>();
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium mb-2 text-main-text">
          1) On a high-stakes project, what's your priority?
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <label className="flex items-center gap-2 rounded-lg border border-subtle bg-light-bg px-3 py-2">
            <input type="radio" value="safety" {...register("q1")} /> Safety first
          </label>
          <label className="flex items-center gap-2 rounded-lg border border-subtle bg-light-bg px-3 py-2">
            <input type="radio" value="speed" {...register("q1")} /> Deliver on time
          </label>
          <label className="flex items-center gap-2 rounded-lg border border-subtle bg-light-bg px-3 py-2">
            <input type="radio" value="cost" {...register("q1")} /> Control costs
          </label>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-2 text-main-text">
          2) Which 3D shape results from rotating this 2D profile?
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <label className="flex items-center gap-2 rounded-lg border border-subtle bg-light-bg px-3 py-2">
            <input type="radio" value="cylinder" {...register("q2")} /> Cylinder
          </label>
          <label className="flex items-center gap-2 rounded-lg border border-subtle bg-light-bg px-3 py-2">
            <input type="radio" value="sphere" {...register("q2")} /> Sphere
          </label>
          <label className="flex items-center gap-2 rounded-lg border border-subtle bg-light-bg px-3 py-2">
            <input type="radio" value="torus" {...register("q2")} /> Torus
          </label>
        </div>
      </div>
    </div>
  );
}

