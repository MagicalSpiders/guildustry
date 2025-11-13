"use client";

import { useState, useMemo } from "react";
import { ResourcesHeader } from "@/app/candidate/resources/components/ResourcesHeader";
import { ResourcesTabs } from "@/app/candidate/resources/components/ResourcesTabs";
import { Trade101Tab } from "@/app/candidate/resources/components/Trade101Tab";
import { CertificationsTab } from "@/app/candidate/resources/components/CertificationsTab";
import { ResourcesTab } from "@/app/candidate/resources/components/ResourcesTab";
import { InterviewPrepTab } from "@/app/candidate/resources/components/InterviewPrepTab";
import { trades } from "@/app/candidate/resources/data/trades";
import { certifications } from "@/app/candidate/resources/data/certifications";
import { resources } from "@/app/candidate/resources/data/resources";
import { interviewPrep } from "@/app/candidate/resources/data/interviewPrep";

export default function CandidateResourcesPage() {
  const [activeTab, setActiveTab] = useState("trade101");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter content based on search query
  const filteredTrades = useMemo(() => {
    if (!searchQuery) return trades;
    const query = searchQuery.toLowerCase();
    return trades.filter(
      (trade) =>
        trade.title.toLowerCase().includes(query) ||
        trade.overview.toLowerCase().includes(query) ||
        trade.applications.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const filteredCertifications = useMemo(() => {
    if (!searchQuery) return certifications;
    const query = searchQuery.toLowerCase();
    return certifications.filter(
      (cert) =>
        cert.title.toLowerCase().includes(query) ||
        cert.programs.some((p) => p.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  const filteredResources = useMemo(() => {
    if (!searchQuery) return resources;
    const query = searchQuery.toLowerCase();
    return resources.filter(
      (resource) =>
        resource.title.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const filteredInterviewPrep = useMemo(() => {
    if (!searchQuery) return interviewPrep;
    const query = searchQuery.toLowerCase();
    return interviewPrep.filter(
      (prep) =>
        prep.title.toLowerCase().includes(query) ||
        prep.description.toLowerCase().includes(query) ||
        prep.topics.some((t) => t.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-main-bg text-main-text">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
        <ResourcesHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <ResourcesTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "trade101" && <Trade101Tab trades={filteredTrades} />}
        {activeTab === "certifications" && (
          <CertificationsTab certifications={filteredCertifications} />
        )}
        {activeTab === "resources" && (
          <ResourcesTab resources={filteredResources} />
        )}
        {activeTab === "interviewPrep" && (
          <InterviewPrepTab interviewPrep={filteredInterviewPrep} />
        )}
      </div>
    </div>
  );
}

