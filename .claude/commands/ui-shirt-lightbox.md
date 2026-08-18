---
description: "UI: black t-shirt mockup + click-to-expand lightbox with carousel nav"
---

Run this AFTER ui-violet-palette-migration.md (done) AND
migrate-component-folders.md (must run first). It depends on the new
`--color-bg`, `--color-surface`, `--color-accent`, `--color-text` tokens,
AND on the folder-per-component + index.js convention established by
migrate-component-folders.md -- both new components below are created
directly in that structure, not as flat files. Adds a flat black t-shirt
silhouette showing the design on the chest, displayed in a full-screen
lightbox opened by clicking any design tile. The lightbox has a blurred
backdrop and prev/next arrows to browse every product without closing it.
Grid tiles themselves (Shop, Landing teaser, OrderForm picker) are NOT
changed -- they keep showing the flat design image as they do now; the
shirt mockup is reserved for the lightbox.

IMPORTANT on relative import depth: because both new components live one
level deeper than a flat file would (`ComponentName/ComponentName.jsx`
instead of `ComponentName.jsx`), every relative import INSIDE these two
new files needs one extra `../` compared to what's shown below in
prose -- the code blocks below already have the correct depth for the
final folder location, but double-check each one resolves against the
actual file tree before moving on, don't assume.

## Step 1 — ShirtMockup component

Create `src/components/art/ShirtMockup/ShirtMockup.jsx`:
```jsx
import React from "react";
import "./ShirtMockup.css";

export default function ShirtMockup({ product, size = 320 }) {
  const clipId = `shirt-print-${product.id}`;
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className="shirt-mockup">
      <path
        d="M70 20 L60 40 L30 55 L45 85 L60 75 L60 175 L140 175 L140 75 L155 85 L170 55 L140 40 L130 20
           C130 20 122 32 100 32 C78 32 70 20 70 20 Z"
        fill="#161016"
        stroke="#0B080B"
        strokeWidth="1.5"
      />
      <path
        d="M70 20 C70 20 78 32 100 32 C122 32 130 20 130 20"
        fill="none"
        stroke="#2A1F2A"
        strokeWidth="1.5"
      />
      <clipPath id={clipId}>
        <rect x="72" y="55" width="56" height="56" rx="4" />
      </clipPath>
      <g clipPath={`url(#${clipId})`}>
        {product.image ? (
          <image
            href={product.image}
            x="72"
            y="55"
            width="56"
            height="56"
            preserveAspectRatio="xMidYMid slice"
          />
        ) : (
          <rect x="72" y="55" width="56" height="56" fill={product.tileBg || "#3D2740"} />
        )}
      </g>
    </svg>
  );
}
```
Create `src/components/art/ShirtMockup/ShirtMockup.css`:
```css
.shirt-mockup {
  display: block;
}
```
Create `src/components/art/ShirtMockup/index.js`:
```js
export { default } from "./ShirtMockup";
```
The `fill`/`stroke` attributes on the SVG shapes are standard SVG
presentation attributes, not the React `style` prop -- consistent with how
`CanopyHero.jsx`/`ProductIcon.jsx` already draw art in this codebase,
not a violation of the no-inline-styles rule.

## Step 2 — DesignLightbox component

Create `src/components/lightbox/DesignLightbox/DesignLightbox.jsx`.
Note the import depths below: this file sits two levels under
`src/components/`, same as `ShirtMockup.jsx` does, so `PRODUCTS` needs
`../../../data/products` (not `../../`), and sibling component folders
`ui/Btn` and `art/ShirtMockup` need `../../` (not `../`) to first reach
`src/components/` before descending into the other category:
```jsx
import React, { useState, useEffect } from "react";
import { PRODUCTS } from "../../../data/products";
import ShirtMockup from "../../art/ShirtMockup";
import Btn from "../../ui/Btn";
import "./DesignLightbox.css";

