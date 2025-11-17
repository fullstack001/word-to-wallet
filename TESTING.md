# Frontend Testing Guide

This guide explains how to run and write tests for the Word2Wallet frontend.

## Quick Start

```bash
# Install dependencies (if not already done)
npm install

# Run all tests
npm run test:qa

# Run Jest unit/integration tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run API connection test
npm run test:api
```

## Test Structure

Tests are organized alongside source files in `__tests__` directories:

```
src/
  components/
    common/
      Loading.tsx
      __tests__/
        Loading.test.tsx
  utils/
    validation.ts
    __tests__/
      validation.test.ts
```

## Writing Tests

### Component Tests

Use React Testing Library to test components:

```typescript
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import MyComponent from '../MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('should handle user interactions', async () => {
    const user = userEvent.setup()
    render(<MyComponent />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(screen.getByText('Clicked!')).toBeInTheDocument()
  })
})
```

### Utility Tests

Test pure functions and utilities:

```typescript
import { validateField } from '../validation'

describe('validateField', () => {
  it('should validate email format', () => {
    const result = validateField('invalid', { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }, 'email')
    expect(result).toBeTruthy()
  })
})
```

### Mocking

Mock external dependencies in `jest.setup.js` or individual test files:

```typescript
// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
  }),
}))

// Mock API calls
jest.mock('@/services/api', () => ({
  fetchData: jest.fn(() => Promise.resolve({ data: 'mock' })),
}))
```

## Test Configuration

- **Jest Config**: `jest.config.js` - Uses Next.js Jest integration
- **Test Setup**: `jest.setup.js` - Global mocks and configurations
- **TypeScript**: Fully supported via Next.js Jest integration

## Coverage

Generate coverage reports:

```bash
npm run test:coverage
```

Coverage reports are generated in the `coverage/` directory. Aim for:
- **Utilities**: >90% coverage
- **Components**: >80% coverage
- **Critical paths**: 100% coverage

## Best Practices

1. **Test behavior, not implementation**: Focus on what users see and do
2. **Use semantic queries**: Prefer `getByRole`, `getByLabelText` over `getByTestId`
3. **Keep tests simple**: One assertion per test when possible
4. **Mock external dependencies**: Don't make real API calls in tests
5. **Test edge cases**: Empty states, error states, loading states
6. **Use descriptive test names**: `it('should display error message when API fails')`

## Troubleshooting

### Tests fail with "Cannot find module"

Run `npm install` to ensure all dependencies are installed.

### TypeScript errors in tests

Ensure `@types/jest` is installed and TypeScript is properly configured.

### Tests timeout

Increase timeout for slow tests:
```typescript
it('slow test', async () => {
  // test code
}, 10000) // 10 second timeout
```

### Mock not working

Ensure mocks are defined before imports:
```typescript
jest.mock('./module')
import { function } from './module'
```

## CI/CD Integration

Tests can be run in CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run tests
  run: |
    cd word2wallet-frontend
    npm install
    npm test -- --coverage --watchAll=false
```

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Next.js Testing](https://nextjs.org/docs/app/building-your-application/testing)

