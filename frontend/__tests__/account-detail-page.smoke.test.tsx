import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithQuery } from './test-utils';
import AccountDetailPage from '../app/(app)/accounts/[id]/page';

vi.mock('next/navigation', () => ({
  useParams: () => ({ id: '1' }),
}));

vi.mock('@/hooks/useAccounts', () => ({
  useAccount: () => ({
    isLoading: false,
    isError: false,
    data: {
      id: 1,
      userId: 1,
      name: 'Main',
      type: 'checking',
      currency: 'USD',
      balance: 120,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  }),
}));

vi.mock('@/hooks/useTransactions', () => ({
  useTransactions: () => ({
    isLoading: false,
    isError: false,
    data: [],
  }),
  useCreateTransaction: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
    isError: false,
  }),
}));

describe('AccountDetailPage smoke', () => {
  it('renders without crashing', () => {
    const { getByText } = renderWithQuery(<AccountDetailPage />);
    expect(getByText('Transactions')).toBeInTheDocument();
  });
});
