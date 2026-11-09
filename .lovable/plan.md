# Stockcial: living Base stock characters

## Goal
Build the first usable Stockcial screen: a playful, polished stock-character world driven by tokenized-stock metadata and market/activity signals.

## Scope
- Replace the blank home page with a Stockcial dashboard: a lively featured mascot, browseable stock characters, portfolio/activity context, mood indicators, pairings, short “snack” posts, and compact one- or two-word character speech.
- Load tokenized-stock metadata from Coinbase's public paginated endpoint, keyed by contract address, and show a clearly labeled sample state if the service is unavailable.
- Add safe demo interactions for feeding, liking/tagging, and sound, plus prominent Buy/Trade actions that explain their current availability rather than sending unapproved transactions.
- Define mood and character animation from available signals; mark social sentiment and on-chain activity as sample/unconnected until their data sources are configured.
- Establish a cohesive art direction and accessible visual system, including animated mascot art and responsive layout.
- Add route metadata and a focused test for the stock mood rules.

## Technical notes
- Use TanStack Start's server-function pattern for the public stock listing request; check Worker and server-function guidance before implementing it.
- No live swaps, wallet signing, X scraping/Grok, persistent accounts, or live on-chain event feed will be represented as connected without required credentials, wallet support, and service access. Keep these actions honest and isolated from demo feedback.
- Lovable Cloud is required only if adding persistent user state or secured server-side integrations; use it before implementing those backend features.
