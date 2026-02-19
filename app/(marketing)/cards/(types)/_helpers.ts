import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {createOgImage} from '@/lib/og';

type CardsPageKey =
    | 'type_credit'
    | 'type_debit'
    | 'type_2in1'
    | 'type_co_branded'
    | 'network_visa'
    | 'network_mastercard'
    | 'network_jcb'
    | 'network_napas'
    | 'network_amex'
    | 'network_unionpay';

export async function createTypeMetadata(
    titleKey: CardsPageKey,
    canonical: string,
): Promise<Metadata> {
    const t = await getTranslations('CardsPage');
    const title = `${t(titleKey)} | Open Wallet`;
    const description = t('meta_description', {card: t(titleKey)});
    return {
        title,
        alternates: {canonical},
        openGraph: {title, description},
        twitter: {title, description},
    };
}

export async function createTypeOgImage(titleKey: CardsPageKey) {
    const t = await getTranslations('CardsPage');
    return createOgImage({
        title: t(titleKey),
        description: t('meta_description', {card: t(titleKey)}),
    });
}
