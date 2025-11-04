import { useFormContext } from "react-hook-form";

export function TradeStep() {
  const { register } = useFormContext();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-2 text-main-light-text">Primary Trade</label>
        <select
          {...register("primaryTrade")}
          className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text"
        >
          <option value="">Select trade</option>
          <option value="electrician">Electrician</option>
          <option value="plumber">Plumber</option>
          <option value="welder">Welder</option>
          <option value="hvac">HVAC Technician</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2 text-main-light-text">Years of Experience</label>
        <input
          {...register("yearsExperience")}
          className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text"
          placeholder="5"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2 text-main-light-text">Shift Preference</label>
        <select
          {...register("shiftPreference")}
          className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text"
        >
          <option value="any">Any</option>
          <option value="day">Day</option>
          <option value="night">Night</option>
        </select>
      </div>
      <label className="flex items-center gap-2 mt-6">
        <input type="checkbox" {...register("hasLicense")} className="rounded border-subtle" />
        <span className="text-sm text-main-light-text">I have a valid license/certification</span>
      </label>
    </div>
  );
}


