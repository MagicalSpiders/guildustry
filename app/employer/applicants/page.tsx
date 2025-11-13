"use client";

import { useState, useMemo } from "react";
import { ApplicantsHeader } from "@/app/employer/applicants/components/ApplicantsHeader";
import { ApplicantsStats } from "@/app/employer/applicants/components/ApplicantsStats";
import { ApplicantsSearchAndFilters } from "@/app/employer/applicants/components/ApplicantsSearchAndFilters";
import { ApplicantsTabs } from "@/app/employer/applicants/components/ApplicantsTabs";
import { ApplicantsList } from "@/app/employer/applicants/components/ApplicantsList";
import { Applicant } from "@/app/employer/applicants/components/ApplicantCard";

// Mock data - replace with API call
const mockApplicants: Applicant[] = [
  {
    id: "1",
    name: "John Smith",
    status: "interviewScheduled",
    jobTitle: "Licensed Electrician",
    location: "New York, NY",
    experience: "5 years",
    rating: 4.8,
    appliedDate: "2025-10-14",
    education: "Technical School",
    employmentType: "Full-time",
    shiftPattern: "Day Shift",
    transportation: "Has License & Vehicle",
    skills: [
      { name: "Residential Wiring", matched: true },
      { name: "Commercial Projects", matched: true },
      { name: "OSHA Certified", matched: false },
      { name: "Panel Installation", matched: false },
    ],
    certifications: [
      { name: "Journeyman Electrician License", matched: true },
      { name: "OSHA 30-Hour Safety", matched: true },
      { name: "CPR/First Aid", matched: false },
    ],
    assessment: {
      overall: 92,
      technicalAptitude: 95,
      problemSolving: 90,
      safetyAwareness: 88,
      adaptability: 92,
    },
  },
  {
    id: "2",
    name: "Sarah Johnson",
    status: "new",
    jobTitle: "Master Plumber",
    location: "Brooklyn, NY",
    experience: "3 years",
    rating: 4.5,
    appliedDate: "2025-10-15",
    education: "Associate Degree",
    employmentType: "Full-time",
    shiftPattern: "Day Shift",
    transportation: "Has License & Vehicle",
    skills: [
      { name: "Pipe Installation", matched: true },
      { name: "Blueprint Reading", matched: true },
      { name: "Welding", matched: true },
      { name: "HVAC Installation", matched: false },
    ],
    certifications: [
      { name: "Master Plumber License", matched: true },
      { name: "OSHA 10-Hour Safety", matched: true },
      { name: "CPR/First Aid", matched: true },
    ],
    assessment: {
      overall: 88,
      technicalAptitude: 85,
      problemSolving: 92,
      safetyAwareness: 90,
      adaptability: 85,
    },
  },
  {
    id: "3",
    name: "Michael Chen",
    status: "underReview",
    jobTitle: "Licensed Electrician",
    location: "Manhattan, NY",
    experience: "7 years",
    rating: 4.9,
    appliedDate: "2025-10-13",
    education: "Bachelor's Degree",
    employmentType: "Full-time",
    shiftPattern: "Flexible",
    transportation: "Has License & Vehicle",
    skills: [
      { name: "Residential Wiring", matched: true },
      { name: "Commercial Projects", matched: true },
      { name: "OSHA Certified", matched: true },
      { name: "Panel Installation", matched: true },
    ],
    certifications: [
      { name: "Master Electrician License", matched: true },
      { name: "OSHA 30-Hour Safety", matched: true },
      { name: "CPR/First Aid", matched: true },
    ],
    assessment: {
      overall: 96,
      technicalAptitude: 98,
      problemSolving: 95,
      safetyAwareness: 96,
      adaptability: 94,
    },
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    status: "shortlisted",
    jobTitle: "HVAC Technician",
    location: "Queens, NY",
    experience: "4 years",
    rating: 4.6,
    appliedDate: "2025-10-12",
    education: "Trade School Certificate",
    employmentType: "Full-time",
    shiftPattern: "Day Shift",
    transportation: "Has License & Vehicle",
    skills: [
      { name: "HVAC Installation", matched: true },
      { name: "HVAC Repair", matched: true },
      { name: "Circuit Installation", matched: true },
      { name: "Safety Compliance", matched: true },
    ],
    certifications: [
      { name: "EPA 608 Certification", matched: true },
      { name: "OSHA 10-Hour Safety", matched: true },
      { name: "NATE Certification", matched: true },
    ],
    assessment: {
      overall: 90,
      technicalAptitude: 92,
      problemSolving: 88,
      safetyAwareness: 91,
      adaptability: 89,
    },
  },
  {
    id: "5",
    name: "Robert Martinez",
    status: "rejected",
    jobTitle: "Licensed Electrician",
    location: "New York, NY",
    experience: "2 years",
    rating: 3.8,
    appliedDate: "2025-10-11",
    education: "High School",
    employmentType: "Part-time",
    shiftPattern: "Night Shift",
    transportation: "No License/Vehicle",
    skills: [
      { name: "Residential Wiring", matched: true },
      { name: "Commercial Projects", matched: false },
      { name: "OSHA Certified", matched: false },
      { name: "Panel Installation", matched: false },
    ],
    certifications: [
      { name: "Journeyman Electrician License", matched: true },
      { name: "OSHA 10-Hour Safety", matched: false },
      { name: "CPR/First Aid", matched: false },
    ],
  },
];

