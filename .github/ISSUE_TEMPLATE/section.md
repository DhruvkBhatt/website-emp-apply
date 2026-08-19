---
name: Section
about: One issue per site section (PLAN §9)
title: 'feat(<section-slug>): '
labels: section
---

## Section

<!-- e.g. BlushLab, JewelryRoadmap -->

**Phase:** <!-- 0–8, per PLAN §8 -->

## Checklist

- [ ] Copy ready and living in `src/content/` (no strings in the component)
- [ ] Mobile checked on a real phone (iOS Safari **and** Android Chrome)
- [ ] Reduced-motion checked — static end state carries the same information
- [ ] Keyboard reachable, visible focus ring, ≥ 44 px touch targets
- [ ] Contrast ≥ 4.5:1 in the theme this section uses
- [ ] `npm run privacy` passes

## Privacy tier

- [ ] Public — normal review
- [ ] Personal — behind the `#/management` gate, and still safe if a stranger reads it
- [ ] Private — **not in this repo**; rendered as `<LockedPanel>` only

## Notes
