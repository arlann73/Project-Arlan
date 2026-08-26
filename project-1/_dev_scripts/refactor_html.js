const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

// Replace the start of timeline-card-inner
let counter = 1;
html = html.replace(/<div class="timeline-card-inner" style="background-image: url\('assets\/images\/islands\/ice_island(\d+)\.jpg'\);">/g, (match, p1) => {
    return `<img src="assets/images/islands/ice_island${p1}.png" class="timeline-island-img" alt="Island ${p1}">\n                                <div class="timeline-text-content">`;
});

fs.writeFileSync(filePath, html);
console.log('Successfully refactored HTML to use img tags instead of background images.');
