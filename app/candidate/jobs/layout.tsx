"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/components/AuthProvider";
import { PageSkeleton } from "@/src/components/ui/PageSkeleton";
import { NoticeModal } from "@/src/components/NoticeModal";
import { useState } from "react";

export default function CandidateJobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile, loading } = useAuth();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!loading && !profile) {
      // Show modal explaining they need to complete profile first
      setShowModal(true);
    }
  }, [profile, loading]);

  if (loading) {
    return <PageSkeleton variant="dashboard" />;
  }

  // If no profile, show modal and redirect
  if (!profile) {
    return (
      <>
        <NoticeModal
          open={showModal}
          title="Complete Your Profile First"
          description="You need to complete your profile and assessment before you can browse job openings. This helps employers find the right match for you."
          variant="info"
          onClose={() => {
            setShowModal(false);
            router.push("/candidate/profile");
          }}
          primaryAction={{
            label: "Complete Profile",
            onClick: () => {
              setShowModal(false);
              router.push("/candidate/profile");
            },
          }}
        />
        <div className="min-h-screen bg-main-bg flex items-center justify-center">
          <PageSkeleton variant="dashboard" />
        </div>
      </>
    );
  }

  return <>{children}</>;
}
