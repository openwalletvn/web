import { IconCheck } from '@tabler/icons-react';
import { getBankImageUrl, type Bank, type Card } from '@/lib/api';
import {CardModel} from '@/lib/card-model';
import {OwCardImage} from '@/components/ow-ui/ow-card-image';

export function CardSelectionStep({
  bank,
  cards,
  loading,
  ownedCardIds,
  onSelect,
}: {
  bank: Bank;
  cards: Card[];
  loading: boolean;
  ownedCardIds?: Set<string>;
  onSelect: (card: Card) => void;
}) {
  return (
    <div className="ow-card-selection-step">
      <div className="flex items-center gap-2 mb-5 p-2.5 border border-dashed border-slate-200 rounded-sm w-fit">
        <img src={getBankImageUrl(bank.logo_url)} alt={bank.name} className="w-7 h-7 object-contain" />
        <span className="text-sm font-medium text-slate-700">{bank.name}</span>
      </div>

      <p className="text-sm text-slate-500 mb-4">Chọn thẻ của bạn</p>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border border-dashed border-slate-200 rounded-sm p-3">
              <div className="w-full aspect-[16/10] bg-slate-100 rounded-sm animate-pulse mb-2" />
              <div className="h-4 w-3/4 bg-slate-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : cards.length === 0 ? (
        <p className="text-sm text-slate-400">Không tìm thấy thẻ nào của ngân hàng này.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {cards.map((card) => {
            const owned = ownedCardIds?.has(card.id) ?? false;
            return (
              <button
                key={card.id}
                onClick={() => onSelect(card)}
                className="flex flex-col gap-2 p-3 border border-dashed border-slate-200 rounded-sm hover:border-brand-blue hover:bg-blue-50/40 transition-colors text-left"
              >
                <div className="relative w-full aspect-[16/10]">
                  <OwCardImage card={new CardModel(card)} />
                  {owned && (
                    <div className="absolute top-1.5 right-1.5 bg-green-500 text-white rounded-full p-0.5">
                      <IconCheck size={10} strokeWidth={3} />
                    </div>
                  )}
                </div>
                <div className="flex items-start justify-between gap-1.5 min-w-0">
                  <span className="font-medium text-slate-800 leading-tight text-sm">{card.name}</span>
                  {owned && (
                    <span className="shrink-0 text-xs text-green-600 border border-dashed border-green-300 px-1 py-0.5 rounded-sm leading-none mt-0.5">
                      Đã có
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
