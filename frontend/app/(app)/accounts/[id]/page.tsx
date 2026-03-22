'use client';

import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Skeleton from '@/components/ui/Skeleton';
import TransactionRow from '@/components/TransactionRow';
import { useAccount } from '@/hooks/useAccounts';
import { useCreateTransaction, useTransactions } from '@/hooks/useTransactions';
import { getErrorMessage } from '@/lib/errors';
import { formatCurrency } from '@/lib/format';
import {
  createTransactionSchema,
  type CreateTransactionValues,
} from '@/lib/validators';

export default function AccountDetailPage() {
  const [openModal, setOpenModal] = useState(false);
  const params = useParams<{ id: string }>();
  const accountId = Number(params.id);
  const parsedAccountId = Number.isNaN(accountId) ? null : accountId;

  const accountQuery = useAccount(parsedAccountId);
  const transactionsQuery = useTransactions();
  const createTransactionMutation = useCreateTransaction();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTransactionValues>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      accountId: parsedAccountId ?? 0,
      type: 'expense',
      amount: 0,
      currency: 'USD',
      note: '',
      transactedAt: new Date().toISOString().slice(0, 16),
    },
  });

  const accountTransactions = useMemo(() => {
    const allTransactions = transactionsQuery.data ?? [];
    if (parsedAccountId === null) {
      return [];
    }
    return allTransactions
      .filter((transaction) => transaction.accountId === parsedAccountId)
      .sort((a, b) => new Date(b.transactedAt).getTime() - new Date(a.transactedAt).getTime());
  }, [parsedAccountId, transactionsQuery.data]);

  const onSubmit = async (values: CreateTransactionValues) => {
    if (parsedAccountId === null) {
      return;
    }
    const payload = {
      accountId: parsedAccountId,
      type: values.type,
      amount: values.amount,
      currency: values.currency,
      transactedAt: values.transactedAt,
      ...(values.note ? { note: values.note } : {}),
      ...(values.toAccountId ? { toAccountId: values.toAccountId } : {}),
      ...(values.categoryId ? { categoryId: values.categoryId } : {}),
    };
    await createTransactionMutation.mutateAsync({
      ...payload,
    });
    reset({
      accountId: parsedAccountId,
      type: 'expense',
      amount: 0,
      currency: values.currency,
      note: '',
      transactedAt: new Date().toISOString().slice(0, 16),
    });
    setOpenModal(false);
  };

  if (accountQuery.isLoading || transactionsQuery.isLoading) {
    return (
      <section className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-16 w-full" />
      </section>
    );
  }

  if (accountQuery.isError) {
    return (
      <p className="rounded-md bg-rose-50 p-3 text-sm text-rose-700">
        {getErrorMessage(accountQuery.error)}
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

  const account = accountQuery.data;
  if (!account) {
    return (
      <p className="rounded-md bg-amber-50 p-3 text-sm text-amber-700">Account not found.</p>
    );
  }

  return (
    <section className="space-y-6">
      <header className="rounded-xl border border-slate-200 bg-white p-6">
        <p className="text-xs uppercase tracking-wide text-slate-500">{account.type}</p>
        <h1 className="text-2xl font-bold text-slate-900">{account.name}</h1>
        <p className="mt-2 text-lg font-semibold text-slate-900">
          {formatCurrency(account.balance, account.currency)}
        </p>
      </header>

      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-slate-900">Transactions</h2>
        <Button onClick={() => setOpenModal(true)}>New Transaction</Button>
      </div>

      {accountTransactions.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 p-6 text-sm text-slate-600">
          No transactions for this account yet.
        </p>
      ) : (
        <div className="space-y-3">
          {accountTransactions.map((transaction) => (
            <TransactionRow key={transaction.id} transaction={transaction} />
          ))}
        </div>
      )}

      <Modal open={openModal} title="Create Transaction" onClose={() => setOpenModal(false)}>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Input
            id="amount"
            label="Amount"
            type="number"
            step="0.01"
            error={errors.amount?.message}
            {...register('amount')}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="type" className="mb-1 block text-sm font-medium text-slate-700">
                Type
              </label>
              <select
                id="type"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                {...register('type')}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
                <option value="transfer">Transfer</option>
              </select>
            </div>
            <Input
              id="currency"
              label="Currency"
              maxLength={3}
              error={errors.currency?.message}
              {...register('currency')}
            />
          </div>

          <Input id="note" label="Note" error={errors.note?.message} {...register('note')} />

          <Input
            id="transactedAt"
            label="Date & Time"
            type="datetime-local"
            error={errors.transactedAt?.message}
            {...register('transactedAt')}
          />

          {createTransactionMutation.isError ? (
            <p className="rounded-md bg-rose-50 p-3 text-sm text-rose-700">
              {getErrorMessage(createTransactionMutation.error)}
            </p>
          ) : null}

          <Button type="submit" className="w-full" disabled={createTransactionMutation.isPending}>
            {createTransactionMutation.isPending ? 'Saving...' : 'Save Transaction'}
          </Button>
        </form>
      </Modal>
    </section>
  );
}
