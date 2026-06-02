import type {Metadata} from 'next';
import {CardTypePage, generateCardTypeMetadata, type CardTypePageConfig} from '../card-type-page';

const CONFIG: CardTypePageConfig = {
    type: 'hybrid',
    slug: 'the-hybrid',
    label: 'Thẻ hybrid',
    title: 'Thẻ Hybrid',
    description: 'Danh sách thẻ hybrid ngân hàng tại Việt Nam. Kết hợp tính năng tín dụng và ghi nợ trong một thẻ duy nhất.',
};

export async function generateMetadata(): Promise<Metadata> {
    return generateCardTypeMetadata(CONFIG);
}

export default function HybridCardsPage() {
    return <CardTypePage config={CONFIG}/>;
}
