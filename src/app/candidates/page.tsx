import type { Metadata } from "next";
import { CandidatesHero } from "@/src/app/candidates/components/Hero";

export const metadata: Metadata = {
  title: "Candidates – Build a Career Without Debt | Guildustry",
  description: "Skilled trades offer stability, high pay, and respect. No degree required. Start earning from day one.",
};

export default function CandidatesPage() {
  return (
    <>
      <CandidatesHero />
    </>
  );
}
