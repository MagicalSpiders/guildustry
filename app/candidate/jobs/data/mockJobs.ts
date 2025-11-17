export interface CandidateJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  posted: string;
  status: "active" | "pending" | "closed";
  matchScore: number;
  tradeSpecialty: string;
  employmentType: string;
  shiftPattern: string;
  startDate: string;
  requiredCertifications: string[];
  prioritySkills: string[];
  minimumEducation: string;
  transportationRequired: string;
  description: string;
  hasApplied?: boolean;
}

export const mockJobs: CandidateJob[] = [
  {
    id: "1",
    title: "Licensed Electrician",
    company: "ABC Construction",
    location: "New York, NY",
    salary: "$65,000 - $85,000",
    posted: "2 days ago",
    status: "active",
    matchScore: 92,
    tradeSpecialty: "Electrical",
    employmentType: "Full-time",
    shiftPattern: "Day Shift",
    startDate: "2025-01-15",
    requiredCertifications: [
      "OSHA 10-Hour Safety",
      "Journeyman Electrician License",
    ],
    prioritySkills: [
      "Blueprint Reading",
      "Electrical Troubleshooting",
      "Circuit Installation",
    ],
    minimumEducation: "High School Diploma/GED",
    transportationRequired: "Driver's license & own vehicle required",
    description:
      "We are seeking an experienced Licensed Electrician to join our commercial construction team. The ideal candidate will have a valid journeyman electrician license and OSHA 10-hour safety certification. You will be responsible for installing, maintaining, and repairing electrical systems in commercial buildings. This role requires strong technical skills, attention to detail, and the ability to work independently or as part of a team. We offer competitive compensation, comprehensive benefits, and opportunities for professional growth.",
    hasApplied: false,
  },
  {
    id: "2",
    title: "Master Plumber",
    company: "PipeDreams Co",
    location: "Brooklyn, NY",
    salary: "$70,000 - $90,000",
    posted: "3 days ago",
    status: "active",
    matchScore: 88,
    tradeSpecialty: "Plumbing",
    employmentType: "Full-time",
    shiftPattern: "Day Shift",
    startDate: "2025-01-20",
    requiredCertifications: [
      "OSHA 30-Hour Safety",
      "Master Plumber License",
    ],
    prioritySkills: [
      "Pipe Installation",
      "Blueprint Reading",
      "Safety Compliance",
    ],
    minimumEducation: "Trade School Certificate",
    transportationRequired: "Driver's license & own vehicle required",
    description:
      "Join our team as a Master Plumber and lead plumbing projects for residential and commercial properties. You'll work on complex installations, repairs, and maintenance tasks. We're looking for someone with extensive experience, strong leadership skills, and a commitment to quality workmanship. This position offers excellent pay, benefits, and the opportunity to work on diverse projects.",
    hasApplied: false,
  },
  {
    id: "3",
    title: "HVAC Technician",
    company: "CoolAir Systems",
    location: "Queens, NY",
    salary: "$55,000 - $75,000",
    posted: "4 days ago",
    status: "active",
    matchScore: 85,
    tradeSpecialty: "HVAC",
    employmentType: "Full-time",
    shiftPattern: "Day Shift",
    startDate: "2025-01-18",
    requiredCertifications: [
      "EPA 608 Certification",
      "HVAC Excellence Certification",
    ],
    prioritySkills: [
      "HVAC Installation",
      "HVAC Repair",
      "Electrical Troubleshooting",
    ],
    minimumEducation: "High School Diploma/GED",
    transportationRequired: "Driver's license & own vehicle required",
    description:
      "We're looking for a skilled HVAC Technician to install, maintain, and repair heating, ventilation, and air conditioning systems. The ideal candidate will have EPA 608 certification and experience with both residential and commercial systems. You'll work with a team of professionals in a fast-paced environment, providing excellent service to our customers.",
    hasApplied: true,
  },
  {
    id: "4",
    title: "Welder",
    company: "MetalWorks Inc",
    location: "Brooklyn, NY",
    salary: "$50,000 - $70,000",
    posted: "6 days ago",
    status: "active",
    matchScore: 78,
    tradeSpecialty: "Welding",
    employmentType: "Full-time",
    shiftPattern: "Day Shift",
    startDate: "2025-01-22",
    requiredCertifications: ["Welding Certification (AWS)"],
    prioritySkills: ["Welding", "Blueprint Reading", "Safety Compliance"],
    minimumEducation: "High School Diploma/GED",
    transportationRequired: "Driver's license & own vehicle preferred",
    description:
      "MetalWorks Inc is seeking an experienced Welder to join our fabrication team. You'll work on various metal projects, including structural steel, pipe welding, and custom fabrication. We need someone with AWS certification and strong welding skills across multiple processes. This role offers steady work, competitive pay, and a supportive team environment.",
    hasApplied: false,
  },
  {
    id: "5",
    title: "Carpenter",
    company: "BuildRight LLC",
    location: "Manhattan, NY",
    salary: "$58,000 - $78,000",
    posted: "1 week ago",
    status: "active",
    matchScore: 90,
    tradeSpecialty: "Carpentry",
    employmentType: "Full-time",
    shiftPattern: "Day Shift",
    startDate: "2025-01-25",
    requiredCertifications: ["OSHA 10-Hour Safety"],
    prioritySkills: [
      "Carpentry",
      "Blueprint Reading",
      "Project Management",
    ],
    minimumEducation: "High School Diploma/GED",
    transportationRequired: "Driver's license & own vehicle required",
    description:
      "BuildRight LLC is looking for a skilled Carpenter to work on high-end residential and commercial projects in Manhattan. You'll be responsible for framing, finishing work, and custom installations. We value craftsmanship, attention to detail, and the ability to work efficiently. This position offers competitive compensation and the opportunity to work on prestigious projects.",
    hasApplied: false,
  },
  {
    id: "6",
    title: "Construction Supervisor",
    company: "ABC Construction",
    location: "Manhattan, NY",
    salary: "$75,000 - $95,000",
    posted: "1 week ago",
    status: "active",
    matchScore: 82,
    tradeSpecialty: "General Construction",
    employmentType: "Full-time",
    shiftPattern: "Day Shift",
    startDate: "2025-02-01",
    requiredCertifications: [
      "OSHA 30-Hour Safety",
      "CPR/First Aid",
    ],
    prioritySkills: [
      "Project Management",
      "Blueprint Reading",
      "Safety Compliance",
    ],
    minimumEducation: "Associate Degree",
    transportationRequired: "Driver's license & own vehicle required",
    description:
      "We're seeking an experienced Construction Supervisor to oversee commercial construction projects. You'll manage crews, coordinate schedules, ensure quality standards, and maintain safety protocols. This role requires strong leadership skills, extensive construction experience, and the ability to handle multiple projects simultaneously.",
    hasApplied: false,
  },
  {
    id: "7",
    title: "Plumber",
    company: "PipeDreams Co",
    location: "New York, NY",
    salary: "$62,000 - $82,000",
    posted: "3 days ago",
    status: "active",
    matchScore: 87,
    tradeSpecialty: "Plumbing",
    employmentType: "Full-time",
    shiftPattern: "Day Shift",
    startDate: "2025-01-17",
    requiredCertifications: [
      "OSHA 10-Hour Safety",
      "Journeyman Plumber License",
    ],
    prioritySkills: [
      "Pipe Installation",
      "Blueprint Reading",
      "Safety Compliance",
    ],
    minimumEducation: "High School Diploma/GED",
    transportationRequired: "Driver's license & own vehicle required",
    description:
      "Join PipeDreams Co as a Plumber and work on diverse residential and commercial plumbing projects. You'll handle installations, repairs, and maintenance tasks. We're looking for someone with a journeyman license, strong technical skills, and excellent customer service abilities. This position offers competitive pay, benefits, and opportunities for advancement.",
    hasApplied: false,
  },
  {
    id: "8",
    title: "HVAC Installer",
    company: "CoolAir Systems",
    location: "Queens, NY",
    salary: "$52,000 - $72,000",
    posted: "5 days ago",
    status: "active",
    matchScore: 80,
    tradeSpecialty: "HVAC",
    employmentType: "Full-time",
    shiftPattern: "Day Shift",
    startDate: "2025-01-19",
    requiredCertifications: ["EPA 608 Certification"],
    prioritySkills: [
      "HVAC Installation",
      "Equipment Operation",
      "Safety Compliance",
    ],
    minimumEducation: "High School Diploma/GED",
    transportationRequired: "Driver's license & own vehicle required",
    description:
      "CoolAir Systems is hiring an HVAC Installer to join our installation team. You'll be responsible for installing new HVAC systems in residential and commercial properties. We need someone with EPA 608 certification and experience with various HVAC equipment. This role offers on-the-job training, competitive pay, and a supportive work environment.",
    hasApplied: false,
  },
];

