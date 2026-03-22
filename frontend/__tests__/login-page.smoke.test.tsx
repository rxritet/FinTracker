import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithQuery } from './test-utils';
import LoginPage from '../app/(auth)/login/page';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: vi.fn(),
  }),
}));

describe('LoginPage smoke', () => {
  it('renders without crashing', () => {
    const { getByText } = renderWithQuery(<LoginPage />);
    expect(getByText('Login to FinTracker')).toBeInTheDocument();
  });
});
