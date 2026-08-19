# PRIVACY

**Read this before every commit.** It is the checklist referenced by
`PLAN.md §5`, and it is enforced by `scripts/privacy-check.sh` (locally via the
pre-commit hook, and again in CI so `--no-verify` does not get you past it).

---

## The three tiers

| Tier         | Where it lives                                              | What that means in practice                                                                                                                                              |
| ------------ | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Public**   | `src/content/*.ts`, committed                               | Normal review. Assume anyone with the URL reads it.                                                                                                                      |
| **Personal** | `src/content/management.ts`, behind the `#/management` gate | The gate is **UX-only**. The hash and the copy both ship in the bundle. Nothing goes here that would embarrass either of you if a stranger read it.                      |
| **Private**  | **Never committed.** `<LockedPanel>` placeholders only      | Actual finance figures, ring budget, intimate agreements. These stay off the repo entirely — not in a comment, not in a branch, not in a commit that was later reverted. |

The reverted-commit point matters: git history is not a delete button. If a
Private-tier detail ever lands in a commit, the fix is a fresh repo, not a
revert.

---

## Hard rules

1. **No raw meeting transcript.** No verbatim call notes, no automated
   transcript file. Only the paraphrased "What I Heard" list in
   `src/content/meetingNotes.ts`.
2. **No amounts.** No rupee or dollar figures anywhere in `src/` or `public/`.
   The finance section is philosophy plus four buckets. The jewellery roadmap is
   four phases with no budget.
3. **No family identifiers.** No full names, employers, or addresses.
4. **`.gitignore` covers** `NOTES.private.md`, `*.private.*`, `content/private/`,
   and `.env*` except `.env.example`.
5. **The passphrase is never committed.** Only its SHA-256, injected at build
   time from a repo secret. Generate it with `npm run hash -- "your phrase"`.
6. **The pre-commit hook is not optional.** Install it once:
   ```sh
   git config core.hooksPath .githooks
   ```

---

## What the automated gate actually checks

`scripts/privacy-check.sh` greps for a short, word-bounded denylist: currency
symbols and amounts, `salary` / `ctc` / `in-hand`, account identifiers,
`transcript`, and government ID terms. It also refuses any file matching the
never-commit patterns in rule 4.

Two deliberate exemptions, both verified by the test suite:

- **Comment-only lines are skipped.** A source comment that says "no
  transcripts in this repo" documents the rule; it does not break it.
- **Test files are exempt**, because `src/content/content.test.ts` asserts the
  _absence_ of these terms and therefore has to spell them out.

The gate is a tripwire for accidents, not a substitute for reading your own
diff. It cannot detect a private detail phrased in ordinary words.

---

## Pre-commit checklist

- [ ] `npm run privacy` passes
- [ ] I have read the actual diff, not just the file list
- [ ] Every new string in `src/content/` is Public tier — or Personal and still
      safe if a stranger read it
- [ ] No new photo is Private tier
- [ ] No new figure, however rounded, has appeared anywhere
- [ ] If I added a `<LockedPanel>`, its `note` prop contains no private detail
      either

---

## Before sending the link

- [ ] `VITE_MANAGEMENT_PASSPHRASE_HASH` is set as a repo secret and the deployed
      build actually uses it (open `#/management` and confirm the gate is _not_
      showing the "no passphrase configured" warning)
- [ ] The repo has no description, no topics, and no README screenshots of the
      emotional sections
- [ ] `PLAN.md` itself is not published anywhere she will find it before she
      sees the site — it is a spoiler for the whole narrative
