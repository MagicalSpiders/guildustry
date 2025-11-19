"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import {
  getAllCandidates,
  getAllCompanies,
  deleteCandidate,
  deleteCompany,
} from "@/src/lib/adminFunctions";
import type { UserProfile } from "@/src/lib/database.types";
import type { Company } from "@/src/lib/database.types";

export default function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState<"candidates" | "employers">("candidates");
  const [candidates, setCandidates] = useState<UserProfile[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadData();
  }, [activeTab]);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      if (activeTab === "candidates") {
        const data = await getAllCandidates();
        setCandidates(data);
      } else {
        const data = await getAllCompanies();
        setCompanies(data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteCandidate(id: string) {
    if (!confirm("Are you sure you want to delete this candidate?")) return;
    try {
      await deleteCandidate(id);
      setCandidates(candidates.filter((c) => c.id !== id));
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  }

  async function handleDeleteCompany(id: string) {
    if (!confirm("Are you sure you want to delete this company?")) return;
    try {
      await deleteCompany(id);
      setCompanies(companies.filter((c) => c.id !== id));
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  }

  const filteredCandidates = candidates.filter(
    (c) =>
      c.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.primary_trade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCompanies = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contact_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.industry?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-title font-bold text-main-text">
          User Management
        </h1>
        <p className="mt-2 text-lg text-main-light-text">
          Manage candidate and employer accounts
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-subtle">
        <button
          onClick={() => setActiveTab("candidates")}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === "candidates"
              ? "border-b-2 border-main-accent text-main-accent"
              : "text-main-light-text hover:text-main-text"
          }`}
        >
          Candidates ({candidates.length})
        </button>
        <button
          onClick={() => setActiveTab("employers")}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === "employers"
              ? "border-b-2 border-main-accent text-main-accent"
              : "text-main-light-text hover:text-main-text"
          }`}
        >
          Employers ({companies.length})
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Icon
            icon="lucide:search"
            className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-main-light-text"
          />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-subtle bg-light-bg px-10 py-3 text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent"
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-500">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center text-main-light-text">Loading...</div>
      ) : activeTab === "candidates" ? (
        <div className="space-y-4">
          {filteredCandidates.length === 0 ? (
            <div className="rounded-lg border border-subtle bg-surface p-8 text-center text-main-light-text">
              No candidates found
            </div>
          ) : (
            filteredCandidates.map((candidate) => (
              <div
                key={candidate.id}
                className="rounded-lg border border-subtle bg-surface p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-main-text">
                      {candidate.fullname}
                    </h3>
                    <p className="mt-1 text-sm text-main-light-text">{candidate.email}</p>
                    <div className="mt-3 flex flex-wrap gap-4 text-sm">
                      <span className="text-main-light-text">
                        <span className="font-medium">Trade:</span> {candidate.primary_trade}
                      </span>
                      <span className="text-main-light-text">
                        <span className="font-medium">Experience:</span>{" "}
                        {candidate.years_of_experience} years
                      </span>
                      <span className="text-main-light-text">
                        <span className="font-medium">Location:</span> {candidate.city},{" "}
                        {candidate.state}
                      </span>
                      <span className="text-main-light-text">
                        <span className="font-medium">Phone:</span> {candidate.phone_number}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteCandidate(candidate.id)}
                    className="ml-4 rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500/20 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCompanies.length === 0 ? (
            <div className="rounded-lg border border-subtle bg-surface p-8 text-center text-main-light-text">
              No companies found
            </div>
          ) : (
            filteredCompanies.map((company) => (
              <div
                key={company.id}
                className="rounded-lg border border-subtle bg-surface p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-main-text">{company.name}</h3>
                    <p className="mt-1 text-sm text-main-light-text">
                      {company.contact_email || "No email"}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-4 text-sm">
                      {company.industry && (
                        <span className="text-main-light-text">
                          <span className="font-medium">Industry:</span> {company.industry}
                        </span>
                      )}
                      {company.headquarters && (
                        <span className="text-main-light-text">
                          <span className="font-medium">Location:</span> {company.headquarters}
                        </span>
                      )}
                      {company.website && (
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-main-accent hover:underline"
                        >
                          Website
                        </a>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteCompany(company.id)}
                    className="ml-4 rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500/20 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

