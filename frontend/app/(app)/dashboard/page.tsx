'use client';

import { Landmark, ReceiptText } from 'lucide-react';
import TransactionRow from '@/components/TransactionRow';
import Skeleton from '@/components/ui/Skeleton';
import { useAccounts } from '@/hooks/useAccounts';
import { useTransactions } from '@/hooks/useTransactions';
import { getErrorMessage } from '@/lib/errors';
import { formatCurrency } from '@/lib/format';

export default function DashboardPage() {
  const accountsQuery = useAccounts();
  const transactionsQuery = useTransactions();

  if (accountsQuery.isLoading || transactionsQuery.isLoading) {
    return (
      <section className="space-y-4">
        <Skeleton className="h-10 w-44" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-20 w-full" />
      </section>
    );
  }

  if (accountsQuery.isError) {
    return (
      <p className="rounded-md bg-rose-50 p-3 text-sm text-rose-700">
        {getErrorMessage(accountsQuery.error)}
      </p>
    );
  }

  if (transactionsQuery.isError) {
    return (
      <p className="rounded-md bg-rose-50 p-3 text-sm text-rose-700">
        {getErrorMessage(transactionsQuery.error)}
      </p>
    );
  }

  const accounts = accountsQuery.data ?? [];
  const transactions = transactionsQuery.data ?? [];
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const latestTransactions = [...transactions]
    .sort((a, b) => new Date(b.transactedAt).getTime() - new Date(a.transactedAt).getTime())
    .slice(0, 5);
  const balanceCurrency = accounts[0]?.currency ?? 'USD';

  return (
    <section className="space-y-8">
      <header className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="mb-2 flex items-center gap-2 text-slate-600">
          <Landmark className="h-4 w-4" />
          <span className="text-sm uppercase tracking-wide">Total Balance</span>
        </div>
        <p className="text-3xl font-bold text-slate-900">
          {formatCurrency(totalBalance, balanceCurrency)}
        </p>
      </header>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <ReceiptText className="h-5 w-5 text-slate-700" />
          <h2 className="text-xl font-semibold text-slate-900">Last 5 Transactions</h2>
        </div>
        {latestTransactions.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-300 p-6 text-sm text-slate-600">
            No transactions yet.
          </p>
        ) : (
          <div className="space-y-3">
            {latestTransactions.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
