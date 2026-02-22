<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the OpenWallet VN Next.js App Router project. PostHog is initialized using the `instrumentation-client.ts` pattern (recommended for Next.js 15.3+), which provides automatic pageview tracking, session replay, and error capture with no extra provider components needed. Environment variables are stored in `.env.local` and referenced via `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`. Event tracking was added to five key files covering the core user journeys: adding cards (via the 3-step wizard and the marketing catalog), editing/deleting cards, changing card status, reordering cards, and wallet data export/import.

| Event | Description | File |
|-------|-------------|------|
| `add_card_wizard_bank_selected` | User selects a bank in step 1 of the add-card wizard | `app/app/add/page.tsx` |
| `add_card_wizard_card_selected` | User selects a specific card in step 2 of the add-card wizard | `app/app/add/page.tsx` |
| `card_added_to_wallet` | User completes the wizard and saves a new card to their wallet | `app/app/add/page.tsx` |
| `card_updated` | User edits and saves changes to an existing wallet card | `components/wallet/card-form-dialog.tsx` |
| `card_added_to_wallet` | Card saved via the catalog quick-add dialog | `components/wallet/card-form-dialog.tsx` |
| `card_deleted` | User removes a card from their wallet | `components/wallet/card-form-dialog.tsx` |
| `card_status_changed` | User changes a card's status (active / locked / expired / canceled) | `app/app/my-cards/page.tsx` |
| `card_reordered` | User drags a card to a new position in the card list | `app/app/my-cards/page.tsx` |
| `catalog_card_added_to_wallet` | User clicks "Add to wallet" on a catalog card detail page | `app/(marketing)/cards/(details)/[slug]/_add-to-wallet-button.tsx` |
| `wallet_exported` | User exports a wallet (single or all) as a JSON backup | `app/app/settings/page.tsx` |
| `wallet_imported` | User successfully imports a wallet from a JSON file | `app/app/settings/page.tsx` |
| `catalog_filter_applied` | User applies a filter on the marketing cards listing | `app/(marketing)/_components/cards-filter.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- 📊 **Dashboard — Analytics basics**: [https://us.posthog.com/project/320154/dashboard/1298281](https://us.posthog.com/project/320154/dashboard/1298281)
- 🔀 **Card Add Funnel (Wizard)** — conversion funnel: bank → card → saved: [https://us.posthog.com/project/320154/insights/GVl7usGv](https://us.posthog.com/project/320154/insights/GVl7usGv)
- 📈 **Cards Added to Wallet (Daily)** — core activation trend: [https://us.posthog.com/project/320154/insights/pgHnRjYm](https://us.posthog.com/project/320154/insights/pgHnRjYm)
- 📉 **Card Deletions (Churn Signal)** — weekly wallet churn indicator: [https://us.posthog.com/project/320154/insights/uxATzton](https://us.posthog.com/project/320154/insights/uxATzton)
- 🔍 **Catalog Filter Usage** — what features users are searching for: [https://us.posthog.com/project/320154/insights/SUPdiEDH](https://us.posthog.com/project/320154/insights/SUPdiEDH)
- 💾 **Wallet Export & Import Activity** — data portability usage: [https://us.posthog.com/project/320154/insights/5KS29yk2](https://us.posthog.com/project/320154/insights/5KS29yk2)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
