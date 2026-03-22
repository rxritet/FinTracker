import type { Account } from '@/types';
import Button from '@/components/ui/Button';
import { formatCurrency } from '@/lib/format';

interface AccountCardProps {
  account: Account;
  onOpen: (id: number) => void;
  onDelete: (id: number) => void;
  deleting: boolean;
}

export default function AccountCard({
  account,
  onOpen,
  onDelete,
  deleting,
}: Readonly<AccountCardProps>) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">{account.type}</p>
          <button
            type="button"
            className="mt-1 text-left text-lg font-semibold text-slate-900 hover:text-brand-700"
            onClick={() => onOpen(account.id)}
          >
            {account.name}
          </button>
        </div>
        <Button
          variant="danger"
          className="px-3 py-1 text-xs"
          onClick={(event) => {
            event.stopPropagation();
            onDelete(account.id);
          }}
          disabled={deleting}
        >
          Delete
        </Button>
      </div>
      <p className="mt-6 text-2xl font-bold text-slate-900">
        {formatCurrency(account.balance, account.currency)}
      </p>
    </article>
  );
}
