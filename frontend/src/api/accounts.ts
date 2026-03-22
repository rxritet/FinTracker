import apiClient from './client';
import type { Account } from '@/types';

export type AccountPayload = Omit<Account, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;

export async function listAccounts(): Promise<Account[]> {
  const { data } = await apiClient.get<Account[]>('/accounts');
  return data;
}

export async function getAccount(id: number): Promise<Account> {
  const { data } = await apiClient.get<Account>(`/accounts/${id}`);
  return data;
}

export async function createAccount(body: AccountPayload): Promise<Account> {
  const { data } = await apiClient.post<Account>('/accounts', body);
  return data;
}

export async function updateAccount(id: number, body: AccountPayload): Promise<Account> {
  const { data } = await apiClient.put<Account>(`/accounts/${id}`, body);
  return data;
}

export async function deleteAccount(id: number): Promise<void> {
  await apiClient.delete(`/accounts/${id}`);
}
