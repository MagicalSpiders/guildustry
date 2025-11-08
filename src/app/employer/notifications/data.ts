export interface Notification {
  id: string;
  type: "application" | "interview" | "message" | "performance" | "update";
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
    views?: number;
    [key: string]: any;
  };
}

export const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "application",
    status: "unread",
    timestamp: "1 hour ago",
    title: "New Application Received",
    label: "New Application",
    labelColor: "blue",
    icon: "lucide:user-plus",
    primaryEntityName: "John Smith",
    description: "John Smith has applied for the Licensed Electrician position.",
    actionButtonText: "View Application",
    actionButtonLink: "/employer/applicants/1",
    metadata: {
      jobTitle: "Licensed Electrician",
      applicantId: "1",
    },
  },
  {
    id: "2",
    type: "interview",
    status: "unread",
    timestamp: "3 hours ago",
    title: "Interview Response",
    label: "Interview",
    labelColor: "grey",
    icon: "lucide:calendar",
    primaryEntityName: "Sarah Johnson",
    description: "Sarah Johnson has confirmed the interview scheduled for October 20, 2025.",
    actionButtonText: "View Details",
    actionButtonLink: "/employer/interviews/2",
    metadata: {
      interviewDate: "October 20, 2025",
      interviewId: "2",
    },
  },
  {
    id: "3",
    type: "message",
    status: "read",
    timestamp: "5 hours ago",
    title: "New Message",
    label: "Message",
    labelColor: "grey",
    icon: "lucide:message-square",
    primaryEntityName: "Mike Davis",
    description: "Mike Davis sent you a message regarding the HVAC Technician position.",
    actionButtonText: "Read Message",
    actionButtonLink: "/employer/messages/3",
    metadata: {
      jobTitle: "HVAC Technician",
      messageId: "3",
    },
  },
  {
    id: "4",
    type: "application",
    status: "read",
    timestamp: "1 day ago",
    title: "New Application Received",
    label: "New Application",
    labelColor: "blue",
    icon: "lucide:user-plus",
    primaryEntityName: "Emily Chen",
    description: "Emily Chen has applied for the Licensed Electrician position.",
    actionButtonText: "View Application",
    actionButtonLink: "/employer/applicants/4",
    metadata: {
      jobTitle: "Licensed Electrician",
      applicantId: "4",
    },
  },
  {
    id: "5",
    type: "performance",
    status: "read",
    timestamp: "2 days ago",
    title: "Job Posting Performance",
    label: "Update",
    labelColor: "orange",
    icon: "lucide:trending-up",
    primaryEntityName: "",
    description: "Your Licensed Electrician posting has received 15 new views this week.",
    actionButtonText: "View Analytics",
    actionButtonLink: "/employer/jobs/analytics",
    metadata: {
      jobTitle: "Licensed Electrician",
      views: 15,
    },
  },
  {
    id: "6",
    type: "interview",
    status: "read",
    timestamp: "3 days ago",
    title: "Interview Reminder",
    label: "Interview",
    labelColor: "grey",
    icon: "lucide:calendar-clock",
    primaryEntityName: "Michael Chen",
    description: "Interview with Michael Chen is scheduled for tomorrow at 10:00 AM.",
    actionButtonText: "View Details",
    actionButtonLink: "/employer/interviews/6",
    metadata: {
      interviewDate: "Tomorrow at 10:00 AM",
      interviewId: "6",
    },
  },
];

