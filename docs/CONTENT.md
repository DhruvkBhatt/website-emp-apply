# CONTENT

**All copy lives in `src/content/`.** No component holds a user-visible string.
That is the rule that lets you rewrite the whole site at 1 a.m. without opening
a single `.tsx` file.

---

## Where each section's words live

| File              | Sections it feeds                                                                                           |
| ----------------- | ----------------------------------------------------------------------------------------------------------- |
| `candidate.ts`    | Loader boot lines, Hero (first-visit _and_ returning), the application ID, the motion-toggle labels         |
| `pitch.ts`        | Executive Pitch — the four cards                                                                            |
| `portfolio.ts`    | Portfolio — three deployments, the 87 % meter                                                               |
| `meetingNotes.ts` | Meeting Notes — the paraphrased "What I Heard" list                                                         |
| `planning777.ts`  | The 7·7·7 plan, the 80/20 split, Spontaneous Mode                                                           |
| `warmth.ts`       | Warmth Protocol, Blush Lab (including the 403), Food Simulator                                              |
| `roadmap.ts`      | Get Over Here, Compatibility, Decisions, Finance, Jewellery, Fitness, Family, Career, Exclusivity, Timeline |
| `benefits.ts`     | Benefits, the Serious Message, Apply Now, Declaration, the decision portal, Acceptance, Footer              |
| `management.ts`   | The passphrase gate and the unlocked panel (**Personal tier** — see `PRIVACY.md`)                           |
| `surprises.ts`    | Spontaneous-mode pool, the five easter eggs                                                                 |
| `index.ts`        | Typed barrel + the runtime shape check                                                                      |

---

## Editing safely

Everything is `as const`, so TypeScript catches a typo in a key immediately.
Change the text freely; changing _structure_ is where the guardrails are.

`index.ts` exports `checkContent()`, which runs automatically in dev (errors go
to the console) and is asserted in CI by `src/content/content.test.ts`. It
enforces the counts the sections and the brief depend on:

- 4 pitch cards, 3 portfolio deployments, 3 planning horizons
- 4 finance buckets, 4 jewellery phases, 5 easter eggs
- exactly 5 food reactions — one per rejection before the SLA breach
- more food options than the SLA limit, or the breach can never fire
- the timeline must start at `TODAY` and end at `LIFETIME`
- compatibility needs at least one honest `FAIL` (the two failures are the joke)
- no duplicate ids in the spontaneous pool — the no-repeat logic keys on them

If you want to change one of those counts, change the assertion in
`content.test.ts` in the same commit. A red test here means "the copy and the
component disagree", which is exactly when you want to be interrupted.

---

## Adding a new section

1. Add its copy to a file in `src/content/` and export it from `index.ts`.
2. Create `src/sections/<Name>/<Name>.tsx`. It may import from `content/`,
   `components/`, `hooks/`, `design/`, and `state/` — **never from another
   section**. ESLint enforces this; try it and see.
3. Add it to the list in `src/App.tsx`. That file _is_ the narrative order, and
   it is the only place the order exists.
4. Wrap the body in `<Section id theme>` so it inherits a theme, a scroll
   reveal, and the reduced-motion behaviour for free.

---

## Copy conventions

- **Sentence case** for body copy, `UPPERCASE` reserved for terminal output,
  status badges, and the two big buttons (`APPLY NOW`, `ACCEPT APPLICATION`).
- **The corporate voice is the joke; the feeling is not.** Keep the framing dry
  and the substance sincere. When the two fight, the substance wins.
- **The Serious Message has no jokes in it.** It also has no animation. Both are
  deliberate — do not "improve" either.
- **Read it aloud before committing.** Anything you would not say out loud to
  her face does not belong on a page addressed to her.
- **Placeholders are marked.** Everything currently in `src/content/` is
  structurally correct but written by someone who does not know the two of you.
  Replace it. That is the point of the split.
