import { useState } from "react";
import { useRouter } from "next/navigation";
import { UseFormReturn } from "react-hook-form";
import { useAuth } from "@/src/components/AuthProvider";
import { updateUserProfile, uploadResume } from "@/src/lib/profileFunctions";
import type { ProfileFormValues } from "@/src/app/profile/schema";

interface UseProfileUpdateReturn {
  isSubmitting: boolean;
  noticeOpen: boolean;
  noticeTitle: string;
  noticeDescription: string;
  noticeVariant: "success" | "error" | "info";
  handleSave: () => Promise<void>;
  closeNotice: () => void;
}

export function useProfileUpdate(
  methods: UseFormReturn<ProfileFormValues>
): UseProfileUpdateReturn {
  const router = useRouter();
  const { user, refreshProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeDescription, setNoticeDescription] = useState("");
  const [noticeVariant, setNoticeVariant] = useState<
    "success" | "error" | "info"
  >("info");

  const handleSave = async () => {
    // Validate form first
    const isValid = await methods.trigger();
    if (!isValid) {
      console.log("[Profile] Form validation failed");
      return;
    }

    const data = methods.getValues();

    if (!user) {
      console.error("[Profile] No user found");
      setNoticeTitle("Authentication Required");
      setNoticeDescription(
        "You must be logged in to save your profile. Please sign in and try again."
      );
      setNoticeVariant("error");
      setNoticeOpen(true);
      setTimeout(() => {
        router.push("/auth/sign-in");
      }, 2000);
      return;
    }

    console.log("[Profile] Saving profile updates");
    setIsSubmitting(true);

    // Show loading modal
    setNoticeTitle("Updating Your Profile");
    setNoticeDescription("Please wait while we save your changes...");
    setNoticeVariant("info");
    setNoticeOpen(true);

    try {
      // Handle resume file upload if present
      let resumeUrl = data.resume_file_url;
      const resumeFile = (data as any).resumeFile as File | undefined;

      if (resumeFile) {
        console.log("[Profile] Uploading new resume file");
        setNoticeDescription("Uploading your resume...");
        try {
          resumeUrl = await uploadResume(resumeFile, user.id);
          console.log("[Profile] Resume uploaded successfully");
          setNoticeDescription("Resume uploaded! Saving your profile...");
        } catch (uploadError: any) {
          console.error("[Profile] Resume upload failed:", uploadError.message);
          throw new Error(`Failed to upload resume: ${uploadError.message}`);
        }
      }

      const profileData = {
        fullname: data.fullname,
        email: data.email,
        phone_number: data.phone_number,
        city: data.city,
        state: data.state,
        primary_trade: data.primary_trade,
        years_of_experience: data.years_of_experience,
        shift_preference: data.shift_preference,
        has_valid_licence: data.has_valid_licence || false,
        resume_file_url: resumeUrl,
        role: data.role || "candidate",
        priority: data.priority || 1,
        company_id: data.company_id || null,
        priority_choice: data.priority_choice,
        shape_choice: data.shape_choice,
        // timestamp will be auto-updated by database
      };

      console.log("[Profile] Calling updateUserProfile...");
      await updateUserProfile(profileData);
      console.log("[Profile] Profile updated successfully");

      console.log("[Profile] Refreshing profile in AuthProvider...");
      await refreshProfile();
      console.log("[Profile] Profile refreshed");

      // Show success modal
      setNoticeTitle("Profile Updated Successfully!");
      setNoticeDescription(
        "Your profile has been updated. You'll be redirected to view your profile."
      );
      setNoticeVariant("success");
      setNoticeOpen(true);

      // Redirect after showing success message
      setTimeout(() => {
        router.push("/candidate/profile/view");
      }, 2000);
    } catch (error: any) {
      console.error("[Profile] Update error:", error);
      console.error("[Profile] Error message:", error.message);
      console.error("[Profile] Error stack:", error.stack);

      // Show error modal
      setNoticeTitle("Failed to Update Profile");
      setNoticeDescription(
        error.message ||
          "An error occurred while updating your profile. Please try again."
      );
      setNoticeVariant("error");
      setNoticeOpen(true);
    } finally {
      console.log("[Profile] Setting isSubmitting to false");
      setIsSubmitting(false);
    }
  };

  const closeNotice = () => {
    setNoticeOpen(false);
    if (
      noticeVariant === "error" &&
      noticeTitle === "Authentication Required"
    ) {
      router.push("/auth/sign-in");
    }
  };

  return {
    isSubmitting,
    noticeOpen,
    noticeTitle,
    noticeDescription,
    noticeVariant,
    handleSave,
    closeNotice,
  };
}
