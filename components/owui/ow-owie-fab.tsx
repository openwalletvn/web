"use client";

import * as React from 'react';
import {usePathname, useRouter} from 'next/navigation';
import {cn} from '@/lib/utils';
import {OwLogo} from '@/components/owui/ow-logo';
import {OwTooltip} from '@/components/owui/ow-tooltip';
import {useChatContext} from '@/components/chat/chat-provider';
import {MovingBorder} from '@/components/phucbm/moving-border';

export function OwOwieFab({className}: { className?: string }) {
    const {toggle} = useChatContext();
    const pathname = usePathname();
    const router = useRouter();
    if (pathname === '/chat') return null;

    function handleClick() {
        if (window.innerWidth <= 1024) {
            router.push('/chat');
        } else {
            toggle();
        }
    }

    return (
        <div className={cn(
            'ow-owie-fab fixed sm:bottom-4 sm:right-4 bottom-1 right-1 z-50 transition-all ease-bounce duration-200 is-chat-open:translate-x-full is-chat-open:-right-1',
            className)}>
            <OwTooltip tooltip="Chào CT!" side="top">
                <MovingBorder
                    borderWidth={2}
                    radius={8}
                    gradientWidth={200}
                    duration={2}
                    colors={["#3b82f6", "#8b5cf6", "#ef3c23"]}
                    innerBg="bg-transparent"
                    as="div"
                >
                    <button
                        type="button"
                        onClick={handleClick}
                        className="bg-black text-white cursor-pointer p-2 sm:w-16 w-14 rounded-[8px] flex flex-col gap-1 justify-center items-center hover:bg-primary transition-all duration-200">
                        <OwLogo color="white" variant="full" className="size-10" href={null}/>
                        <span className="inline-flex text-label font-bold font-display">Owie</span>
                    </button>
                </MovingBorder>
            </OwTooltip>
        </div>
    );
}
