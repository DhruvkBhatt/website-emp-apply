#!/usr/bin/env bash
#
# PLAN §5.6 — privacy denylist gate.
#
# Two modes:
#   ./scripts/privacy-check.sh          # scan the whole working tree (CI)
#   ./scripts/privacy-check.sh --staged # scan only the staged diff (pre-commit)
#
# Exit 1 blocks the commit / fails CI, and points at docs/PRIVACY.md.

set -uo pipefail

MODE="${1:-}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT" || exit 1

# Case-insensitive denylist, extended-regex. Keep this list short and specific,
# and always word-bounded: an unanchored "ctc" matches foodRejeCTCount, and a
# gate that cries wolf is a gate people bypass with --no-verify.
PATTERNS=(
  '₹'
  '\$[0-9]'
  '\brs\.? ?[0-9]'
  '\binr ?[0-9]'
  '\b[0-9][0-9,.]* ?(lakh|crore|rupees|dollars|usd|inr)\b'
  '\b(salary|ctc|in-hand|take-home)\b'
  '\b(account number|ifsc|upi id)\b'
  '\btranscript\b'
  '\b(aadhaar|pan number|passport number)\b'
)

# Files that are allowed to mention the denylisted words, because their whole
# job is to talk about the rule. Test files are included deliberately: the
# content unit tests assert the *absence* of these terms and must therefore
# spell them out.
ALLOWLIST_REGEX='^(docs/PRIVACY\.md|scripts/privacy-check\.sh|PLAN\.md|\.githooks/pre-commit|.*\.test\.tsx?)$'

# Strips comment-only lines before matching. A source comment that says "no
# transcripts in this repo" is documentation of the rule, not a violation of it;
# what matters is the copy and the data, which are never comments.
strip_comments() {
  grep -vE '^[[:space:]]*(//|\*|/\*|#)' "$1"
}

if [ "$MODE" = "--staged" ]; then
  FILES="$(git diff --cached --name-only --diff-filter=ACMR)"
else
  # Everything tracked, or everything in src/public/docs if git isn't set up yet.
  if git rev-parse --git-dir >/dev/null 2>&1; then
    FILES="$(git ls-files)"
  else
    FILES="$(find src public docs -type f 2>/dev/null)"
  fi
fi

FAILED=0

for file in $FILES; do
  [ -f "$file" ] || continue
  echo "$file" | grep -Eq "$ALLOWLIST_REGEX" && continue
  # Skip binaries.
  grep -Iq . "$file" 2>/dev/null || continue

  for pattern in "${PATTERNS[@]}"; do
    if [ "$MODE" = "--staged" ]; then
      HITS="$(git diff --cached -U0 -- "$file" | grep -E '^\+' | grep -vE '^\+[[:space:]]*(//|\*|/\*|#)' | grep -Ein "$pattern")"
    else
      HITS="$(strip_comments "$file" | grep -Ein "$pattern")"
    fi
    if [ -n "$HITS" ]; then
      echo "✗ $file matches denylisted pattern: /$pattern/"
      echo "$HITS" | sed 's/^/    /'
      FAILED=1
    fi
  done
done

# §5.4 — files that must never be committed at all.
for file in $FILES; do
  case "$file" in
    NOTES.private.md | *.private.* | src/content/private/* | .env | .env.*)
      if [ "$file" != ".env.example" ]; then
        echo "✗ $file must never be committed (PLAN §5.4)"
        FAILED=1
      fi
      ;;
  esac
done

if [ "$FAILED" -ne 0 ]; then
  cat <<'EOF'

────────────────────────────────────────────────────────────
Privacy gate failed. Read docs/PRIVACY.md before proceeding.

Private-tier material does not belong in this repository —
not in a comment, not in content/, not behind the passphrase
gate. Use <LockedPanel> and have the conversation in person.
────────────────────────────────────────────────────────────
EOF
  exit 1
fi

echo "✓ privacy gate passed"
