import type {Metadata} from 'next';
import {CardTypePage, generateCardTypeMetadata, type CardTypePageConfig} from '../card-type-page';

const CONFIG: CardTypePageConfig = {
    type: 'credit',
    slug: 'the-tin-dung',
    label: 'Thẻ tín dụng',
    title: 'Thẻ Tín Dụng',
    description: 'Danh sách thẻ tín dụng ngân hàng tại Việt Nam. So sánh cashback, phí thường niên và ưu đãi để chọn thẻ phù hợp nhất.',
};

export async function generateMetadata(): Promise<Metadata> {
    return generateCardTypeMetadata(CONFIG);
}

export default function CreditCardsPage() {
    return <CardTypePage config={CONFIG}/>;
}
