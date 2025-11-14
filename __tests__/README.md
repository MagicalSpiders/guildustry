# Guildustry Test Suite

Comprehensive test suite for the Guildustry platform covering authentication, job posting, and application workflows.

## 📁 Test Structure

```
__tests__/
├── setup/
│   └── testUtils.tsx          # Test utilities and mock data factories
├── unit/
│   ├── auth/
│   │   └── authentication.test.ts    # Authentication function tests
│   ├── jobs/
│   │   └── jobFunctions.test.ts      # Job posting function tests
│   └── applications/
│       └── applicationFunctions.test.ts  # Application function tests
├── integration/
│   ├── candidateFlow.test.ts         # End-to-end candidate workflow
│   └── employerFlow.test.ts          # End-to-end employer workflow
└── README.md
```

## 🚀 Getting Started

### Installation

First, install the testing dependencies:

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom @types/jest
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm test -- authentication.test.ts

# Run tests matching a pattern
npm test -- --testNamePattern="should successfully sign up"
```

## 📝 Test Categories

### 1. Unit Tests

#### Authentication Tests (`__tests__/unit/auth/authentication.test.ts`)
Tests for user authentication functionality:
- ✅ Sign up (candidate and employer)
- ✅ Sign in with valid/invalid credentials
- ✅ Sign out
- ✅ Email verification
- ✅ Session management
- ✅ Password validation
- ✅ Duplicate email handling

**Key scenarios:**
- Successful candidate/employer registration
- Login with correct/incorrect credentials
- Email not confirmed error handling
- Session retrieval and validation
- Resend verification email

#### Job Functions Tests (`__tests__/unit/jobs/jobFunctions.test.ts`)
Tests for job posting functionality:
- ✅ Create job posting
- ✅ Update job details
- ✅ Delete job posting
- ✅ Fetch open jobs
- ✅ Fetch employer's own jobs
- ✅ Get job by ID

**Key scenarios:**
- Job creation with company validation
- Status changes (draft → open → closed)
- Permission checks for updates/deletes
- Job listing and filtering
- Error handling for missing data

#### Application Functions Tests (`__tests__/unit/applications/applicationFunctions.test.ts`)
Tests for job application functionality:
- ✅ Submit application
- ✅ Update application status
- ✅ Fetch candidate's applications
- ✅ Fetch applications by job ID
- ✅ Fetch employer's applications
- ✅ Delete application

**Key scenarios:**
- Application submission with duplicate prevention
- Status updates (pending → under review → shortlisted → interview)
- Permission checks for updates/deletes
- Application listing and filtering
- Error handling for invalid data

### 2. Integration Tests

#### Candidate Flow (`__tests__/integration/candidateFlow.test.ts`)
End-to-end tests for candidate journey:
- 🔄 Browse available jobs
- 🔄 View job details
- 🔄 Apply to jobs
- 🔄 Track application status
- 🔄 Prevent duplicate applications
- 🔄 Filter jobs by location/trade

**Test scenario:**
```
Candidate Journey:
1. Browse open jobs → sees list of available positions
2. View job details → sees description, salary, requirements
3. Apply to job → submits application with cover letter
4. Track applications → monitors application status
5. Receive updates → status changes from pending to under review
```

#### Employer Flow (`__tests__/integration/employerFlow.test.ts`)
End-to-end tests for employer journey:
- 🔄 Post new job
- 🔄 View posted jobs
- 🔄 Receive applications
- 🔄 Review applicants
- 🔄 Update application status
- 🔄 Manage multiple jobs

**Test scenario:**
```
Employer Journey:
1. Post job → creates new job listing (requires company profile)
2. View jobs → sees all posted jobs
3. Receive applications → candidates apply to jobs
4. Review applicants → views candidate details
5. Update status → moves applications through pipeline
   (pending → under review → shortlisted → interview scheduled)
```

## 🎯 Test Coverage Goals

| Module | Target Coverage | Current Status |
|--------|----------------|----------------|
| Authentication | 90%+ | ✅ Complete |
| Job Functions | 90%+ | ✅ Complete |
| Application Functions | 90%+ | ✅ Complete |
| Integration Flows | 80%+ | ✅ Complete |

## 🧪 Writing Tests

### Using Test Utilities

The `testUtils.tsx` file provides helpful utilities and mock data factories:

```typescript
import { mockUser, mockJob, mockApplication, render } from '../setup/testUtils'

