'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { IconSearch, IconX } from '@tabler/icons-react';
import type { SearchCard } from '@/lib/search-types';
import { useCardSearch } from '@/lib/use-card-search';

export interface CardSearchInputProps {
    value: SearchCard | null;
    onChange: (card: SearchCard | null) => void;
    placeholder?: string;
    excludeId?: string;
    excludeIds?: string[];
    label?: string;
    underline?: boolean;
}

export function CardSearchInput({
    value,
    onChange,
    placeholder,
    excludeId,
    excludeIds,
    label,
    underline,
}: CardSearchInputProps) {
    const t = useTranslations('ComparePage');
    const { search, load } = useCardSearch();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchCard[]>([]);
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const excluded = new Set([
        ...(excludeId ? [excludeId] : []),
        ...(excludeIds ?? []),
    ]);

    useEffect(() => {
        function onPointerDown(e: PointerEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('pointerdown', onPointerDown);
        return () => document.removeEventListener('pointerdown', onPointerDown);
    }, []);

    function handleFocus() {
        load();
        if (query.trim()) setOpen(true);
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const q = e.target.value;
        setQuery(q);
        if (q.trim()) {
            const res = search(q).filter((c) => !excluded.has(c.id));
            setResults(res.slice(0, 8));
            setOpen(true);
        } else {
            setResults([]);
            setOpen(false);
        }
    }

    function handleSelect(card: SearchCard) {
        onChange(card);
        setQuery('');
        setResults([]);
        setOpen(false);
    }

    function handleClear() {
        onChange(null);
        setQuery('');
        setResults([]);
        setOpen(false);
    }

    const wrapperClass = underline
        ? 'relative flex items-center border-b border-slate-300 bg-transparent focus-within:border-slate-700 transition-colors'
        : 'relative flex items-center border border-slate-300 rounded-sm bg-white focus-within:border-brand-blue focus-within:ring-1 focus-within:ring-brand-blue/30 transition-colors';

    return (
        <div ref={containerRef} className="relative">
            {label && (
                <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
            )}
            <div className={wrapperClass}>
                {!underline && (
                    <IconSearch size={15} className="absolute left-3 text-slate-400 pointer-events-none shrink-0" />
                )}

                {value ? (
                    underline ? (
                        <span className="flex-1 py-2 pr-6 text-sm font-medium text-slate-900 truncate">
                            {value.name}
                        </span>
                    ) : (
                        <div className="flex items-center gap-2 flex-1 pl-9 pr-8 py-2 min-w-0">
                            {value.image_url && (
                                <img src={value.image_url} alt={value.name} className="h-5 w-8 object-contain shrink-0" />
                            )}
                            <span className="text-sm text-slate-900 truncate font-medium">{value.name}</span>
                            <span className="text-xs text-slate-500 truncate">{value.bank_name}</span>
                        </div>
                    )
                ) : (
                    <input
                        type="text"
                        value={query}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        placeholder={placeholder ?? t('search_placeholder')}
                        className={`flex-1 py-2 text-sm bg-transparent outline-none placeholder:text-slate-400 ${underline ? 'pr-6' : 'pl-9 pr-8'}`}
                    />
                )}

                {(value || query) && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-1 text-slate-400 hover:text-slate-600 transition-colors p-1"
                    >
                        <IconX size={13} />
                    </button>
                )}
            </div>

            {open && results.length > 0 && (
                <div className="absolute z-50 top-full mt-1 w-full bg-white border border-slate-200 rounded-sm shadow-lg overflow-hidden">
                    {results.map((card) => (
                        <button
                            key={card.id}
                            type="button"
                            onClick={() => handleSelect(card)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 transition-colors text-left border-b border-dashed border-slate-100 last:border-0"
                        >
                            {card.image_url ? (
                                <img src={card.image_url} alt={card.name} className="h-6 w-10 object-contain shrink-0" />
                            ) : (
                                <div className="h-6 w-10 bg-slate-100 rounded shrink-0" />
                            )}
                            <div className="min-w-0">
                                <p className="text-sm text-slate-900 font-medium truncate">{card.name}</p>
                                <p className="text-xs text-slate-500 truncate">{card.bank_name}</p>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
