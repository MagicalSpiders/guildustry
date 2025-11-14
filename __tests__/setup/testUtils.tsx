import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { AuthProvider } from '@/src/components/AuthProvider'
import { ThemeProvider } from 'next-themes'

// Mock providers wrapper for testing
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  )
}

// Custom render function that includes providers
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Common test data factories
export const mockUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  user_metadata: {
    role: 'candidate',
    user_type: 'candidate',
  },
  app_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  ...overrides,
})

export const mockEmployerUser = (overrides = {}) => ({
  ...mockUser(),
  id: 'test-employer-id',
  email: 'employer@example.com',
  user_metadata: {
    role: 'employer',
    user_type: 'employer',
  },
  ...overrides,
})

export const mockSession = (user = mockUser()) => ({
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  token_type: 'bearer',
  user,
})

export const mockJob = (overrides = {}) => ({
  id: 'test-job-id',
  title: 'Licensed Electrician',
  description: 'We are looking for an experienced electrician...',
  location: 'New York, NY',
  salary_min: 50000,
  salary_max: 80000,
  job_type: 'full-time',
  status: 'open',
  requirements: 'Must have valid license',
  skills: ['Blueprint Reading', 'Electrical Troubleshooting'],
  trade_specialty: 'Electrical',
  posted_by: 'test-employer-id',
  employer_id: 'test-employer-id',
  company_id: 'test-company-id',
  posted_date: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
})

export const mockApplication = (overrides = {}) => ({
  id: 'test-application-id',
  job_id: 'test-job-id',
  applicant_id: 'test-user-id',
  status: 'pending',
  cover_letter: 'I am interested in this position...',
  resume_url: 'https://example.com/resume.pdf',
  submitted_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
})

export const mockCandidateProfile = (overrides = {}) => ({
  id: 'test-user-id',
  fullname: 'John Doe',
  email: 'test@example.com',
  state: 'NY',
  phone_number: '555-1234',
  city: 'New York',
  primary_trade: 'Electrical',
  shift_preference: 'Day Shift',
  years_of_experience: 5,
  has_valid_licence: true,
  priority: 1,
  resume_file_url: 'https://example.com/resume.pdf',
  created_by: 'test-user-id',
  role: 'candidate',
  company_id: null,
  priority_choice: 'Safety first',
  shape_choice: 'Cylinder',
  timestamp: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
})

export const mockCompany = (overrides = {}) => ({
  id: 'test-company-id',
  owner_id: 'test-employer-id',
  name: 'Test Construction Co.',
  industry: 'Construction',
  headquarters: 'New York, NY',
  founded: '2020',
  website: 'https://testconstruction.com',
  description: 'A leading construction company',
  size: '50-100',
  logo_url: 'https://example.com/logo.png',
  specialties: ['Commercial', 'Residential'],
  values: ['Safety', 'Quality'],
  benefits: ['Health Insurance', '401k'],
  contact_email: 'hr@testconstruction.com',
  contact_phone: '555-5678',
  contact_address: '123 Main St, New York, NY',
  linkedin: 'https://linkedin.com/company/test',
  twitter: null,
  facebook: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
})

// Helper to wait for async operations
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0))

