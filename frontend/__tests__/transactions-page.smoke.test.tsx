import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithQuery } from './test-utils';
import TransactionsPage from '../app/(app)/transactions/page';

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
  useDeleteTransaction: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
}));

describe('TransactionsPage smoke', () => {
  it('renders without crashing', () => {
    const { getByText } = renderWithQuery(<TransactionsPage />);
    expect(getByText('Transactions')).toBeInTheDocument();
  });
});
