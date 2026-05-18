'use client';

import {useEffect, useRef, useState} from 'react';
import type {Card, Intent} from '@/lib/api';
import Link from 'next/link';
import {CardImage} from '@/components/cards/card-image';
import {CompareTable} from './compare-table';

interface Props {
    cards: (Card | null)[];
    children?: React.ReactNode;
    onStickyChange?: (visible: boolean) => void;
    intentMap?: Map<string, Intent>;
}

export function CompareTemplate({ cards, children, onStickyChange, intentMap }: Props) {
    const cardHeaderRef = useRef<HTMLDivElement>(null);
    const [showSticky, setShowSticky] = useState(false);

    useEffect(() => {
        const el = cardHeaderRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                const visible = !entry.isIntersecting;
                setShowSticky(visible);
                onStickyChange?.(visible);
            },
            { threshold: 0 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [onStickyChange]);

    const colStyle = { gridTemplateColumns: `repeat(${cards.length}, 1fr)` };

    return (
        <div>
            {/* ── Sticky mini header ────────────────────────────────────────── */}
            <div
                className={`fixed top-0 inset-x-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm transition-transform duration-200 ease-out ${
                    showSticky ? 'translate-y-0' : '-translate-y-full'
                }`}
            >
                <div className="min-h-[80px] max-w-[980px] mx-auto py-2 flex items-center">
                    <div className="grid w-full" style={colStyle}>
                        {cards.map((card, i) => (
                            <div key={card?.id ?? i} className="flex items-center gap-2">
                                {card ? (
                                    <>
                                        <Link href={`/the/${card.id}`} className="block shrink-0">
                                            <CardImage card={card} tilt className="h-[60px] w-auto" />
                                        </Link>
                                        <Link
                                            href={`/the/${card.id}`}
                                            className="text-sm font-semibold text-slate-900 hover:text-brand-red transition-colors line-clamp-2"
                                        >
                                            {card.name}
                                        </Link>
                                    </>
                                ) : (
                                    <div className="h-[60px] w-[96px] bg-slate-100 rounded-sm shrink-0" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Main card header ──────────────────────────────────────────── */}
            <div ref={cardHeaderRef} className="grid mb-8" style={colStyle}>
                {cards.map((card, i) => (
                    <div key={card?.id ?? i} className="flex flex-col gap-3">
                        {card ? (
                            <>
                                <div className="flex items-end h-[200px]">
                                    <Link href={`/the/${card.id}`}>
                                        {card.image?.orientation === 'vertical' ? (
                                            <div className="h-[200px] flex items-center">
                                                <CardImage card={card} tilt className="h-full w-auto" />
                                            </div>
                                        ) : (
                                            <div className="w-full max-w-[200px]">
                                                <CardImage card={card} tilt className="w-full" />
                                            </div>
                                        )}
                                    </Link>
                                </div>
                                <Link
                                    href={`/the/${card.id}`}
                                    className="text-base font-semibold text-slate-900 hover:text-brand-red transition-colors"
                                >
                                    {card.name}
                                </Link>
                            </>
                        ) : (
                            <div className="flex items-end h-[200px]">
                                <div className="w-full max-w-[200px] aspect-[16/10] bg-slate-100 rounded-lg" />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* ── Comparison table ──────────────────────────────────────────── */}
            <CompareTable cards={cards} intentMap={intentMap} />

            {/* ── Editorial MDX content ─────────────────────────────────────── */}
            {children && (
                <div className="mt-12 prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-brand-blue prose-a:no-underline hover:prose-a:underline">
                    {children}
                </div>
            )}
        </div>
    );
}
