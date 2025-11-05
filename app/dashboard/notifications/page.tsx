import type { Metadata } from "next";
import { NotificationsClient } from "./components/NotificationsClient";

export const metadata: Metadata = {
  title: "Notifications - Guildustry",
  description: "View your notifications",
};

export default function NotificationsPage() {
  return <NotificationsClient />;
}

