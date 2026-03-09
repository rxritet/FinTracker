// Central export for all shared domain types.
// These mirror the backend domain structs and grow as the API is implemented.

export interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string; // ISO-8601
}

export type AccountType = 'checking' | 'savings' | 'cash' | 'credit';

export interface Account {
  id: number;
  userId: number;
  name: string;
  type: AccountType;
  currency: string; // ISO 4217, e.g. "USD"
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export type TransactionType = 'income' | 'expense' | 'transfer';

export interface Transaction {
  id: number;
  userId: number;
  accountId: number;
  toAccountId?: number; // only for transfers
  type: TransactionType;
  amount: number;
  currency: string;
  categoryId?: number;
  note?: string;
  transactedAt: string;
  createdAt: string;
}

// Generic API response envelope returned by the backend
export interface ApiError {
  error: string;
  code: string;
}
