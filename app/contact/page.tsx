import type { Metadata } from "next";
import { ContactHero } from "@/app/contact/components/Hero";
import { HowCanWeHelp } from "@/app/contact/components/HowCanWeHelp";
import { ContactForm } from "@/app/contact/components/ContactForm";
import { OtherWays } from "@/app/contact/components/OtherWays";

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


