import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithQuery } from './test-utils';
import AccountsPage from '../app/(app)/accounts/page';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock('@/hooks/useAccounts', () => ({
  useAccounts: () => ({
    isLoading: false,
    isError: false,
    data: [],
  }),
  useCreateAccount: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
    isError: false,
  }),
  useDeleteAccount: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
}));

describe('AccountsPage smoke', () => {
  it('renders without crashing', () => {
    const { getByText } = renderWithQuery(<AccountsPage />);
    expect(getByText('Accounts')).toBeInTheDocument();
  });
});
