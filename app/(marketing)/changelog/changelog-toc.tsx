'use client';

import {useState} from 'react';
import {IconChevronDown} from '@tabler/icons-react';
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from '@/components/ui/collapsible';
import {cn, fmtIsoDate} from '@/lib/utils';

interface ChangelogTocItem {
    id: string;
    title: string;
    date: string;
}

interface Props {
    items: ChangelogTocItem[];
}


export function ChangelogToc({items}: Props) {
    const [open, setOpen] = useState(true);

    if (items.length === 0) return null;

    return (
        <Collapsible open={open} onOpenChange={setOpen}>
            <div className="border border-dashed border-slate-200 rounded-sm">
                <CollapsibleTrigger
                    className="flex items-center justify-between w-full px-3 py-2.5 hover:bg-slate-50/60 transition-colors group">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mục lục</span>
                    <IconChevronDown
                        size={13}
                        className={cn('text-slate-400 transition-transform duration-200', open ? 'rotate-180' : '')}
                    />
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <nav className="border-t border-dashed border-slate-100 px-3 py-2 flex flex-col">
                        {items.map((item) => (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                className="block py-1 text-xs leading-snug text-slate-500 hover:text-slate-900 transition-colors"
                            >
                                <span className="font-mono text-slate-400 mr-1.5">{fmtIsoDate(item.date)}</span>
                                {item.title}
                            </a>
                        ))}
                    </nav>
                </CollapsibleContent>
            </div>
        </Collapsible>
    );
}
