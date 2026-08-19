# PROJECT FOREVER — Repository Plan

**Application ID:** `QB × DKB / 2026 / LIFETIME`
**Repo working name:** `project-forever` (see §9 for naming/visibility decision)
**Deliverable:** static, mobile-first, single-page interactive experience deployed to GitHub Pages.

---

## 1. Stack decision

| Concern              | Choice                                                               | Why                                                                                     |
| -------------------- | -------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Build                | **Vite 6 + React 19 + TypeScript**                                   | Fast, zero-config static output, first-class GitHub Pages support via `base`.           |
| Styling              | **Tailwind CSS v4** + a small `tokens.css` layer                     | Design system (§3) expressed as CSS variables; Tailwind for layout speed.               |
| Animation            | **Framer Motion** (`motion/react`)                                   | Scroll reveals, timeline draw, section personality shifts, `useReducedMotion` built in. |
| Confetti / particles | **canvas-confetti** (lazy-loaded)                                    | 3 KB gz, only pulled in on Apply Now / Accept / Celebrate.                              |
| Typewriter           | Hand-rolled `useTypewriter` hook                                     | No dep needed; must respect reduced-motion.                                             |
| State                | React Context + `useReducer`, persisted to `localStorage`            | Single-user app — no store library justified.                                           |
| Routing              | None (single scroll page) + a hash-gated `#/management` panel        | Keeps it one narrative; hash gate covers the Personal tier.                             |
| Tests                | **Vitest** + Testing Library for reducer/persistence/gate logic only | Don't unit-test animations; test the state machine.                                     |
| Lint/format          | ESLint (flat config) + Prettier + `tsc --noEmit` in CI               | Cheap correctness gate.                                                                 |
| Deploy               | **GitHub Actions → GitHub Pages** (`actions/deploy-pages`)           | No `gh-pages` branch to babysit.                                                        |

Explicitly **not** using: Next.js (no server needed, Pages export friction), a CMS, analytics, or an audio library. Music stays a single `<audio>` element, `paused` by default (§8).

---

## 2. Repository structure

```
project-forever/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                  # typecheck + lint + test + build on PR
│   │   └── deploy.yml              # build + deploy Pages on push to main
│   └── ISSUE_TEMPLATE/section.md   # one issue per site section
├── public/
│   ├── media/
│   │   ├── gif/get-over-here.gif   # lazy-loaded, never in initial bundle
│   │   ├── photos/                 # WebP, ≤200 KB each, srcset
│   │   └── audio/theme.m4a         # optional, off by default
│   ├── og-image.png
│   └── favicon.svg
├── src/
│   ├── main.tsx
│   ├── App.tsx                     # section order = narrative order
│   ├── content/                    # ALL copy lives here — no strings in components
│   │   ├── candidate.ts
│   │   ├── management.ts
│   │   ├── pitch.ts
│   │   ├── portfolio.ts
│   │   ├── meetingNotes.ts
│   │   ├── planning777.ts
│   │   ├── warmth.ts
│   │   ├── roadmap.ts
│   │   ├── benefits.ts
│   │   ├── surprises.ts            # spontaneous-mode pool + easter eggs
│   │   └── index.ts                # typed barrel + zod-less runtime shape check
│   ├── design/
│   │   ├── tokens.css              # palette, type scale, easing, radii
│   │   ├── themes.ts               # 'executive' | 'warm' | 'intimate' | 'cinematic'
│   │   └── motion.ts               # shared variants + durations
│   ├── state/
│   │   ├── AppState.tsx            # context + reducer
│   │   ├── persistence.ts          # versioned localStorage schema
│   │   └── types.ts
│   ├── hooks/
│   │   ├── useTypewriter.ts
│   │   ├── useInViewOnce.ts
│   │   ├── useKonami.ts            # "queen" keystroke unlock
│   │   ├── useClickStreak.ts       # 3x coffee, 5x blanket equity
│   │   └── useLazyConfetti.ts
│   ├── components/                 # dumb, reusable
│   │   ├── Section.tsx             # theme-aware wrapper + scroll reveal
│   │   ├── TerminalBlock.tsx       # the ✓/PASS console aesthetic
│   │   ├── ProgressMeter.tsx
│   │   ├── GlassCard.tsx
│   │   ├── Timeline.tsx            # horizontal desktop → vertical mobile
│   │   ├── StatusBadge.tsx
│   │   ├── LockedPanel.tsx         # 🔐 MANAGEMENT-ONLY PROTOCOL
│   │   └── MotionSafe.tsx
│   └── sections/                   # one folder per §, matches your component list
│       ├── Loader/
│       ├── Hero/
│       ├── GetOverHere/
│       ├── ExecutivePitch/
│       ├── Portfolio/
│       ├── MeetingNotes/
│       ├── Planning777/
│       ├── WarmthProtocol/
│       ├── BlushLab/
│       ├── FoodSimulator/
│       ├── Compatibility/
│       ├── DecisionArchitecture/
│       ├── FinancePhilosophy/
│       ├── JewelryRoadmap/
│       ├── FitnessPlan/
│       ├── FamilyIntegration/
│       ├── CareerSupport/
│       ├── Exclusivity/
│       ├── CommitmentTimeline/
│       ├── SeriousMessage/
│       ├── ApplyNow/
│       └── AcceptanceScreen/
├── docs/
│   ├── DESIGN.md                   # design system + animation budget
│   ├── CONTENT.md                  # how to edit copy without touching components
│   └── PRIVACY.md                  # §8 tier rules — read before every commit
├── .gitignore
├── .env.example                    # VITE_MANAGEMENT_PASSPHRASE_HASH
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts                  # base: '/project-forever/'
└── README.md                       # deliberately vague; see §9
```

