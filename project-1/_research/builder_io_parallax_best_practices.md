# Research: Builder.io Parallax Best Practices (2026)

**Source:** [The best way to create a parallax scrolling effect in 2026 (Builder.io Blog)](https://www.builder.io/blog/parallax-scrolling-effect)

## Key Takeaways

1. **Vanilla JS vs Libraries:** The article advocates for using pure Vanilla JavaScript and native scroll events instead of libraries like GSAP or Lenis to save on bundle size (dependencies). 
2. **Direct Transform Manipulation:** The recommended approach is reading `window.scrollY` and directly setting `style.transform = translateY(...)` on elements, multiplying the scroll value by different speeds (e.g., `0.3x` for background, `0.5x` for foreground).
3. **Compositor Thread Optimization:** The article highlights the importance of applying `will-change: transform` to parallax layers. This forces modern browsers to handle the animation on the compositor thread, guaranteeing smooth 60fps performance without layout recalculation.
4. **Subtlety is Key:** Speed differences between layers should remain subtle (between `0.2` and `0.5`). Multipliers higher than `0.7` can induce motion sickness.
5. **Accessibility:** Always implement a check for `window.matchMedia("(prefers-reduced-motion: reduce)").matches` and statically position the layers if the user has disabled animations.
6. **Smooth Transitioning:** They recommend placing a gradient element at the bottom of the parallax container (fading to a solid color) to create a seamless transition from the parallax hero into the standard content below.

## Impact on Our "3-Layer Cloud" Implementation

While the article strongly advocates dropping libraries like GSAP, our project *already* heavily relies on GSAP, ScrollTrigger, and Lenis for the core scrollytelling timeline (the 9 islands). Therefore, we do not gain a bundle-size advantage by rewriting our cloud parallax in Vanilla JS. 

However, we **must** apply the architectural lessons from this article to our `prototype_cloud_transition.html` and final implementation:

- [ ] **CSS Optimization:** Add `will-change: transform;` to all `.cloud-layer` elements to ensure the wipe transition runs purely on the compositor thread.
- [ ] **Speed Tuning:** Ensure our GSAP `scrub` speeds map to the recommended subtle multiplier ranges to prevent motion sickness.
- [ ] **Accessibility (A11y):** Implement the `prefers-reduced-motion` check before initializing the GSAP ScrollTrigger for the cloud wipe. If reduced motion is preferred, the clouds should not animate.
- [ ] **Gradient Seam:** The article's recommendation to use a gradient fade perfectly matches our strategy of having the "darkest" cloud act as a mask connecting to the `#111111` background. 

*This note captures the research requested via the `/research` skill.*
