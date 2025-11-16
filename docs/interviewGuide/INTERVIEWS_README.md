# Interview Management System

This document outlines the interview management functionality in the application, including the test suite and core functions.

## Core Files

### `interviews.ts`
Contains the core functions for managing interviews:
- `insertInterview`: Creates a new interview for an application
- `updateInterviewStatus`: Updates the status of an existing interview

### `interviews.test.ts`
Test suite for the interview management functionality.

## Data Model

### Interview
- `id`: Unique identifier (UUID)
- `application_id`: Reference to the application (UUID)
- `interview_date`: Scheduled date/time of the interview
- `status`: Interview status (e.g., 'scheduled', 'completed')
- `type`: Type of interview (e.g., 'phone', 'in-person')
- `notes`: Additional notes about the interview
- `location`: Interview location (e.g., 'remote', office address)
- `interviewers`: Array of user IDs representing the interviewers

## API Endpoints

### Create Interview
```typescript
POST /api/interviews
{
  "application_id": "uuid",
  "interview_date": "ISO date string",
  "type": "phone" | "in-person",
  "notes": "string",
  "location": "string",
  "interviewers": ["user_uuid1", "user_uuid2"]
}
```

### Update Interview Status
```typescript
PATCH /api/interviews/:id/status
{
  "status": "scheduled" | "completed" | "cancelled" | "rescheduled"
}
```

## Test Suite

The test suite verifies:
1. Successful interview creation for an application
2. Interview status updates
3. Proper cleanup of test data

### Running Tests
```bash
npx ts-node interviews.test.ts
```

## Dependencies
- Supabase for database operations
- TypeScript for type safety

## Error Handling
- Validates application existence
- Enforces interview uniqueness per application
- Validates interview status transitions
