"use client";

import * as React from 'react';
import {usePathname} from 'next/navigation';
import {cn} from '@/lib/utils';
import {OwLogo} from '@/components/ow-ui/ow-logo';
import {OwTooltip} from '@/components/ow-ui/ow-tooltip';
import {useChatContext} from '@/components/chat/chat-provider';

export function OwOwieFab({className}: { className?: string }) {
    const {toggle} = useChatContext();
    const pathname = usePathname();
    if (pathname === '/chat') return null;
    return (
        <div className={cn(
            'ow-owie-fab fixed bottom-3 right-3 z-50 transition-all ease-bounce duration-200 is-chat-open:translate-x-full is-chat-open:-right-1',
            className)}>
            <OwTooltip tooltip="Chào CT!" tooltipAlign="top">
                <button
                    type="button"
                    onClick={toggle}
                    className="bg-black text-white cursor-pointer p-2 w-16 rounded-md flex flex-col gap-1 justify-center items-center hover:bg-primary transition-all duration-200">
                    <OwLogo color="white" variant="full" className="size-10"/>
                    <span className="inline-flex text-label font-bold">Owie</span>
                </button>
            </OwTooltip>
        </div>
    );
}
