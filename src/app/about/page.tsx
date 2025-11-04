import type { Metadata } from "next";
import { AboutHero } from "@/src/app/about/components/Hero";
import { OurMission } from "@/src/app/about/components/OurMission";
import { OurValues } from "@/src/app/about/components/OurValues";
import { OurVision } from "@/src/app/about/components/OurVision";

export const metadata: Metadata = {
  title: "About Guildustry – Building the Future of American Manufacturing",
  description:
    "Our mission is to uplift American manufacturing businesses and their communities by addressing the skilled labor shortage.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <OurMission />
      <OurValues />
      <OurVision />
    </>
  );
}
