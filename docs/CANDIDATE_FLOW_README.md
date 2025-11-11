# Candidate Profile Management Flow

## Overview
This document explains the flow of candidate profile management between `profileFUnctions.ts` and `test.db.ts`. This is designed to help Cursor AI understand the architecture and data flow for candidate-related operations.

## Core Files
1. `profileFUnctions.ts` - Contains core CRUD operations for candidate profiles
2. `test.db.ts` - Contains test cases and example usage of the profile functions

## Candidate Profile Flow

### 1. Authentication Flow
- **Sign Up**: Creates a new user in Supabase Auth
- **Sign In**: Authenticates the user and retrieves their session
- **User ID**: The authenticated user's ID is used as the primary key for the candidate profile

### 2. Profile Management Operations

#### a) Create Profile
- **Function**: `insertCandidateProfile(profileData)`
- **Flow**:
  1. Takes candidate data including personal and professional details
  2. Optionally handles resume file upload to Supabase Storage
  3. Creates a new record in the `profiles` table
  4. Links to the authenticated user via `id` and `created_by` fields

#### b) Read Profile
- **Function**: `getCandidateProfile()`
- **Flow**:
  1. Retrieves the current user's ID from the session
  2. Fetches the profile from the `profiles` table
  3. Returns the complete profile data including resume URL if available

#### c) Update Profile
- **Function**: `updateCandidateProfile(updates)`
- **Flow**:
  1. Takes partial profile data to update
  2. Updates the existing profile in the `profiles` table
  3. Returns the updated profile

#### d) Delete Profile
- **Function**: `deleteCandidateProfile()`
- **Flow**:
  1. Deletes the profile from the `profiles` table
  2. (Optional) Handles cleanup of related resources like resume files

## Test Flow (test.db.ts)
- Sets up test environment with test credentials
- Performs end-to-end testing of the profile flow:
  1. Attempts to sign up a new user
  2. Falls back to sign in if user exists
  3. Tests profile creation with resume handling
  4. Tests profile updates
  5. Includes cleanup operations

## Cursor AI Prompt

```
You are an AI assistant helping with candidate profile management. Here's the current context:

1. The system uses Supabase for authentication and data storage
2. Candidate profiles are stored in the 'profiles' table
3. Each candidate is linked to a Supabase Auth user
4. Resumes are stored in Supabase Storage under the 'resume' bucket

When helping with code:
- Always validate user authentication before profile operations
- Handle errors gracefully, especially for duplicate entries
- Ensure proper TypeScript types are used
- Follow the existing patterns for error handling and response formatting
- Consider the test cases in test.db.ts as reference implementations

For any profile operation, ensure you:
1. Verify the user is authenticated
2. Use the correct user ID from the session
3. Handle any file uploads to the appropriate storage bucket
4. Return appropriate success/error responses
```

## Key Dependencies
- Supabase Auth for user management
- Supabase Storage for resume files
- TypeScript for type safety

## Security Notes
- All profile operations require authentication
- Users can only access their own profile
- File uploads should be validated for type and size
- Sensitive operations should include additional confirmation
