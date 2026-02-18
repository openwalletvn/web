import { getBankImageUrl, getCardImageUrl, type Bank, type Card } from '@/lib/api';

export function CardSelectionStep({
  bank,
  cards,
  loading,
  onSelect,
}: {
  bank: Bank;
  cards: Card[];
  loading: boolean;
  onSelect: (card: Card) => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-5 p-2.5 border border-dashed border-slate-200 rounded-sm w-fit">
        <img src={getBankImageUrl(bank.logo_url)} alt={bank.name} className="w-7 h-7 object-contain" />
        <span className="text-sm font-medium text-slate-700">{bank.name}</span>
      </div>

      <p className="text-sm text-slate-500 mb-4">Chọn thẻ của bạn</p>

      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border border-dashed border-slate-200 rounded-sm p-3">
              <div className="w-full aspect-[16/10] bg-slate-100 rounded-sm animate-pulse mb-2" />
              <div className="h-4 w-3/4 bg-slate-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : cards.length === 0 ? (
        <p className="text-sm text-slate-400">Không tìm thấy thẻ nào của ngân hàng này.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => onSelect(card)}
              className="flex flex-col gap-2 p-3 border border-dashed border-slate-200 rounded-sm hover:border-brand-blue hover:bg-blue-50/40 transition-colors text-left"
            >
              <div className="w-full aspect-[16/10] bg-slate-50 overflow-hidden rounded-sm">
                <img src={getCardImageUrl(card)} alt={card.name} className="w-full h-full object-contain" />
              </div>
              <span className="font-medium text-slate-800 leading-tight">{card.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
