"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import {
  getAllJobs,
  approveJob,
  flagJob,
  closeJob,
} from "@/src/lib/adminFunctions";
import type { Job } from "@/src/lib/database.types";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filter, setFilter] = useState<string | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadJobs();
  }, [filter]);

  async function loadJobs() {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllJobs(filter);
      setJobs(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(jobId: string) {
    try {
      await approveJob(jobId);
      await loadJobs();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  }

  async function handleFlag(jobId: string) {
    try {
      await flagJob(jobId);
      await loadJobs();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  }

  async function handleClose(jobId: string) {
    try {
      await closeJob(jobId);
      await loadJobs();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  }

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.trade_specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingCount = jobs.filter((j) => j.status === null).length;
  const openCount = jobs.filter((j) => j.status === "open").length;
  const flaggedCount = jobs.filter((j) => j.status === "flagged").length;
  const closedCount = jobs.filter((j) => j.status === "closed").length;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-title font-bold text-main-text">
          Job Management
        </h1>
        <p className="mt-2 text-lg text-main-light-text">
          Review, approve, and manage job postings
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-lg border border-subtle bg-surface p-4">
          <p className="text-sm text-main-light-text">Pending</p>
          <p className="mt-1 text-2xl font-bold text-main-text">{pendingCount}</p>
        </div>
        <div className="rounded-lg border border-subtle bg-surface p-4">
          <p className="text-sm text-main-light-text">Open</p>
          <p className="mt-1 text-2xl font-bold text-main-text">{openCount}</p>
        </div>
        <div className="rounded-lg border border-subtle bg-surface p-4">
          <p className="text-sm text-main-light-text">Flagged</p>
          <p className="mt-1 text-2xl font-bold text-main-text">{flaggedCount}</p>
        </div>
        <div className="rounded-lg border border-subtle bg-surface p-4">
          <p className="text-sm text-main-light-text">Closed</p>
          <p className="mt-1 text-2xl font-bold text-main-text">{closedCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter(undefined)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            filter === undefined
              ? "bg-main-accent text-white"
              : "border border-subtle bg-surface text-main-text hover:bg-light-bg"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter(null)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            filter === null
              ? "bg-main-accent text-white"
              : "border border-subtle bg-surface text-main-text hover:bg-light-bg"
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter("open")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            filter === "open"
              ? "bg-main-accent text-white"
              : "border border-subtle bg-surface text-main-text hover:bg-light-bg"
          }`}
        >
          Open
        </button>
        <button
          onClick={() => setFilter("flagged")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            filter === "flagged"
              ? "bg-main-accent text-white"
              : "border border-subtle bg-surface text-main-text hover:bg-light-bg"
          }`}
        >
          Flagged
        </button>
        <button
          onClick={() => setFilter("closed")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            filter === "closed"
              ? "bg-main-accent text-white"
              : "border border-subtle bg-surface text-main-text hover:bg-light-bg"
          }`}
        >
          Closed
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
            placeholder="Search jobs..."
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
      ) : (
        <div className="space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="rounded-lg border border-subtle bg-surface p-8 text-center text-main-light-text">
              No jobs found
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className="rounded-lg border border-subtle bg-surface p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-main-text">{job.title}</h3>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          job.status === null
                            ? "bg-yellow-500/10 text-yellow-500"
                            : job.status === "open"
                            ? "bg-green-500/10 text-green-500"
                            : job.status === "flagged"
                            ? "bg-red-500/10 text-red-500"
                            : "bg-gray-500/10 text-gray-500"
                        }`}
                      >
                        {job.status || "Pending"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-main-light-text">{job.description}</p>
                    <div className="mt-3 flex flex-wrap gap-4 text-sm">
                      <span className="text-main-light-text">
                        <span className="font-medium">Location:</span> {job.location}
                      </span>
                      <span className="text-main-light-text">
                        <span className="font-medium">Trade:</span> {job.trade_specialty}
                      </span>
                      <span className="text-main-light-text">
                        <span className="font-medium">Salary:</span> ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}
                      </span>
                      <span className="text-main-light-text">
                        <span className="font-medium">Type:</span> {job.job_type}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 flex flex-col gap-2">
                    {job.status === null && (
                      <button
                        onClick={() => handleApprove(job.id)}
                        className="rounded-lg bg-green-500/10 px-4 py-2 text-sm font-medium text-green-500 hover:bg-green-500/20 transition-colors"
                      >
                        Approve
                      </button>
                    )}
                    {job.status !== "flagged" && (
                      <button
                        onClick={() => handleFlag(job.id)}
                        className="rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500/20 transition-colors"
                      >
                        Flag
                      </button>
                    )}
                    {job.status === "open" && (
                      <button
                        onClick={() => handleClose(job.id)}
                        className="rounded-lg bg-gray-500/10 px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-500/20 transition-colors"
                      >
                        Close
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

