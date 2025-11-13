export interface Resource {
  id: string;
  title: string;
  description: string;
  buttonText: string;
}

export const resources: Resource[] = [
  {
    id: "1",
    title: "Trade Resume Template",
    description: "Professional resume template designed specifically for skilled trades",
    buttonText: "Download Template",
  },
  {
    id: "2",
    title: "Cover Letter Guide",
    description: "Learn how to write compelling cover letters for trade positions",
    buttonText: "Download Guide",
  },
  {
    id: "3",
    title: "Skills Checklist",
    description: "Comprehensive checklist of in-demand trade skills",
    buttonText: "Download Checklist",
  },
  {
    id: "4",
    title: "Salary Negotiation Guide",
    description: "Tips and strategies for negotiating better pay",
    buttonText: "Download Guide",
  },
  {
    id: "5",
    title: "Safety Certification Guide",
    description: "Overview of important safety certifications by trade",
    buttonText: "Download Guide",
  },
  {
    id: "6",
    title: "Career Roadmap",
    description: "Plan your career progression in the skilled trades",
    buttonText: "Download Roadmap",
  },
];

