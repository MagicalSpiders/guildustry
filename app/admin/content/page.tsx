"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import {
  getAllTrades,
  getAllResources,
  getAllPartnerOrgs,
  insertTrade,
  updateTrade,
  deleteTrade,
  insertResource,
  updateResource,
  deleteResource,
  insertPartnerOrg,
  updatePartnerOrg,
  deletePartnerOrg,
} from "@/src/lib/contentFunctions";
import type {
  TradeContent,
  ResourceContent,
  PartnerOrg,
} from "@/src/lib/contentFunctions";

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<"trades" | "resources" | "partners">("trades");
  const [trades, setTrades] = useState<TradeContent[]>([]);
  const [resources, setResources] = useState<ResourceContent[]>([]);
  const [partnerOrgs, setPartnerOrgs] = useState<PartnerOrg[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      if (activeTab === "trades") {
        const data = await getAllTrades();
        setTrades(data);
      } else if (activeTab === "resources") {
        const data = await getAllResources();
        setResources(data);
      } else {
        const data = await getAllPartnerOrgs();
        setPartnerOrgs(data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteTrade(id: string) {
    if (!confirm("Are you sure you want to delete this trade?")) return;
    try {
      await deleteTrade(id);
      await loadData();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  }

  async function handleDeleteResource(id: string) {
    if (!confirm("Are you sure you want to delete this resource?")) return;
    try {
      await deleteResource(id);
      await loadData();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  }

  async function handleDeletePartnerOrg(id: string) {
    if (!confirm("Are you sure you want to delete this partner organization?")) return;
    try {
      await deletePartnerOrg(id);
      await loadData();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-title font-bold text-main-text">
            Content Management
          </h1>
          <p className="mt-2 text-lg text-main-light-text">
            Manage trade resources, content, and partner organizations
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-main-accent px-6 py-3 font-medium text-white hover:bg-main-accent/90 transition-colors"
        >
          <Icon icon="lucide:plus" className="inline h-5 w-5 mr-2" />
          Add New
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-subtle">
        <button
          onClick={() => setActiveTab("trades")}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === "trades"
              ? "border-b-2 border-main-accent text-main-accent"
              : "text-main-light-text hover:text-main-text"
          }`}
        >
          Trades ({trades.length})
        </button>
        <button
          onClick={() => setActiveTab("resources")}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === "resources"
              ? "border-b-2 border-main-accent text-main-accent"
              : "text-main-light-text hover:text-main-text"
          }`}
        >
          Resources ({resources.length})
        </button>
        <button
          onClick={() => setActiveTab("partners")}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === "partners"
              ? "border-b-2 border-main-accent text-main-accent"
              : "text-main-light-text hover:text-main-text"
          }`}
        >
          Partner Orgs ({partnerOrgs.length})
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-500">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center text-main-light-text">Loading...</div>
      ) : (
        <>
          {activeTab === "trades" && (
            <div className="space-y-4">
              {trades.length === 0 ? (
                <div className="rounded-lg border border-subtle bg-surface p-8 text-center text-main-light-text">
                  No trades found. Click "Add New" to create one.
                </div>
              ) : (
                trades.map((trade) => (
                  <div
                    key={trade.id}
                    className="rounded-lg border border-subtle bg-surface p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-main-text">{trade.title}</h3>
                        <p className="mt-2 text-sm text-main-light-text">{trade.overview}</p>
                        <div className="mt-3 text-sm text-main-light-text">
                          <span className="font-medium">Salary:</span> {trade.salary}
                        </div>
                      </div>
                      <div className="ml-4 flex gap-2">
                        <button
                          onClick={() => setEditingItem(trade.id)}
                          className="rounded-lg border border-subtle bg-light-bg px-4 py-2 text-sm font-medium text-main-text hover:bg-surface transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTrade(trade.id)}
                          className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500/20 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "resources" && (
            <div className="space-y-4">
              {resources.length === 0 ? (
                <div className="rounded-lg border border-subtle bg-surface p-8 text-center text-main-light-text">
                  No resources found. Click "Add New" to create one.
                </div>
              ) : (
                resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="rounded-lg border border-subtle bg-surface p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-main-text">
                          {resource.title}
                        </h3>
                        <p className="mt-2 text-sm text-main-light-text">
                          {resource.description}
                        </p>
                        {resource.url && (
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-block text-sm text-main-accent hover:underline"
                          >
                            {resource.url}
                          </a>
                        )}
                      </div>
                      <div className="ml-4 flex gap-2">
                        <button
                          onClick={() => setEditingItem(resource.id)}
                          className="rounded-lg border border-subtle bg-light-bg px-4 py-2 text-sm font-medium text-main-text hover:bg-surface transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteResource(resource.id)}
                          className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500/20 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "partners" && (
            <div className="space-y-4">
              {partnerOrgs.length === 0 ? (
                <div className="rounded-lg border border-subtle bg-surface p-8 text-center text-main-light-text">
                  No partner organizations found. Click "Add New" to create one.
                </div>
              ) : (
                partnerOrgs.map((org) => (
                  <div
                    key={org.id}
                    className="rounded-lg border border-subtle bg-surface p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-main-text">{org.name}</h3>
                        <p className="mt-2 text-sm text-main-light-text">{org.description}</p>
                        {org.website_url && (
                          <a
                            href={org.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-block text-sm text-main-accent hover:underline"
                          >
                            {org.website_url}
                          </a>
                        )}
                      </div>
                      <div className="ml-4 flex gap-2">
                        <button
                          onClick={() => setEditingItem(org.id)}
                          className="rounded-lg border border-subtle bg-light-bg px-4 py-2 text-sm font-medium text-main-text hover:bg-surface transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePartnerOrg(org.id)}
                          className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500/20 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}

      {/* Form Modal - Simplified for now, can be expanded */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl rounded-lg border border-subtle bg-surface p-6">
            <h2 className="text-xl font-title font-semibold text-main-text mb-4">
              Add New {activeTab === "trades" ? "Trade" : activeTab === "resources" ? "Resource" : "Partner Org"}
            </h2>
            <p className="text-main-light-text mb-4">
              Form implementation needed. This is a placeholder for the add/edit form.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 rounded-lg border border-subtle bg-light-bg px-4 py-2 font-medium text-main-text hover:bg-surface transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

