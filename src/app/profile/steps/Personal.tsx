import { useFormContext } from "react-hook-form";

export function PersonalStep() {
  const { register, formState } = useFormContext();
  const { errors } = formState as any;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-2 text-main-light-text">Full Name</label>
        <input
          {...register("fullName")}
          className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent"
          placeholder="John Builder"
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-500">{errors.fullName.message as string}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-2 text-main-light-text">Email</label>
        <input
          {...register("email")}
          type="email"
          className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent"
          placeholder="you@example.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message as string}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-2 text-main-light-text">Phone</label>
        <input
          {...register("phone")}
          className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent"
          placeholder="(555) 000-0000"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-500">{errors.phone.message as string}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-2 text-main-light-text">City</label>
        <input
          {...register("city")}
          className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent"
          placeholder="Detroit"
        />
        {errors.city && (
          <p className="mt-1 text-sm text-red-500">{errors.city.message as string}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-2 text-main-light-text">State</label>
        <input
          {...register("state")}
          className="w-full px-4 py-3 rounded-lg border border-subtle bg-light-bg text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent"
          placeholder="MI"
        />
        {errors.state && (
          <p className="mt-1 text-sm text-red-500">{errors.state.message as string}</p>
        )}
      </div>
    </div>
  );
}