export default function DesignLightbox({ startId, onClose, onOrder }) {
  const [index, setIndex] = useState(() => {
    const i = PRODUCTS.findIndex((p) => p.id === startId);
    return i === -1 ? 0 : i;
  });

  const product = PRODUCTS[index];

  function goPrev() {
    setIndex((i) => (i - 1 + PRODUCTS.length) % PRODUCTS.length);
  }
  function goNext() {
    setIndex((i) => (i + 1) % PRODUCTS.length);
  }

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="design-lightbox__overlay" onClick={onClose}>
      <button className="design-lightbox__close" onClick={onClose} aria-label="Close">
        ×
      </button>
      <button
        className="design-lightbox__nav design-lightbox__nav--prev"
        onClick={(e) => { e.stopPropagation(); goPrev(); }}
        aria-label="Previous design"
      >
        ‹
      </button>

      <div className="design-lightbox__card" onClick={(e) => e.stopPropagation()}>
        <ShirtMockup product={product} size={320} />
        <div className="design-lightbox__name">{product.name}</div>
        <div className="design-lightbox__price">${product.price}</div>
        <Btn variant="primary" onClick={() => onOrder(product.id)}>
          Order this design
        </Btn>
      </div>

      <button
        className="design-lightbox__nav design-lightbox__nav--next"
        onClick={(e) => { e.stopPropagation(); goNext(); }}
        aria-label="Next design"
      >
        ›
      </button>
    </div>
  );
}
```

Create `src/components/lightbox/DesignLightbox/DesignLightbox.css`:
```css
.design-lightbox__overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 8, 16, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.design-lightbox__card {
  background: var(--color-surface);
  border-radius: 24px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 460px;
  width: 100%;
}

.design-lightbox__name {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 22px;
  color: var(--color-accent);
  margin-top: 20px;
}

.design-lightbox__price {
  font-family: var(--font-mono);
  font-size: 16px;
  color: var(--color-text);
  opacity: 0.8;
  margin: 6px 0 20px;
}

.design-lightbox__close {
  position: absolute;
  top: 24px;
  right: 24px;
  background: transparent;
  border: none;
  color: var(--color-text);
  font-size: 30px;
  cursor: pointer;
  line-height: 1;
}

.design-lightbox__nav {
  background: transparent;
  border: none;
  color: var(--color-text);
  font-size: 48px;
  cursor: pointer;
  padding: 12px 20px;
  line-height: 1;
  z-index: 1001;
}

.design-lightbox__nav--prev {
  position: absolute;
  left: 12px;
}

.design-lightbox__nav--next {
  position: absolute;
  right: 12px;
}
```
Create `src/components/lightbox/DesignLightbox/index.js`:
```js
export { default } from "./DesignLightbox";
```
Navigation wraps around (last design's "next" goes to the first, and vice
versa) for continuous browsing, matching what was asked for.

## Step 3 — Wire click-to-open into Shop.jsx and Landing.jsx

In `Shop.jsx`, make the `.shop__card-media` (the `PosterTile` wrapper)
clickable to open the lightbox, without interfering with the existing
like-heart click or the "Order this design" button (both need
`e.stopPropagation()` if they're inside the same clickable area, or keep
them as siblings outside it -- check the actual DOM structure and use
whichever avoids the heart-click also opening the lightbox). Add an
`onPreview` prop to `Shop`, called with the product id.

In `Landing.jsx`, similarly make the collection teaser grid items open the
lightbox on click instead of (or in addition to -- use your judgement,
but the existing behavior routes straight to `OrderForm` via `onOrder`,
so consider whether teaser-grid click should now open the lightbox first
with an "Order this design" button inside it, rather than skipping
straight to the order form). Add the same `onPreview` prop.

## Step 4 — Wire the lightbox into App.jsx

1. Import `DesignLightbox`.
2. Add `const [previewId, setPreviewId] = useState(null);`
3. Pass `onPreview={(id) => setPreviewId(id)}` to both `Shop` and `Landing`.
4. Render conditionally:
   ```jsx
   {previewId && (
     <DesignLightbox
       startId={previewId}
       onClose={() => setPreviewId(null)}
       onOrder={(id) => { setPreviewId(null); goOrder(id); }}
     />
   )}
   ```
   (`goOrder` already exists in `App.jsx` from the existing order-navigation flow.)

## Verify

1. `npm run build` -- paste real output.
2. `npm run dev`. In the Shop grid, click a design tile (not the heart,
   not the "Order this design" button) -- confirm the lightbox opens with
   that exact design shown on the black shirt, backdrop blurred.
3. Click the right arrow repeatedly -- confirm it cycles through all 55
   products in order, wrapping from the last back to the first.
4. Click the left arrow -- confirm it goes backward, wrapping from the
   first to the last.
5. Press the Escape key -- confirm it closes. Press ArrowRight/ArrowLeft
   with the lightbox open -- confirm keyboard navigation works too.
6. Click the backdrop (not the card) -- confirm it closes. Click inside
   the card -- confirm it does NOT close.
7. Click "Order this design" inside the lightbox -- confirm it closes the
   lightbox AND navigates to the order form with that exact design
   pre-selected.
8. Confirm the like-heart and "Order this design" button on the Shop grid
   tiles still work independently and do NOT also trigger the lightbox.
9. Report clearly whether each of the above actually held.
