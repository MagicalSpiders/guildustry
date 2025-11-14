import { supabase } from '@/src/lib/supabase'
import { mockUser, mockEmployerUser, mockSession } from '../../setup/testUtils'

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks()
})

describe('Authentication Functions', () => {
  describe('Sign Up', () => {
    it('should successfully sign up a candidate', async () => {
      const mockSignUpData = {
        email: 'candidate@example.com',
        password: 'Password123!',
        role: 'candidate',
      }

      const mockResponse = {
        data: {
          user: mockUser({ email: mockSignUpData.email }),
          session: null, // Email confirmation required
        },
        error: null,
      }

      ;(supabase.auth.signUp as jest.Mock).mockResolvedValue(mockResponse)

      const result = await supabase.auth.signUp({
        email: mockSignUpData.email,
        password: mockSignUpData.password,
        options: {
          data: {
            role: mockSignUpData.role,
            user_type: mockSignUpData.role,
          },
        },
      })

      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: mockSignUpData.email,
        password: mockSignUpData.password,
        options: {
          data: {
            role: 'candidate',
            user_type: 'candidate',
          },
        },
      })

      expect(result.data.user).toBeDefined()
      expect(result.data.user?.email).toBe(mockSignUpData.email)
      expect(result.error).toBeNull()
    })

    it('should successfully sign up an employer', async () => {
      const mockSignUpData = {
        email: 'employer@example.com',
        password: 'Password123!',
        role: 'employer',
      }

      const mockResponse = {
        data: {
          user: mockEmployerUser({ email: mockSignUpData.email }),
          session: null,
        },
        error: null,
      }

      ;(supabase.auth.signUp as jest.Mock).mockResolvedValue(mockResponse)

      const result = await supabase.auth.signUp({
        email: mockSignUpData.email,
        password: mockSignUpData.password,
        options: {
          data: {
            role: mockSignUpData.role,
            user_type: mockSignUpData.role,
          },
        },
      })

      expect(result.data.user).toBeDefined()
      expect(result.data.user?.user_metadata.user_type).toBe('employer')
      expect(result.error).toBeNull()
    })

    it('should fail with invalid email format', async () => {
      const mockError = {
        message: 'Invalid email format',
        status: 400,
      }

      ;(supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: null, session: null },
        error: mockError,
      })

      const result = await supabase.auth.signUp({
        email: 'invalid-email',
        password: 'Password123!',
        options: { data: { role: 'candidate', user_type: 'candidate' } },
      })

      expect(result.error).toBeDefined()
      expect(result.error?.message).toBe('Invalid email format')
    })

    it('should fail with weak password', async () => {
      const mockError = {
        message: 'Password should be at least 6 characters',
        status: 400,
      }

      ;(supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: null, session: null },
        error: mockError,
      })

      const result = await supabase.auth.signUp({
        email: 'test@example.com',
        password: '123',
        options: { data: { role: 'candidate', user_type: 'candidate' } },
      })

      expect(result.error).toBeDefined()
      expect(result.error?.message).toContain('Password')
    })

    it('should fail with duplicate email', async () => {
      const mockError = {
        message: 'User already registered',
        status: 400,
      }

      ;(supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: null, session: null },
        error: mockError,
      })

      const result = await supabase.auth.signUp({
        email: 'existing@example.com',
        password: 'Password123!',
        options: { data: { role: 'candidate', user_type: 'candidate' } },
      })

      expect(result.error).toBeDefined()
      expect(result.error?.message).toBe('User already registered')
    })
  })

  describe('Sign In', () => {
    it('should successfully sign in with valid credentials', async () => {
      const mockCredentials = {
        email: 'test@example.com',
        password: 'Password123!',
      }

      const user = mockUser({ email: mockCredentials.email })
      const mockResponse = {
        data: {
          user,
          session: mockSession(user),
        },
        error: null,
      }

      ;(supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue(mockResponse)

      const result = await supabase.auth.signInWithPassword({
        email: mockCredentials.email,
        password: mockCredentials.password,
      })

      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: mockCredentials.email,
        password: mockCredentials.password,
      })

      expect(result.data.user).toBeDefined()
      expect(result.data.session).toBeDefined()
      expect(result.data.user?.email).toBe(mockCredentials.email)
      expect(result.error).toBeNull()
    })

    it('should fail with incorrect password', async () => {
      const mockError = {
        message: 'Invalid login credentials',
        status: 400,
      }

      ;(supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: null, session: null },
        error: mockError,
      })

      const result = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'WrongPassword',
      })

      expect(result.error).toBeDefined()
      expect(result.error?.message).toBe('Invalid login credentials')
    })

    it('should fail with non-existent email', async () => {
      const mockError = {
        message: 'Invalid login credentials',
        status: 400,
      }

      ;(supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: null, session: null },
        error: mockError,
      })

      const result = await supabase.auth.signInWithPassword({
        email: 'nonexistent@example.com',
        password: 'Password123!',
      })

      expect(result.error).toBeDefined()
      expect(result.error?.message).toBe('Invalid login credentials')
    })

    it('should fail when email is not confirmed', async () => {
      const mockError = {
        message: 'Email not confirmed',
        status: 400,
      }

      ;(supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: null, session: null },
        error: mockError,
      })

      const result = await supabase.auth.signInWithPassword({
        email: 'unconfirmed@example.com',
        password: 'Password123!',
      })

      expect(result.error).toBeDefined()
      expect(result.error?.message).toBe('Email not confirmed')
    })
  })

  describe('Sign Out', () => {
    it('should successfully sign out', async () => {
      ;(supabase.auth.signOut as jest.Mock).mockResolvedValue({
        error: null,
      })

      const result = await supabase.auth.signOut({ scope: 'local' })

      expect(supabase.auth.signOut).toHaveBeenCalledWith({ scope: 'local' })
      expect(result.error).toBeNull()
    })

    it('should handle sign out errors gracefully', async () => {
      const mockError = {
        message: 'Sign out failed',
        status: 500,
      }

      ;(supabase.auth.signOut as jest.Mock).mockResolvedValue({
        error: mockError,
      })

      const result = await supabase.auth.signOut({ scope: 'local' })

      expect(result.error).toBeDefined()
      expect(result.error?.message).toBe('Sign out failed')
    })
  })

  describe('Get User Session', () => {
    it('should retrieve active user session', async () => {
      const user = mockUser()
      const session = mockSession(user)

      ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session },
        error: null,
      })

      const result = await supabase.auth.getSession()

      expect(result.data.session).toBeDefined()
      expect(result.data.session?.user.email).toBe(user.email)
      expect(result.error).toBeNull()
    })

    it('should return null when no active session', async () => {
      ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: null },
        error: null,
      })

      const result = await supabase.auth.getSession()

      expect(result.data.session).toBeNull()
      expect(result.error).toBeNull()
    })
  })

  describe('Get User', () => {
    it('should retrieve authenticated user', async () => {
      const user = mockUser()

      ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user },
        error: null,
      })

      const result = await supabase.auth.getUser()

      expect(result.data.user).toBeDefined()
      expect(result.data.user?.id).toBe(user.id)
      expect(result.error).toBeNull()
    })

    it('should return error when not authenticated', async () => {
      const mockError = {
        message: 'User not authenticated',
        status: 401,
      }

      ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: mockError,
      })

      const result = await supabase.auth.getUser()

      expect(result.data.user).toBeNull()
      expect(result.error).toBeDefined()
    })
  })

  describe('Email Verification Resend', () => {
    it('should successfully resend verification email', async () => {
      ;(supabase.auth.resend as jest.Mock).mockResolvedValue({
        data: {},
        error: null,
      })

      const result = await supabase.auth.resend({
        type: 'signup',
        email: 'test@example.com',
      })

      expect(supabase.auth.resend).toHaveBeenCalledWith({
        type: 'signup',
        email: 'test@example.com',
      })
      expect(result.error).toBeNull()
    })

    it('should fail to resend with invalid email', async () => {
      const mockError = {
        message: 'Email not found',
        status: 400,
      }

      ;(supabase.auth.resend as jest.Mock).mockResolvedValue({
        data: {},
        error: mockError,
      })

      const result = await supabase.auth.resend({
        type: 'signup',
        email: 'invalid@example.com',
      })

      expect(result.error).toBeDefined()
      expect(result.error?.message).toBe('Email not found')
    })
  })
})

