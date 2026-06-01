'use client';

import Image from 'next/image';
import Link from 'next/link';
import type {Bank} from '@/lib/api';
import {getBankImageUrl} from '@/lib/api';
import {cn} from '@/lib/utils';

interface Props {
    bank: Bank;
    href?: string;
    className?: string;
    priority?: boolean;
}

export function OwBankImage({bank, href, className, priority = false}: Props) {
    const url = getBankImageUrl(bank.logo_url);
    const content = (
        <Image
            src={url}
            alt={bank.name}
            width={120}
            height={24}
            priority={priority}
            className={cn("object-contain mix-blend-multiply dark:mix-blend-screen")}
            style={{width: '100%', height: '100%'}}
        />
    );

    const baseClass = cn('ow-bank-image inline-flex items-center gap-2');

    if (href) {
        return (
            <Link href={href} className={cn(baseClass, 'hover:underline', className)}>
                {content}
            </Link>
        );
    }

    return (
        <span className={cn(baseClass, className)}>
            {content}
        </span>
    );
}
