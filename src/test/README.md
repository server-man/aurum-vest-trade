# Testing Guide

This project uses Vitest with React Testing Library for comprehensive testing.

## Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

## Test Structure

### Component Tests
Located in `src/components/__tests__/`
- Test component rendering
- Test user interactions
- Test props and state changes
- Test accessibility

### Hook Tests
Located in `src/hooks/__tests__/`
- Test custom hooks in isolation
- Test hook state management
- Test hook side effects

### Utility Tests
Located in `src/lib/__tests__/`
- Test pure functions
- Test utility helpers
- Test data transformations

### Edge Function Tests
Located in `supabase/functions/__tests__/`
- Test edge function logic
- Test API endpoints
- Test error handling

## Writing Tests

### Component Test Example
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should handle user interactions', async () => {
    const user = userEvent.setup();
    render(<MyComponent />);
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Clicked')).toBeInTheDocument();
  });
});
```

### Hook Test Example
```typescript
import { renderHook } from '@testing-library/react';
import { useMyHook } from '../useMyHook';

describe('useMyHook', () => {
  it('should return initial value', () => {
    const { result } = renderHook(() => useMyHook());
    expect(result.current.value).toBe('initial');
  });
});
```

## Coverage Goals
- Statements: > 80%
- Branches: > 80%
- Functions: > 80%
- Lines: > 80%

## Best Practices
1. Write tests alongside new features
2. Test user behavior, not implementation details
3. Use semantic queries (getByRole, getByLabelText)
4. Mock external dependencies
5. Keep tests simple and focused
6. Use descriptive test names
