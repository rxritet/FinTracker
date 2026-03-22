import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithQuery } from './test-utils';
import DashboardPage from '../app/(app)/dashboard/page';

vi.mock('@/hooks/useAccounts', () => ({
  useAccounts: () => ({
    isLoading: false,
    isError: false,
    data: [],
  }),
}));

vi.mock('@/hooks/useTransactions', () => ({
  useTransactions: () => ({
    isLoading: false,
    isError: false,
    data: [],
  }),
}));

describe('DashboardPage smoke', () => {
  it('renders without crashing', () => {
    const { getByText } = renderWithQuery(<DashboardPage />);
    expect(getByText('Last 5 Transactions')).toBeInTheDocument();
  });
});
