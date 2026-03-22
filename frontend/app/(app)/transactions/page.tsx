'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import TransactionRow from '@/components/TransactionRow';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Skeleton from '@/components/ui/Skeleton';
import {
  useCreateTransaction,
  useDeleteTransaction,
  useTransactions,
} from '@/hooks/useTransactions';
import { getErrorMessage } from '@/lib/errors';
import {
  createTransactionSchema,
  type CreateTransactionValues,
} from '@/lib/validators';
import type { TransactionType } from '@/types';

const FILTERS: Array<{ label: string; value: 'all' | TransactionType }> = [
  { label: 'All', value: 'all' },
  { label: 'Income', value: 'income' },
  { label: 'Expense', value: 'expense' },
  { label: 'Transfer', value: 'transfer' },
];

export default function TransactionsPage() {
  const [openModal, setOpenModal] = useState(false);
  const [filter, setFilter] = useState<'all' | TransactionType>('all');

  const transactionsQuery = useTransactions();
  const createTransactionMutation = useCreateTransaction();
  const deleteTransactionMutation = useDeleteTransaction();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTransactionValues>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      accountId: 1,
      type: 'expense',
      amount: 0,
      currency: 'USD',
      note: '',
      transactedAt: new Date().toISOString().slice(0, 16),
    },
  });

  const filteredTransactions = useMemo(() => {
    const transactions = transactionsQuery.data ?? [];
    const sorted = [...transactions].sort(
      (a, b) => new Date(b.transactedAt).getTime() - new Date(a.transactedAt).getTime(),
    );

    if (filter === 'all') {
      return sorted;
    }

    return sorted.filter((transaction) => transaction.type === filter);
  }, [filter, transactionsQuery.data]);

  const onSubmit = async (values: CreateTransactionValues) => {
    const payload = {
      accountId: values.accountId,
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
      accountId: values.accountId,
      type: values.type,
      amount: 0,
      currency: values.currency,
      note: '',
      transactedAt: new Date().toISOString().slice(0, 16),
    });
    setOpenModal(false);
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Transactions</h1>
        <Button onClick={() => setOpenModal(true)}>New Transaction</Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <Button
            key={item.value}
            variant={filter === item.value ? 'primary' : 'ghost'}
            onClick={() => setFilter(item.value)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      {transactionsQuery.isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : null}

      {transactionsQuery.isError ? (
        <p className="rounded-md bg-rose-50 p-3 text-sm text-rose-700">
          {getErrorMessage(transactionsQuery.error)}
        </p>
      ) : null}

      {!transactionsQuery.isLoading && !transactionsQuery.isError ? (
        <>
          {filteredTransactions.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-300 p-6 text-sm text-slate-600">
              No transactions match this filter.
            </p>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="space-y-2">
                  <TransactionRow transaction={transaction} />
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      className="text-xs"
                      disabled={deleteTransactionMutation.isPending}
                      onClick={() => {
                        deleteTransactionMutation.mutate(transaction.id);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : null}

      <Modal open={openModal} title="Create Transaction" onClose={() => setOpenModal(false)}>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Input
            id="accountId"
            label="Account ID"
            type="number"
            error={errors.accountId?.message}
            {...register('accountId')}
          />

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
