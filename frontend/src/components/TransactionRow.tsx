import type { Transaction } from '@/types';
import { formatCurrency, formatDate } from '@/lib/format';

interface TransactionRowProps {
  transaction: Transaction;
}

export default function TransactionRow({ transaction }: Readonly<TransactionRowProps>) {
  const sign = transaction.type === 'expense' ? '-' : '+';

  return (
    <div className="grid grid-cols-[1fr_auto] gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-[1fr_180px_120px] sm:items-center">
      <div>
        <p className="font-medium text-slate-900">{transaction.note || 'No note'}</p>
        <p className="text-sm text-slate-500">{formatDate(transaction.transactedAt)}</p>
      </div>
      <p className="text-sm uppercase tracking-wide text-slate-600">{transaction.type}</p>
      <p className="text-right font-semibold text-slate-900">
        {sign}
        {formatCurrency(transaction.amount, transaction.currency)}
      </p>
    </div>
  );
}
