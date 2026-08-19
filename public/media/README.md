# Media

Nothing in here is committed except these notes — see `.gitignore` and
`docs/PRIVACY.md`.

## `gif/get-over-here.gif`

- Budget: **≤ 2 MB** (§7). Fetched only when the GetOverHere section enters the
  viewport, and `loading="lazy"`.
- If the file is missing, the section falls back to the static line in
  `src/content/roadmap.ts` (`getOverHere.staticLine`) and shows a maintainer
  note. Nothing breaks.

## `photos/`

- WebP only. `≤ 200 KB` each. Provide `480 / 960 / 1440` widths for `srcset`.
- Always set explicit `width`/`height` on the `<img>` to keep CLS at zero.
- Decide the privacy tier per photo before adding it (§5, §10.4).

## `audio/theme.m4a`

- Optional. If added, it stays a single `<audio>` element that is **paused by
  default** — the site must never autoplay sound (§1, §8).
