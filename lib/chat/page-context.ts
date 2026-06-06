export type PageContext =
    | {
          type: 'card';
          cardId: string;
          cardName: string;
          bankId: string;
          cardNetwork: string;
          cardType: string[];
          description?: string;
      }
    | {
          type: 'bank';
          bankId: string;
          bankName: string;
      }
    | null;

const HINT_SUFFIX = ' (double click để chọn)';

/**
 * Get context-aware placeholder examples for chat input
 */
export function getContextPlaceholders(context: PageContext): string[] {
    const addHint = (text: string) => text + HINT_SUFFIX;

    if (!context) {
        return [
            'Mua Shopee mỗi tháng 3 triệu nên dùng thẻ nào?',
            'Đi siêu thị 5tr/tháng nên mở thẻ nào?',
            'Thẻ ghi nợ nào có ưu đãi hoàn tiền?',
            'So sánh thẻ tín dụng và thẻ ghi nợ',
            'Thẻ nào hoàn tiền cao nhất hiện nay?',
        ].map(addHint);
    }

    if (context.type === 'card') {
        const {cardName} = context;
        return [
            `Thẻ ${cardName} hoàn tiền cho những lĩnh vực nào?`,
            `Gợi ý chi tiêu để tối ưu thẻ ${cardName}`,
            `So sánh thẻ ${cardName} với thẻ khác cùng ngân hàng`,
            `Điều kiện mở thẻ ${cardName} như thế nào?`,
            `Thẻ ${cardName} có ưu đãi gì nổi bật?`,
            `Chi phí thường niên thẻ ${cardName} là bao nhiêu?`,
        ].map(addHint);
    }

    if (context.type === 'bank') {
        const {bankName} = context;
        return [
            `${bankName} có thẻ nào hoàn tiền cao nhất?`,
            `So sánh các thẻ của ${bankName}`,
            `Thẻ ${bankName} nào phù hợp đi siêu thị?`,
            `Điều kiện mở thẻ tại ${bankName}`,
            `${bankName} có thẻ miễn phí thường niên không?`,
        ].map(addHint);
    }

    return [];
}

/**
 * Strip hint suffix from placeholder before injecting into input
 */
export function stripPlaceholderHint(text: string): string {
    return text.replace(HINT_SUFFIX, '');
}
