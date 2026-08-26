## Problem Statement

The user is experiencing instability in their portfolio website's core "scrollytelling" engine (the 9-island timeline). A previous attempt to add a parallax scrolling transition between the initial Hero section and the About section altered the DOM's native scroll height and flow. This broke the complex GSAP ScrollTrigger and Lenis math used downstream, causing jittering and broken camera tracking. The user needs a premium, dynamic transition that completely protects the structural stability of the existing scroll calculations.

## Solution

A "White Clouds Wipe" transition. The Hero section is frozen in place using native CSS (`position: sticky`). As the user scrolls, a container holding 3 layers of white clouds—purely decorative and absolutely positioned—sweeps upwards across the screen at high speeds. These clouds act as a visual wipe that hides the seam between the bright Hero and the dark About section. Because the clouds are outside the document flow and the GSAP triggers are decoupled from the timeline container, the mathematical stability of the site remains completely intact.

## User Stories

1. As a user, I want the transition from the Hero to the About section to feel seamless and premium, so that I get a strong first impression of the portfolio.
2. As a user, I want the page scrolling to remain perfectly smooth (60fps), so that the experience doesn't stutter or cause motion sickness.
3. As a user with motion sensitivities, I want the fast cloud wipe animations to be disabled if my device prefers reduced motion, so that I can browse safely without discomfort.
4. As a developer, I want the transition elements to be structurally decoupled from the main content flow, so that the complex scrollytelling GSAP calculations are not broken.
5. As a developer, I want the transition to avoid loading heavy third-party image assets, so that the initial page load time remains extremely fast.
6. As a user, I want the top navigation bar to remain visible and swap colors correctly exactly when I pass the Hero section, so that I can always access the menu.

## Implementation Decisions

- **Architectural Seam**: The transition will be built purely in `index.html`, `style.css`, and a new isolated block in `script.js`. It will NOT interact with `window.timelinePhases` or the `updateTimelinePath()` functions.
- **Hero Sticking**: The Hero section (`#hero`) will use `position: sticky; top: 0;` and `z-index: 1`.
- **Main Content Layering**: The main container (`.main-content`) will use `position: relative`, `z-index: 10`, and a solid `#111111` background to physically scroll over the sticky Hero.
- **Cloud Container**: A `.cloud-transition-container` will be injected at the top of `.main-content`, overhanging the Hero by `100%` (`transform: translateY(-100%)`).
- **Cloud Assets**: 3 white cloud layers will use SVG paths as CSS `background-image` data URIs to eliminate network requests.
- **Performance Optimization**: From our Builder.io research, all `.cloud-layer` elements will explicitly declare `will-change: transform` to force animation onto the compositor thread.
- **Animation Trigger**: A GSAP `ScrollTrigger` targeting the `body` with `start: "top top"` will drive the cloud wipe, ensuring they appear the *instant* the user scrolls.
- **Accessibility**: 
  - The GSAP timeline will be wrapped in a `prefers-reduced-motion` check (from prototype):
    ```javascript
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!prefersReducedMotion) {
      // cloud parallax timeline
    }
    ```

## Testing Decisions

- **Test Seam (E2E)**: The highest and only necessary seam for this feature is the existing Playwright E2E suite (`tests/scrollytelling.spec.ts`).
- **Criteria for a good test**: Tests should verify the external behavior of the page under real wheel-scroll simulation. Since our change relies on native DOM flow remaining stable, the test must simply scroll through the page and assert that the 9 timeline cards appear in order without layout shifts breaking the assertions.
- **Execution**: We will run `npm test` or `npx playwright test -g "text scrolls"`. If the structural assertions pass, our transition math is proven to be correctly isolated.

## Out of Scope

- Changing the assets or layout of the 9 islands inside the `.timeline` itself.
- Refactoring the legacy `heroTl` GSAP timeline (it will just run underneath the clouds).
- Implementing new pages or routing.

## Further Notes

- The project does not use an external issue tracker (like Jira/GitHub Issues). This spec has been committed directly to the repository at `specs/hero_cloud_transition.md` and applies the `ready-for-agent` triage status internally.
