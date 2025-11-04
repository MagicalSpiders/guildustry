import type { Metadata } from "next";
import { CandidatesHero } from "@/src/app/candidates/components/Hero";
import { WhyTrades } from "@/src/app/candidates/components/WhyTrades";
import { MythBusting } from "@/src/app/candidates/components/MythBusting";
import { InDemandTrades } from "@/src/app/candidates/components/InDemandTrades";
import { HowItWorks } from "@/src/app/candidates/components/HowItWorks";

export const metadata: Metadata = {
  title: "Candidates – Build a Career Without Debt | Guildustry",
  description:
    "Skilled trades offer stability, high pay, and respect. No degree required. Start earning from day one.",
};

export default function CandidatesPage() {
  return (
    <>
      <CandidatesHero />
      <WhyTrades />
      <MythBusting />
      <InDemandTrades />
      <HowItWorks />
    </>
  );
}


