'use client';

import Image from 'next/image';
import Link from 'next/link';
import type {Bank} from '@/lib/api';
import {BankModel} from '@/lib/bank-model';
import {cn} from '@/lib/utils';

interface Props {
    bank: Bank;
    href?: string;
    className?: string;
}

export function OwBankImage({bank: bankRaw, href, className}: Props) {
    const bank = new BankModel(bankRaw);
    const url = bank.getLogoUrl();
    const content = (
        <Image
            src={url}
            alt={bankRaw.name}
            width={120}
            height={24}
            className={cn("object-contain size-full mix-blend-multiply dark:mix-blend-screen")}
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