// Create mock data
const user = mockUser({ email: 'custom@example.com' })
const job = mockJob({ title: 'Custom Job Title' })
const application = mockApplication({ status: 'pending' })

// Render components with providers
render(<MyComponent />)
```

### Mock Data Factories

Available mock factories:
- `mockUser()` - Creates a mock candidate user
- `mockEmployerUser()` - Creates a mock employer user
- `mockSession()` - Creates a mock auth session
- `mockJob()` - Creates a mock job posting
- `mockApplication()` - Creates a mock application
- `mockCandidateProfile()` - Creates a mock candidate profile
- `mockCompany()` - Creates a mock company

All factories accept an optional `overrides` parameter to customize the data.

### Example Test

```typescript
import { supabase } from '@/src/lib/supabase'
import { insertJob } from '@/src/lib/jobsFunctions'
import { mockEmployerUser, mockJob, mockCompany } from '../setup/testUtils'

it('should create a job posting', async () => {
  const user = mockEmployerUser()
  const company = mockCompany()
  const job = mockJob()

  // Mock authentication
  ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
    data: { user },
    error: null,
  })

  // Mock company lookup
  ;(getCompanyByOwner as jest.Mock).mockResolvedValue(company)

  // Mock database insert
  const mockFrom = jest.fn().mockReturnValue({
    insert: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        single: jest.fn().mockResolvedValue({
          data: job,
          error: null,
        }),
      }),
    }),
  })

  ;(supabase.from as jest.Mock) = mockFrom

  // Execute
  const result = await insertJob(jobData)

  // Assert
  expect(result).toEqual(job)
  expect(mockFrom).toHaveBeenCalledWith('jobs')
})
```

## 🔍 Debugging Tests

### View Test Output

```bash
# Verbose output
npm test -- --verbose

# Show console.log statements
npm test -- --silent=false
```

### Debug Specific Test

```bash
# Run single test file
npm test -- authentication.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="sign up"

# Update snapshots
npm test -- --updateSnapshot
```

## 📊 Coverage Report

Generate detailed coverage report:

```bash
npm run test:coverage
```

Open the HTML coverage report:

```bash
open coverage/lcov-report/index.html
```

## 🛠️ Best Practices

### 1. **Arrange-Act-Assert (AAA) Pattern**
```typescript
it('should do something', async () => {
  // Arrange - set up test data
  const user = mockUser()
  
  // Act - execute the code
  const result = await someFunction(user)
  
  // Assert - verify the result
  expect(result).toBeDefined()
})
```

### 2. **Clear Test Names**
```typescript
// ❌ Bad
it('tests login', () => {})

// ✅ Good
it('should successfully sign in with valid credentials', () => {})
```

### 3. **Isolated Tests**
- Each test should be independent
- Clear mocks before each test
- Don't rely on test execution order

### 4. **Mock External Dependencies**
- Mock Supabase client
- Mock API calls
- Mock file system operations

### 5. **Test Error Cases**
```typescript
it('should fail with invalid credentials', async () => {
  await expect(signIn('bad@email.com', 'wrong')).rejects.toThrow(
    'Invalid login credentials'
  )
})
```

## 🔧 Troubleshooting

### Common Issues

#### 1. **Module not found**
```bash
# Clear Jest cache
npm test -- --clearCache
```

#### 2. **Mock not working**
```bash
# Ensure jest.clearAllMocks() in beforeEach
beforeEach(() => {
  jest.clearAllMocks()
})
```

#### 3. **Async test timeout**
```typescript
// Increase timeout for slow tests
it('should handle slow operation', async () => {
  // test code
}, 10000) // 10 seconds
```

#### 4. **TypeScript errors**
```bash
# Rebuild TypeScript
npm run build
```

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://testingjavascript.com/)

## 🤝 Contributing

When adding new features, please:
1. Write corresponding unit tests
2. Add integration tests for user flows
3. Maintain test coverage above 80%
4. Update this documentation

## 📝 Test Checklist

Before submitting a PR, ensure:
- [ ] All tests pass (`npm test`)
- [ ] Coverage meets threshold (`npm run test:coverage`)
- [ ] New features have tests
- [ ] Edge cases are covered
- [ ] Error handling is tested
- [ ] Documentation is updated

