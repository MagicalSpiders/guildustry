export interface Certification {
  id: string;
  title: string;
  location: string;
  programs: string[];
  duration: string;
  format: string;
}

export const certifications: Certification[] = [
  {
    id: "1",
    title: "Tooling U-SME",
    location: "Online",
    programs: [
      "CNC Programming",
      "Blueprint Reading",
      "Welding Fundamentals",
      "Manufacturing Processes",
    ],
    duration: "Self-paced",
    format: "Online",
  },
  {
    id: "2",
    title: "Community College Programs",
    location: "Various Locations",
    programs: [
      "Associate Degree Programs",
      "Certificate Programs",
      "Apprenticeship Support",
    ],
    duration: "6 months - 2 years",
    format: "In-person/Hybrid",
  },
  {
    id: "3",
    title: "Trade School Partners",
    location: "National",
    programs: [
      "Specialized Trade Training",
      "Certification Prep",
      "Hands-on Skills Development",
    ],
    duration: "3-12 months",
    format: "In-person",
  },
];

