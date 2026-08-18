# Contributing

Conventions for this codebase, kept here so the pattern stays consistent as the project grows.

## CSS: BEM naming

Every component has its own co-located CSS file using BEM (`block__element--modifier`):

- **Block** — the component name in kebab-case (`Avatar` → `.avatar`, `PosterTile` → `.poster-tile`).
- **Element** — a part of the block: `.avatar__label`, `.order-form__submit-btn`.
- **Modifier** — a state or variant: `.btn--primary`, `.btn--disabled`.

Reference shared design tokens (`src/styles/tokens.css`) via `var(--color-accent)`, `var(--font-display)`, etc. — never hardcode a color or font that already has a token.

## No inline styles — one sanctioned exception

Don't use the `style={{}}` prop for real CSS properties (background, padding, font-size, ...). Put that in the component's `.css` file as a BEM class instead.

The **one** exception: a `style` prop that sets *only* CSS custom properties, for a value that is genuinely per-instance and data-driven (can't be known ahead of time as a static class). Example — `Avatar`'s color and size vary per user:

```jsx
// src/components/ui/Avatar/Avatar.jsx
<div
  className="avatar"
  style={{ "--avatar-color": getAvatarColor(label || ""), "--avatar-size": `${size}px` }}
  ...
>
```

```css
/* src/components/ui/Avatar/Avatar.css */
.avatar {
  width: var(--avatar-size);
  height: var(--avatar-size);
  background: var(--avatar-color);
  ...
}
```

All the actual styling (layout, sizing, color roles) still lives in the `.css` file — the inline `style` only ever sets the custom properties that vary per instance. `PosterTile` follows the same pattern for its per-product tile colors.

## Component folder structure

Every component under `src/components` lives in its own folder:

```
components/ComponentCategory/ComponentName/
  ComponentName.jsx
  ComponentName.css   (if the component has styles)
  index.js
```

`index.js` is a one-line re-export so callers can import the folder directly instead of reaching into it:

```js
// src/components/ui/Avatar/index.js
export { default } from "./Avatar";
```

```jsx
// caller, anywhere in the app
import Avatar from "../../components/ui/Avatar";
```

Don't write `from "../../components/ui/Avatar/Avatar"` — once the `index.js` exists, the plain folder path resolves automatically. If a component has no CSS (e.g. a pure SVG icon component), just omit the `.css` file — don't invent an empty one.

This pattern applies to `src/components/**`. `src/pages/**` and the root `App.jsx` are not reusable components and don't follow it — `App.jsx` lives flat at `src/App.jsx`, and pages live at `src/pages/PageName/PageName.jsx` without an `index.js`.
