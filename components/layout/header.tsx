import {getBanks, getCards, getNetworks} from '@/lib/api';
import {MobileNav} from './mobile-nav';
import {SearchDialog} from '@/components/search/search-dialog';
import {Nav2} from "@/components/layout/nav2";
import {Logo} from "@/components/layout/logo";
import {ChatToggleButton} from "@/components/chat/chat-toggle-button";

const NETWORK_TIER_FILTER = 'visa:infinite,visa:signature,mastercard:world-elite,mastercard:world,amex:platinum,jcb:ultimate';

export async function Header() {
    const [banks, networks, allCards] = await Promise.all([
        getBanks().catch(() => []),
        getNetworks().catch(() => []),
        getCards().catch(() => []),
    ]);

    const cardCounts: Record<string, number> = {
        '/the-tin-dung': allCards.filter((c) => c.card_type.includes('credit')).length,
        '/the-ghi-no': allCards.filter((c) => c.card_type.includes('debit')).length,
        '/the-tin-dung-mien-phi-thuong-nien': allCards.filter(
            (c) => c.card_type.includes('credit') && c.fees?.annual?.amount === 0
        ).length,
        '/the-tin-dung-noi-dia': allCards.filter(
            (c) => c.card_type.includes('credit') && c.card_network === 'napas'
        ).length,
        '/the-2-trong-1': allCards.filter(
            (c) => c.card_type.includes('credit') && c.card_type.includes('debit')
        ).length,
        '/the-ghi-no-mien-phi': allCards.filter(
            (c) => c.card_type.includes('debit') && c.fees?.annual?.amount === 0
        ).length,
        '/the-ghi-no-noi-dia': allCards.filter(
            (c) => c.card_type.includes('debit') && c.card_network === 'napas'
        ).length,
        '/the-shopee': allCards.filter((c) => c.co_brand === 'shopee').length,
        '/the-kim-loai': allCards.filter((c) => c.is_metal === true).length,
        '/the-doanh-nghiep': allCards.filter((c) => c.for_business === true).length,
        '/the-tin-dung-cao-cap': (() => {
            const tiers = new Set(
                NETWORK_TIER_FILTER.split(',').map((t) => {
                    const [net, tier] = t.split(':');
                    return `${net}:${tier}`;
                })
            );
            return allCards.filter((c) => {
                const key = `${c.card_network}:${c.card_tier}`;
                return tiers.has(key);
            }).length;
        })(),
        '/the-tin-dung-visa': allCards.filter(
            (c) => c.card_type.includes('credit') && c.card_network === 'visa'
        ).length,
        '/the-tin-dung-mastercard': allCards.filter(
            (c) => c.card_type.includes('credit') && c.card_network === 'mastercard'
        ).length,
        '/the-tin-dung-jcb': allCards.filter(
            (c) => c.card_type.includes('credit') && c.card_network === 'jcb'
        ).length,
        '/the-tin-dung-amex': allCards.filter(
            (c) => c.card_type.includes('credit') && c.card_network === 'amex'
        ).length,
    };

    const totalCards = allCards.length;
    const totalBanks = banks.length;

    return (
        <header className="ow-header xl:py-5 py-3 is-home:absolute top-0 left-0 w-full z-50">
            <div className="lg:px-8 px-5 flex justify-between xl:grid xl:grid-cols-3 items-center">

                {/* Left: logo */}
                <div className="flex items-center">
                    <Logo className="xl:h-20 h-10 aspect-square"/>
                </div>

                {/* Center: nav */}
                <div className="hidden xl:flex justify-center">
                    <Nav2/>
                </div>

                {/* Right: search + chat + mobile trigger */}
                <div className="flex items-center gap-2 justify-end">
                    <div className="hidden xl:flex items-center gap-2">
                        <ChatToggleButton/>
                        <SearchDialog/>
                    </div>
                    <div className="xl:hidden flex items-center">
                        <ChatToggleButton/>
                        <SearchDialog mobileOnly/>
                        <MobileNav banks={banks}/>
                    </div>
                </div>

            </div>
        </header>
    );
}
