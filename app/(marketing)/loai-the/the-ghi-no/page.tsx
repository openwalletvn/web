import type {Metadata} from 'next';
import {CardTypePage, generateCardTypeMetadata, type CardTypePageConfig} from '../card-type-page';

const CONFIG: CardTypePageConfig = {
    type: 'debit',
    slug: 'the-ghi-no',
    label: 'Thẻ ghi nợ',
    title: 'Thẻ Ghi Nợ',
    description: 'Danh sách thẻ ghi nợ ngân hàng tại Việt Nam. Thanh toán trực tiếp từ tài khoản, không lo lãi suất.',
};

export async function generateMetadata(): Promise<Metadata> {
    return generateCardTypeMetadata(CONFIG);
}

export default function DebitCardsPage() {
    return <CardTypePage config={CONFIG}/>;
}
