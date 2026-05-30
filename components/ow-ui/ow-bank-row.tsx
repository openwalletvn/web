'use client';

import Link from 'next/link';
import type {Bank} from '@/lib/api';
import {OwBankImage} from '@/components/ow-ui/ow-bank-image';
import {OwButton} from '@/components/ow-ui/ow-button';
import {IconAffiliateFilled, IconCreditCardFilled} from "@tabler/icons-react";
import {OwChip} from "@/components/ow-ui/ow-chip";

interface Props {
    bank: Bank;
    className?: string;
}

export function OwBankRow({bank, className}: Props) {
    return (
        <div
            className={`ow-bank-row group grid grid-cols-12 gap-2 p-3 max-sm:py-4 md:rounded-full rounded-lg bg-[#f6f6f6] ${className ?? ''}`}>
            {/*left*/}
            <div
                className="lg:col-span-8 col-span-12 flex md:gap-4 gap-2 items-center max-sm:flex-col max-sm:items-start">
                {/*image*/}
                <OwBankImage bank={bank}
                             className="lg:w-[200px] lg:min-w-[200px] sm:w-[100px] sm:min-w-[100px] sm:h-8 md:px-4 h-6 w-auto"
                             href={`/ngan-hang/${bank.id}`}/>

                {/*sep*/}
                <div className="w-[1px] h-full bg-gray-300 hidden sm:block"></div>

                {/*bank info*/}
                <div className="space-y-2">
                    <h2 className="heading-6">{bank.full_name}</h2>
                    <p className="flex gap-2 flex-wrap">
                        {(bank.stats?.card_count ?? 0) > 0 && (
                            <OwChip size="sm">
                                <IconCreditCardFilled className="w-5"/> {bank.stats!.card_count} thẻ
                            </OwChip>
                        )}
                        {(bank.networks?.length ?? 0) > 0 && (
                            <OwChip size="sm">
                                <IconAffiliateFilled className="w-5"/> {bank.networks?.length} mạng thẻ
                            </OwChip>
                        )}

                    </p>
                </div>
            </div>
            {/*right*/}
            <div
                className="col-span-4 hidden lg:flex justify-end items-center transition-opacity opacity-0 group-hover:opacity-100 duration-500">
                <OwButton asChild size="sm">
                    <Link href={`/ngan-hang/${bank.id}`}>Xem ngân hàng</Link>
                </OwButton>
            </div>
        </div>
    );
}
