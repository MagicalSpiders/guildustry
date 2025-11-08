export interface InterviewPrep {
  id: string;
  title: string;
  icon: string;
  description: string;
  topics: string[];
  buttonText: string;
}

export const interviewPrep: InterviewPrep[] = [
  {
    id: "1",
    title: "Common Interview Questions",
    icon: "lucide:message-circle",
    description:
      "50+ common questions asked in skilled trade interviews with sample answers",
    topics: [
      "Technical skills and experience",
      "Safety practices and protocols",
      "Problem-solving scenarios",
      "Teamwork and communication",
      "Career goals and motivation",
    ],
    buttonText: "View Questions",
  },
  {
    id: "2",
    title: "Video Interview Tips",
    icon: "lucide:video",
    description:
      "Master virtual interviews with professional tips and best practices",
    topics: [
      "Setting up your space and equipment",
      "Dressing professionally",
      "Body language and eye contact",
      "Handling technical issues",
      "Following up after the interview",
    ],
    buttonText: "View Tips",
  },
  {
    id: "3",
    title: "Questions to Ask Employers",
    icon: "lucide:help-circle",
    description:
      "Impress interviewers by asking thoughtful, informed questions",
    topics: [
      "Company culture and values",
      "Growth and advancement opportunities",
      "Training and development programs",
      "Team structure and management",
      "Benefits and compensation",
    ],
    buttonText: "View Questions",
  },
  {
    id: "4",
    title: "STAR Method Guide",
    icon: "lucide:file-text",
    description: "Structure your answers using the proven STAR technique",
    topics: [
      "Situation: Set the context",
      "Task: Explain the challenge",
      "Action: Describe what you did",
      "Result: Share the outcome",
      "Practice examples included",
    ],
    buttonText: "Learn STAR Method",
  },
];

