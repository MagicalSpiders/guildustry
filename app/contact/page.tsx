import type { Metadata } from "next";
import { ContactHero } from "@/src/app/contact/components/Hero";
import { HowCanWeHelp } from "@/src/app/contact/components/HowCanWeHelp";
import { ContactForm } from "@/src/app/contact/components/ContactForm";
import { OtherWays } from "@/src/app/contact/components/OtherWays";

export const metadata: Metadata = {
  title: "Contact Us – Get in Touch | Guildustry",
  description: "Have questions? We're here to help. Reach out for support or partnership opportunities.",
};

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <HowCanWeHelp />
      <ContactForm />
      <OtherWays />
    </>
  );
}


