'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AccountCard from '@/components/AccountCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Skeleton from '@/components/ui/Skeleton';
import { useAccounts, useCreateAccount, useDeleteAccount } from '@/hooks/useAccounts';
import { createAccountSchema, type CreateAccountValues } from '@/lib/validators';
import { getErrorMessage } from '@/lib/errors';

export default function AccountsPage() {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const accountsQuery = useAccounts();
  const createAccountMutation = useCreateAccount();
  const deleteAccountMutation = useDeleteAccount();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateAccountValues>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      name: '',
      type: 'checking',
      currency: 'USD',
      balance: 0,
    },
  });

  const onSubmit = async (values: CreateAccountValues) => {
    await createAccountMutation.mutateAsync(values);
    reset();
    setOpenModal(false);
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Accounts</h1>
        <Button onClick={() => setOpenModal(true)}>New Account</Button>
      </div>

      {accountsQuery.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : null}

      {accountsQuery.isError ? (
        <p className="rounded-md bg-rose-50 p-3 text-sm text-rose-700">
          {getErrorMessage(accountsQuery.error)}
        </p>
      ) : null}

      {!accountsQuery.isLoading && !accountsQuery.isError ? (
        <>
          {(accountsQuery.data ?? []).length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-300 p-8 text-sm text-slate-600">
              No accounts yet. Create your first account.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {(accountsQuery.data ?? []).map((account) => (
                <AccountCard
                  key={account.id}
                  account={account}
                  deleting={deleteAccountMutation.isPending}
                  onOpen={(id) => router.push(`/accounts/${id}`)}
                  onDelete={(id) => {
                    deleteAccountMutation.mutate(id);
                  }}
                />
              ))}
            </div>
          )}
        </>
      ) : null}

      <Modal open={openModal} title="Create Account" onClose={() => setOpenModal(false)}>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Input label="Name" id="name" error={errors.name?.message} {...register('name')} />

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
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
                <option value="cash">Cash</option>
                <option value="credit">Credit</option>
              </select>
            </div>

            <Input
              label="Currency"
              id="currency"
              maxLength={3}
              error={errors.currency?.message}
              {...register('currency')}
            />
          </div>

          <Input
            label="Initial Balance"
            id="balance"
            type="number"
            step="0.01"
            error={errors.balance?.message}
            {...register('balance')}
          />

          {createAccountMutation.isError ? (
            <p className="rounded-md bg-rose-50 p-3 text-sm text-rose-700">
              {getErrorMessage(createAccountMutation.error)}
            </p>
          ) : null}

          <Button type="submit" className="w-full" disabled={createAccountMutation.isPending}>
            {createAccountMutation.isPending ? 'Creating...' : 'Create Account'}
          </Button>
        </form>
      </Modal>
    </section>
  );
}
