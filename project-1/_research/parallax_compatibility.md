# Research: Parallax Baseline Compatibility with Lenis & ScrollTrigger

## Objective
Evaluate whether the proposed technical baseline (`window.scrollY` + native `scroll` event listener + direct `transform`) is compatible with the existing project architecture (GSAP + ScrollTrigger + Lenis).

## Findings

### Conflict 1: Desynchronization (Jitter)
The project uses **Lenis** for smooth scrolling, which hijacks native scroll inputs and interpolates them using a `requestAnimationFrame` (rAF) loop. GSAP's ticker is explicitly synchronized with Lenis via:
```javascript
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000) });
```
If we use a native `window.addEventListener('scroll')` and read `window.scrollY`, we are reading values that are decoupled from the GSAP/Lenis rAF loop. This will cause **visible jitter and stuttering**, as the parallax layers will update out-of-sync with the rest of the GSAP-animated page elements (like the About Me scrollytelling).

### Conflict 2: Performance & Frame Budget
While direct `transform` manipulation is performant, executing it inside a native `scroll` listener (even with `passive: true`) forces the browser to run layout/composite calculations outside the optimized rAF cycle that Lenis is already managing.

## Recommendation: The Safest Approach

The direct `window.scrollY` approach is **NOT SAFE** for this specific codebase. It will introduce jitter and risk breaking the smooth visual flow of the site.

To maintain the performance benefits of direct transforms while staying 100% compatible with the architecture, we have two safe alternatives:

### Option A (Recommended): GSAP ScrollTrigger Scrub
Since the project already relies on `ScrollTrigger`, the safest and most maintainable approach is to use a GSAP timeline with `scrub`.
- **Why it's safe:** It automatically plugs into the existing `lenis.on('scroll', ScrollTrigger.update)` integration. 
- **Performance:** GSAP optimizes transforms heavily and batches DOM writes, achieving the same performance goal as the baseline without the desynchronization risk.
- **Constraints:** Safely isolated; won't break the About Me timeline if we scope the trigger strictly to the Hero section.

### Option B: Lenis Event Listener
If we strictly want to avoid GSAP overhead for this specific effect, we can use Lenis's built-in event emitter instead of the native scroll event.
- **Implementation:** `lenis.on('scroll', (e) => { const scrollY = e.scroll; /* apply direct transforms */ })`
- **Why it's safe:** `e.scroll` provides the perfectly interpolated virtual scroll position, completely eliminating the jitter associated with native `window.scrollY`.

**Conclusion:** We should proceed with **Option A (GSAP ScrollTrigger)** because it aligns with the existing codebase patterns, perfectly respects the Lenis integration, and effortlessly handles the different `0.3x, 0.4x, 0.5x` speed offsets without manual math.