**Rule:** a section component may import from `content/`, `components/`, `hooks/`, `design/`, `state/`. It may not import another section. That keeps the narrative reorderable in `App.tsx` alone.

---

## 3. Design system, as code

`src/design/tokens.css`:

```css
:root {
  --ivory: #fbf7f0;
  --ink: #14100f;
  --wine: #6e1b32;
  --rose: #b76e79;
  --champagne: #d9be8a;
  --mogra: #fffdf8;
  --font-serif: 'Cormorant Garamond', Georgia, serif; /* emotional */
  --font-sans: 'Inter', system-ui, sans-serif; /* corporate UI */
  --font-mono: 'JetBrains Mono', ui-monospace; /* terminal blocks */
  --ease-premium: cubic-bezier(0.16, 1, 0.3, 1);
  --dur-slow: 900ms;
}
```

Four themes drive the personality shift; `Section.tsx` sets `data-theme` and everything inherits:

| Theme       | Sections                                                  | Background → text             |
| ----------- | --------------------------------------------------------- | ----------------------------- |
| `executive` | Loader, Hero, Portfolio, Compatibility, Exclusivity       | near-black → champagne        |
| `warm`      | Pitch, MeetingNotes, 777, Warmth, Family, Career, Fitness | ivory → ink                   |
| `playful`   | GetOverHere, BlushLab, FoodSimulator                      | ivory + rose accents          |
| `intimate`  | SeriousMessage, Declaration                               | deep wine-black → ivory serif |
| `cinematic` | ApplyNow, AcceptanceScreen                                | pure black, letterboxed       |

Self-host both display fonts (`public/fonts`, `font-display: swap`, WOFF2 subset) — no Google Fonts request on first paint.

---

## 4. State machine

`src/state/types.ts`:

```ts
export type ManagementDecision = 'pending' | 'accepted' | 'clarification';

export interface AppState {
  version: 1;
  hasEntered: boolean;
  hasSeenGif: boolean;
  flowersDeployed: number;
  coffeeSent: number;
  hugRequested: number;
  hoodieStolen: boolean;
  foodRejectCount: number; // 0..5, SLA breach at 5
  compatibilityCompleted: boolean;
  spontaneousDrawn: string[]; // avoid repeats
  eggsFound: string[]; // 'blanket' | 'coffee' | 'name' | 'mangalsutra' | 'queen'
  applicationSubmitted: boolean;
  managementDecision: ManagementDecision;
  managementUnlocked: boolean; // Personal tier gate
  reducedMotionOverride: boolean | null;
}
```

Persistence rules (`persistence.ts`):

