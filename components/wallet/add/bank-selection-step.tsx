'use client';

import { useState, useRef, useEffect } from 'react';
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
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filtered = query.trim()
    ? banks.filter((b) => b.name.toLowerCase().includes(query.toLowerCase()))
    : banks;

  if (loading) {
    return (
      <div className="ow-bank-selection-step grid grid-cols-3 gap-3">
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
    <div className="ow-bank-selection-step">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Tìm ngân hàng..."
        className="w-full px-3 py-2 mb-5 border border-dashed border-slate-300 rounded-sm bg-white text-slate-900 placeholder-slate-300 focus:outline-none focus:border-brand-blue text-sm"
      />

      {filtered.length === 0 ? (
        <p className="text-sm text-slate-400">Không tìm thấy ngân hàng nào.</p>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {filtered.map((bank) => (
            <button
              key={bank.id}
              onClick={() => onSelect(bank)}
              className="flex flex-col items-center gap-2 p-4 border border-dashed border-slate-200 rounded-sm hover:border-brand-blue hover:bg-blue-50/40 transition-colors text-center"
            >
              <img src={getBankImageUrl(bank.logo_url)} alt={bank.name} className="w-12 h-12 object-contain" />
              <span className="text-slate-600 leading-tight text-sm">{bank.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
