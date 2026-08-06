# Common Thread

A t-shirt shop prototype: a single naturalist wildlife product line, with 10% of every order routed to a cause the buyer picks at checkout. Built as a React component tree with no backend — accounts, likes, and order history persist through a `window.storage` key/value API, and payment is entirely mocked (no real card processing).

## Status

This is a prototype UI only. There is currently no `package.json`, bundler, or dev server in this repo — `src/` is a plain React component tree meant to be dropped into a host environment that provides `React` and a `window.storage.get/set` implementation. If you want to run it standalone, it'll need a bundler setup (Vite, CRA, etc.) added first.

## Structure

```
src/
├── App.jsx                  # top-level state + view routing
├── theme/tokens.js          # color tokens (TOKENS) and font import string (FONTS)
├── data/
│   ├── products.js          # PRODUCTS catalog, SIZES
│   └── causes.js            # CAUSES buyers can route their 10% to
├── lib/storage.js           # getJSON / setJSON wrappers around window.storage
├── components/
│   ├── ui/                  # Card, Btn, Tag, Input — shared visual atoms
│   ├── art/                 # hand-drawn SVG illustrations (hero art, product icons)
│   ├── layout/               # Header, Footer
│   └── cart/                # CartDrawer, CauseMeter
├── pages/
│   ├── Landing.jsx           # hero + product teaser + cause list
│   ├── Shop.jsx               # full catalog grid (ProductGrid lives here)
│   ├── ProductDetail.jsx
│   ├── Checkout.jsx           # guest/member choice → shipping → cause → payment
│   ├── Profile.jsx            # account settings, liked items, order history
│   └── auth/                  # AuthScreen (standalone) + AuthForm (shared with checkout)
└── hooks/
    ├── useCart.js            # cart array, add/remove/update qty, totals
    ├── useAuth.js            # user session, login/logout, purchase history
    └── useLiked.js           # liked product ids, loaded per-user from storage
```

## How it works

- **Accounts & sessions** — Signing up writes `account:<email>` to storage with a password and a `twoFA` flag. Logging in re-reads that record. There's no real auth backend; passwords are stored as plain JSON.
- **Mock 2FA** — If an account has 2FA enabled, login generates a random 6-digit code and displays it directly in the UI (there's no email to send it to) instead of gating on a real out-of-band channel.
- **Likes & orders** — `liked:<email>` and `purchases:<email>` are loaded whenever the signed-in user changes, and rewritten on every toggle/purchase. Guests can browse and check out but can't like items or see order history.
- **Cause routing** — At checkout, the buyer picks one of `CAUSES` from `data/causes.js`. The `CauseMeter` component visualizes 10% of the order total going to that cause; the confirmation screen restates the dollar amount.
- **Payment** — The payment step accepts any non-empty card number/expiry/CVC and always "succeeds." No card processor is called.

## Notable non-obvious behavior

- `ProductGrid` (defined in `pages/Shop.jsx`) is reused by `Landing.jsx` for the 4-item teaser grid — it's exported from `Shop.jsx` rather than duplicated.
- `AuthForm` is shared between the standalone `/auth` screen and the inline "log in or create an account" step in checkout, so login/signup logic only exists in one place.
- Cart state, session/purchase state, and liked-items state each live in their own hook (`useCart`, `useAuth`, `useLiked`); `App.jsx` composes them rather than owning that state directly.
