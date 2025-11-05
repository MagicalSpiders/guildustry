import { Icon } from "@iconify/react";
import type { ProfileFormValues } from "@/src/app/profile/schema";

interface PersonalInfoProps {
  data: ProfileFormValues;
}

export function PersonalInfo({ data }: PersonalInfoProps) {
  const infoItems = [
    { label: "Full Name", value: data.fullName, icon: "lucide:user" },
    { label: "Email", value: data.email, icon: "lucide:mail" },
    { label: "Phone", value: data.phone, icon: "lucide:phone" },
    { label: "Location", value: `${data.city}, ${data.state}`, icon: "lucide:map-pin" },
  ].filter((item) => item.value);

  if (infoItems.length === 0) {
    return (
      <div className="rounded-2xl border border-subtle bg-surface p-6 shadow-elevated">
        <h2 className="text-xl font-title font-bold mb-4 flex items-center gap-2">
          <Icon icon="lucide:user" className="w-5 h-5 text-main-accent" />
          Personal Information
        </h2>
        <p className="text-sm text-main-light-text">No personal information available.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-subtle bg-surface p-6 shadow-elevated">
      <h2 className="text-xl font-title font-bold mb-6 flex items-center gap-2">
        <Icon icon="lucide:user" className="w-5 h-5 text-main-accent" />
        Personal Information
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {infoItems.map((item) => (
          <div key={item.label} className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <div className="inline-flex items-center justify-center rounded-lg bg-main-accent/10 text-main-accent p-2">
                <Icon icon={item.icon} className="w-4 h-4" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-main-light-text mb-1">{item.label}</p>
              <p className="text-sm font-medium text-main-text break-words">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

