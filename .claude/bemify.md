---
description: Convert all inline styles to BEM-named CSS classes, no exceptions
---

Convert every component in this project from inline `style={{...}}` props to
CSS classes following BEM naming (`block__element--modifier`). Zero inline
`style={{...}}` objects should remain when this is done, with one specific
exception noted below for genuinely data-driven per-instance values.

## Files to convert (all of them)

```
src/App.jsx
src/components/art/CanopyHero.jsx
src/components/art/CanopyIcon.jsx
src/components/art/PosterTile.jsx
src/components/art/ProductIcon.jsx
src/components/layout/Footer.jsx
src/components/layout/Header.jsx
src/components/ui/Btn.jsx
src/components/ui/Card.jsx
src/components/ui/Input.jsx
src/components/ui/Tag.jsx
src/pages/AuthPanel.jsx
src/pages/Landing.jsx
src/pages/OrderForm.jsx
src/pages/Shop.jsx
```

## Method, per file

1. Create a CSS file next to the component with the same base name
   (e.g. `Header.jsx` → `Header.css`, co-located in the same folder).
   Import it at the top of the component: `import "./Header.css";`
2. The **block** name is the component name in kebab-case
   (`Header` → `header`, `PosterTile` → `poster-tile`, `AuthPanel` →
   `auth-panel`).
3. Each distinct visual sub-part is an **element**:
   `.header__logo`, `.header__nav`, `.order-form__submit-btn`,
   `.card__body`. Don't over-split — one style object usually maps to
   one class, not five.
4. State/variant differences become **modifiers**:
   `.btn--primary`, `.btn--ghost`, `.btn--disabled`,
   `.order-form__size-chip--selected`. Apply with a template literal:
   `className={\`btn btn--${variant} ${disabled ? "btn--disabled" : ""}\`}`
5. Every color, font-family, and spacing value currently pulled from
   `TOKENS` in `src/theme/tokens.js` must become a CSS custom property.
   Create `src/styles/tokens.css` with a `:root { --color-leaf: #1F3D2E;
   --color-cream: ...; --font-display: 'Fraunces', serif; ... }` block
   generated from the actual values in `tokens.js` (read that file, don't
   guess the hex values), import it once in `src/main.jsx`, and reference
   these as `var(--color-leaf)` etc. in every component CSS file instead
   of hardcoding colors again per file.

## The one exception: genuinely per-instance dynamic values

`PosterTile` renders a different background/foreground color per product
(`product.tileBg`, `product.tileFg`, pulled from `src/data/products.js`),
and `Landing`/`Shop` render a different `--cause-color` per cause from
`src/data/causes.js`. These are real data, not styling choices, and can't
be pre-written as static CSS classes. For these specific cases, keep a
**minimal** inline `style` that sets ONLY CSS custom properties, then do
all actual styling (layout, sizing, border-radius, etc.) in the CSS class:

```jsx
<div className="poster-tile" style={{ "--tile-bg": product.tileBg, "--tile-fg": product.tileFg }}>
```
```css
.poster-tile { background: var(--tile-bg); color: var(--tile-fg); border-radius: 16px; /* ...rest of the real styling... */ }
```

This is the only acceptable use of the `style` prop anywhere in the
project. Everything else — every color, spacing, font, shadow, layout
property — must live in a `.css` file.

## After conversion

1. Run this and confirm it returns nothing except the CSS-custom-property
   exceptions described above:
```bash
   grep -rn "style={{" src --include=*.jsx
```
   For each result, verify it only sets `--` custom properties. If it sets
   any real CSS property (`background:`, `padding:`, `fontSize:`, etc.)
   directly, that's a conversion you missed — fix it, don't leave it.
2. Run `npm run build` and paste the real output.
3. Run `npm run dev`, open the app, and visually confirm the landing page,
   shop grid, order form, and auth panel all still look identical to
   before — this is a styling-mechanism change, not a redesign. Report
   any visual regressions you notice, don't just assume it matches.
4. List every `.css` file created and every `.jsx` file that changed.