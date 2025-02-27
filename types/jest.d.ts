import '@testing-library/jest-dom';
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare global {
  namespace jest {
    interface Matchers<R> extends TestingLibraryMatchers<typeof expect.stringContaining, R> {
      toHaveTextContent: (expected: string | RegExp) => R;
    }
  }
}