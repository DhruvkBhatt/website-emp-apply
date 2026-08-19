# project-forever

A small static site. Single page, no backend, no analytics.

Deliberately light on detail — see `PLAN.md` if you are the author, and
`docs/PRIVACY.md` before every commit.

## Requirements

Node 22+ (Node 25 works; the test setup accounts for its built-in
`localStorage` global).

## Setup

```sh
npm install
cp .env.example .env
git config core.hooksPath .githooks   # installs the pre-commit privacy gate
```

## Run

```sh
npm run dev        # vite dev server
npm run build      # typecheck → build → performance budget
npm run preview    # serve the production build locally
```

## Verify

```sh
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npm test           # vitest
npm run budget     # §7 initial-payload budget, against dist/
npm run privacy    # denylist gate over the tree
```

CI runs all five on every pull request.

## The management passphrase

```sh
npm run hash -- "your passphrase here"
```

Put the resulting hex in `.env` locally and in a repo secret named
`VITE_MANAGEMENT_PASSPHRASE_HASH` for the deploy workflow. The plaintext never
enters git history.

With no hash configured the gate fails **open** and says so on screen — check
this before sending the link.

## Deploy

Push to `main`. `.github/workflows/deploy.yml` builds and publishes to GitHub
Pages.

`vite.config.ts` defaults `base` to `/project-forever/` for a project page. For
a custom domain, set the repo variable `VITE_BASE` to `/` and add
`public/CNAME`.

## Layout

```
src/content/    all copy — no strings live in components
src/sections/   one folder per section; none imports another
src/components/ shared, dumb primitives
src/state/      reducer, persistence, passphrase gate
src/design/     tokens, themes, motion
docs/           DESIGN, CONTENT, PRIVACY
scripts/        privacy gate, budget check, passphrase hasher
```

`src/App.tsx` is the only place section order is defined.

## Outstanding assets

Neither is required to run; both degrade gracefully.

- `public/fonts/` — two WOFF2 subsets. See its README.
- `public/media/gif/get-over-here.gif` — falls back to a static line if absent.
