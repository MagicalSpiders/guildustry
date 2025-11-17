export interface CompanyProfile {
  id: string;
  companyName: string;
  industry: string;
  founded: string;
  headquarters: string;
  website: string;
  description: string;
  size: string;
  logo_url: string | null;
  members_count: number;
  specialties: string[];
  values: string[];
  benefits: string[];
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  stats: {
    totalEmployees: number;
    activeJobs: number;
    totalHires: number;
    yearsInBusiness: number;
  };
  socialMedia: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

export const mockCompanyData: CompanyProfile = {
  id: "1",
  companyName: "ABC Construction",
  industry: "Construction & Skilled Trades",
  founded: "2010",
  headquarters: "New York, NY",
  website: "www.abcconstruction.com",
  description:
    "ABC Construction is a leading provider of commercial and residential construction services, specializing in electrical, plumbing, HVAC, and general contracting. With over a decade of experience, we've built a reputation for quality craftsmanship, safety excellence, and innovative solutions. Our team of skilled trades professionals is committed to delivering exceptional results on every project.",
  size: "50-200 employees",
  logo_url: "https://example.com/logo.png",
  members_count: 145,
  specialties: [
    "Commercial Construction",
    "Electrical Systems",
    "Plumbing & HVAC",
    "Project Management",
    "Safety Compliance",
  ],
  values: [
    "Safety First",
    "Quality Craftsmanship",
    "Innovation",
    "Team Collaboration",
    "Customer Excellence",
  ],
  benefits: [
    "Competitive Salary & Benefits",
    "Health, Dental & Vision Insurance",
    "401(k) with Company Match",
    "Paid Time Off & Holidays",
    "Professional Development Programs",
    "Safety Training & Certifications",
    "Tool & Equipment Allowance",
    "Overtime Opportunities",
  ],
  contact: {
    email: "careers@abcconstruction.com",
    phone: "(555) 123-4567",
    address: "123 Construction Way, New York, NY 10001",
  },
  stats: {
    totalEmployees: 145,
    activeJobs: 8,
    totalHires: 42,
    yearsInBusiness: 14,
  },
  socialMedia: {
    linkedin: "linkedin.com/company/abc-construction",
    twitter: "@ABCConstruction",
    facebook: "facebook.com/abcconstruction",
  },
};

