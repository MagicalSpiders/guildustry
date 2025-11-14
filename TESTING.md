# 🧪 Testing Guide for Guildustry

This guide will help you get started with testing the Guildustry application.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

This will install all testing dependencies including:

- Jest (test runner)
- React Testing Library (component testing)
- @testing-library/jest-dom (DOM matchers)
- jest-environment-jsdom (browser-like environment)

### 2. Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (recommended for development)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### 3. View Coverage Report

After running `npm run test:coverage`, open:

```bash
# On Mac/Linux
open coverage/lcov-report/index.html

# On Windows
start coverage/lcov-report/index.html
```

## Test Organization

### Unit Tests

Located in `__tests__/unit/`, these test individual functions in isolation:

- **Authentication** (`auth/authentication.test.ts`)

  - Sign up, sign in, sign out
  - Email verification
  - Session management

- **Jobs** (`jobs/jobFunctions.test.ts`)

  - Create, update, delete jobs
  - Fetch jobs (open, own, by ID)
  - Permission checks

- **Applications** (`applications/applicationFunctions.test.ts`)
  - Submit applications
  - Update application status
  - Fetch applications (own, by job, for employer)
  - Duplicate prevention

### Integration Tests

Located in `__tests__/integration/`, these test complete user workflows:

- **Candidate Flow** (`candidateFlow.test.ts`)

  - Browse jobs → View details → Apply → Track status

- **Employer Flow** (`employerFlow.test.ts`)
  - Post job → Receive applications → Review → Update status

## What's Tested

### ✅ Authentication Flow

```
Candidate/Employer Sign Up
├── Email validation
├── Password strength requirements
├── Role assignment
└── Email verification

Sign In
├── Valid credentials → success
├── Invalid credentials → error
├── Unconfirmed email → error
└── Session creation

Sign Out
└── Session cleanup
```

### ✅ Job Posting Flow (Employer)

```
Post Job
├── Requires company profile
├── Validates required fields
├── Defaults to draft status
└── Associates with employer

Update Job
├── Permission check (must own job)
├── Status changes (draft → open → closed)
└── Field updates

Get Jobs
├── Get all open jobs (candidates)
├── Get own jobs (employer)
└── Get job by ID
```

### ✅ Application Flow (Candidate)

```
Apply to Job
├── Prevents duplicates
├── Requires authentication
├── Defaults to pending status
└── Includes cover letter/resume

Track Applications
├── View all own applications
├── See status changes
└── Filter by status

Employer View
├── See all applications for own jobs
├── Update application status
└── View candidate details
```

## Running Specific Tests

### Run a specific test file

```bash
npm test -- authentication.test.ts
```

### Run tests matching a pattern

```bash
npm test -- --testNamePattern="sign up"
```

### Run tests in a specific directory

```bash
npm test -- __tests__/unit/auth/
```

## Understanding Test Output

### ✅ Passing Test

```
✓ should successfully sign up a candidate (15 ms)
```

### ❌ Failing Test

```
✕ should successfully sign up a candidate (23 ms)

  Expected: "candidate"
  Received: "employer"
```

### Test Summary

```
Test Suites: 5 passed, 5 total
Tests:       45 passed, 45 total
Snapshots:   0 total
Time:        3.456 s
```

## Common Test Commands

```bash
# Run all tests
npm test

# Watch mode (re-runs tests on file changes)
npm run test:watch

# Coverage report
npm run test:coverage

# Verbose output
npm test -- --verbose

# Update snapshots
npm test -- --updateSnapshot

# Run tests in CI mode (no watch)
npm test -- --ci

# Clear Jest cache
npm test -- --clearCache
```

## Writing New Tests

### 1. Create test file

Place it in the appropriate directory:

- `__tests__/unit/` for function tests
- `__tests__/integration/` for workflow tests

### 2. Use test utilities

```typescript
import { mockUser, mockJob, mockApplication } from "../setup/testUtils";

it("should do something", async () => {
  const user = mockUser();
  const job = mockJob({ title: "Custom Title" });

  // Your test code here
});
```

### 3. Follow AAA pattern

```typescript
it('should create a job', async () => {
  // Arrange - set up test data
  const jobData = { ... }

  // Act - execute the function
  const result = await insertJob(jobData)

  // Assert - verify the result
  expect(result).toBeDefined()
  expect(result.title).toBe(jobData.title)
})
```

## Debugging Tests

### Add console logs

```typescript
it("should debug something", () => {
  const data = mockUser();
  console.log("User data:", data);
  // test continues...
});
```

### Use debugger

```typescript
it("should debug with breakpoint", () => {
  const data = mockUser();
  debugger; // Execution will pause here
  // test continues...
});
```

Then run:

```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Check mock calls

```typescript
expect(supabase.from).toHaveBeenCalledWith("jobs");
expect(supabase.from).toHaveBeenCalledTimes(1);
```

## Test Coverage Goals

| Module                | Target | Status      |
| --------------------- | ------ | ----------- |
| Auth Functions        | 90%+   | ✅ Complete |
| Job Functions         | 90%+   | ✅ Complete |
| Application Functions | 90%+   | ✅ Complete |
| Integration Tests     | 80%+   | ✅ Complete |

## Continuous Integration

Tests automatically run on:

- Pull requests
- Pushes to main branch
- Before deployment

### CI Configuration

```yaml
# .github/workflows/test.yml
- name: Run tests
  run: npm test -- --ci --coverage
```

## Troubleshooting

### Tests fail locally but pass in CI

```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npm test -- --clearCache
```

### Module not found errors

```bash
# Rebuild TypeScript
npm run build

# Clear Jest cache
npm test -- --clearCache
```

### Timeout errors

Increase timeout in individual tests:

```typescript
it("slow test", async () => {
  // test code
}, 10000); // 10 seconds
```

### Mock not working

Ensure mocks are cleared:

```typescript
beforeEach(() => {
  jest.clearAllMocks();
});
```

## Best Practices

### ✅ DO

- Write tests for all new features
- Test both success and error cases
- Use descriptive test names
- Keep tests isolated and independent
- Mock external dependencies
- Maintain > 80% coverage

### ❌ DON'T

- Test implementation details
- Rely on test execution order
- Share state between tests
- Mock everything (test real behavior when possible)
- Skip error case testing
- Write flaky tests

## Additional Resources

- [Full Test Documentation](./__tests__/README.md)
- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://testingjavascript.com/)

## Questions?

Check the detailed [Test Documentation](./__tests__/README.md) or reach out to the development team.

---

**Happy Testing! 🎉**
