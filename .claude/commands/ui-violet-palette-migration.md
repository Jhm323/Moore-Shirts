---
description: "UI: migrate palette to warm dark violet/gold, remove leaf hero art"
---

Migrate the color system from the current light cream/green palette to a
warm dark violet/gold palette, and remove the leaf canopy hero art from the
Landing page. This is a careful token-semantics change, not a blind hex
find-and-replace -- several existing tokens are overloaded (used as both a
background color AND a light-text-on-dark-accent color), and swapping their
values naively would break contrast in specific places. Read this whole
file before touching anything.

## Step 1 — New token definitions

In `src/styles/tokens.css`, replace the `:root` block's color variables
with clearly single-purpose names (keep the `--font-*` variables
unchanged):

```css
:root {
  --color-bg: #2A1A2C;
  --color-bg-dim: #241725;
  --color-surface: #3D2740;
  --color-text: #F4E8DC;
  --color-text-on-accent: #2A1A2C;
  --color-accent: #D9A94E;
  --color-button: #6B2C52;
  --color-button-hover: #7D3560;
  --color-border: #9C8296;

  --font-display: 'Fraunces', serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'Space Mono', monospace;
}
```

Do the equivalent in `src/theme/tokens.js`'s `TOKENS` export -- replace
`sky`, `skyDeep`, `leaf`, `leafDeep`, `cream`, `creamDim`, `ink`, `grey`
with matching JS-side names (`bg`, `bgDim`, `surface`, `text`,
`textOnAccent`, `accent`, `button`, `buttonHover`, `border`) using the same
hex values as above, since `CanopyHero.jsx`/`ProductIcon.jsx` (kept as dead
code per an earlier session, still imported by nothing) reference `TOKENS`
directly in JS, not CSS.

## Step 2 — Audit every existing color usage (this is the important part)

Search every `.css` file in `src/` for `var(--color-cream`, `var(--color-cream-dim`,
`var(--color-ink`, `var(--color-leaf`, `var(--color-leaf-deep`,
`var(--color-gold`, `var(--color-grey`, `var(--color-sky`, and any
hardcoded `rgba(246, 241, 228` (the old cream color used directly, not
via token, in `Header.css`). For each match, read the surrounding CSS rule
and classify it -- is this token being used as a BACKGROUND, or as a
FOREGROUND/text/border color? Map it to the new token accordingly, per
this table:

| Old usage (by role, not by name) | New token |
|---|---|
| Page/card/panel background (was cream) | `--color-bg` |
| Secondary/translucent surface background (header backdrop, was cream/cream-dim) | `--color-bg-dim` or `--color-surface` (pick whichever reads better in context) |
| Body text color (was ink, on a light bg) | `--color-text` |
| Heading/label/accent text color (was leaf, e.g. logo, section titles, price) | `--color-accent` |
| Solid button/pill background (was leaf, e.g. `.btn--primary`, `.header__signin`, `.order-form__submit` is gold already -- check) | `--color-button` |
| Text ON a solid leaf-colored button/pill/band (was cream, e.g. `.btn--primary` text, `.header__signin` text, `.landing__causes` text, `.order-form__summary` text) | `--color-text` (NOT `--color-bg` -- this is the exact trap: these need to stay LIGHT text, and `--color-bg` is now dark) |
| Text ON the gold tag/badge (`Tag.css`, was ink) | `--color-text-on-accent` (dark text on the light gold background -- do NOT use `--color-text` here, that would be light-on-light and nearly unreadable) |
| Borders, dividers, muted secondary text (was grey) | `--color-border` |
| Anything referencing sky/sky-deep (only used by `CanopyHero`, being removed in Step 3) | leave as dead code in `tokens.js`, no CSS usage should remain after Step 3 |

Known specific fixes required (verify each, don't skip):
- `Btn.css` `.btn--primary` -- background becomes `--color-button`, text stays
  light via `--color-text` (not `--color-bg`).
- `Header.css` `.header__signin` -- background `--color-button`, text
  `--color-text`. The hardcoded `.header` background rgba needs to become a
  translucent version of `--color-bg-dim`, e.g.
  `rgba(42, 26, 44, 0.9)` (adjust to taste, keep the blur).
- `Header.css` `.header__logo`, `.header__user-name` -- these were
  `--color-leaf`, become `--color-accent` (gold logo/name reads well on
  the dark header).
- `Tag.css` `.tag` -- background `--color-accent` (gold, unchanged role),
  text `--color-text-on-accent` (dark, NOT `--color-text`).
- `Landing.css` `.landing__causes` -- background `--color-button`
  (was `--color-leaf`), text `--color-text` (was `--color-cream`).
- `OrderForm.css` `.order-form__summary` -- background `--color-button`,
  text `--color-text`.
- Every `--color-leaf` used purely as heading/label TEXT color (not a
  button background) -- becomes `--color-accent`.
- `AuthPanel.css`, `Input.css`, `Card.css` -- backgrounds become
  `--color-bg` or `--color-surface` as appropriate (cards sitting on the
  page background should use `--color-surface` so they're visually
  distinct from the page, not the exact same flat color).

## Step 3 — Remove the leaf hero art

In `Landing.jsx`, remove the `import CanopyHero from "../components/art/CanopyHero";`
line and the `<CanopyHero height={420} />` usage inside the hero card. The
hero card (`.landing__hero-card`) should still render, just without the
leaf illustration -- it becomes a clean panel containing only the overlay
card (tag, headline, copy, button). Remove the now-unused `card--sky`
className if `Card.css`'s `.card--sky` rule referenced the old sky token
and no longer makes sense with nothing sky-colored behind it -- check
whether removing it changes anything visually and use your judgement, but
don't leave a class name that no longer describes what's there.

Do NOT delete `CanopyHero.jsx`, `CanopyIcon.jsx`, or `ProductIcon.jsx` --
leave them as unused files, consistent with how this codebase has handled
dead code in earlier sessions (flagged, not unilaterally removed).

## Verify

1. `npm run build` -- paste real output.
2. `grep -rn "color-cream\|color-ink\|color-leaf\|color-sky" src --include=*.css --include=*.js`
   -- should return nothing (everything migrated to the new names). Report
   the actual result.
3. `npm run dev`, and actually look at every page, not just load them:
   Landing, Shop, OrderForm, AuthPanel, sign-in state header. For each,
   confirm text is legible against its background -- specifically check
   the sign-in pill, the "Shop the collection" button, the tag pill on the
   hero, the causes band, and the order summary panel, since those are
   exactly the spots identified above as contrast traps.
4. Confirm the Landing hero no longer shows leaf/canopy art but the layout
   still looks intentional, not broken/empty.
5. Report clearly: the full list of files touched, and confirm each of the
   "known specific fixes" above was actually applied (don't just say
   "done" -- name each one and its resulting token).
