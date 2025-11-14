/**
 * Integration Test: Candidate Job Application Flow
 * Tests the complete journey of a candidate from browsing jobs to applying
 */

import { supabase } from '@/src/lib/supabase'
import { getOpenJobs } from '@/src/lib/jobsFunctions'
import {
  insertApplication,
  getOwnApplications,
} from '@/src/lib/applicationsFunctions'
import {
  mockUser,
  mockJob,
  mockApplication,
  mockCompany,
} from '../setup/testUtils'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('Candidate Job Application Flow', () => {
  it('should complete full application flow: browse → view → apply → track', async () => {
    const user = mockUser()
    const job = mockJob({ status: 'open' })
    const jobWithCompany = {
      ...job,
      company: mockCompany(),
    }

    // Step 1: Candidate browses open jobs
    const mockFrom = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: [jobWithCompany],
            error: null,
          }),
        }),
      }),
    })

    ;(supabase.from as jest.Mock) = mockFrom

    const availableJobs = await getOpenJobs()

    expect(availableJobs).toHaveLength(1)
    expect(availableJobs[0].status).toBe('open')
    expect(availableJobs[0].title).toBe(job.title)

    // Step 2: Candidate views job details
    const selectedJob = availableJobs[0]
    expect(selectedJob.description).toBeDefined()
    expect(selectedJob.salary_min).toBeDefined()
    expect(selectedJob.salary_max).toBeDefined()

    // Step 3: Candidate applies to the job
    ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user },
      error: null,
    })

    const applicationData = {
      job_id: selectedJob.id,
      applicant_id: user.id,
      cover_letter: 'I am very interested in this position',
      resume_url: 'https://example.com/resume.pdf',
      submitted_at: new Date().toISOString(),
    }

    const application = mockApplication(applicationData)

    const mockFromApp = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { code: 'PGRST116' }, // No existing application
            }),
          }),
        }),
      }),
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: application,
            error: null,
          }),
        }),
      }),
    })

    ;(supabase.from as jest.Mock) = mockFromApp

    const createdApplication = await insertApplication(applicationData)

    expect(createdApplication).toBeDefined()
    expect(createdApplication.job_id).toBe(selectedJob.id)
    expect(createdApplication.status).toBe('pending')

    // Step 4: Candidate tracks their applications
    const mockFromTrack = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: [application],
            error: null,
          }),
        }),
      }),
    })

    ;(supabase.from as jest.Mock) = mockFromTrack

    const myApplications = await getOwnApplications()

    expect(myApplications).toHaveLength(1)
    expect(myApplications[0].job_id).toBe(selectedJob.id)
    expect(myApplications[0].applicant_id).toBe(user.id)
  })

  it('should prevent duplicate applications to the same job', async () => {
    const user = mockUser()
    const job = mockJob()
    const existingApp = mockApplication({ job_id: job.id, applicant_id: user.id })

    ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user },
      error: null,
    })

    // Mock finding existing application
    const mockFrom = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: existingApp,
              error: null,
            }),
          }),
        }),
      }),
    })

    ;(supabase.from as jest.Mock) = mockFrom

    const applicationData = {
      job_id: job.id,
      applicant_id: user.id,
      cover_letter: 'Another application',
      submitted_at: new Date().toISOString(),
    }

    await expect(insertApplication(applicationData)).rejects.toThrow(
      'You have already applied to this job'
    )
  })

  it('should only show open jobs to candidates', async () => {
    const openJobs = [
      mockJob({ id: '1', status: 'open' }),
      mockJob({ id: '2', status: 'open' }),
    ]

    const mockFrom = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: openJobs,
            error: null,
          }),
        }),
      }),
    })

    ;(supabase.from as jest.Mock) = mockFrom

    const jobs = await getOpenJobs()

    expect(jobs).toHaveLength(2)
    jobs.forEach((job) => {
      expect(job.status).toBe('open')
    })
  })

  it('should require authentication to apply for jobs', async () => {
    ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: null },
      error: { message: 'Not authenticated' },
    })

    const applicationData = {
      job_id: 'test-job-id',
      applicant_id: 'test-user-id',
      cover_letter: 'Cover letter',
      submitted_at: new Date().toISOString(),
    }

    await expect(insertApplication(applicationData)).rejects.toThrow(
      'User must be authenticated'
    )
  })

  it('should track application status changes', async () => {
    const user = mockUser()
    const application = mockApplication({ applicant_id: user.id, status: 'pending' })

    ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user },
      error: null,
    })

    // Initial application list
    let mockFrom = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: [application],
            error: null,
          }),
        }),
      }),
    })

    ;(supabase.from as jest.Mock) = mockFrom

    const initialApps = await getOwnApplications()
    expect(initialApps[0].status).toBe('pending')

    // After employer reviews
    const updatedApplication = { ...application, status: 'underReview' }
    mockFrom = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: [updatedApplication],
            error: null,
          }),
        }),
      }),
    })

    ;(supabase.from as jest.Mock) = mockFrom

    const updatedApps = await getOwnApplications()
    expect(updatedApps[0].status).toBe('underReview')
  })

  it('should filter jobs by location and trade specialty', async () => {
    const jobs = [
      mockJob({ id: '1', location: 'New York, NY', trade_specialty: 'Electrical' }),
      mockJob({ id: '2', location: 'New York, NY', trade_specialty: 'Plumbing' }),
      mockJob({ id: '3', location: 'Los Angeles, CA', trade_specialty: 'Electrical' }),
    ]

    const mockFrom = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: jobs,
            error: null,
          }),
        }),
      }),
    })

    ;(supabase.from as jest.Mock) = mockFrom

    const allJobs = await getOpenJobs()
    expect(allJobs).toHaveLength(3)

    // Frontend would filter these
    const newYorkElectrical = allJobs.filter(
      (job) => job.location.includes('New York') && job.trade_specialty === 'Electrical'
    )
    expect(newYorkElectrical).toHaveLength(1)
    expect(newYorkElectrical[0].id).toBe('1')
  })
})

