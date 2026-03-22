import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createAccount,
  deleteAccount,
  getAccount,
  listAccounts,
  type AccountPayload,
} from '@/api/accounts';
import type { Account } from '@/types';

export function useAccounts() {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: listAccounts,
  });
}

export function useAccount(id: number | null) {
  return useQuery({
    queryKey: ['account', id],
    queryFn: () => getAccount(id ?? 0),
    enabled: id !== null,
  });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AccountPayload) => createAccount(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accounts'] }),
  });
}

interface DeleteContext {
  previousAccounts: Account[] | undefined;
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteAccount(id),
    onMutate: async (id: number): Promise<DeleteContext> => {
      await queryClient.cancelQueries({ queryKey: ['accounts'] });
      const previousAccounts = queryClient.getQueryData<Account[]>(['accounts']);
      queryClient.setQueryData<Account[]>(['accounts'], (old) =>
        old ? old.filter((account) => account.id !== id) : [],
      );
      return { previousAccounts };
    },
    onError: (_error, _id, context) => {
      if (context?.previousAccounts) {
        queryClient.setQueryData(['accounts'], context.previousAccounts);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['accounts'] }),
  });
}
