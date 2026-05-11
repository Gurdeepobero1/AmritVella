# AmritVella Design System

AmritVella now follows the Mistral-inspired reference supplied by the user: editorial serif display type, Inter UI text, cream-yellow surfaces, saturated orange primary actions, sober 8/12px geometry, atmospheric sunset panels, and a persistent sunset stripe above the footer.

The product remains a Sikh discipline, healing, career, and self-mastery app. The design should feel calm, serious, and premium, not motivational or decorative.

## Tokens

- `colors.primary` `#ff5a1f`: primary action, active emphasis, and sunset-gradient stop.
- `colors.primary-pressed` `#d9470f`: pressed state.
- `colors.cream` `#fff4d7`: warm feature panels, footer-adjacent surfaces, and soft callouts.
- `colors.surface-cream-soft` `#fff8e7`: stat tiles, rows, and secondary surfaces.
- `colors.canvas` `#ffffff`: main cards, forms, and top navigation.
- `colors.hairline` `#e7d7ae`: 1px borders and dividers.
- `colors.ink` `#1f1d18`: headings and primary control text.
- `colors.body` `#2f2b24`: body copy.
- `colors.mute` `#746b5c`: metadata and helper text.
- `colors.surface-code` `#1f1d18`: dark score panels and emergency/focus surfaces.

## Typography

Use Georgia / Times as the available PP Editorial Old substitute for large editorial display moments, and Inter/system sans for every UI and body role.

- Hero / page display: serif, `40-84px`, `400`, `line-height: 1.05-1.15`, negative tracking.
- Stat display: serif, `48-56px`, `400`, tight tracking.
- Section heading: Inter, `18-28px`, `500`.
- Body: Inter, `16px`, `400`, `line-height: 1.55`.
- Button/control: Inter, `14px`, `500`, `line-height: 1.3`.
- Labels: Inter, `11-13px`, uppercase when used as section metadata.

## Shapes

- `8px`: buttons, inputs, compact rows, controls.
- `12px`: standard cards, panels, forms, stat tiles.
- `16px`: large hero/sunset panels and dark focus surfaces.
- `9999px`: badges only, used sparingly.

Do not use pill-shaped primary buttons.

## Signature Elements

- `sunset-panel`: atmospheric orange/yellow gradient with dark mountain-like depth for score/loading/error focus panels.
- `sunset-stripe`: full-width gradient band above the footer on every page.
- Cream cards stay flat with hairline borders; avoid heavy shadows except product/mockup-like surfaces.

## Product Rules

- The first screen is the real app command center, not a landing page.
- Daily Nitnem must remain visible and operational; do not hide all paths behind a select.
- Do not include Gurbani text unless it is verified and source-linked.
- Every log remains persistent in PostgreSQL under `userId`.
- Keep orange scarce: primary save/log actions, active emphasis, and the sunset stripe.
- Maintain mobile-first usability with minimal options visible at once.
