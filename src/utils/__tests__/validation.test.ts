import {
  validateField,
  validateForm,
  VALIDATION_PATTERNS,
  VALIDATION_MESSAGES,
  VALIDATION_SCHEMAS,
} from '../validation'

describe('Validation Utilities', () => {
  describe('validateField', () => {
    it('should validate required fields', () => {
      const result = validateField('', { required: true }, 'email')
      expect(result).toBeTruthy()
    })

    it('should pass validation for non-empty required fields', () => {
      const result = validateField('test@example.com', { required: true }, 'email')
      expect(result).toBeNull()
    })

    it('should validate minLength', () => {
      const result = validateField('abc', { minLength: 5 }, 'password')
      expect(result).toBeTruthy()
    })

    it('should validate maxLength', () => {
      const result = validateField('abcdefghijklmnop', { maxLength: 10 }, 'name')
      expect(result).toBeTruthy()
    })

    it('should validate email pattern', () => {
      const invalidResult = validateField(
        'invalid-email',
        { pattern: VALIDATION_PATTERNS.email },
        'email'
      )
      expect(invalidResult).toBeTruthy()

      const validResult = validateField(
        'test@example.com',
        { pattern: VALIDATION_PATTERNS.email },
        'email'
      )
      expect(validResult).toBeNull()
    })

    it('should validate custom validation function', () => {
      const customRule = {
        custom: (value: string) => {
          if (value !== 'expected') {
            return 'Value must be "expected"'
          }
          return null
        },
      }

      const invalidResult = validateField('wrong', customRule, 'field')
      expect(invalidResult).toBe('Value must be "expected"')

      const validResult = validateField('expected', customRule, 'field')
      expect(validResult).toBeNull()
    })
  })

  describe('validateForm', () => {
    it('should validate entire form with login schema', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      }

      const result = validateForm(validData, VALIDATION_SCHEMAS.login)
      expect(result.isValid).toBe(true)
      expect(Object.keys(result.errors)).toHaveLength(0)
    })

    it('should return errors for invalid login data', () => {
      const invalidData = {
        email: 'invalid-email',
        password: '123', // too short
      }

      const result = validateForm(invalidData, VALIDATION_SCHEMAS.login)
      expect(result.isValid).toBe(false)
      expect(result.errors.email).toBeTruthy()
      expect(result.errors.password).toBeTruthy()
    })

    it('should validate signup schema', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        acceptTerms: true,
      }

      const result = validateForm(validData, VALIDATION_SCHEMAS.signup)
      expect(result.isValid).toBe(true)
    })

    it('should validate password match in signup', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'different123',
        firstName: 'John',
        lastName: 'Doe',
        acceptTerms: true,
      }

      const result = validateForm(invalidData, VALIDATION_SCHEMAS.signup)
      expect(result.isValid).toBe(false)
      expect(result.errors.confirmPassword).toBeTruthy()
    })

    it('should validate terms acceptance', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        acceptTerms: false,
      }

      const result = validateForm(invalidData, VALIDATION_SCHEMAS.signup)
      expect(result.isValid).toBe(false)
      expect(result.errors.acceptTerms).toBeTruthy()
    })
  })

  describe('VALIDATION_PATTERNS', () => {
    it('should match valid email patterns', () => {
      expect(VALIDATION_PATTERNS.email.test('test@example.com')).toBe(true)
      expect(VALIDATION_PATTERNS.email.test('user.name@domain.co.uk')).toBe(true)
      expect(VALIDATION_PATTERNS.email.test('invalid-email')).toBe(false)
      expect(VALIDATION_PATTERNS.email.test('@example.com')).toBe(false)
    })

    it('should match valid password patterns', () => {
      expect(VALIDATION_PATTERNS.password.test('password123')).toBe(true)
      expect(VALIDATION_PATTERNS.password.test('12345')).toBe(false) // too short
    })

    it('should match valid URL patterns', () => {
      expect(VALIDATION_PATTERNS.url.test('https://example.com')).toBe(true)
      expect(VALIDATION_PATTERNS.url.test('http://example.com')).toBe(true)
      expect(VALIDATION_PATTERNS.url.test('example.com')).toBe(false)
    })
  })
})

