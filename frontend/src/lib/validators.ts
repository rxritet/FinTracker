import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const createAccountSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['checking', 'savings', 'cash', 'credit']),
  currency: z
    .string()
    .length(3, 'Currency must be a 3-letter code')
    .transform((value) => value.toUpperCase()),
  balance: z.coerce.number(),
});

export const createTransactionSchema = z.object({
  accountId: z.coerce.number().int().positive('Account is required'),
  type: z.enum(['income', 'expense', 'transfer']),
  amount: z.coerce.number().positive('Amount must be positive'),
  currency: z
    .string()
    .length(3, 'Currency must be a 3-letter code')
    .transform((value) => value.toUpperCase()),
  note: z.string().max(280).optional().or(z.literal('')),
  transactedAt: z.string().min(1, 'Date is required'),
  toAccountId: z.coerce.number().int().positive().optional(),
  categoryId: z.coerce.number().int().positive().optional(),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type CreateAccountValues = z.infer<typeof createAccountSchema>;
export type CreateTransactionValues = z.infer<typeof createTransactionSchema>;
