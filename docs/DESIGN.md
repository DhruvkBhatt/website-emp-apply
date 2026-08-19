# DESIGN

The design system and the animation budget, as they exist in code. Source of
truth is `src/design/tokens.css`; this file explains the decisions behind it.

---

## Colour

```
--ivory  #FBF7F0    --ink       #14100F
--wine   #6E1B32    --rose      #B76E79
--champagne #D9BE8A --mogra     #FFFDF8
```

### Contrast (§7 — ≥ 4.5:1 for body copy, in all themes)

Measured, not assumed:

| Pair                             | Ratio      | Verdict                        |
| -------------------------------- | ---------- | ------------------------------ |
| `rose` #B76E79 on ivory          | **3.24:1** | ✗ decoration only — never text |
| `rose-text` #96505B on ivory     | 5.04:1     | ✓ the text variant             |
| `wine` on ivory                  | 9.78:1     | ✓                              |
| `champagne` on ink               | 10.5:1     | ✓                              |
| `ink-muted` #4A3F41 on ivory     | 8.70:1     | ✓ secondary text               |
| `champagne-muted` #B9A279 on ink | 7.60:1     | ✓ secondary text               |

The plan predicted muted rose would fail on ivory, and it does. That is why
`--rose` and `--rose-text` are separate tokens: the brand colour survives as a
border, a fill, and an accent bar, and the darkened variant carries every word.

### Themes

Sections set `data-theme`, which re-points a small set of semantic slots
(`--bg`, `--fg`, `--fg-muted`, `--accent`, `--accent-text`, `--ring`). Children
are theme-agnostic — they only ever reference the slots.

| Theme       | Sections                                                                                           |
| ----------- | -------------------------------------------------------------------------------------------------- |
| `executive` | Loader, Hero, Portfolio, Compatibility, Exclusivity, Timeline, Footer                              |
| `warm`      | Pitch, MeetingNotes, 777, Warmth, Decisions, Finance, Jewellery, Fitness, Family, Career, Benefits |
| `playful`   | GetOverHere, BlushLab, FoodSimulator                                                               |
| `intimate`  | SeriousMessage                                                                                     |
| `cinematic` | ApplyNow, ManagementPortal, AcceptanceScreen                                                       |

---

## Type

Three families, three jobs: serif for emotion, sans for the corporate UI, mono
for terminal blocks and eyebrows. The scale is fluid `clamp()` from `--step--1`
to `--step-4`, so there are no per-breakpoint font sizes anywhere.

Fonts are **not yet in the repo** — see `public/fonts/README.md`. The fallback
stack keeps the hierarchy correct until they are added. Budget: 2 families,
WOFF2 subsets, ≤ 60 KB total.

---

## Motion

`--ease-premium: cubic-bezier(.16, 1, .3, 1)` everywhere. Durations are
`fast 180ms / mid 420ms / slow 900ms`, mirrored in `src/design/motion.ts` — keep
the two in step.

### The rule that governs every animation

> No information is conveyed by animation alone. Every animated reveal has a
> static end state carrying the same content.

Practically: variants animate `opacity` and `transform` only. The text, the
number, and the status are in the DOM either way. Turning motion off never
removes content — only travel.

### Reduced motion

Three layers, deliberately redundant:

1. **CSS** — `@media (prefers-reduced-motion: reduce)` collapses durations to
   1 ms in `tokens.css`.
2. **The in-page override** — `data-motion="reduced" | "full"` on `<html>`,
   driven by `reducedMotionOverride` in app state. Three states, because
   "follow the system" must stay reachable after you have overridden it.
3. **Component logic** — `useMotionPreference()` returns a single `reduced`
   boolean; the typewriter renders in full, confetti is skipped, terminal blocks
   print at once, and the loader does not wait.

### The animation budget

Framer Motion's full feature set is ~46 KB gz, which busts the §7 initial-JS
budget on its own. So:

- Animated components import `m` from `motion/react-m` (a renderer-only stub).
- `components/MotionProvider.tsx` wraps the app in `<LazyMotion strict>` and
  fetches `domAnimation` _after_ first paint.
- `strict` means reaching for `motion.div` throws in dev rather than silently
  re-inflating the bundle. The test harness includes the provider, so a mistake
  fails in CI too.
- `canvas-confetti` is only ever reached through a dynamic `import()`.

`npm run budget` parses the built `index.html`, gzips exactly the assets fetched
before first paint, and fails the build over budget. Current state:

```
initial JS    99.0 KB gz   budget 120.0 KB
initial CSS    5.1 KB gz   budget  25.0 KB
```

---

## Accessibility, non-negotiable

- Every interactive element is a real `<button>`, min height 44 px, with a
  visible `:focus-visible` ring in the theme's `--ring`.
- Terminal blocks are `role="status" aria-live="polite"` so PASS/FAIL is
  announced. Meters use `role="meter"` with `aria-valuetext`.
- Both modals (the 403 takeover, the acceptance screen) are labelled, close on
  Escape, take focus on open, and restore it on close.
- Easter eggs are enhancements only, and every one has a tap route: the crown in
  the footer is the tap equivalent of typing "queen".
- Errors are announced (`role="alert"`), not just coloured red.
