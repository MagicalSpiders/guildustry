# Candidate Application Flow

This document outlines the complete flow of a candidate applying for a job using the application system.

## Key Files

1. `candidateApplication.test.ts` - Test script demonstrating the application flow
2. `applications.ts` - Core application service with business logic
3. `jobsFunctions.ts` - Job-related functions used in the flow

## Application Flow

### 1. Authentication
- The candidate signs in using their email and password
- The system verifies credentials using Supabase Auth
- On successful authentication, a user session is established

### 2. Fetching Open Jobs
- The system retrieves a list of all open job postings
- Jobs are filtered to show only those with 'open' status
- Job details include title, description, requirements, and other relevant information

### 3. Job Selection
- The candidate selects a job to apply to (in this case, the first available job)
- The system verifies the job exists and is open for applications

### 4. Application Submission
- The candidate submits their application with:
  - Job ID
  - Applicant ID (from auth)
  - Status (set to 'pending')
  - Cover letter
  - Resume URL (in a real app, this would be uploaded first)
  - Submission timestamp

### 5. Duplicate Prevention
Before creating a new application, the system checks if the candidate has already applied by:
1. Querying the `applications` table for any existing record with the same `applicant_id` and `job_id`
2. If a matching record exists, it throws an error: "You have already applied to this job"
3. If no duplicate is found, proceeds with creating the new application

### 6. Application Verification
- After submission, the system verifies the application was created by:
  - Fetching all applications for the current user
  - Checking if the new application exists in the list

### 7. Session Cleanup
- The candidate is signed out to end the session
- Any temporary data is cleaned up

## Key Functions

### `insertApplication(app: ApplicationInsert)`
- **Purpose**: Creates a new job application
- **Parameters**:
  - `app`: Object containing application details
- **Returns**: The created application with related data
- **Error Cases**:
  - If user is not authenticated
  - If required fields are missing
  - If duplicate application exists

### `getOwnApplications()`
- **Purpose**: Retrieves all applications for the currently authenticated user
- **Returns**: Array of applications with related job and profile data
- **Note**: Only returns applications for the currently signed-in user

### `getOpenJobs()`
- **Purpose**: Fetches all jobs that are currently open for applications
- **Returns**: Array of job listings with company information

## Example Usage

```typescript
// 1. Sign in
const { user } = await supabase.auth.signInWithPassword({
  email: 'candidate@example.com',
  password: 'password123!'
});

// 2. Get open jobs
const jobs = await getOpenJobs();

// 3. Select a job to apply to
const jobToApply = jobs[0];

// 4. Submit application
const newApplication = await insertApplication({
  job_id: jobToApply.id,
  applicant_id: user.id,
  status: 'pending',
  cover_letter: 'My cover letter...',
  resume_url: 'https://example.com/resume.pdf',
  submitted_at: new Date().toISOString()
});

// 5. Verify application
const myApplications = await getOwnApplications();
const isApplicationCreated = myApplications.some(app => app.id === newApplication.id);
```

## Security Considerations
- All operations are protected by Supabase Row Level Security (RLS)
- Users can only view and manage their own applications
- Job applications can only be created for existing and open job postings
- The system prevents duplicate applications from the same candidate for the same job
