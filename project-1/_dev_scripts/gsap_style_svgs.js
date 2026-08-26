const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'assets', 'images');

// The new GSAP Brand-inspired SVGs
// Characteristics: Smooth swooshes, playful geometry, bold negative space, floating dots (flair).
const svgs = {
  'brand-arlan.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- Swooshing A -->
    <path class="draw-path" d="M5 20 C10 2 14 2 19 20" />
    <path class="draw-path" d="M8 14 Q12 17 16 14" />
    <!-- Floating GSAP flair dot -->
    <circle class="draw-path" cx="12" cy="8" r="1.5" />
</svg>`,

  'general-arrow-readmore.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- Fluid curving arrow -->
    <path class="draw-path" d="M4 12 C10 12 14 9 20 12" />
    <path class="draw-path" d="M14 6 C17 8 19 10 20 12 C19 14 17 16 14 18" />
</svg>`,

  'general-education.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- Rounded flowing open book -->
    <path class="draw-path" d="M12 19 C7 19 4 17 4 17 V7 C4 7 7 9 12 9" />
    <path class="draw-path" d="M12 9 C17 9 20 7 20 7 V17 C20 17 17 19 12 19" />
    <path class="draw-path" d="M12 5 V21" />
    <!-- Flair dot -->
    <circle class="draw-path" cx="12" cy="4" r="1" />
</svg>`,

  'general-graduation.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- Playful rounded certificate -->
    <rect class="draw-path" x="4" y="5" width="16" height="14" rx="3" />
    <circle class="draw-path" cx="10" cy="12" r="2.5" />
    <path class="draw-path" d="M10 14.5 Q8 19 10 21 Q12 19 10 14.5" />
</svg>`,

  'general-internship.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- Chubby rounded briefcase -->
    <rect class="draw-path" x="3" y="8" width="18" height="12" rx="3" />
    <path class="draw-path" d="M8 8 V6 C8 3.5 16 3.5 16 6 V8" />
    <circle class="draw-path" cx="12" cy="14" r="1.5" />
    <path class="draw-path" d="M3 14 C7 14 7 14 10.5 14" />
    <path class="draw-path" d="M13.5 14 C17 14 17 14 21 14" />
</svg>`,

  'general-number.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- Smooth GSAP-style wave chart -->
    <path class="draw-path" d="M4 18 C10 18 10 8 16 8 C18 8 20 5 20 5" />
    <circle class="draw-path" cx="4" cy="18" r="1.5" />
    <circle class="draw-path" cx="16" cy="8" r="1.5" />
    <circle class="draw-path" cx="20" cy="5" r="1.5" />
</svg>`,

  'general-organization.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- Fluid node network -->
    <circle class="draw-path" cx="12" cy="5" r="2" />
    <circle class="draw-path" cx="5" cy="17" r="2" />
    <circle class="draw-path" cx="19" cy="17" r="2" />
    <path class="draw-path" d="M11 7 Q8 12 6 15" />
    <path class="draw-path" d="M13 7 Q16 12 18 15" />
    <path class="draw-path" d="M7 17 Q12 19 17 17" />
</svg>`,

  'general-skill.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- Playful intersecting geometric flair -->
    <circle class="draw-path" cx="10" cy="14" r="5" />
    <rect class="draw-path" x="14" y="5" width="5" height="5" rx="1" />
    <path class="draw-path" d="M4 8 Q12 -2 20 14" />
</svg>`,

  'general-software.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- Minimal rounded window -->
    <rect class="draw-path" x="3" y="5" width="18" height="14" rx="3" />
    <path class="draw-path" d="M3 10 H21" />
    <circle class="draw-path" cx="6" cy="7.5" r="1" />
    <circle class="draw-path" cx="9" cy="7.5" r="1" />
    <path class="draw-path" d="M10 14 L12 16 L14 14" />
</svg>`,

  'section-about.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- Abstract fluid human profile / body -->
    <circle class="draw-path" cx="12" cy="7" r="3.5" />
    <path class="draw-path" d="M6 21 C6 14 18 14 18 21" />
    <!-- Playful flair dot -->
    <circle class="draw-path" cx="18" cy="8" r="1.5" />
</svg>`,

  'section-project.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- Curvy GSAP wave layers (abstract geology) -->
    <path class="draw-path" d="M3 8 C9 3 15 13 21 8" />
    <path class="draw-path" d="M3 14 C9 9 15 19 21 14" />
    <path class="draw-path" d="M3 20 C9 15 15 25 21 20" />
    <circle class="draw-path" cx="7" cy="8" r="1.5" />
    <circle class="draw-path" cx="17" cy="14" r="1.5" />
</svg>`,

  'section-experience.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- Smooth S-Curve Timeline -->
    <path class="draw-path" d="M4 6 C12 6 10 18 20 18" />
    <circle class="draw-path" cx="4" cy="6" r="2" />
    <circle class="draw-path" cx="12" cy="12" r="2" />
    <circle class="draw-path" cx="20" cy="18" r="2" />
</svg>`,

  'section-gallery.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- Rounded landscape frame -->
    <rect class="draw-path" x="4" y="4" width="16" height="16" rx="3" />
    <path class="draw-path" d="M4 15 Q10 8 16 15 T20 13" />
    <circle class="draw-path" cx="8" cy="9" r="1.5" />
</svg>`,

  'section-contact.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- Fluid paper plane + curved speed trails -->
    <path class="draw-path" d="M21 4 L10 10 L13 15 Z" />
    <path class="draw-path" d="M13 15 L17 21 L21 4" />
    <path class="draw-path" d="M4 20 C8 20 10 16 12 14" />
    <path class="draw-path" d="M8 22 C11 22 13 19 14 18" />
</svg>`
};

for (const [filename, content] of Object.entries(svgs)) {
  const filePath = path.join(outputDir, filename);
  fs.writeFileSync(filePath, content);
  console.log('Re-updated to GSAP flair style:', filename);
}

console.log('All 14 SVGs have been redesigned matching the curvy GSAP brand style.');
