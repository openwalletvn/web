'use client';

import { useState } from 'react';
import { IconChevronDown } from '@tabler/icons-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { TocHeading } from '@/lib/mdx';

interface Props {
  headings: TocHeading[];
}

export function BlogToc({ headings }: Props) {
  const [open, setOpen] = useState(true);

  if (headings.length === 0) return null;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="border border-dashed border-slate-200 rounded-sm">
        <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2.5 hover:bg-slate-50/60 transition-colors group">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mục lục</span>
          <IconChevronDown
            size={13}
            className={`text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <nav className="border-t border-dashed border-slate-100 px-3 py-2 flex flex-col">
            {headings.map((h) => (
              <a
                key={h.id}
                href={`#${h.id}`}
                className={[
                  'block py-1 text-xs leading-snug text-slate-500 hover:text-slate-900 transition-colors',
                  h.level === 3 ? 'pl-3' : h.level === 4 ? 'pl-5' : '',
                ].join(' ')}
              >
                {h.text}
              </a>
            ))}
          </nav>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
