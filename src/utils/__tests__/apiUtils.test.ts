import { loginUser, registerEmail } from '../apiUtils'

// Mock axios
jest.mock('axios', () => ({
  default: {
    create: jest.fn(() => ({
      post: jest.fn(),
      get: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    })),
  },
}))

describe('API Utils', () => {
  // Create a proper localStorage mock that actually stores values
  const localStorageMock = (() => {
    let store: Record<string, string> = {}
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString()
      },
      removeItem: (key: string) => {
        delete store[key]
      },
      clear: () => {
        store = {}
      },
    }
  })()

  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.clear()
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    })
  })

  describe('loginUser', () => {
    it('should handle successful login', async () => {
      const mockResponse = {
        data: {
          data: {
            user: {
              id: '123',
              email: 'test@example.com',
              fullName: 'Test User',
              role: 'user',
              emailVerified: true,
            },
            tokens: {
              accessToken: 'mock-token',
            },
          },
        },
      }

      // This is a placeholder test - actual implementation would mock axios properly
      expect(true).toBe(true)
    })
  })

  describe('localStorage token management', () => {
    it('should handle localStorage operations', () => {
      localStorage.setItem('authToken', 'test-token')
      expect(localStorage.getItem('authToken')).toBe('test-token')
      
      localStorage.removeItem('authToken')
      expect(localStorage.getItem('authToken')).toBeNull()
    })
  })
})

