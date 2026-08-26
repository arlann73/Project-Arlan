## Problem Statement

The Hero -> About cloud wipe transition has been implemented structurally and functionally, but it currently relies on raw GSAP translations. To achieve a truly premium, high-end agency feel, the transition needs to be refined using the newly installed `transitions-polish` skill principles. The goal is to elevate the existing transition from a mechanical translation to a polished, cinematic interaction.

## Solution

Apply the `transitions-polish` methodology to the existing Hero -> About cloud wipe transition. This involves fine-tuning the GSAP easing curves, adjusting the timing and duration of the parallax scrubs, and ensuring the interaction feels fluid, intentional, and physically grounded according to premium web design standards, while strictly preserving the existing scrollytelling stability.

## User Stories

1. As a visitor, I want the scroll-linked cloud wipe to feel incredibly smooth and responsive to my scroll wheel velocity, so that the interaction feels premium and natural.
2. As a visitor, I want the timing of the clouds appearing from the bottom to feel perfectly synchronized with the dark About section revealing itself, so that the seam is completely imperceptible.
3. As an accessibility user, I want the transitions-polish enhancements to automatically disable themselves or degrade gracefully if I have `prefers-reduced-motion` enabled, so that I don't experience motion sickness.
4. As a developer, I want the polished animation to continue utilizing hardware-accelerated properties (like `transform` on the compositor thread), so that the site maintains a strict 60fps frame rate without jank.

## Implementation Decisions

- **Modules Modified**: 
  - `project-1/script.js` (GSAP timeline parameters, easings, and scrollTrigger scrub logic).
  - `project-1/style.css` (Adjusting initial layers or filters if `transitions-polish` dictates specific blur/opacity ramping).
- **Architectural Constraints**: The structural CSS (`top: 100%`, `position: absolute` for `.cloud-transition-container`) remains strictly untouched, as altering the document flow would break the downstream `tests/scrollytelling.spec.ts` assertions.
- **Skill Usage**: The implementation will rely directly on the guidelines and constants provided by the local `.agents/skills/transitions-polish` installation (e.g., using specific custom bezier easings instead of standard GSAP `power2.out` if applicable).

## Testing Decisions

- **What makes a good test**: The test must verify that the *transitions-polish* refinements do not accidentally re-introduce layout shifts or break the strict separation between the absolute cloud container and the pinned About section.
- **Modules Tested**: The existing Playwright E2E suite (`tests/scrollytelling.spec.ts`) will be used as the primary verification seam.
- **Prior Art**: We will re-run the exact same 8 assertions that passed during the initial structural implementation. As long as those pass, the polish is considered safe.

## Out of Scope

- Applying parallax transitions to any other sections on the site (Mega Portfolio, Mega Skills, Footer). The user has explicitly restricted this scope to only the Hero -> About boundary.
- Altering the SVG assets of the clouds themselves.
- Altering the 9-island timeline functionality inside the About section.

## Further Notes

- Triage status: `ready-for-agent`
