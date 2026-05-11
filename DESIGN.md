# AmritVella Design System

This app follows the Pinterest-style reference supplied by the user: quiet warm-cream chrome, rounded 16px surfaces, image/card-inspired masonry rhythm, and one scarce primary accent. The product remains a Sikh discipline system, so the interface language is serious, sparse, and operational rather than motivational.

## Tokens

- `colors.primary` `#e60023`: primary action only, active navigation, and selected filter states.
- `colors.primary-pressed` `#cc001f`: pressed primary action.
- `colors.canvas` `#ffffff`: main cards, forms, table rows, and top navigation.
- `colors.surface-soft` `#fbfbf9`: page background wash.
- `colors.surface-card` `#f6f6f3`: secondary cards, path tiles, stat tiles, history rows.
- `colors.secondary-bg` `#e5e5e0`: secondary buttons and soft chips.
- `colors.hairline` `#dadad3`: 1px borders and dividers.
- `colors.ink` `#000000`: headings and primary control text.
- `colors.body` `#33332e`: body copy.
- `colors.mute` `#62625b`: metadata and helper text.
- `colors.surface-dark` `#262622`: rare dark strip for score emphasis.

## Typography

Use Inter as the open substitute for Pin Sans. Display headings use tight tracking, but app chrome and form controls keep normal tracking for readability.

- Display: `44-70px`, `600-700`, `line-height: 1.1`.
- Page heading: `28px`, `700`, `line-height: 1.2`.
- Section heading: `18-22px`, `600-700`.
- Body: `16px`, `400`, `line-height: 1.4`.
- Button/control: `14px`, `700`, `line-height: 1`.

## Shapes

- `16px`: buttons, inputs, cards, path tiles, history rows.
- `32px`: hero score panels, large feature surfaces, modal-like regions.
- `9999px`: pills, filters, avatars, icon buttons.

Do not introduce extra radii for ordinary UI.

## Product Rules

- The first screen is the real app, not a landing page.
- Daily Nitnem must be visible as a full operational board, not hidden in a select.
- Do not include Gurbani text unless it is verified and source-linked.
- Every log must remain persistent in PostgreSQL under `userId`.
- Keep primary red scarce. Use it for the most important save/log action only.
- Prefer full-bleed data tiles and tight card grids over decorative dashboards.
- Mobile is the primary layout; desktop only widens the grid.
