"use client";

import { useRouter } from "next/navigation";
import { NoticeModal } from "@/src/components/NoticeModal";

interface ProfileSubmissionModalProps {
  open: boolean;
  title: string;
  description: string;
  variant: "success" | "error" | "info";
  onClose: () => void;
}

export function ProfileSubmissionModal({
  open,
  title,
  description,
  variant,
  onClose,
}: ProfileSubmissionModalProps) {
  const router = useRouter();

  return (
    <NoticeModal
      open={open}
      title={title}
      description={description}
      variant={variant}
      onClose={onClose}
      primaryAction={
        variant === "success"
          ? {
              label: "View Profile",
              onClick: () => {
                onClose();
                router.push("/candidate/profile/view");
              },
            }
          : variant === "error" && title !== "Authentication Required"
          ? {
              label: "Try Again",
              onClick: onClose,
            }
          : undefined
      }
    />
  );
}

