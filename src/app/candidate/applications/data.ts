export type Application = {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  applied: string; // ISO date
  status: "Interview Scheduled" | "Under Review" | "Pending" | "Rejected";
  category: "all" | "active" | "saved" | "interviews" | "rejected";
  summary?: string;
};

export const data: Application[] = [
  {
    id: "1",
    title: "Licensed Electrician",
    company: "ABC Construction",
    location: "New York, NY",
    salary: "$65,000 - $85,000",
    applied: "2025-10-12",
    status: "Interview Scheduled",
    category: "interviews",
    summary: "Seeking experienced electrician for commercial projects",
  },
  {
    id: "2",
    title: "Certified Welder",
    company: "Metro Welding Co",
    location: "Manhattan, NY",
    salary: "$55,000 - $75,000",
    applied: "2025-10-05",
    status: "Rejected",
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
    status: "Under Review",
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
    status: "Pending",
    category: "saved",
    summary: "Assist with residential plumbing projects",
  },
];


