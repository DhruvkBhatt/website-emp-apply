# Fonts

§3 / §7 — two families, WOFF2 **subsets**, **≤ 60 KB total**, self-hosted so
there is no third-party request on first paint.

Expected files:

- `cormorant-garamond-600.woff2` — the serif, used for emotional copy.
- `inter-variable.woff2` — the sans, used for corporate UI.

The mono family (`JetBrains Mono`) intentionally falls through to
`ui-monospace`, which costs nothing and looks correct on both iOS and Android.

## Adding them

1. Download the WOFF2 from the foundry or Google Fonts.
2. Subset to the Latin range you actually use — `pyftsubset` from `fonttools`:

   ```sh
   pyftsubset Inter.ttf --flavor=woff2 --output-file=inter-variable.woff2 \
     --unicodes="U+0000-00FF,U+2018,U+2019,U+201C,U+201D,U+2013,U+2014,U+2026"
   ```

3. Drop the files here.
4. Uncomment the two `<link rel="preload">` lines in `index.html`.
5. Add the matching `@font-face` rules to `src/design/tokens.css`:

   ```css
   @font-face {
     font-family: 'Inter';
     src: url('/fonts/inter-variable.woff2') format('woff2');
     font-weight: 100 900;
     font-display: swap;
   }
   ```

   Note the leading `/` — with a non-root Vite `base`, use
   `url('./fonts/…')` relative to the stylesheet instead, or Vite will not
   rewrite it.

Until then the fallback stack (`Georgia`, `system-ui`, `ui-monospace`) is used.
The hierarchy still reads correctly; it just is not the final typeface.
