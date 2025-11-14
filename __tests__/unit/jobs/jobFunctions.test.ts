import { supabase } from '@/src/lib/supabase'
import {
  insertJob,
  updateJob,
  deleteJob,
  getOpenJobs,
  getOwnJobs,
  getJobById,
} from '@/src/lib/jobsFunctions'
import { mockJob, mockEmployerUser, mockCompany } from '../../setup/testUtils'

// Mock the company functions
jest.mock('@/src/lib/companyFunctions', () => ({
  getCompanyByOwner: jest.fn(),
}))

import { getCompanyByOwner } from '@/src/lib/companyFunctions'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('Job Functions', () => {
  describe('insertJob', () => {
    const mockJobData = {
      title: 'Licensed Electrician',
      description: 'Looking for experienced electrician',
      location: 'New York, NY',
      salary_min: 50000,
      salary_max: 80000,
      job_type: 'full-time',
      trade_specialty: 'Electrical',
      posted_by: 'test-employer-id',
      employer_id: 'test-employer-id',
      company_id: 'test-company-id',
      posted_date: new Date().toISOString(),
    }

    it('should successfully create a job posting', async () => {
      const user = mockEmployerUser()
      const company = mockCompany()
      const job = mockJob(mockJobData)

      ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user },
        error: null,
      })

      ;(getCompanyByOwner as jest.Mock).mockResolvedValue(company)

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

      const result = await insertJob(mockJobData)

      expect(supabase.auth.getUser).toHaveBeenCalled()
      expect(getCompanyByOwner).toHaveBeenCalled()
      expect(mockFrom).toHaveBeenCalledWith('jobs')
      expect(result).toEqual(job)
    })

    it('should fail when user is not authenticated', async () => {
      ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      })

      await expect(insertJob(mockJobData)).rejects.toThrow(
        'User must be authenticated to post a job'
      )
    })

    it('should fail when company profile does not exist', async () => {
      const user = mockEmployerUser()

      ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user },
        error: null,
      })

      ;(getCompanyByOwner as jest.Mock).mockResolvedValue(null)

      await expect(insertJob(mockJobData)).rejects.toThrow(
        'Company profile required'
      )
    })

    it('should default to draft status if not specified', async () => {
      const user = mockEmployerUser()
      const company = mockCompany()
      const job = mockJob({ ...mockJobData, status: 'draft' })

      ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user },
        error: null,
      })

      ;(getCompanyByOwner as jest.Mock).mockResolvedValue(company)

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

      const result = await insertJob(mockJobData)

      expect(result.status).toBe('draft')
    })

    it('should fail with database error', async () => {
      const user = mockEmployerUser()
      const company = mockCompany()

      ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user },
        error: null,
      })

      ;(getCompanyByOwner as jest.Mock).mockResolvedValue(company)

      const mockFrom = jest.fn().mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Database error' },
            }),
          }),
        }),
      })

      ;(supabase.from as jest.Mock) = mockFrom

      await expect(insertJob(mockJobData)).rejects.toThrow(
        'Failed to create job: Database error'
      )
    })
  })

  describe('updateJob', () => {
    const jobId = 'test-job-id'
    const updates = {
      title: 'Senior Electrician',
      salary_min: 60000,
    }

    it('should successfully update a job', async () => {
      const user = mockEmployerUser()
      const existingJob = mockJob({ id: jobId, posted_by: user.id })
      const updatedJob = mockJob({ ...existingJob, ...updates })

      ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user },
        error: null,
      })

      const mockFrom = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: existingJob,
                error: null,
              }),
            }),
          }),
        }),
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              select: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: updatedJob,
                  error: null,
                }),
              }),
            }),
          }),
        }),
      })

      ;(supabase.from as jest.Mock) = mockFrom

      const result = await updateJob(jobId, updates)

      expect(result.title).toBe(updates.title)
      expect(result.salary_min).toBe(updates.salary_min)
    })

    it('should fail when user is not authenticated', async () => {
      ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      })

      await expect(updateJob(jobId, updates)).rejects.toThrow(
        'User must be authenticated to update a job'
      )
    })

    it('should fail when job does not exist', async () => {
      const user = mockEmployerUser()

      ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user },
        error: null,
      })

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

      await expect(updateJob(jobId, updates)).rejects.toThrow(
        "Job not found or you don't have permission"
      )
    })

    it('should fail when user does not own the job', async () => {
      const user = mockEmployerUser()
      const existingJob = mockJob({ id: jobId, posted_by: 'different-user-id' })

      ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user },
        error: null,
      })

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

      await expect(updateJob(jobId, updates)).rejects.toThrow(
        "Job not found or you don't have permission"
      )
    })
  })

  describe('deleteJob', () => {
    const jobId = 'test-job-id'

    it('should successfully delete a job', async () => {
      const user = mockEmployerUser()

      ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user },
        error: null,
      })

      const mockFrom = jest.fn().mockReturnValue({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({
              error: null,
            }),
          }),
        }),
      })

      ;(supabase.from as jest.Mock) = mockFrom

      const result = await deleteJob(jobId)

      expect(result).toBe(true)
      expect(mockFrom).toHaveBeenCalledWith('jobs')
    })

    it('should fail when user is not authenticated', async () => {
      ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      })

      await expect(deleteJob(jobId)).rejects.toThrow(
        'User must be authenticated to delete a job'
      )
    })

    it('should fail with database error', async () => {
      const user = mockEmployerUser()

      ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user },
        error: null,
      })

      const mockFrom = jest.fn().mockReturnValue({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({
              error: { message: 'Database error' },
            }),
          }),
        }),
      })

      ;(supabase.from as jest.Mock) = mockFrom

      await expect(deleteJob(jobId)).rejects.toThrow(
        'Failed to delete job: Database error'
      )
    })
  })

  describe('getOpenJobs', () => {
    it('should fetch all open jobs with company info', async () => {
      const jobs = [
        mockJob({ id: '1', status: 'open' }),
        mockJob({ id: '2', status: 'open' }),
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

      const result = await getOpenJobs()

      expect(result).toHaveLength(2)
      expect(mockFrom).toHaveBeenCalledWith('jobs')
    })

    it('should respect limit parameter', async () => {
      const jobs = [mockJob({ id: '1', status: 'open' })]

      const mockFrom = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockReturnValue({
              limit: jest.fn().mockResolvedValue({
                data: jobs,
                error: null,
              }),
            }),
          }),
        }),
      })

      ;(supabase.from as jest.Mock) = mockFrom

      const result = await getOpenJobs(1)

      expect(result).toHaveLength(1)
    })

    it('should return empty array when no jobs', async () => {
      const mockFrom = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({
              data: [],
              error: null,
            }),
          }),
        }),
      })

      ;(supabase.from as jest.Mock) = mockFrom

      const result = await getOpenJobs()

      expect(result).toEqual([])
    })

    it('should fail with database error', async () => {
      const mockFrom = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Database error' },
            }),
          }),
        }),
      })

      ;(supabase.from as jest.Mock) = mockFrom

      await expect(getOpenJobs()).rejects.toThrow(
        'Failed to fetch open jobs: Database error'
      )
    })
  })

  describe('getOwnJobs', () => {
    it('should fetch all jobs posted by user', async () => {
      const user = mockEmployerUser()
      const jobs = [
        mockJob({ id: '1', posted_by: user.id }),
        mockJob({ id: '2', posted_by: user.id }),
      ]

      ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user },
        error: null,
      })

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

      const result = await getOwnJobs()

      expect(result).toHaveLength(2)
      expect(result[0].posted_by).toBe(user.id)
    })

    it('should fail when user is not authenticated', async () => {
      ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      })

      await expect(getOwnJobs()).rejects.toThrow(
        'User must be authenticated to get your jobs'
      )
    })
  })

  describe('getJobById', () => {
    const jobId = 'test-job-id'

    it('should fetch a single job by id', async () => {
      const job = mockJob({ id: jobId })

      const mockFrom = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: job,
              error: null,
            }),
          }),
        }),
      })

      ;(supabase.from as jest.Mock) = mockFrom

      const result = await getJobById(jobId)

      expect(result).toEqual(job)
      expect(result?.id).toBe(jobId)
    })

    it('should return null when job not found', async () => {
      const mockFrom = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { code: 'PGRST116' },
            }),
          }),
        }),
      })

      ;(supabase.from as jest.Mock) = mockFrom

      const result = await getJobById(jobId)

      expect(result).toBeNull()
    })

    it('should throw error for other database errors', async () => {
      const mockFrom = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Database error' },
            }),
          }),
        }),
      })

      ;(supabase.from as jest.Mock) = mockFrom

      await expect(getJobById(jobId)).rejects.toThrow(
        'Failed to fetch job: Database error'
      )
    })
  })
})

