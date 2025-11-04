import type { Metadata } from "next";
import { EmployersHero } from "@/src/app/employers/components/Hero";
import { WhyHiring } from "@/src/app/employers/components/WhyHiring";
import { WhyChooseUs } from "@/src/app/employers/components/WhyChooseUs";
import { Pricing } from "@/src/app/employers/components/Pricing";
import { HowItWorks } from "@/src/app/employers/components/HowItWorks";

export const metadata: Metadata = {
  title: "Employers – Hire Skilled Trades Faster | Guildustry",
  description:
    "America's skilled trades shortage is real. Connect with motivated, qualified candidates ready to work.",
};

export default function EmployersPage() {
  return (
    <>
      <EmployersHero />
      <WhyHiring />
      <WhyChooseUs />
      <Pricing />
      <HowItWorks />
    </>
  );
}