export default function EmployerApplicantsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState("All Jobs");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [activeTab, setActiveTab] = useState("all");

  // Get unique jobs for filter
  const availableJobs = useMemo(() => {
    const jobs = new Set(mockApplicants.map((app) => app.jobTitle));
    return ["All Jobs", ...Array.from(jobs)];
  }, []);

  // Filter applicants based on search, filters, and tab
  const filteredApplicants = useMemo(() => {
    let filtered = [...mockApplicants];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.name.toLowerCase().includes(query) ||
          app.jobTitle.toLowerCase().includes(query)
      );
    }

    // Job filter
    if (selectedJob !== "All Jobs") {
      filtered = filtered.filter((app) => app.jobTitle === selectedJob);
    }

    // Status filter
    if (selectedStatus !== "All Status") {
      const statusMap: Record<string, Applicant["status"]> = {
        "New": "new",
        "Under Review": "underReview",
        "Shortlisted": "shortlisted",
        "Interview Scheduled": "interviewScheduled",
        "Rejected": "rejected",
      };
      const status = statusMap[selectedStatus];
      if (status) {
        filtered = filtered.filter((app) => app.status === status);
      }
    }

    // Tab filter
    switch (activeTab) {
      case "new":
        filtered = filtered.filter((app) => app.status === "new");
        break;
      case "underReview":
        filtered = filtered.filter((app) => app.status === "underReview");
        break;
      case "shortlisted":
        filtered = filtered.filter((app) => app.status === "shortlisted");
        break;
      case "interviews":
        filtered = filtered.filter((app) => app.status === "interviewScheduled");
        break;
      default:
        // "all" - no filter
        break;
    }

    return filtered;
  }, [searchQuery, selectedJob, selectedStatus, activeTab]);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: mockApplicants.length,
      new: mockApplicants.filter((app) => app.status === "new").length,
      interviews: mockApplicants.filter((app) => app.status === "interviewScheduled").length,
      shortlisted: mockApplicants.filter((app) => app.status === "shortlisted").length,
    };
  }, []);

  // Calculate tab counts
  const tabCounts = useMemo(() => {
    return {
      all: mockApplicants.length,
      new: mockApplicants.filter((app) => app.status === "new").length,
      underReview: mockApplicants.filter((app) => app.status === "underReview").length,
      shortlisted: mockApplicants.filter((app) => app.status === "shortlisted").length,
      interviews: mockApplicants.filter((app) => app.status === "interviewScheduled").length,
    };
  }, []);

  return (
    <div className="min-h-screen bg-main-bg text-main-text">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
        <ApplicantsHeader />
        <ApplicantsStats
          total={stats.total}
          new={stats.new}
          interviews={stats.interviews}
          shortlisted={stats.shortlisted}
        />

        <ApplicantsSearchAndFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedJob={selectedJob}
          onJobChange={setSelectedJob}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          jobs={availableJobs}
        />

        <ApplicantsTabs activeTab={activeTab} onTabChange={setActiveTab} counts={tabCounts} />

        <ApplicantsList applicants={filteredApplicants} />
      </div>
    </div>
  );
}

