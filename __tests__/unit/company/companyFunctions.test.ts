import { supabase } from '@/src/lib/supabase'
import {
  insertCompany,
  updateCompany,
  getCompanyByOwner,
  getCompanyById,
  deleteCompany,
} from '@/src/lib/companyFunctions'
import { mockCompany, mockEmployerUser } from '../../setup/testUtils'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('Company Functions', () => {
  describe('insertCompany', () => {
    const mockCompanyData = {
      owner_id: 'test-employer-id',
      name: 'Test Construction Co.',
      industry: 'Construction',
      headquarters: 'New York, NY',
      founded: '2020',
      website: 'https://testconstruction.com',
      description: 'A leading construction company',
      size: '50-200 employees',
      specialties: ['Commercial Construction', 'Residential'],
      values: ['Safety First', 'Quality'],
      benefits: ['Health Insurance', '401k'],
      contact_email: 'hr@testconstruction.com',
      contact_phone: '555-5678',
      contact_address: '123 Main St, New York, NY',
      linkedin: 'https://linkedin.com/company/test',
      twitter: null,
      facebook: null,
    }

    it('should successfully create a company with specialties, values, and benefits', async () => {
      const user = mockEmployerUser()
      const company = mockCompany(mockCompanyData)

      ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user },
        error: null,
      })

      const mockFrom = jest.fn().mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: company,
              error: null,
            }),
          }),
        }),
      })

      ;(supabase.from as jest.Mock) = mockFrom

      const result = await insertCompany(mockCompanyData)

      expect(supabase.auth.getUser).toHaveBeenCalled()
      expect(mockFrom).toHaveBeenCalledWith('companies')
      expect(result).toEqual(company)
      expect(result.specialties).toEqual(mockCompanyData.specialties)
      expect(result.values).toEqual(mockCompanyData.values)
      expect(result.benefits).toEqual(mockCompanyData.benefits)
    })

    it('should successfully create a company with empty arrays for optional fields', async () => {
      const user = mockEmployerUser()
      const companyDataWithoutArrays = {
        ...mockCompanyData,
        specialties: [],
        values: [],
        benefits: [],
      }
      const company = mockCompany(companyDataWithoutArrays)

      ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user },
        error: null,
      })

      const mockFrom = jest.fn().mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: company,
              error: null,
            }),
          }),
        }),
      })

      ;(supabase.from as jest.Mock) = mockFrom

      const result = await insertCompany(companyDataWithoutArrays)

      expect(result.specialties).toEqual([])
      expect(result.values).toEqual([])
      expect(result.benefits).toEqual([])
    })

    it('should fail when user is not authenticated', async () => {
      ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      })

      await expect(insertCompany(mockCompanyData)).rejects.toThrow(
        'User must be authenticated to create a company'
      )
    })

    it('should fail when company already exists', async () => {
      const user = mockEmployerUser()

      ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user },
        error: null,
      })

      const mockFrom = jest.fn().mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { code: '23505', message: 'Duplicate key' },
            }),
          }),
        }),
      })

      ;(supabase.from as jest.Mock) = mockFrom

      await expect(insertCompany(mockCompanyData)).rejects.toThrow(
        'A company already exists for this user'
      )
    })
  })

  describe('updateCompany', () => {
    const updateData = {
      name: 'Updated Company Name',
      specialties: ['New Specialty 1', 'New Specialty 2'],
      values: ['New Value 1'],
      benefits: ['New Benefit 1', 'New Benefit 2', 'New Benefit 3'],
    }

    it('should successfully update company with specialties, values, and benefits', async () => {
      const user = mockEmployerUser()
      const updatedCompany = mockCompany({
        ...updateData,
        owner_id: user.id,
      })

      ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user },
        error: null,
      })

      const mockFrom = jest.fn().mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: updatedCompany,
                error: null,
              }),
            }),
          }),
        }),
      })

      ;(supabase.from as jest.Mock) = mockFrom

      const result = await updateCompany(updateData)

      expect(supabase.auth.getUser).toHaveBeenCalled()
      expect(mockFrom).toHaveBeenCalledWith('companies')
      expect(result).toEqual(updatedCompany)
      expect(result.specialties).toEqual(updateData.specialties)
      expect(result.values).toEqual(updateData.values)
      expect(result.benefits).toEqual(updateData.benefits)
    })

    it('should successfully update company with empty arrays', async () => {
      const user = mockEmployerUser()
      const updateDataWithEmptyArrays = {
        ...updateData,
        specialties: [],
        values: [],
        benefits: [],
      }
      const updatedCompany = mockCompany({
        ...updateDataWithEmptyArrays,
        owner_id: user.id,
      })

      ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user },
        error: null,
      })

      const mockFrom = jest.fn().mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: updatedCompany,
                error: null,
              }),
            }),
          }),
        }),
      })

      ;(supabase.from as jest.Mock) = mockFrom

      const result = await updateCompany(updateDataWithEmptyArrays)

      expect(result.specialties).toEqual([])
      expect(result.values).toEqual([])
      expect(result.benefits).toEqual([])
    })

    it('should fail when user is not authenticated', async () => {
      ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      })

      await expect(updateCompany(updateData)).rejects.toThrow(
        'User must be authenticated to update company'
      )
    })

    it('should fail when company is not found', async () => {
      const user = mockEmployerUser()

      ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user },
        error: null,
      })

      const mockFrom = jest.fn().mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: null,
                error: { code: 'PGRST116', message: 'Not found' },
              }),
            }),
          }),
        }),
      })

      ;(supabase.from as jest.Mock) = mockFrom

      await expect(updateCompany(updateData)).rejects.toThrow('Company not found')
    })
  })

  describe('getCompanyByOwner', () => {
    it('should successfully retrieve company with specialties, values, and benefits', async () => {
      const user = mockEmployerUser()
      const company = mockCompany({
        owner_id: user.id,
        specialties: ['Commercial', 'Residential'],
        values: ['Safety', 'Quality'],
        benefits: ['Health Insurance', '401k'],
      })

      ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user },
        error: null,
      })

      const mockFrom = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: company,
              error: null,
            }),
          }),
        }),
      })

      ;(supabase.from as jest.Mock) = mockFrom

      const result = await getCompanyByOwner()

      expect(supabase.auth.getUser).toHaveBeenCalled()
      expect(mockFrom).toHaveBeenCalledWith('companies')
      expect(result).toEqual(company)
      expect(result?.specialties).toEqual(['Commercial', 'Residential'])
      expect(result?.values).toEqual(['Safety', 'Quality'])
      expect(result?.benefits).toEqual(['Health Insurance', '401k'])
    })

    it('should return null when company does not exist', async () => {
      const user = mockEmployerUser()

      ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user },
        error: null,
      })

      const mockFrom = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { code: 'PGRST116', message: 'Not found' },
            }),
          }),
        }),
      })

      ;(supabase.from as jest.Mock) = mockFrom

      const result = await getCompanyByOwner()

      expect(result).toBeNull()
    })

    it('should fail when user is not authenticated', async () => {
      ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      })

      await expect(getCompanyByOwner()).rejects.toThrow(
        'User must be authenticated to get company'
      )
    })
  })

  describe('getCompanyById', () => {
    it('should successfully retrieve company by ID with all array fields', async () => {
      const company = mockCompany({
        id: 'test-company-id',
        specialties: ['Specialty 1', 'Specialty 2'],
        values: ['Value 1'],
        benefits: ['Benefit 1', 'Benefit 2'],
      })

      const mockFrom = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: company,
              error: null,
            }),
          }),
        }),
      })

      ;(supabase.from as jest.Mock) = mockFrom

      const result = await getCompanyById('test-company-id')

      expect(mockFrom).toHaveBeenCalledWith('companies')
      expect(result).toEqual(company)
      expect(result?.specialties).toHaveLength(2)
      expect(result?.values).toHaveLength(1)
      expect(result?.benefits).toHaveLength(2)
    })

    it('should return null when company does not exist', async () => {
      const mockFrom = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { code: 'PGRST116', message: 'Not found' },
            }),
          }),
        }),
      })

      ;(supabase.from as jest.Mock) = mockFrom

      const result = await getCompanyById('non-existent-id')

      expect(result).toBeNull()
    })
  })

  describe('deleteCompany', () => {
    it('should successfully delete company', async () => {
      const user = mockEmployerUser()

      ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user },
        error: null,
      })

      const mockFrom = jest.fn().mockReturnValue({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: null,
            error: null,
          }),
        }),
      })

      ;(supabase.from as jest.Mock) = mockFrom

      const result = await deleteCompany()

      expect(supabase.auth.getUser).toHaveBeenCalled()
      expect(mockFrom).toHaveBeenCalledWith('companies')
      expect(result).toBe(true)
    })

    it('should fail when user is not authenticated', async () => {
      ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      })

      await expect(deleteCompany()).rejects.toThrow(
        'User must be authenticated to delete company'
      )
    })
  })
})

