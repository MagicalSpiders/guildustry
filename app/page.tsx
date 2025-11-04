import { Hero } from "@/src/app/homepage/components/Hero";
import { Stats } from "@/src/app/homepage/components/Stats";
import { Employers } from "@/src/app/homepage/components/Employers";
import { Candidates } from "@/src/app/homepage/components/Candidates";

export const metadata = {
  title: "Guildustry - America Needs Builders",
  description: "Step into the future of skilled trades. Find high-paying jobs that offer stability—without the burden of college debt.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Employers />
      <Candidates />
    </>
  );
}