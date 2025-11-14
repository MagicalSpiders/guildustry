# Job Posting Flow

This document outlines the flow for company profile retrieval and job posting functionality in the application.

## Key Files

1. `companyFuntions.ts` - Handles company-related operations
2. `jobsFunctions.ts` - Manages job posting CRUD operations
3. `simpleJobPost.test.ts` - Example implementation of job posting flow

## Company Profile Flow

### Getting Company Profile

1. **Authentication**: User must be authenticated
2. **Retrieval**: 
   - The `getCompanyByOwner(userId)` function is used to fetch company details
   - It queries the `companies` table filtering by `owner_id`
   - Returns the company data if found, or `null` if not found

## Job Posting Flow

### 1. Authentication
- User must be signed in to post a job
- The system verifies the user's identity using Supabase Auth

### 2. Company Verification
- The system checks if the authenticated user has an associated company
- Uses `getCompanyByOwner(user.id)` to verify company existence
- If no company is found, the user must create one first

### 3. Job Creation
- Once verified, a new job can be created using `insertJob(jobData)`
- Required job data includes:
  - `title`: Job title
  - `description`: Detailed job description
  - `location`: Job location
  - `salary_min`/`salary_max`: Salary range
  - `job_type`: Type of employment
  - `status`: Job status (e.g., 'open')
  - `requirements`: Job requirements
  - `skills`: Array of required skills
  - `trade_specialty`: Specific trade specialty

### 4. Job Management
- **Update**: `updateJob(jobId, updates)` - Update an existing job
- **Delete**: `deleteJob(jobId)` - Remove a job posting
- **List Jobs**: `getOpenJobs(limit)` - Get list of open jobs
- **Get User's Jobs**: `getOwnJobs()` - Get jobs posted by the current user

## Example Usage

```typescript
// 1. Sign in
const { user } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});

// 2. Get company
const company = await getCompanyByOwner(user.id);
if (!company) throw new Error('No company found');

// 3. Create job
const newJob = await insertJob({
  title: 'Senior Developer',
  description: 'Job description...',
  // ... other fields
  posted_by: user.id,
  employer_id: user.id,
  company_id: company.id,
  posted_date: new Date().toISOString()
});
```

## Security
- All operations are protected by Row Level Security (RLS) in Supabase
- Users can only modify their own job postings
- Company data is only accessible to the company owner
