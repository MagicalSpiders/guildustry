# 🏗️ Guildustry

> Connecting skilled trades professionals with employers in the construction and trades industry

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?logo=supabase)](https://supabase.com/)

---

## 📋 Overview

Guildustry is a modern job board platform designed specifically for skilled trades professionals. Whether you're an electrician, plumber, HVAC technician, or any other trades professional, Guildustry helps you find high-paying jobs that offer stability—without the burden of college debt.

For employers, Guildustry provides a streamlined way to post job openings, manage applicants, schedule interviews, and find the right talent for your construction and trades projects.

## ✨ Key Features

### 👷 For Candidates

- **Profile Creation** - Build a detailed profile showcasing your skills and experience
- **Job Discovery** - Browse and search through available job openings
- **Easy Applications** - Apply to jobs with a simple, streamlined process
- **Application Tracking** - Monitor the status of your applications in real-time
- **Interview Management** - View and manage scheduled interviews
- **Notifications** - Stay updated on application status changes and interview invitations

### 🏢 For Employers

- **Job Posting** - Create detailed job postings with a multi-step form
- **Applicant Management** - View and manage all applicants in one place
- **Interview Scheduling** - Schedule interviews directly from applicant profiles
- **Status Updates** - Update application statuses and keep candidates informed
- **Real-time Notifications** - Get notified when new applications are submitted

## 🛠️ Tech Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Iconify React** - Icon library
- **next-themes** - Dark/Light theme support

### Backend & Database

- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication
  - Real-time subscriptions
  - Row Level Security (RLS)

### Database Schema

- `candidate_profile` - Candidate information and skills
- `companies` - Employer company profiles
- `jobs` - Job postings
- `applications` - Job applications
- `interviews` - Scheduled interviews
- `notifications` - User notifications

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Supabase account and project

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/guildustry.git
   cd guildustry
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
guildustry/
├── app/
│   ├── candidate/          # Candidate-facing pages
│   │   ├── jobs/           # Job browsing and details
│   │   ├── applications/   # Application tracking
│   │   └── profile/        # Profile management
│   ├── employer/           # Employer-facing pages
│   │   ├── jobs/           # Job posting and management
│   │   ├── applicants/     # Applicant management
│   │   └── profile/        # Company profile
│   ├── auth/               # Authentication pages
│   └── (marketing)/        # Marketing pages
├── src/
│   ├── components/         # Shared React components
│   ├── lib/                # Backend functions and utilities
│   └── styles/             # Global styles and theme
├── public/                 # Static assets
└── docs/                   # Documentation
```

## 🔄 Core Workflow

```
1. Employer creates company profile → Posts job
2. Candidate creates profile → Browses jobs → Applies
3. Employer reviews applications → Updates status → Schedules interviews
4. System sends notifications to both parties
5. Candidate views interviews → Attends interview
```

## 🎨 Design System

### Theming

- **Dark Mode** (default) - Professional dark theme
- **Light Mode** - Clean light theme
- **Accent Color** - `#f59f0a` (amber/orange)

### Typography

- **Headings** - Red Hat Display
- **Body Text** - Cambria (serif)

### Accessibility

- WCAG AA contrast compliance
- Full keyboard navigation
- Screen reader support
- Reduced motion support

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🔐 Authentication

Guildustry uses Supabase Authentication with email/password:

- Users sign up/sign in with email and password
- Role is stored in user metadata (`candidate` or `employer`)
- Profile/company data is loaded based on role
- Protected routes redirect based on authentication status

## 🔔 Notification System

- Real-time notifications via Supabase subscriptions
- Auto-created for:
  - New applications
  - Application status changes
  - Interview scheduling
- Shown in dedicated notifications pages for both candidates and employers

## 📖 Documentation

For more detailed documentation, check out the [docs](./docs/) directory:

- [Project Overview](./docs/PROJECT_OVERVIEW.md)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

Built with ❤️ for the skilled trades community.

---

**Made with Next.js and Supabase**
