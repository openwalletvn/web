'use client';

import {usePathname} from 'next/navigation';
import {useEffect} from 'react';
import {useChatContext} from '@/components/chat/chat-provider';

export function BodyClass() {
    const pathname = usePathname();
    const {isOpen, isThreadRunning} = useChatContext();

    useEffect(() => {
        document.body.classList.toggle('is-home', pathname === '/');
    }, [pathname]);

    useEffect(() => {
        document.body.classList.toggle('is-chat-open', isOpen);
    }, [isOpen]);

    useEffect(() => {
        document.body.classList.toggle('is-thread-running', isThreadRunning);
    }, [isThreadRunning]);

    return null;
}
