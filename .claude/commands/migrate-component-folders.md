---
description: "Migrate to documented per-component folder structure (ComponentName/ComponentName.jsx + .css + index.js), fix current broken build, add CONTRIBUTING.md"
---

The build is currently broken because of a partial manual reorganization
(some files moved into same-name folders inconsistently). This command
finishes that migration properly and consistently, per the project's own
documented file structure:
```
/components
  /ComponentName
    ComponentName.jsx
    ComponentName.css
    index.js
```

## Step 0 — Assess current actual state

Run `find src -type f` and read the real current tree before changing
anything -- the manual reorg may have moved some files correctly, some
incorrectly, and left others untouched. Don't assume the tree matches any
prior description in this conversation; verify directly.

## Step 1 — Fix App.jsx specifically (not part of the folder pattern)

`App.jsx` is the root app shell, not a reusable component, and the
project's documented structure doesn't describe it as living in a
same-name folder (the folder+index.js pattern is specified for
`/components` specifically). If `App.jsx`/`App.css` are currently inside
any `App/` folder, move them back to flat `src/App.jsx` and `src/App.css`,
matching `main.jsx`'s existing `import App from "./App"`. Remove any
now-empty `App/` folder.

## Step 2 — Migrate every component under src/components into folders

For each of the following, if it is not already a proper
`ComponentCategory/ComponentName/ComponentName.jsx` (+`.css` if one
exists) structure, make it one:

```
components/ui/Card, Btn, Tag, Input, Avatar
components/art/CanopyHero, CanopyIcon, ProductIcon, PosterTile, ShirtMockup
components/layout/Header, Footer
components/profile/ProfileModal
components/lightbox/DesignLightbox
```

For each component `X` in category `C`:
1. Ensure the file lives at `src/components/C/X/X.jsx` (and `X.css` next
   to it, if that component has one -- `CanopyIcon.jsx` and
   `ProductIcon.jsx` don't have their own `.css` file, don't invent one).
2. The `.jsx` file's own `import "./X.css"` stays a relative import to the
   file now sitting next to it -- no change needed there since both files
   move together.
3. Create `src/components/C/X/index.js`:
   ```js
   export { default } from "./X";
   ```

## Step 3 — Verify import paths do NOT need to change (but check anyway)

Because `import Card from "../ui/Card"` resolves to `ui/Card/index.js`
automatically once that folder exists, existing import statements
elsewhere in the app referencing `"../components/ui/Card"` (etc.) should
continue to work completely unchanged. Do NOT rewrite these imports as a
matter of course. However: since a manual reorg already happened and may
have incorrectly edited some import paths to compensate for the broken
structure (adding or removing `../` levels, etc.), grep for every import
of each moved component across `src/` and confirm each one is the plain
pre-existing form (e.g. `from "../components/ui/Card"`, NOT
`from "../components/ui/Card/Card"` or similar) -- revert any that were
manually mangled back to the plain form.

## Step 4 — Write CONTRIBUTING.md

The project's own instructions call for this file to document the
convention "so the pattern stays consistent as the project grows." Create
`CONTRIBUTING.md` at the repo root covering: the BEM CSS naming rule, the
no-inline-styles rule (with the one sanctioned exception for CSS custom
properties on genuinely per-instance dynamic values, e.g. `PosterTile`,
`Avatar`), and the `/components/ComponentName/ComponentName.jsx + .css +
index.js` folder pattern demonstrated with one real example from this
codebase (e.g. `Avatar`). Keep it concise -- a reference doc, not a tutorial.

## Verify

1. `npm run build` -- paste the real output. This must succeed.
2. `grep -rn "from \"\.\./\|from \"\./" src --include=*.jsx --include=*.js`
   piped against the actual file tree (`find src -type f`) -- confirm
   every import target genuinely exists, the same style of check used to
   catch the last broken-import incident in this project. Don't just trust
   a clean build; a clean build only proves the FIRST broken import (if
   any) would have been caught, not that every import is individually
   correct.
3. `npm run dev`, click through landing -> shop -> order form -> auth
   panel -> sign in -> profile modal -> design lightbox, confirming no
   console errors and nothing renders broken. This exercises every
   migrated component category at least once.
4. Report the exact final tree under `src/components/` (via
   `find src/components -type f`), confirm `CONTRIBUTING.md` was created,
   and list anything from Step 3 that needed reverting (mangled import
   paths from the earlier manual reorg), if anything did.
