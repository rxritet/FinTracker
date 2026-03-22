import apiClient from './client';
import type { Transaction } from '@/types';

export type TransactionPayload = Omit<Transaction, 'id' | 'userId' | 'createdAt'>;

export async function listTransactions(): Promise<Transaction[]> {
  const { data } = await apiClient.get<Transaction[]>('/transactions');
  return data;
}

export async function getTransaction(id: number): Promise<Transaction> {
  const { data } = await apiClient.get<Transaction>(`/transactions/${id}`);
  return data;
}

export async function createTransaction(body: TransactionPayload): Promise<Transaction> {
  const { data } = await apiClient.post<Transaction>('/transactions', body);
  return data;
}

export async function updateTransaction(id: number, body: TransactionPayload): Promise<Transaction> {
  const { data } = await apiClient.put<Transaction>(`/transactions/${id}`, body);
  return data;
}

export async function deleteTransaction(id: number): Promise<void> {
  await apiClient.delete(`/transactions/${id}`);
}
