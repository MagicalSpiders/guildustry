import type { Metadata } from "next";
import { AboutHero } from "@/app/about/components/Hero";
import { OurMission } from "@/app/about/components/OurMission";
import { OurValues } from "@/app/about/components/OurValues";
import { OurVision } from "@/app/about/components/OurVision";

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
