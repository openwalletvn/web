'use client';

import Link from 'next/link';
import type {Bank} from '@/lib/api';
import {BankModel} from '@/lib/bank-model';
import {OwBankImage} from '@/components/ow-ui/ow-bank-image';
import {OwButton} from '@/components/ow-ui/ow-button';
import {IconAffiliateFilled, IconCreditCardFilled} from "@tabler/icons-react";
import {OwBadge} from "@/components/ow-ui/ow-badge";

interface Props {
    bank: Bank;
    className?: string;
}

export function OwBankRow({bank: bankRaw, className}: Props) {
    const bank = new BankModel(bankRaw);
    return (
        <div
            className={`ow-bank-row group grid grid-cols-12 gap-2 p-3 max-sm:py-4 md:rounded-full rounded-2xl bg-[#f6f6f6] ${className ?? ''}`}>
            {/*left*/}
            <div
                className="lg:col-span-8 col-span-12 flex md:gap-4 gap-2 items-center max-sm:flex-col max-sm:items-start">
                {/*image*/}
                <OwBankImage bank={bankRaw}
                             className="lg:w-[200px] lg:min-w-[200px] sm:w-[100px] sm:min-w-[100px] sm:h-8 md:px-4 h-6 w-auto"
                             href={bank.getHref()}/>

                {/*sep*/}
                <div className="w-[1px] h-full bg-gray-300 hidden sm:block"></div>

                {/*bank info*/}
                <div className="space-y-2">
                    <h2 className="heading-6">{bank.getFullName()}</h2>
                    <p className="flex gap-2 flex-wrap">
                        {bank.getCardCount() > 0 && (
                            <OwBadge small>
                                <IconCreditCardFilled className="w-5"/> {bank.getCardCount()} thẻ
                            </OwBadge>
                        )}
                        {bank.getNetworks().length > 0 && (
                            <OwBadge small>
                                <IconAffiliateFilled className="w-5"/> {bank.getNetworks().length} mạng thẻ
                            </OwBadge>
                        )}
                    </p>
                </div>
            </div>
            {/*right*/}
            <div
                className="col-span-4 hidden lg:flex justify-end items-center transition-opacity opacity-0 group-hover:opacity-100 duration-500">
                <OwButton asChild size="sm">
                    <Link href={bank.getHref()}>Xem ngân hàng</Link>
                </OwButton>
            </div>
        </div>
    );
}
