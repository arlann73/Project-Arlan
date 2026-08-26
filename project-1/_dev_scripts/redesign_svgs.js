const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'assets', 'images');

// The newly redesigned SVGs matching the premium motion-design aesthetic
const svgs = {
  'brand-arlan.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path class="draw-path" d="M4 21 L12 4 L20 21" />
    <path class="draw-path" d="M8 15 L16 11" />
    <path class="draw-path" d="M12 4 L12 21" />
</svg>`,

  'general-arrow-readmore.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path class="draw-path" d="M4 12 H20" />
    <path class="draw-path" d="M13 5 L20 12 L13 19" />
</svg>`,

  'general-education.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path class="draw-path" d="M12 21 V5" />
    <path class="draw-path" d="M4 7 V19 L12 21 L20 19 V7 L12 5 L4 7 Z" />
    <path class="draw-path" d="M4 13 L12 15 L20 13" />
</svg>`,

  'general-graduation.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path class="draw-path" d="M14 4 V8 H20 M4 4 H14 M20 8 V20 H4 V4" />
    <circle class="draw-path" cx="10" cy="14" r="2" />
    <path class="draw-path" d="M10 16 V20 L12 18 L14 20 V14" />
</svg>`,

  'general-internship.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path class="draw-path" d="M4 9 H20 V19 H4 V9 Z" />
    <path class="draw-path" d="M9 9 V6 H15 V9" />
    <path class="draw-path" d="M12 9 V19" />
    <path class="draw-path" d="M4 14 H20" />
</svg>`,

  'general-number.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path class="draw-path" d="M4 18 H20" />
    <path class="draw-path" d="M6 18 V11 M12 18 V7 M18 18 V3" />
    <path class="draw-path" d="M6 11 L12 7 L18 3" />
</svg>`,

  'general-organization.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path class="draw-path" d="M12 4 L20 12 L12 20 L4 12 Z" />
    <path class="draw-path" d="M12 4 V20" />
    <path class="draw-path" d="M4 12 H20" />
    <circle class="draw-path" cx="12" cy="12" r="2" />
</svg>`,

  'general-skill.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect class="draw-path" x="4" y="4" width="10" height="10" />
    <rect class="draw-path" x="10" y="10" width="10" height="10" />
    <path class="draw-path" d="M10 4 L20 14" />
    <path class="draw-path" d="M4 10 L14 20" />
</svg>`,

  'general-software.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect class="draw-path" x="3" y="4" width="18" height="16" />
    <path class="draw-path" d="M3 9 H21" />
    <path class="draw-path" d="M6 6 H7 M10 6 H11" />
    <path class="draw-path" d="M8 13 L10 15 L8 17 M13 17 H16" />
</svg>`,

  'section-about.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path class="draw-path" d="M12 3 V21" />
    <path class="draw-path" d="M12 3 C6 3 5 8 5 12 C5 16 7 21 12 21" />
    <path class="draw-path" d="M12 9 H18 L18 13 H12" />
    <path class="draw-path" d="M12 17 H16" />
</svg>`,

  'section-project.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path class="draw-path" d="M4 8 L10 6 L16 9 L20 7" />
    <path class="draw-path" d="M4 14 L9 15 L14 12 L20 14" />
    <path class="draw-path" d="M4 20 L11 18 L17 21 L20 19" />
    <path class="draw-path" d="M10 6 V15 M16 9 V20 M4 8 V20 M20 7 V19" />
</svg>`,

  'section-experience.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path class="draw-path" d="M3 20 H9 V14 H15 V8 H21" />
    <circle class="draw-path" cx="9" cy="14" r="2" />
    <circle class="draw-path" cx="15" cy="8" r="2" />
    <circle class="draw-path" cx="3" cy="20" r="2" />
</svg>`,

  'section-gallery.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect class="draw-path" x="4" y="4" width="16" height="16" />
    <path class="draw-path" d="M4 16 L12 9 L16 13 L20 10" />
    <circle class="draw-path" cx="8" cy="8" r="1.5" />
</svg>`,

  'section-contact.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path class="draw-path" d="M21 3 L9 9 L13 13 L19 21 Z" />
    <path class="draw-path" d="M13 13 L21 3" />
    <path class="draw-path" d="M3 21 L7 17 M6 22 L9 19" />
</svg>`
};

for (const [filename, content] of Object.entries(svgs)) {
  const filePath = path.join(outputDir, filename);
  fs.writeFileSync(filePath, content);
  console.log('Updated:', filename);
}

console.log('All 14 premium SVGs have been redesigned and replaced successfully.');
