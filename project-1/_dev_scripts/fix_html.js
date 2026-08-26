const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

// 1. Fix the duplicate timeline-text-content
html = html.replace(/<div class="timeline-text-content">\s*<div class="timeline-text-content">/g, '<div class="timeline-text-content">');

// 2. Fix the broken 2025 card
const broken2025 = `<img src="assets/images/islands/ice_island8.png" class="timeline-island-img" alt="Island 8">
                                    <h3 class="timeline-title">Graduate</h3>`;
const fixed2025 = `<img src="assets/images/islands/ice_island8.png" class="timeline-island-img" alt="Island 8">
                                <div class="timeline-text-content">
                                    <span class="timeline-year">'25</span>
                                    <h3 class="timeline-title">Graduate</h3>`;
html = html.replace(broken2025, fixed2025);

fs.writeFileSync(filePath, html);
console.log('Fixed HTML errors.');
