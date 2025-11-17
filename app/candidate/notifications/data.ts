// UI notification types mapped from database notification types
export type NotificationUIType = "application" | "interview" | "job" | "system" | "news";

export interface Notification {
  id: string;
  type: NotificationUIType;
  status: "read" | "unread";
  timestamp: string;
  title: string;
  label: string;
  labelColor: "blue" | "grey" | "orange" | "green";
  icon: string;
  primaryEntityName: string;
  description: string;
  actionButtonText: string;
  actionButtonLink?: string;
  metadata?: {
    jobTitle?: string;
    interviewDate?: string;
    companyName?: string;
    [key: string]: any;
  };
}

export const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "application",
    status: "unread",
    timestamp: "2 hours ago",
    title: "Application Status Update",
    label: "Application Update",
    labelColor: "blue",
    icon: "lucide:file-check",
    primaryEntityName: "ABC Construction",
    description:
      "ABC Construction has reviewed your application for the Licensed Electrician position.",
    actionButtonText: "View Application",
    actionButtonLink: "/candidate/applications/1",
    metadata: {
      jobTitle: "Licensed Electrician",
      companyName: "ABC Construction",
    },
  },
  {
    id: "2",
    type: "interview",
    status: "unread",
    timestamp: "1 day ago",
    title: "Interview Scheduled",
    label: "Interview",
    labelColor: "green",
    icon: "lucide:calendar",
    primaryEntityName: "BuildCo Inc",
    description:
      "You have an interview scheduled with BuildCo Inc for the Plumber position on November 20, 2025 at 2:00 PM.",
    actionButtonText: "View Details",
    actionButtonLink: "/candidate/interviews/2",
    metadata: {
      jobTitle: "Plumber",
      companyName: "BuildCo Inc",
      interviewDate: "November 20, 2025 at 2:00 PM",
    },
  },
  {
    id: "3",
    type: "job",
    status: "unread",
    timestamp: "3 days ago",
    title: "New Job Match",
    label: "Job Match",
    labelColor: "orange",
    icon: "lucide:briefcase",
    primaryEntityName: "TradePro Services",
    description:
      "A new job matching your skills has been posted: HVAC Technician at TradePro Services.",
    actionButtonText: "View Job",
    actionButtonLink: "/candidate/jobs?job=3",
    metadata: {
      jobTitle: "HVAC Technician",
      companyName: "TradePro Services",
    },
  },
  {
    id: "4",
    type: "application",
    status: "read",
    timestamp: "1 week ago",
    title: "Application Received",
    label: "Application Sent",
    labelColor: "grey",
    icon: "lucide:send",
    primaryEntityName: "ABC Construction",
    description:
      "Your application for the Licensed Electrician position has been received and is under review.",
    actionButtonText: "View Application",
    actionButtonLink: "/candidate/applications/4",
    metadata: {
      jobTitle: "Licensed Electrician",
      companyName: "ABC Construction",
    },
  },
  {
    id: "5",
    type: "system",
    status: "read",
    timestamp: "2 weeks ago",
    title: "Profile Optimization",
    label: "System",
    labelColor: "grey",
    icon: "lucide:settings",
    primaryEntityName: "Guildustry",
    description:
      "Your profile has been viewed 25 times this week. Consider updating your skills section.",
    actionButtonText: "Update Profile",
    actionButtonLink: "/candidate/profile/edit",
    metadata: {},
  },
  {
    id: "6",
    type: "interview",
    status: "read",
    timestamp: "3 weeks ago",
    title: "Interview Reminder",
    label: "Interview",
    labelColor: "grey",
    icon: "lucide:clock",
    primaryEntityName: "BuildCo Inc",
    description:
      "Reminder: Your interview with BuildCo Inc is tomorrow at 10:00 AM. Prepare your portfolio!",
    actionButtonText: "View Details",
    actionButtonLink: "/candidate/interviews/6",
    metadata: {
      jobTitle: "Plumber",
      companyName: "BuildCo Inc",
      interviewDate: "Tomorrow at 10:00 AM",
    },
  },
];
