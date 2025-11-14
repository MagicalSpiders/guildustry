import { supabase } from '@/src/lib/supabase'
import {
  insertApplication,
  updateApplication,
  getOwnApplications,
  getApplicationsByJobId,
  getApplicationsForEmployer,
  deleteApplication,
} from '@/src/lib/applicationsFunctions'
import {
  mockApplication,
  mockUser,
  mockEmployerUser,
  mockJob,
  mockCandidateProfile,
} from '../../setup/testUtils'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('Application Functions', () => {
  describe('insertApplication', () => {
    const mockAppData = {
      job_id: 'test-job-id',
      applicant_id: 'test-user-id',
      cover_letter: 'I am interested in this position',
      resume_url: 'https://example.com/resume.pdf',
      submitted_at: new Date().toISOString(),
    }

    it('should successfully create an application', async () => {
      const user = mockUser()
      const application = mockApplication(mockAppData)

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

      ;(supabase.from as jest.Mock) = mockFrom

      const result = await insertApplication(mockAppData)

      expect(result).toEqual(application)
      expect(mockFrom).toHaveBeenCalledWith('applications')
    })

    it('should fail when user is not authenticated', async () => {
      ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      })

      await expect(insertApplication(mockAppData)).rejects.toThrow(
        'User must be authenticated to submit an application'
      )
    })

    it('should fail when user already applied to the job', async () => {
      const user = mockUser()
      const existingApp = mockApplication({ id: 'existing-app-id' })

      ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user },
        error: null,
      })

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

      await expect(insertApplication(mockAppData)).rejects.toThrow(
        'You have already applied to this job'
      )
    })

    it('should default to pending status if not specified', async () => {
      const user = mockUser()
      const application = mockApplication({ ...mockAppData, status: 'pending' })

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
                error: { code: 'PGRST116' },
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

      ;(supabase.from as jest.Mock) = mockFrom

      const result = await insertApplication(mockAppData)

      expect(result.status).toBe('pending')
    })

    it('should fail with database error', async () => {
      const user = mockUser()

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
                error: { code: 'PGRST116' },
              }),
            }),
          }),
        }),
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

      await expect(insertApplication(mockAppData)).rejects.toThrow(
        'Failed to submit application: Database error'
      )
    })
  })

  describe('updateApplication', () => {
    const appId = 'test-application-id'
    const updates = {
      status: 'underReview',
    }

    it('should successfully update application status', async () => {
      const updatedApp = mockApplication({ id: appId, status: 'underReview' })

      const mockFrom = jest.fn().mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: updatedApp,
                error: null,
              }),
            }),
          }),
        }),
      })

      ;(supabase.from as jest.Mock) = mockFrom

      const result = await updateApplication(appId, updates)

      expect(result.status).toBe('underReview')
      expect(mockFrom).toHaveBeenCalledWith('applications')
    })

    it('should fail with database error', async () => {
      const mockFrom = jest.fn().mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: null,
                error: { message: 'Database error' },
              }),
            }),
          }),
        }),
      })

      ;(supabase.from as jest.Mock) = mockFrom

      await expect(updateApplication(appId, updates)).rejects.toThrow(
        'Failed to update application: Database error'
      )
    })
  })

  describe('getOwnApplications', () => {
    it('should fetch all applications for authenticated user', async () => {
      const user = mockUser()
      const applications = [
        mockApplication({ id: '1', applicant_id: user.id }),
        mockApplication({ id: '2', applicant_id: user.id }),
      ]

      ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user },
        error: null,
      })

      const mockFrom = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({
              data: applications,
              error: null,
            }),
          }),
        }),
      })

      ;(supabase.from as jest.Mock) = mockFrom

      const result = await getOwnApplications()

      expect(result).toHaveLength(2)
      expect(result[0].applicant_id).toBe(user.id)
    })

    it('should return empty array when user is not authenticated', async () => {
      ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      })

      const result = await getOwnApplications()

      expect(result).toEqual([])
    })

    it('should return empty array when no applications exist', async () => {
      const user = mockUser()

      ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user },
        error: null,
      })

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

      const result = await getOwnApplications()

      expect(result).toEqual([])
    })

    it('should fail with database error', async () => {
      const user = mockUser()

      ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user },
        error: null,
      })

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

      await expect(getOwnApplications()).rejects.toThrow(
        'Failed to fetch applications: Database error'
      )
    })
  })

  describe('getApplicationsByJobId', () => {
    const jobId = 'test-job-id'

    it('should fetch all applications for a specific job', async () => {
      const applications = [
        mockApplication({ id: '1', job_id: jobId }),
        mockApplication({ id: '2', job_id: jobId }),
      ]

      const mockFrom = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({
              data: applications,
              error: null,
            }),
          }),
        }),
      })

      ;(supabase.from as jest.Mock) = mockFrom

      const result = await getApplicationsByJobId(jobId)

      expect(result).toHaveLength(2)
      expect(result[0].job_id).toBe(jobId)
    })

    it('should return empty array when no applications exist', async () => {
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

      const result = await getApplicationsByJobId(jobId)

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

      await expect(getApplicationsByJobId(jobId)).rejects.toThrow(
        'Failed to fetch applications: Database error'
      )
    })
  })

  describe('getApplicationsForEmployer', () => {
    it('should fetch all applications for jobs posted by employer', async () => {
      const user = mockEmployerUser()
      const jobs = [
        mockJob({ id: 'job-1', employer_id: user.id }),
        mockJob({ id: 'job-2', employer_id: user.id }),
      ]
      const applications = [
        mockApplication({ id: '1', job_id: 'job-1' }),
        mockApplication({ id: '2', job_id: 'job-2' }),
      ]

      ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user },
        error: null,
      })

      const mockFrom = jest.fn()
        .mockReturnValueOnce({
          // First call for jobs
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({
              data: jobs,
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

      const result = await getApplicationsForEmployer()

      expect(result).toHaveLength(2)
    })

    it('should return empty array when user is not authenticated', async () => {
      ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      })

      const result = await getApplicationsForEmployer()

      expect(result).toEqual([])
    })

    it('should return empty array when employer has no jobs', async () => {
      const user = mockEmployerUser()

      ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user },
        error: null,
      })

      const mockFrom = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: [],
            error: null,
          }),
        }),
      })

      ;(supabase.from as jest.Mock) = mockFrom

      const result = await getApplicationsForEmployer()

      expect(result).toEqual([])
    })

    it('should fail with database error when fetching jobs', async () => {
      const user = mockEmployerUser()

      ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user },
        error: null,
      })

      const mockFrom = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Database error' },
          }),
        }),
      })

      ;(supabase.from as jest.Mock) = mockFrom

      await expect(getApplicationsForEmployer()).rejects.toThrow(
        'Failed to fetch employer jobs: Database error'
      )
    })
  })

  describe('deleteApplication', () => {
    const appId = 'test-application-id'

    it('should successfully delete own application', async () => {
      const user = mockUser()
      const application = mockApplication({ id: appId, applicant_id: user.id })

      ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user },
        error: null,
      })

      const mockFrom = jest.fn()
        .mockReturnValueOnce({
          // First call to verify ownership
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: application,
                error: null,
              }),
            }),
          }),
        })
        .mockReturnValueOnce({
          // Second call to delete
          delete: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({
              error: null,
            }),
          }),
        })

      ;(supabase.from as jest.Mock) = mockFrom

      const result = await deleteApplication(appId)

      expect(result).toBe(true)
    })

    it('should fail when user is not authenticated', async () => {
      ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      })

      await expect(deleteApplication(appId)).rejects.toThrow(
        'User must be authenticated to delete an application'
      )
    })

    it('should fail when application not found', async () => {
      const user = mockUser()

      ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user },
        error: null,
      })

      const mockFrom = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Not found' },
            }),
          }),
        }),
      })

      ;(supabase.from as jest.Mock) = mockFrom

      await expect(deleteApplication(appId)).rejects.toThrow(
        'Application not found'
      )
    })

    it('should fail when user does not own the application', async () => {
      const user = mockUser()
      const application = mockApplication({
        id: appId,
        applicant_id: 'different-user-id',
      })

      ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user },
        error: null,
      })

      const mockFrom = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: application,
              error: null,
            }),
          }),
        }),
      })

      ;(supabase.from as jest.Mock) = mockFrom

      await expect(deleteApplication(appId)).rejects.toThrow(
        "You don't have permission to delete this application"
      )
    })

    it('should fail with database error', async () => {
      const user = mockUser()
      const application = mockApplication({ id: appId, applicant_id: user.id })

      ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user },
        error: null,
      })

      const mockFrom = jest.fn()
        .mockReturnValueOnce({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: application,
                error: null,
              }),
            }),
          }),
        })
        .mockReturnValueOnce({
          delete: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({
              error: { message: 'Database error' },
            }),
          }),
        })

      ;(supabase.from as jest.Mock) = mockFrom

      await expect(deleteApplication(appId)).rejects.toThrow(
        'Failed to delete application: Database error'
      )
    })
  })
})