- Key `pf.state.v1`. On version mismatch → discard, don't migrate (single user, cheap).
- Persist **everything except** `hasEntered` — the loader should replay on a fresh visit, but only for ~1.2 s if state exists (don't make her sit through the full boot twice).
- If `applicationSubmitted` is true on load, Hero swaps to: _"Welcome back, Management. Candidate application remains active. ❤️"_ with a jump-to-decision CTA.
- If `managementDecision === 'accepted'`, expose a persistent 🖤 button that replays the acceptance screen on demand.
- `try/catch` every storage access — private-browsing Safari throws on `localStorage` in some configs, and that must not white-screen the site.

Unit-test targets: reducer transitions, food SLA at exactly 5, persistence round-trip, version discard, storage-throw fallback.

---

## 5. Privacy tiers → concrete repo rules

`docs/PRIVACY.md` is a pre-commit checklist, and the tiers map to enforcement, not just intent:

| Tier         | Where it lives                                                     | Enforcement                                                                                                                            |
| ------------ | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Public**   | `src/content/*.ts`, committed                                      | Normal review.                                                                                                                         |
| **Personal** | Same files, but behind the `#/management` passphrase gate          | Gate is UX-only — assume anyone can read the bundle. So: _nothing goes here that would embarrass either of you if read by a stranger._ |
| **Private**  | **Never committed.** Rendered as `<LockedPanel>` placeholders only | Actual finance figures, ring budget, intimate agreements stay off the repo entirely.                                                   |

Hard rules:

1. No raw meeting transcript, no verbatim call notes, no automated-transcript file in the repo. Only your paraphrased "What I Heard" list.
2. No rupee/dollar amounts anywhere in `src/` or `public/`. Finance section is philosophy + four buckets only (§15 of the brief).
3. No family members' full names, employers, or addresses.
4. `.gitignore` includes `NOTES.private.md`, `*.private.*`, `.env*` (except `.env.example`), `content/private/`.
5. Passphrase gate compares a SHA-256 hash from `VITE_MANAGEMENT_PASSPHRASE_HASH`, injected at build time as a repo secret — the plaintext never enters git history.
6. Add a `pre-commit` hook (simple shell, no husky): grep the staged diff for a small denylist (`₹`, `salary`, `account number`, transcript filenames) and block the commit with a message pointing at `docs/PRIVACY.md`.

---

## 6. CI/CD

`.github/workflows/ci.yml` — on `pull_request`:

```
setup-node 22 (cache: npm) → npm ci → tsc --noEmit → eslint . → vitest run → vite build
```

`.github/workflows/deploy.yml` — on `push: main` + `workflow_dispatch`:

```
permissions: { contents: read, pages: write, id-token: write }
concurrency: { group: pages, cancel-in-progress: true }
build job:  npm ci → vite build (env: VITE_MANAGEMENT_PASSPHRASE_HASH) → upload-pages-artifact ./dist
deploy job: actions/deploy-pages
```

`vite.config.ts` must set `base: '/project-forever/'` for a project-page URL, or `base: '/'` if you attach a custom domain. Ship a `public/404.html` copy of `index.html` only if you later add real routes.

Manual chunks in the Rollup config: `react`, `motion`, and lazy-only `confetti` — so the initial bundle stays under the §33 budget.

---

## 7. Performance & accessibility budget (enforced, not aspirational)

Targets, checked with `npx lighthouse` against the deployed URL on the "Mobile / Slow 4G" preset:

| Metric               | Budget                                                                                  |
| -------------------- | --------------------------------------------------------------------------------------- |
| Initial JS (gz)      | ≤ 120 KB                                                                                |
| LCP on 4G            | ≤ 2.0 s                                                                                 |
| Loader → interactive | ≤ 2.5 s (the boot sequence is _theatre_, not a real wait — never block on network)      |
| GIF                  | ≤ 2 MB, `loading="lazy"`, fetched only when GetOverHere enters view                     |
| Photos               | WebP, `srcset` at 480/960/1440, `loading="lazy"`, explicit `width`/`height` to kill CLS |
| Fonts                | 2 families, WOFF2 subset, ≤ 60 KB total                                                 |

Accessibility, non-negotiable:

- `prefers-reduced-motion: reduce` → all strong animations become instant state changes; typewriter renders full text immediately; confetti is skipped. Plus an in-page toggle (`reducedMotionOverride`).
- Every interactive element is a real `<button>` with a visible `:focus-visible` ring in champagne.
- Terminal blocks get `role="status"` / `aria-live="polite"` so the PASS/FAIL results are announced, not just animated.
- No information conveyed by animation alone — every animated reveal has a static end state with text.
- Contrast ≥ 4.5:1 for body copy in **all four** themes (wine-on-ivory and champagne-on-black both need checking; muted rose on ivory will likely fail and must be darkened for text use).
- Easter eggs are enhancements only — never the sole path to any content, and the hover-only ones get a tap equivalent.

---

## 8. Section build order (matches the emotional arc)

Each phase = one branch, one PR, one deployable state. Never leave `main` in a half-narrative state.

| Phase              | Branch                 | Contents                                                                                                                                                                                              | Done when                                                           |
| ------------------ | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| **0 · Setup**      | `chore/scaffold`       | Vite+TS+Tailwind, tokens, `Section`, `TerminalBlock`, `ProgressMeter`, state+persistence+tests, both workflows, empty Pages deploy live                                                               | Blank themed page is live at the Pages URL                          |
| **1 · Foundation** | `feat/foundation`      | Loader, Hero, content config, mobile shell, reduced-motion plumbing                                                                                                                                   | Boot sequence → ENTER APPLICATION → Hero, on a real phone           |
| **2 · Narrative**  | `feat/narrative`       | ExecutivePitch (4 cards), Portfolio (3 deployments + 87 % meter), MeetingNotes (typewriter), Planning777 (3 nodes + 80/20 + Spontaneous Mode)                                                         | The "he remembered" beat lands                                      |
| **3 · Fun**        | `feat/blush`           | GetOverHere (one-shot GIF), BlushLab (mogra/coffee/cuddle/hoodie-403), FoodSimulator (5-reject SLA), Compatibility (99.99 %)                                                                          | All four Blush buttons + SLA breach work on touch                   |
| **4 · Serious**    | `feat/commitment`      | WarmthProtocol, DecisionArchitecture, FinancePhilosophy (buckets + LockedPanel), JewelryRoadmap (4 phases, no budget), FitnessPlan, FamilyIntegration, CareerSupport, Exclusivity, CommitmentTimeline | Timeline reads TODAY → LIFETIME, vertical on mobile                 |
| **5 · Ending**     | `feat/finale`          | SeriousMessage (animations off, theme `intimate`), ApplyNow checklist + submit sequence, Declaration, Management decision portal (Accept / Schedule Clarification), AcceptanceScreen + GIF callback   | Full run-through, then refresh → returning-visitor state is correct |
| **6 · Personal**   | `feat/personalization` | Real photos, mogra references, inside jokes, links to Sunday / Dhruv×Stuti / Test App 1, the 5 easter eggs                                                                                            | Privacy checklist signed off in the PR                              |
| **7 · QA**         | `chore/qa`             | Real-device pass (iOS Safari + Android Chrome), Lighthouse vs §7 budget, copy proofread aloud, link check, refresh-state matrix, reduced-motion pass, privacy grep                                    | Every §7 budget met; QA checklist in the PR body all ticked         |
| **8 · Ship**       | —                      | Tag `v1.0.0`, verify the production URL on **your own phone on cellular**, then send the link                                                                                                         | Link sent to Management only                                        |

Phase 5 depends on nothing from 6 — if time runs short, ship after 5 + a privacy pass. Phases 3 and 4 are independently mergeable and can be built in either order.

---

## 9. Repo hygiene

- **Visibility: private.** GitHub Pages from a private repo needs a paid plan; if the account is Free, the pragmatic route is a **public repo with zero Private-tier content** (§5) plus an unguessable repo name and no topics/description — treat the URL as semi-secret, not secret. If you want true privacy, deploy the same `dist/` to Vercel or Netlify with password protection instead of Pages; the build is host-agnostic, only `base` changes.
- `README.md`: setup/run/deploy instructions only. No screenshots of the emotional sections, no explanation of the surprise — assume she might see the repo.
- Commits: Conventional Commits, section-scoped (`feat(blush-lab): hoodie 403 takeover`). Squash-merge each phase PR so the history reads as eight clean milestones.
- Issues: one per section from `ISSUE_TEMPLATE/section.md` (fields: copy ready?, mobile checked?, reduced-motion checked?, privacy tier). Group into a milestone per phase.
- Tag `v1.0.0` at the moment you send the link. Anything after is `v1.1.x` — because you _will_ keep adding surprises (the meter says 87 %, after all).

---

## 10. Open items for you to decide

1. **Repo visibility / host** — private Pages (paid), public Pages with content discipline, or Netlify/Vercel with a password.
2. **Custom domain?** Something like `apply.<yourdomain>` reads far better in a message than `github.io/project-forever`. Changes `base` to `/` and needs a `public/CNAME`.
3. **The passphrase** for the `#/management` panel — should be something only she'd guess (and the hint should be an inside joke, not a security question).
4. **Which photos**, and whether any are Personal-tier rather than Public.
5. **Does she get a "Schedule Further Clarification" path that actually does something** — e.g. opens a WhatsApp deep link with a pre-filled message. Recommended: yes, otherwise that button is a dead end.
