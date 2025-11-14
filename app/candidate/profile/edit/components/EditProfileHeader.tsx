"use client";

import { Button } from "@/src/components/Button";

interface EditProfileHeaderProps {
  onCancel: () => void;
  onSave: () => void;
  isSubmitting: boolean;
}

export function EditProfileHeader({
  onCancel,
  onSave,
  isSubmitting,
}: EditProfileHeaderProps) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl sm:text-4xl font-title font-bold">
          Edit Profile
        </h1>
        <p className="mt-2 text-main-light-text">
          Update your profile information and preferences.
        </p>
      </div>
      <div className="flex gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          variant="accent"
          size="sm"
          onClick={onSave}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

