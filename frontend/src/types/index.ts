export interface User { id: number; email: string; name: string; createdAt: string; }
export type AccountType = 'checking' | 'savings' | 'cash' | 'credit';
export interface Account { id: number; userId: number; name: string; type: AccountType; currency: string; balance: number; createdAt: string; updatedAt: string; }
export type TransactionType = 'income' | 'expense' | 'transfer';
export interface Transaction { id: number; userId: number; accountId: number; toAccountId?: number; type: TransactionType; amount: number; currency: string; categoryId?: number; note?: string; transactedAt: string; createdAt: string; }
export interface ApiError { error: string; code: string; }
