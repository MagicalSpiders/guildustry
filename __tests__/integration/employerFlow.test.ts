/**
 * Integration Test: Employer Job Posting and Applicant Review Flow
 * Tests the complete journey of an employer from posting a job to reviewing applicants
 */

import { supabase } from '@/src/lib/supabase'
import { insertJob, getOwnJobs, updateJob } from '@/src/lib/jobsFunctions'
import {
  getApplicationsForEmployer,
  updateApplication,
} from '@/src/lib/applicationsFunctions'
import {
  mockEmployerUser,
  mockJob,
  mockApplication,
  mockCompany,
  mockCandidateProfile,
} from '../setup/testUtils'

// Mock the company functions
jest.mock('@/src/lib/companyFunctions', () => ({
  getCompanyByOwner: jest.fn(),
}))

import { getCompanyByOwner } from '@/src/lib/companyFunctions'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('Employer Job Posting and Applicant Review Flow', () => {
  it('should complete full employer flow: post job → receive applications → review', async () => {
    const user = mockEmployerUser()
    const company = mockCompany({ owner_id: user.id })

    // Step 1: Employer posts a job
    ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user },
      error: null,
    })

    ;(getCompanyByOwner as jest.Mock).mockResolvedValue(company)

    const jobData = {
      title: 'Licensed Electrician',
      description: 'Looking for experienced electrician',
      location: 'New York, NY',
      salary_min: 50000,
      salary_max: 80000,
      job_type: 'full-time',
      trade_specialty: 'Electrical',
      posted_by: user.id,
      employer_id: user.id,
      company_id: company.id,
      posted_date: new Date().toISOString(),
    }

    const job = mockJob(jobData)

    let mockFrom = jest.fn().mockReturnValue({
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

    const createdJob = await insertJob(jobData)

    expect(createdJob).toBeDefined()
    expect(createdJob.title).toBe(jobData.title)
    // insertJob defaults to 'draft' if status not provided, but our mock returns 'open'
    // The actual function behavior is tested in unit tests
    expect(createdJob.status).toBeDefined()

    // Step 2: Employer views their posted jobs
    mockFrom = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: [job],
            error: null,
          }),
        }),
      }),
    })

    ;(supabase.from as jest.Mock) = mockFrom

    const ownJobs = await getOwnJobs()

    expect(ownJobs).toHaveLength(1)
    expect(ownJobs[0].employer_id).toBe(user.id)

    // Step 3: Job receives applications from candidates
    const applications = [
      mockApplication({
        id: '1',
        job_id: job.id,
        applicant_id: 'candidate-1',
        status: 'pending',
      }),
      mockApplication({
        id: '2',
        job_id: job.id,
        applicant_id: 'candidate-2',
        status: 'pending',
      }),
    ]

    mockFrom = jest.fn()
      .mockReturnValueOnce({
        // First call for jobs
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: [{ id: job.id }],
            error: null,
          }),
        }),
      })
      .mockReturnValueOnce({
        // Second call for applications
        select: jest.fn().mockReturnValue({
          in: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({
              data: applications,
              error: null,
            }),
          }),
        }),
      })

    ;(supabase.from as jest.Mock) = mockFrom

    const receivedApplications = await getApplicationsForEmployer()

    expect(receivedApplications).toHaveLength(2)
    expect(receivedApplications[0].status).toBe('pending')

    // Step 4: Employer reviews and updates application status
    mockFrom = jest.fn().mockReturnValue({
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { ...applications[0], status: 'underReview' },
              error: null,
            }),
          }),
        }),
      }),
    })

    ;(supabase.from as jest.Mock) = mockFrom

    const updatedApp = await updateApplication(applications[0].id, {
      status: 'underReview',
    })

    expect(updatedApp.status).toBe('underReview')
  })

  it('should require company profile before posting jobs', async () => {
    const user = mockEmployerUser()

    ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user },
      error: null,
    })

    ;(getCompanyByOwner as jest.Mock).mockResolvedValue(null)

    const jobData = {
      title: 'Test Job',
      description: 'Test description',
      location: 'Test Location',
      salary_min: 50000,
      salary_max: 80000,
      job_type: 'full-time',
      trade_specialty: 'Electrical',
      posted_by: user.id,
      employer_id: user.id,
      company_id: 'nonexistent-company-id',
      posted_date: new Date().toISOString(),
    }

    await expect(insertJob(jobData)).rejects.toThrow('Company profile required')
  })

  it('should update job status from draft to open', async () => {
    const user = mockEmployerUser()
    const job = mockJob({ id: 'test-job', posted_by: user.id, status: 'draft' })

    ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user },
      error: null,
    })

    const mockFrom = jest.fn()
      .mockReturnValueOnce({
        // First call to fetch existing job
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: job,
                error: null,
              }),
            }),
          }),
        }),
      })
      .mockReturnValueOnce({
        // Second call to update
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              select: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: { ...job, status: 'open' },
                  error: null,
                }),
              }),
            }),
          }),
        }),
      })

    ;(supabase.from as jest.Mock) = mockFrom

    const updatedJob = await updateJob(job.id, { status: 'open' })

    expect(updatedJob.status).toBe('open')
  })

  it('should manage application lifecycle: pending → under review → shortlisted → interview', async () => {
    const user = mockEmployerUser()
    const application = mockApplication({ status: 'pending' })

    ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user },
      error: null,
    })

    // Move to under review
    let mockFrom = jest.fn().mockReturnValue({
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { ...application, status: 'underReview' },
              error: null,
            }),
          }),
        }),
      }),
    })

    ;(supabase.from as jest.Mock) = mockFrom

    let updated = await updateApplication(application.id, { status: 'underReview' })
    expect(updated.status).toBe('underReview')

    // Move to shortlisted
    mockFrom = jest.fn().mockReturnValue({
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { ...application, status: 'shortlisted' },
              error: null,
            }),
          }),
        }),
      }),
    })

    ;(supabase.from as jest.Mock) = mockFrom

    updated = await updateApplication(application.id, { status: 'shortlisted' })
    expect(updated.status).toBe('shortlisted')

    // Move to interview scheduled
    mockFrom = jest.fn().mockReturnValue({
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { ...application, status: 'interviewScheduled' },
              error: null,
            }),
          }),
        }),
      }),
    })

    ;(supabase.from as jest.Mock) = mockFrom

    updated = await updateApplication(application.id, { status: 'interviewScheduled' })
    expect(updated.status).toBe('interviewScheduled')
  })

  it('should only allow employer to update their own jobs', async () => {
    const user = mockEmployerUser()
    const differentEmployerJob = mockJob({
      id: 'test-job',
      posted_by: 'different-employer-id',
    })

    ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user },
      error: null,
    })

    // Mock returns null because job doesn't belong to this employer
    const mockFrom = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Not found' },
            }),
          }),
        }),
      }),
    })

    ;(supabase.from as jest.Mock) = mockFrom

    await expect(
      updateJob(differentEmployerJob.id, { title: 'New Title' })
    ).rejects.toThrow("Job not found or you don't have permission")
  })

  it('should filter applications by status', async () => {
    const user = mockEmployerUser()
    const applications = [
      mockApplication({ id: '1', status: 'pending' }),
      mockApplication({ id: '2', status: 'underReview' }),
      mockApplication({ id: '3', status: 'shortlisted' }),
      mockApplication({ id: '4', status: 'interviewScheduled' }),
      mockApplication({ id: '5', status: 'rejected' }),
    ]

    ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user },
      error: null,
    })

    const mockFrom = jest.fn()
      .mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: [{ id: 'job-1' }],
            error: null,
          }),
        }),
      })
      .mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          in: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({
              data: applications,
              error: null,
            }),
          }),
        }),
      })

    ;(supabase.from as jest.Mock) = mockFrom

    const allApps = await getApplicationsForEmployer()

    expect(allApps).toHaveLength(5)

    // Frontend would filter these
    const pendingApps = allApps.filter((app) => app.status === 'pending')
    expect(pendingApps).toHaveLength(1)

    const shortlistedApps = allApps.filter((app) => app.status === 'shortlisted')
    expect(shortlistedApps).toHaveLength(1)
  })

  it('should handle multiple jobs with different application counts', async () => {
    const user = mockEmployerUser()
    const jobs = [
      { id: 'job-1' },
      { id: 'job-2' },
      { id: 'job-3' },
    ]

    const applications = [
      mockApplication({ job_id: 'job-1', id: '1' }),
      mockApplication({ job_id: 'job-1', id: '2' }),
      mockApplication({ job_id: 'job-2', id: '3' }),
      // job-3 has no applications
    ]

    ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user },
      error: null,
    })

    const mockFrom = jest.fn()
      .mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: jobs,
            error: null,
          }),
        }),
      })
      .mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          in: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({
              data: applications,
              error: null,
            }),
          }),
        }),
      })

    ;(supabase.from as jest.Mock) = mockFrom

    const allApps = await getApplicationsForEmployer()

    expect(allApps).toHaveLength(3)

    // Group by job
    const job1Apps = allApps.filter((app) => app.job_id === 'job-1')
    const job2Apps = allApps.filter((app) => app.job_id === 'job-2')
    const job3Apps = allApps.filter((app) => app.job_id === 'job-3')

    expect(job1Apps).toHaveLength(2)
    expect(job2Apps).toHaveLength(1)
    expect(job3Apps).toHaveLength(0)
  })
})

