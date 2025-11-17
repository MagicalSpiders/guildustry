export type Application = {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  applied: string; // ISO date
  status: "pending" | "reviewed" | "accepted" | "rejected" | "withdrawn" | null;
  category: "all" | "active" | "saved" | "interviews" | "rejected";
  summary?: string;
  interview?: {
    id: string;
    date: string;
    type: string;
    location?: string;
    notes?: string;
  };
};

export const data: Application[] = [
  {
    id: "1",
    title: "Licensed Electrician",
    company: "ABC Construction",
    location: "New York, NY",
    salary: "$65,000 - $85,000",
    applied: "2025-10-12",
    status: "reviewed",
    category: "interviews",
    summary: "Seeking experienced electrician for commercial projects",
    interview: {
      id: "1",
      date: "2025-10-20",
      type: "In-person",
      location: "New York, NY",
    },
  },
  {
    id: "2",
    title: "Certified Welder",
    company: "Metro Welding Co",
    location: "Manhattan, NY",
    salary: "$55,000 - $75,000",
    applied: "2025-10-05",
    status: "rejected",
    category: "rejected",
    summary: "Structural welding for commercial construction",
  },
  {
    id: "3",
    title: "HVAC Technician",
    company: "TradePro Services",
    location: "Brooklyn, NY",
    salary: "$58,000 - $72,000",
    applied: "2025-10-08",
    status: "reviewed",
    category: "active",
    summary: "Install and service HVAC systems",
  },
  {
    id: "4",
    title: "Apprentice Plumber",
    company: "BuildCo Inc",
    location: "Queens, NY",
    salary: "$40,000 - $55,000",
    applied: "2025-10-15",
    status: "pending",
    category: "saved",
    summary: "Assist with residential plumbing projects",
  },
];
