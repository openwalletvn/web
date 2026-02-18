import { getBankImageUrl, type Bank } from '@/lib/api';

export function BankSelectionStep({
  banks,
  loading,
  onSelect,
}: {
  banks: Bank[];
  loading: boolean;
  onSelect: (bank: Bank) => void;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2 p-4 border border-dashed border-slate-200 rounded-sm">
            <div className="w-12 h-12 bg-slate-100 rounded-sm animate-pulse" />
            <div className="w-14 h-3 bg-slate-100 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {banks.map((bank) => (
        <button
          key={bank.id}
          onClick={() => onSelect(bank)}
          className="flex flex-col items-center gap-2 p-4 border border-dashed border-slate-200 rounded-sm hover:border-brand-blue hover:bg-blue-50/40 transition-colors text-center"
        >
          <img src={getBankImageUrl(bank.logo_url)} alt={bank.name} className="w-12 h-12 object-contain" />
          <span className="text-slate-600 leading-tight">{bank.name}</span>
        </button>
      ))}
    </div>
  );
}
