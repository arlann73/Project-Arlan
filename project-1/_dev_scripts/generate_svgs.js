const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'assets', 'images');

// Create directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// The SVGs
const svgs = {
  'brand-arlan.svg': `<svg xmlns="http://www.w3.org/2000/svg" class="draw-svg-icon brand-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- Abstract A / Mountain -->
    <path class="draw-path" d="M4 20L12 4L20 20M8 14H16M12 4V14" />
</svg>`,
  'section-about.svg': `<svg xmlns="http://www.w3.org/2000/svg" class="draw-svg-icon section-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- User inside circle -->
    <circle class="draw-path" cx="12" cy="8" r="4" />
    <path class="draw-path" d="M4 20C4 16.5 7 14 12 14C17 14 20 16.5 20 20" />
</svg>`,
  'section-project.svg': `<svg xmlns="http://www.w3.org/2000/svg" class="draw-svg-icon section-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- Folder -->
    <path class="draw-path" d="M22 19C22 20.1 21.1 21 20 21H4C2.9 21 2 20.1 2 19V5C2 3.9 2.9 3 4 3H9L11 5H20C21.1 5 22 5.9 22 7V19Z" />
</svg>`,
  'section-experience.svg': `<svg xmlns="http://www.w3.org/2000/svg" class="draw-svg-icon section-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- Timeline -->
    <circle class="draw-path" cx="12" cy="5" r="2" />
    <circle class="draw-path" cx="12" cy="12" r="2" />
    <circle class="draw-path" cx="12" cy="19" r="2" />
    <line class="draw-path" x1="12" y1="7" x2="12" y2="10" />
    <line class="draw-path" x1="12" y1="14" x2="12" y2="17" />
</svg>`,
  'section-gallery.svg': `<svg xmlns="http://www.w3.org/2000/svg" class="draw-svg-icon section-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- Image/Landscape -->
    <rect class="draw-path" x="3" y="3" width="18" height="18" rx="2" />
    <circle class="draw-path" cx="8.5" cy="8.5" r="1.5" />
    <path class="draw-path" d="M21 15L16 10L5 21" />
</svg>`,
  'section-contact.svg': `<svg xmlns="http://www.w3.org/2000/svg" class="draw-svg-icon section-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- Paper plane / Message -->
    <path class="draw-path" d="M22 2L11 13" />
    <path class="draw-path" d="M22 2L15 22L11 13L2 9L22 2Z" />
</svg>`,
  'general-skill.svg': `<svg xmlns="http://www.w3.org/2000/svg" class="draw-svg-icon timeline-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- Abstract shapes -->
    <rect class="draw-path" x="4" y="4" width="6" height="6" rx="1" />
    <rect class="draw-path" x="14" y="4" width="6" height="6" rx="1" />
    <rect class="draw-path" x="4" y="14" width="6" height="6" rx="1" />
    <circle class="draw-path" cx="17" cy="17" r="3" />
</svg>`,
  'general-education.svg': `<svg xmlns="http://www.w3.org/2000/svg" class="draw-svg-icon timeline-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- Graduation Cap / Book -->
    <path class="draw-path" d="M4 10L12 5L20 10L12 15L4 10Z" />
    <path class="draw-path" d="M7 11.5V16.5C7 18 10 19 12 19C14 19 17 18 17 16.5V11.5" />
    <path class="draw-path" d="M20 10V16" />
</svg>`,
  'general-organization.svg': `<svg xmlns="http://www.w3.org/2000/svg" class="draw-svg-icon timeline-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- Network nodes -->
    <circle class="draw-path" cx="12" cy="5" r="3" />
    <circle class="draw-path" cx="5" cy="17" r="3" />
    <circle class="draw-path" cx="19" cy="17" r="3" />
    <line class="draw-path" x1="10.5" y1="7.5" x2="6.5" y2="14.5" />
    <line class="draw-path" x1="13.5" y1="7.5" x2="17.5" y2="14.5" />
    <line class="draw-path" x1="8" y1="17" x2="16" y2="17" />
</svg>`,
  'general-graduation.svg': `<svg xmlns="http://www.w3.org/2000/svg" class="draw-svg-icon timeline-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- Diploma -->
    <path class="draw-path" d="M14 3H7C5.9 3 5 3.9 5 5V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V8L14 3Z" />
    <path class="draw-path" d="M14 3V8H19" />
    <circle class="draw-path" cx="12" cy="13" r="2" />
    <path class="draw-path" d="M12 15V18" />
</svg>`,
  'general-internship.svg': `<svg xmlns="http://www.w3.org/2000/svg" class="draw-svg-icon timeline-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- Briefcase -->
    <rect class="draw-path" x="3" y="7" width="18" height="13" rx="2" />
    <path class="draw-path" d="M8 7V5C8 3.9 8.9 3 10 3H14C15.1 3 16 3.9 16 5V7" />
    <path class="draw-path" d="M3 13H21" />
</svg>`,
  'general-software.svg': `<svg xmlns="http://www.w3.org/2000/svg" class="draw-svg-icon timeline-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- Window / UI -->
    <rect class="draw-path" x="3" y="4" width="18" height="16" rx="2" />
    <path class="draw-path" d="M3 8H21" />
    <path class="draw-path" d="M7 14L9 16L7 18" />
    <path class="draw-path" d="M11 18H15" />
</svg>`,
  'general-number.svg': `<svg xmlns="http://www.w3.org/2000/svg" class="draw-svg-icon number-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- Bar chart / stats -->
    <path class="draw-path" d="M6 18V12 M10 18V8 M14 18V4 M18 18V10 M3 18H21" />
</svg>`,
  'general-arrow-readmore.svg': `<svg xmlns="http://www.w3.org/2000/svg" class="draw-svg-icon arrow-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- Long Arrow Right -->
    <line class="draw-path" x1="5" y1="12" x2="19" y2="12" />
    <polyline class="draw-path" points="12 5 19 12 12 19" />
</svg>`
};

for (const [filename, content] of Object.entries(svgs)) {
  const filePath = path.join(outputDir, filename);
  fs.writeFileSync(filePath, content);
  console.log('Created:', filename);
}

console.log('All SVGs generated in assets/images/ !');
