import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock ApiError class
class MockApiError extends Error {
  public status: number
  public data: unknown
  constructor(message: string, status: number, data: unknown) {
    super(message)
    this.status = status
    this.data = data
    this.name = 'ApiError'
  }
}

// Mock RequestService
const mockNativeFetchPost = vi.fn()

vi.mock('@/lib/requests/RequestService', () => ({
  RequestService: {
    nativeFetchPost: mockNativeFetchPost,
  },
  ApiError: MockApiError,
}))

// Mock the username schema
vi.mock('@/lib/server/validation/commonSchemas', () => ({
  usernameSchema: {
    safeParse: (value: string) => {
      const trimmed = value.trim()
      if (trimmed.length < 3) {
        return {
          success: false,
          error: { errors: [{ message: 'app.rules.userNameMinLength' }] },
        }
      }
      if (trimmed.length > 50) {
        return {
          success: false,
          error: { errors: [{ message: 'app.rules.userNameMaxLength' }] },
        }
      }
      if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
        return {
          success: false,
          error: { errors: [{ message: 'app.rules.userNameFormat' }] },
        }
      }
      return { success: true, data: trimmed }
    },
  },
}))

// Mock constants
vi.mock('@/lib/constants/routes', () => ({
  UPDATE_USER_ACCOUNT_NAME_API: '/api/settings/update-user-account-name',
}))

// Mock the SettingsService to prevent singleton instantiation
vi.mock('@/lib/services/settings/SettingsService', () => ({
  SettingsService: class {},
  settingsService: {},
}))

// Import after mocks
const { UpdateUserAccountNameService } =
  await import('src/lib/services/settings/user_account_name/UpdateUserAccountNameService')

describe('UpdateUserAccountNameService', () => {
  let service: InstanceType<typeof UpdateUserAccountNameService>
  const mockRequestService = {
    nativeFetchPost: mockNativeFetchPost,
  } as any

  beforeEach(() => {
    service = new UpdateUserAccountNameService(mockRequestService)
    mockNativeFetchPost.mockClear()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('updateUsername', () => {
    it('successfully updates username with valid input', async () => {
      const mockResponse = {
        isSuccess: true,
        message: 'settings.profile.usernameUpdated',
      }
      mockNativeFetchPost.mockResolvedValue(mockResponse)

      const result = await service.updateUsername({
        username: 'validuser123',
      })

      expect(result.isSuccess).toBe(true)
      expect(result.message).toBe('settings.profile.usernameUpdated')
      expect(mockNativeFetchPost).toHaveBeenCalledWith(
        '/api/settings/update-user-account-name',
        { username: 'validuser123' },
      )
    })

    it('validates username format - rejects username with less than 3 characters', async () => {
      const result = await service.updateUsername({
        username: 'ab',
      })

      expect(result.isSuccess).toBe(false)
      expect(result.message).toContain('app.rules.userNameMinLength')
      expect(mockNativeFetchPost).not.toHaveBeenCalled()
    })

    it('validates username format - rejects username with more than 50 characters', async () => {
      const longUsername = 'a'.repeat(51)
      const result = await service.updateUsername({
        username: longUsername,
      })

      expect(result.isSuccess).toBe(false)
      expect(result.message).toContain('app.rules.userNameMaxLength')
      expect(mockNativeFetchPost).not.toHaveBeenCalled()
    })

    it('validates username format - rejects username with invalid characters', async () => {
      const result = await service.updateUsername({
        username: 'invalid-user!',
      })

      expect(result.isSuccess).toBe(false)
      expect(result.message).toContain('app.rules.userNameFormat')
      expect(mockNativeFetchPost).not.toHaveBeenCalled()
    })

    it('accepts valid username with letters, numbers and underscores', async () => {
      const mockResponse = {
        isSuccess: true,
        message: 'settings.profile.usernameUpdated',
      }
      mockNativeFetchPost.mockResolvedValue(mockResponse)

      const result = await service.updateUsername({
        username: 'valid_user_123',
      })

      expect(result.isSuccess).toBe(true)
      expect(mockNativeFetchPost).toHaveBeenCalledWith(
        '/api/settings/update-user-account-name',
        { username: 'valid_user_123' },
      )
    })

    it('handles 401 error - invalid OTP', async () => {
      const apiError = new MockApiError('Unauthorized', 401, {})
      mockNativeFetchPost.mockRejectedValue(apiError)

      const result = await service.updateUsername({
        username: 'testuser',
      })

      expect(result.isSuccess).toBe(false)
      expect(result.message).toBe('app.messages.error.invalidOTP')
    })

    it('handles 409 error - username already exists', async () => {
      const apiError = new MockApiError('Conflict', 409, {})
      mockNativeFetchPost.mockRejectedValue(apiError)

      const result = await service.updateUsername({
        username: 'existinguser',
      })

      expect(result.isSuccess).toBe(false)
      expect(result.message).toBe(
        'app.messages.error.emailOrUserNameAlreadyExist',
      )
    })

    it('handles other API errors with generic error message', async () => {
      const apiError = new MockApiError('Server Error', 500, {})
      mockNativeFetchPost.mockRejectedValue(apiError)

      const result = await service.updateUsername({
        username: 'testuser',
      })

      expect(result.isSuccess).toBe(false)
      expect(result.message).toBe('settings.profile.errorUpdateUsername')
    })

    it('handles non-ApiError exceptions', async () => {
      const genericError = new Error('Network failure')
      mockNativeFetchPost.mockRejectedValue(genericError)

      const result = await service.updateUsername({
        username: 'testuser',
      })

      expect(result.isSuccess).toBe(false)
      expect(result.message).toBe('settings.profile.errorUpdateUsername')
    })

    it('trims whitespace from username before validation', async () => {
      const mockResponse = {
        isSuccess: true,
        message: 'settings.profile.usernameUpdated',
      }
      mockNativeFetchPost.mockResolvedValue(mockResponse)

      const result = await service.updateUsername({
        username: '  validuser123  ',
      })

      expect(result.isSuccess).toBe(true)
      expect(mockNativeFetchPost).toHaveBeenCalledWith(
        '/api/settings/update-user-account-name',
        { username: 'validuser123' },
      )
    })

    it('returns first validation error when multiple validation rules fail', async () => {
      // Empty string fails both required and min length
      const result = await service.updateUsername({
        username: '',
      })

      expect(result.isSuccess).toBe(false)
      expect(result.message).toBeDefined()
      expect(mockNativeFetchPost).not.toHaveBeenCalled()
    })
  })
})
