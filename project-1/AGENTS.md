# AGENTS.md

Static portfolio site (vanilla HTML/CSS/JS). No build step, no framework. **Not a git repo.** Windows environment.

## Commands

```bash
npm install            # once (http-server + Playwright)
npm run serve          # http://localhost:3000, cache disabled (-c-1)
npm test               # full Playwright suite (~3 min, workers=1)
npx playwright test -g "text scrolls"   # single test by name
node --check script.js # syntax check after editing JS (no linter configured)
```

`playwright.config.ts` auto-starts `npm run serve` (reuseExistingServer), baseURL `http://localhost:3000`, viewport 1440x900.

## Cache busting — do not forget

`index.html` references assets with version query strings. After editing `style.css` or `script.js`, bump the query string (`?v=NN`) or users get stale files.

## Architecture

- Entry: `index.html` → `style.css` → `script.js` (type=module, but **imports nothing**).
- Libraries are vendored and loaded via `<script>` tags in `index.html`: GSAP + premium plugins in `js/gsap/`, Lenis v1.1.18 in `js/lenis/`. Globals: `gsap`, `ScrollTrigger`, `Lenis`.
- Lenis instance lives at `window.lenis`, created in `initializeAllWithLenis()`; wired to ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker.add`.

### About Me scrollytelling (the fragile core)

- `script.js` builds `window.timelinePhases` (`dock`/`travel` with progress ranges) from measured card rects. Everything downstream reads phases.
- `ISLAND_EDGE_PROFILES` are indexed by **card order, not year** — never reorder/delete the 9 `.timeline-card`s without recalibrating; tests enforce count/order.
- Island X/Y placement comes from inline `--fx` (horizontal fraction) and `--dy` (vertical rhythm) styles on each card in `index.html`. `<992px` they ignore this and center-stack.
- Story text timing: windows are centered on each island's dock midpoint, so text crosses screen center exactly when its island does. Speed knob = `STORY_SPAN` constant in `script.js`. Text render goes through a separate 0.18 lerp (`storySmoothProgress`) for momentum; islands/camera use raw progress.
- Camera = translateY on `.timeline` inside a pinned `.about-section` ScrollTrigger (`refreshPriority: 10` must beat projects horizontal scroll's priority).

## Testing quirks

- Tests simulate real mouse-wheel scrolling (Lenis needs it); each scroll settles ~2s — suite is slow, don't panic-run repeatedly.
- Structural assertions: exactly 9 `.timeline-card`; `.timeline-extended-content` exists only on cards 1–7, first/last stay hidden; `[data-side]` ext-content CSS positioning rules must keep computed `left`/`right` > 0.
- Delete stale `test-results/` between runs if disk matters (it regenerates, can reach hundreds of MB).

## Conventions

- Content copy (email, LinkedIn, CV facts) source of truth: `assets/content/arlan-portfolio-content.md`. Don't invent contact data.
- `_dev_scripts/` is a junk drawer of one-off generators/debug scripts — not part of the site; don't wire it into anything.
- Modals (certificate + `#project-modal`) share scroll-lock helpers that check `window.lenis`; ESC closes both. Project content lives in the `PROJECTS_DATA` array in `script.js`.
