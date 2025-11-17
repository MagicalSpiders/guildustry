# Guildustry - Project Overview

## What is Guildustry?

Guildustry is a job board platform connecting skilled trades professionals (electricians, plumbers, HVAC technicians, etc.) with employers in the construction and trades industry.

## User Types

1. **Candidates** - Trades professionals looking for jobs
2. **Employers** - Companies posting job openings

## Core Flow

```
1. Employer creates company profile → Posts job
2. Candidate creates profile → Browses jobs → Applies
3. Employer reviews applications → Updates status → Schedules interviews
4. System sends notifications to both parties
5. Candidate views interviews → Attends interview
```

## Key Features

### For Employers
- Post job openings (multi-step form)
- View and manage applicants
- Schedule interviews
- Receive notifications for new applications
- Update application statuses

### For Candidates
- Create detailed profile with skills/experience
- Browse and search jobs
- Apply to jobs
- Track applications
- View scheduled interviews
- Receive status update notifications

## Technical Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Database Tables**: 
  - `candidate_profile` - Candidate information
  - `companies` - Employer company profiles
  - `jobs` - Job postings
  - `applications` - Job applications
  - `interviews` - Scheduled interviews
  - `notifications` - User notifications

## Key Files Structure

- `src/lib/` - Backend functions (jobs, applications, interviews, notifications)
- `app/candidate/` - Candidate-facing pages
- `app/employer/` - Employer-facing pages
- `app/auth/` - Authentication pages
- `src/components/` - Shared React components

## Authentication Flow

- Users sign up/sign in with email/password
- Role stored in user metadata (`candidate` or `employer`)
- Profile/company data loaded based on role
- Protected routes redirect based on authentication

## Notification System

- Real-time notifications via Supabase subscriptions
- Auto-created for: new applications, status changes, interview scheduling
- Shown in employer notifications page

## Interview System

- Employers schedule interviews from applicant cards
- Automatically updates application status to "interviewScheduled"
- Creates notification for candidate
- Candidates view interviews in dedicated page

