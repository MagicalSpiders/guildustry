"use client";

import { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/src/components/Button";
import { NotificationModal, NotificationItemData, NotificationKind } from "./NotificationModal";

// Types imported from NotificationModal

const seedNotifications: NotificationItemData[] = [
  {
    id: "n1",
    kind: "interview",
    company: "ABC Construction",
    title: "Interview Scheduled",
    body:
      "Your interview with ABC Construction for the Electrician position has been scheduled for October 18, 2025 at 10:00 AM.",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: "n2",
    kind: "message",
    company: "BuildCo Inc",
    title: "New Message from Employer",
    body:
      "BuildCo Inc has sent you a message regarding your application for the Master Plumber position.",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: "n3",
    kind: "status",
    company: "TradePro Services",
    title: "Application Status Updated",
    body:
      "Your application for HVAC Technician at TradePro Services is now under review.",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: "n4",
    kind: "status",
    company: "Metro Welding Co",
    title: "Application Rejected",
    body:
      "Unfortunately, your application for Certified Welder at Metro Welding Co was not successful at this time.",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: "n5",
    kind: "reminder",
    company: "ABC Construction",
    title: "Interview Reminder",
    body:
      "You have an interview tomorrow at 10:00 AM with ABC Construction. Don't forget to prepare!",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: "n6",
    kind: "message",
    company: "BuildCo Inc",
    title: "Profile Viewed",
    body: "BuildCo Inc viewed your profile.",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
];

function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / (60 * 1000));
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-subtle bg-surface px-6 py-5 shadow-elevated">
      <div className="text-3xl font-title font-bold">{value}</div>
      <div className="mt-1 text-sm text-main-light-text">{label}</div>
    </div>
  );
}

type TabKey = "all" | "unread" | "interviews" | "messages";

export function NotificationsClient() {
  const [tab, setTab] = useState<TabKey>("all");
  const [items, setItems] = useState<NotificationItemData[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<NotificationItemData | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("guildustry_notifications");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
        return;
      } catch {}
    }
    setItems(seedNotifications);
  }, []);

  useEffect(() => {
    if (items.length) localStorage.setItem("guildustry_notifications", JSON.stringify(items));
  }, [items]);

  const stats = useMemo(() => {
    const total = items.length;
    const unread = items.filter((n) => !n.read).length;
    const interviews = items.filter((n) => n.kind === "interview").length;
    const messages = items.filter((n) => n.kind === "message").length;
    return { total, unread, interviews, messages };
  }, [items]);

  const filtered = useMemo(() => {
    switch (tab) {
      case "unread":
        return items.filter((n) => !n.read);
      case "interviews":
        return items.filter((n) => n.kind === "interview");
      case "messages":
        return items.filter((n) => n.kind === "message");
      default:
        return items;
    }
  }, [items, tab]);

  const markAllAsRead = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  const markAsRead = (id: string) => setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const removeItem = (id: string) => setItems((prev) => prev.filter((n) => n.id !== id));
  const openModal = (n: NotificationItemData) => {
    setActive(n);
    setOpen(true);
    if (!n.read) markAsRead(n.id);
  };
  const closeModal = () => {
    setOpen(false);
    setActive(null);
  };

  return (
    <div className="min-h-screen bg-main-bg text-main-text">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-title font-bold">Notifications</h1>
            <p className="mt-2 text-main-light-text">Stay updated with your job search progress</p>
          </div>
          <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={stats.unread === 0}>
            <Icon icon="lucide:check" className="w-4 h-4 mr-2" /> Mark All as Read ({stats.unread})
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total" value={stats.total} />
          <StatCard label="Unread" value={stats.unread} />
          <StatCard label="Interviews" value={stats.interviews} />
          <StatCard label="Messages" value={stats.messages} />
        </div>

        {/* Tabs */}
        <div className="mb-4 flex items-center gap-2">
          {([
            ["all", `All (${stats.total})`],
            ["unread", `Unread (${stats.unread})`],
            ["interviews", `Interviews (${stats.interviews})`],
            ["messages", `Messages (${stats.messages})`],
          ] as [TabKey, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                tab === key
                  ? "border-main-accent text-main-accent"
                  : "border-subtle text-main-light-text hover:text-main-text"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-4">
          {filtered.map((n) => (
            <div key={n.id} className={`rounded-2xl border ${n.read ? "border-subtle" : "border-main-accent"} bg-surface shadow-elevated`}>
              <div className="flex items-start justify-between gap-4 px-5 sm:px-6 py-5">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="inline-flex items-center justify-center rounded-full bg-main-accent/10 text-main-accent p-3">
                      {n.kind === "interview" && <Icon icon="lucide:calendar" className="w-5 h-5" />}
                      {n.kind === "message" && <Icon icon="lucide:message-circle" className="w-5 h-5" />}
                      {n.kind === "status" && <Icon icon="lucide:building-2" className="w-5 h-5" />}
                      {n.kind === "reminder" && <Icon icon="lucide:bell" className="w-5 h-5" />}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-title font-bold">{n.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${
                        n.kind === "interview"
                          ? "border-main-accent text-main-accent"
                          : "border-subtle text-main-light-text"
                      }`}>
                        {n.kind.charAt(0).toUpperCase() + n.kind.slice(1)}
                      </span>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-main-accent" />}
                    </div>
                    <div className="text-sm text-main-light-text">{n.company}</div>
                    <p className="mt-2 text-sm text-main-text">{n.body}</p>
                    <div className="mt-4 flex items-center gap-3">
                      <Button size="sm" variant="accent" onClick={() => openModal(n)}>
                        {n.kind === "message" ? "Read Message" : "View Details"}
                      </Button>
                      <button
                        className="text-sm inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-subtle bg-surface hover:border-main-accent hover:text-main-accent transition-colors"
                        onClick={() => markAsRead(n.id)}
                      >
                        <Icon icon="lucide:check" className="w-4 h-4" /> Mark as Read
                      </button>
                      <button
                        className="text-sm inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-subtle bg-surface hover:border-main-accent hover:text-main-accent transition-colors"
                        onClick={() => removeItem(n.id)}
                      >
                        <Icon icon="lucide:trash-2" className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-main-light-text whitespace-nowrap mt-1">{formatRelativeTime(n.createdAt)}</div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="rounded-2xl border border-subtle bg-surface p-6 text-center text-main-light-text">
              No notifications.
            </div>
          )}
        </div>
        <NotificationModal
          open={open}
          item={active}
          onClose={closeModal}
          onMarkRead={markAsRead}
          onDelete={(id) => {
            removeItem(id);
            closeModal();
          }}
        />
      </div>
    </div>
  );
}


